import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import GoogleButton from "./google-button";

export default async function SignInPage() {
  const googleConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.NEXTAUTH_SECRET,
  );
  const session = googleConfigured ? await getServerSession(authOptions) : null;
  if (session) redirect("/");

  return <main className="account-page">
    <Link className="wordmark" href="/">sola<span>®</span></Link>
    <div className="account-layout">
      <div className="account-image" role="img" aria-label="Quiet, sunlit home interior" />
      <section className="account-form-wrap">
        <p className="eyebrow">Welcome to Sola</p>
        <h1>A place for<br /><em>your things.</em></h1>
        <p className="account-description">Sign in to keep your saved pieces close and make checkout a little easier.</p>
        {googleConfigured ? <GoogleButton /> : <div className="setup-notice">Google sign-in is not configured for this deployment. In Vercel, add <code>GOOGLE_CLIENT_ID</code>, <code>GOOGLE_CLIENT_SECRET</code>, <code>NEXTAUTH_SECRET</code>, and <code>NEXTAUTH_URL</code> under Project Settings → Environment Variables, then redeploy.</div>}
        <p className="account-legal">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
        <Link className="text-link account-back" href="/">Back to the collection <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  </main>;
}