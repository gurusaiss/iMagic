import Link from "next/link";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const stats = db
    .prepare("SELECT COUNT(*) as orderCount, COALESCE(SUM(total), 0) as totalSpent FROM orders WHERE user_id = ?")
    .get(user.id) as { orderCount: number; totalSpent: number };

  const wishlistCount = (
    db.prepare("SELECT COUNT(*) as c FROM wishlist_items WHERE user_id = ?").get(user.id) as { c: number }
  ).c;

  return (
    <div className="section">
      <div className="container-narrow max-w-xl">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Account</h1>
        <p className="mb-8 text-muted">{user.name} · {user.email}</p>

        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="card p-5 text-center">
            <p className="text-2xl font-semibold">{stats.orderCount}</p>
            <p className="text-sm text-muted">Orders</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-2xl font-semibold">₹{stats.totalSpent.toLocaleString("en-IN")}</p>
            <p className="text-sm text-muted">Total Spent</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-2xl font-semibold">{wishlistCount}</p>
            <p className="text-sm text-muted">Wishlist</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/orders" className="btn-secondary w-full">
            View orders
          </Link>
          <Link href="/wishlist" className="btn-secondary w-full">
            View wishlist
          </Link>
          {user.role === "admin" && (
            <Link href="/admin" className="btn-primary w-full">
              Admin dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
