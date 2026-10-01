import { getServerSession } from "next-auth";
import { authOptions, isAuthConfigured } from "@/lib/auth";
import Storefront from "./storefront";

export default async function Home() {
  const session = isAuthConfigured() ? await getServerSession(authOptions) : null;
  const user = session?.user ? {
    name: session.user.name ?? session.user.email?.split("@")[0] ?? "Account",
  } : null;

  return <Storefront user={user} />;
}