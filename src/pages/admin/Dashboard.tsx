import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, ShoppingCart, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [customers, leads, orders, products] = await Promise.all([
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
        supabase.from("products").select("id", { count: "exact", head: true }),
      ]);
      const revenue = (orders.data || []).reduce((s, o) => s + Number(o.total), 0);
      return {
        customers: customers.count || 0,
        leads: leads.count || 0,
        orders: orders.data?.length || 0,
        products: products.count || 0,
        revenue,
      };
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10);
      return data || [];
    },
  });

  const chartData = [
    { name: "Customers", value: stats?.customers || 0 },
    { name: "Leads", value: stats?.leads || 0 },
    { name: "Orders", value: stats?.orders || 0 },
    { name: "Products", value: stats?.products || 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Customers", value: stats?.customers || 0, icon: Users, color: "text-blue-400" },
          { label: "Active Leads", value: stats?.leads || 0, icon: Target, color: "text-green-400" },
          { label: "Total Orders", value: stats?.orders || 0, icon: ShoppingCart, color: "text-purple-400" },
          { label: "Revenue", value: `$${(stats?.revenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-primary" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
