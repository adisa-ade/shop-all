"use client";

import { signIn } from "next-auth/react";

export default function GoogleButton() {
  return <button className="google-button" type="button" onClick={() => signIn("google", { callbackUrl: "/" })}>
    <span className="google-mark" aria-hidden="true">G</span> Continue with Google <span aria-hidden="true">↗</span>
  </button>;
}