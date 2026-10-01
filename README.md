# Sola Studio

A home-goods storefront built with Next.js App Router, Tailwind CSS 4, and DaisyUI. Includes Google OAuth sign-in, a guest checkout, Neon order storage, and Mailgun order confirmations.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and fill in the service values below.
3. Start the app with `npm run dev` and open http://localhost:3000.

## Service setup

- **Google sign-in:** Create a Google OAuth 2.0 Web application in Google Cloud Console. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. Set the client ID and secret in `.env.local`. For deployment, add the corresponding production callback URL and set `NEXTAUTH_URL` and a random `NEXTAUTH_SECRET`.
- **Neon:** Create a Neon project and set its pooled or direct connection string as `DATABASE_URL`. The orders table is created on the first successful checkout request.
- **Mailgun:** Verify a sending domain and set `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, and optionally `MAILGUN_FROM`. For an EU account set `MAILGUN_API_BASE=https://api.eu.mailgun.net`. Order persistence succeeds independently if email delivery is not configured or is temporarily unavailable.

## Checkout note

Checkout stores an order with `pending_payment` status and does not collect or process payment. Connect a payment provider before using this application for live sales. The server recalculates product prices and shipping from the catalog; browser-provided prices are never trusted.

## Commands

- `npm run dev` starts the development server.
- `npm run lint` runs ESLint.
- `npm run build` creates a production build.