import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  unread: "bg-blue-500/20 text-blue-400",
  read: "bg-yellow-500/20 text-yellow-400",
  replied: "bg-green-500/20 text-green-400",
};

const Contacts = () => {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<any>(null);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("contact_submissions").update({ status: status as any }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-contacts"] });
      toast({ title: "Status updated" });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-foreground">Contact Submissions</h1>

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="border border-border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Subject</TableHead>
                <TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(contacts || []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.subject || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[c.status] || ""}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => { setSelected(c); if (c.status === "unread") updateStatus.mutate({ id: c.id, status: "read" }); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => updateStatus.mutate({ id: c.id, status: "replied" })}>
                      <CheckCheck className="h-4 w-4 text-green-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Message from {selected?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{selected?.email}</p>
            {selected?.subject && <p className="text-sm font-medium">{selected.subject}</p>}
            <p className="text-sm text-foreground whitespace-pre-wrap">{selected?.message}</p>
            <p className="text-xs text-muted-foreground">{selected && new Date(selected.created_at).toLocaleString()}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
