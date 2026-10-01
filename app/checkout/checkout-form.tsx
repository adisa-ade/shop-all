"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/products";

type OrderResult = { orderId: string; emailSent: boolean };

export default function CheckoutForm() {
  const [cart, setCart, ready] = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const cartItems = useMemo(() => products.filter((product) => cart[product.id]), [cart]);
  const subtotal = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  const shipping = subtotal >= 120 || subtotal === 0 ? 0 : 9;

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, items: cartItems.map((product) => ({ id: product.id, quantity: cart[product.id] })) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "We could not place your order.");
      setOrder(payload as OrderResult);
      window.localStorage.removeItem("sola-cart");
      setCart({});
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We could not place your order.");
    } finally {
      setPending(false);
    }
  }

  if (order) return <main className="checkout-page">
    <CheckoutHeader />
    <section className="order-success"><p className="eyebrow">A good choice</p><div className="success-mark" aria-hidden="true">✓</div>
      <h1>Thank you,<br /><em>it is on its way.</em></h1><p>Your order is in. Reference <strong>{order.orderId.slice(0, 8).toUpperCase()}</strong>.</p>
      <p className="email-result">{order.emailSent ? "A confirmation note is on its way to your inbox." : "Your order is saved. Email confirmation will be available when Mailgun is configured."}</p>
      <Link className="button button-dark" href="/">Back to the collection <span aria-hidden="true">↗</span></Link>
    </section>
  </main>;

  return <main className="checkout-page">
    <CheckoutHeader />
    <div className="checkout-layout">
      <form className="checkout-form" onSubmit={submitOrder}>
          <div className="checkout-title"><p className="eyebrow">A few details, then it&apos;s yours</p><h1>Checkout</h1></div>
        {!ready ? <p className="checkout-muted">Loading your bag…</p> : cartItems.length === 0 ? <div className="checkout-empty"><p>Your bag is empty for now.</p><Link className="text-link" href="/">Return to the collection <span aria-hidden="true">↗</span></Link></div> : <>
          <section className="form-section">
            <div className="form-section-heading"><h2>Contact</h2><Link href="/signin">Sign in</Link></div>
            <label className="field full-field">Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
            <p className="checkout-muted">Your confirmation will be sent here.</p>
          </section>
          <section className="form-section">
            <div className="form-section-heading"><h2>Delivery</h2><span>Complimentary over $120</span></div>
            <label className="field full-field">Full name<input name="name" autoComplete="name" placeholder="Your name" required minLength={2} /></label>
            <label className="field full-field">Street address<input name="address" autoComplete="street-address" placeholder="House number and street" required /></label>
            <label className="field full-field">Apartment, suite, etc. <span>Optional</span><input name="apartment" autoComplete="address-line2" placeholder="Unit, floor, building" /></label>
            <div className="field-row">
              <label className="field">City<input name="city" autoComplete="address-level2" required /></label>
              <label className="field">State / region<input name="region" autoComplete="address-level1" required /></label>
            </div>
            <div className="field-row">
              <label className="field">Postal code<input name="postalCode" autoComplete="postal-code" required /></label>
              <label className="field">Country<input name="country" autoComplete="country-name" defaultValue="United States" required /></label>
            </div>
          </section>
          <section className="form-section payment-note">
            <div className="form-section-heading"><h2>Payment</h2><span>Not connected</span></div>
            <p>Orders are saved as pending payment. Connect a payment provider before accepting real payments.</p>
          </section>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark place-order" type="submit" disabled={pending || !ready || cartItems.length === 0}>
            {pending ? "Saving your order…" : "Place order request"}<span aria-hidden="true">→</span>
          </button>
          <p className="checkout-disclaimer">No payment is taken on this demo checkout.</p>
        </>}
      </form>
      <aside className="order-summary">
        <div className="summary-title"><h2>Your edit</h2><Link href="/#collection">Edit bag</Link></div>
        {cartItems.map((product) => <div className="summary-item" key={product.id}>
          <div className="summary-product-image" style={{ backgroundImage: `url('${product.image}')` }}><span>{cart[product.id]}</span></div>
          <div className="summary-product-copy"><h3>{product.name}</h3><p>{product.material}</p></div><strong>${(product.price * cart[product.id]).toFixed(2)}</strong>
        </div>)}
        {cartItems.length === 0 && <p className="checkout-muted">Items added to your bag will appear here.</p>}
        <div className="summary-totals"><div><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div><span>Shipping</span><span>{shipping === 0 ? (subtotal > 0 ? "Complimentary" : "—") : `$${shipping.toFixed(2)}`}</span></div><div className="summary-total"><strong>Total</strong><strong>${(subtotal + shipping).toFixed(2)} <small>USD</small></strong></div></div>
        {subtotal > 0 && subtotal < 120 && <p className="shipping-hint">You are ${(120 - subtotal).toFixed(2)} away from complimentary shipping.</p>}
      </aside>
    </div>
  </main>;
}

function CheckoutHeader() {
  return <header className="checkout-header"><Link className="wordmark" href="/">sola<span>®</span></Link><div className="checkout-steps"><span className="step-active">Information</span><span>Delivery</span><span>Payment</span></div><Link className="checkout-return" href="/">Continue shopping</Link></header>;
}