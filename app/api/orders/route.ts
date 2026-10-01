import { neon } from "@neondatabase/serverless";
import { z } from "zod";
import { products } from "@/lib/products";

const orderSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  address: z.string().trim().min(4).max(180),
  apartment: z.string().trim().max(100).optional().default(""),
  city: z.string().trim().min(2).max(100),
  region: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().min(3).max(24),
  country: z.string().trim().min(2).max(80),
  items: z.array(z.object({ id: z.string(), quantity: z.number().int().min(1).max(10) })).min(1).max(30),
});

async function sendConfirmation(email: string, name: string, orderId: string, total: number) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) return false;

  const from = process.env.MAILGUN_FROM ?? `Sola Studio <orders@${domain}>`;
  const message = new URLSearchParams({
    from,
    to: `${name} <${email}>`,
    subject: `We have your order ${orderId.slice(0, 8)}`,
    text: `Hello ${name},\n\nThank you for choosing Sola. Your order ${orderId} has been received. The order total is $${total.toFixed(2)}.\n\nWe will be in touch with delivery updates.\nSola Studio`,
    html: `<p>Hello ${escapeHtml(name)},</p><p>Thank you for choosing Sola. Your order <strong>${orderId}</strong> has been received.</p><p>Order total: <strong>$${total.toFixed(2)}</strong></p><p>We will be in touch with delivery updates.</p><p>Sola Studio</p>`,
  });
  const baseUrl = process.env.MAILGUN_API_BASE ?? "https://api.mailgun.net";
  const response = await fetch(`${baseUrl}/v3/${domain}/messages`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: message,
  });
  return response.ok;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Check the details and try again." }, { status: 400 });

  const catalog = new Map(products.map((product) => [product.id, product]));
  const orderItems = parsed.data.items.map(({ id, quantity }) => {
    const product = catalog.get(id);
    return product ? { id, name: product.name, unitPrice: product.price, quantity } : null;
  });
  if (orderItems.some((item) => !item)) return Response.json({ error: "One or more items are no longer available." }, { status: 400 });

  const items = orderItems.filter((item): item is NonNullable<typeof item> => item !== null);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = subtotal >= 120 ? 0 : 9;
  const total = subtotal + shipping;
  const orderId = crypto.randomUUID();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return Response.json({ error: "Order storage is not configured yet. Add DATABASE_URL to .env.local." }, { status: 503 });

  try {
    const sql = neon(databaseUrl);
    await sql`CREATE TABLE IF NOT EXISTS orders (
      id text PRIMARY KEY,
      customer_name text NOT NULL,
      customer_email text NOT NULL,
      address jsonb NOT NULL,
      items jsonb NOT NULL,
      shipping numeric(10, 2) NOT NULL DEFAULT 0,
      total numeric(10, 2) NOT NULL,
      status text NOT NULL DEFAULT 'pending_payment',
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
    await sql`INSERT INTO orders (id, customer_name, customer_email, address, items, shipping, total)
      VALUES (
        ${orderId},
        ${parsed.data.name},
        ${parsed.data.email},
        ${JSON.stringify({ address: parsed.data.address, apartment: parsed.data.apartment, city: parsed.data.city, region: parsed.data.region, postalCode: parsed.data.postalCode, country: parsed.data.country })}::jsonb,
        ${JSON.stringify(items)}::jsonb,
        ${shipping.toFixed(2)},
        ${total.toFixed(2)}
      )`;
  } catch (error) {
    console.error("Could not save order", error);
    return Response.json({ error: "We could not save your order. Please try again." }, { status: 503 });
  }

  let emailSent = false;
  try {
    emailSent = await sendConfirmation(parsed.data.email, parsed.data.name, orderId, total);
  } catch (error) {
    console.error("Could not send order confirmation", error);
  }

  return Response.json({ orderId, subtotal, shipping, total, emailSent }, { status: 201 });
}