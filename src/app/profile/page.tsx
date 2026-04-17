"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Package, User as UserIcon, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: profileData } = await supabase.from("user_profiles").select("*").eq("id", user.id).single();
      if (profileData) setProfile(profileData);

      const { data: orderData } = await supabase.from("orders").select("*").eq("user_id", user.id).order('created_at', { ascending: false });
      if (orderData) setOrders(orderData);
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return <div className="min-h-screen pt-24 text-center">Loading Data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex justify-between items-end mb-12 border-b border-[var(--color-border)] pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Agent Dossier</h1>
          <p className="text-[var(--color-muted)] flex items-center gap-2">
            <UserIcon size={16} /> {profile?.name || user.email}
          </p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--color-muted)] hover:text-red-500 transition-colors">
          <LogOut size={16} /> Disconnect
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Orders Column */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
            <Package size={20} /> Operation History (Orders)
          </h2>
          
          {orders.length === 0 ? (
            <div className="p-8 border border-[var(--color-border)] text-center text-[var(--color-muted)]">
              No previous orders found. Time to engage.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-6 border border-[var(--color-border)] bg-[var(--background)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-xs font-mono text-[var(--color-muted)] mb-1">ID: {order.id.split('-')[0]}</p>
                    <p className="font-bold">₹{order.total.toFixed(2)}</p>
                    <p className="text-xs text-[var(--color-muted)] mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="px-3 py-1 text-xs font-bold uppercase tracking-widest border border-current text-green-500">
                    {order.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Details */}
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Profile Settings</h2>
          <div className="p-6 border border-[var(--color-border)] space-y-4 text-sm">
            <div>
              <p className="text-xs font-bold uppercase text-[var(--color-muted)] mb-1">Registered Email</p>
              <p className="font-mono">{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-[var(--color-muted)] mb-1">Code Name</p>
              <p className="font-mono">{profile?.name || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
