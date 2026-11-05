"use client";
import { FormEvent, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/service/client";
import { ICategory } from "@/service/landlordService";

const errMsg = (e: unknown, fallback: string) => {
  const raw = e instanceof Error ? e.message : "";
  try { return JSON.parse(raw.slice(raw.indexOf("{"))).message ?? fallback; } catch { return fallback; }
};

export default function AdminCategories() {
  const [items, setItems] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => apiClient("/categories").then((r) => setItems(r.data ?? [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Name must be at least 2 characters");
    setError(""); setSaving(true);
    try {
      await apiClient("/categories", { method: "POST", body: JSON.stringify({ name: name.trim() }) });
      toast.success("Category added"); setName(""); await load();
    } catch (err) { toast.error(errMsg(err, "Could not add category")); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    try { await apiClient(`/categories/${id}`, { method: "DELETE" }); toast.success("Category deleted"); await load(); }
    catch (err) { toast.error(errMsg(err, "Could not delete category")); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
      <Card>
        <CardHeader><CardTitle>Add category</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={add} className="flex flex-col gap-3 sm:flex-row" noValidate>
            <div className="flex-1">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Penthouse" aria-invalid={!!error} />
              {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>All categories</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-32 w-full" /> : (
            <ul className="divide-y">
              {items.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3">
                  <span className="font-medium">{c.name}</span>
                  <Button variant="ghost" size="icon" aria-label={`Delete ${c.name}`} onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}