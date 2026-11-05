"use client";

import { ReactNode, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStats, statsService } from "@/service/stats.service";

const COLORS = ["var(--primary)", "var(--chart-2)", "var(--chart-3)", "var(--muted-foreground)", "var(--destructive)"];
const tip = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--popover-foreground)" };
const axis = { stroke: "var(--muted-foreground)", fontSize: 12 };

function ChartCard({ title, empty, children }: { title: string; empty: boolean; children: ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="h-64">
        {empty ? <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet</p> : children}
      </CardContent>
    </Card>
  );
}

export default function DashboardInsights() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsService.dashboard().then((r) => setData(r.data)).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid gap-6 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}</div>;
  if (!data) return null;

  const sum = (a: { value: number }[]) => a.reduce((s, x) => s + x.value, 0);

  return (
    <div className="space-y-6">
      {data.insights.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" /> Smart insights</CardTitle></CardHeader>
          <CardContent><ul className="list-disc space-y-1 pl-5 text-sm">{data.insights.map((t) => <li key={t}>{t}</li>)}</ul></CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Requests by status" empty={sum(data.statusBreakdown) === 0}>
          <ResponsiveContainer><PieChart>
            <Pie data={data.statusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} label>
              {data.statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={tip} />
          </PieChart></ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Rental requests per month" empty={sum(data.requestsByMonth) === 0}>
          <ResponsiveContainer><BarChart data={data.requestsByMonth}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="month" {...axis} /><YAxis allowDecimals={false} {...axis} />
            <Tooltip contentStyle={tip} cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="value" name="Requests" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart></ResponsiveContainer>
        </ChartCard>

        <ChartCard title={`${data.moneyLabel} per month ($)`} empty={sum(data.moneyByMonth) === 0}>
          <ResponsiveContainer><LineChart data={data.moneyByMonth}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="month" {...axis} /><YAxis {...axis} />
            <Tooltip contentStyle={tip} />
            <Line type="monotone" dataKey="value" name={data.moneyLabel} stroke="var(--chart-2)" strokeWidth={2} dot />
          </LineChart></ResponsiveContainer>
        </ChartCard>

        {data.extra && (
          <ChartCard title={data.extra.title} empty={sum(data.extra.data) === 0}>
            <ResponsiveContainer><BarChart data={data.extra.data} layout="vertical">
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} {...axis} /><YAxis type="category" dataKey="name" width={90} {...axis} />
              <Tooltip contentStyle={tip} cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="value" fill="var(--chart-3)" radius={[0, 6, 6, 0]} />
            </BarChart></ResponsiveContainer>
          </ChartCard>
        )}
      </div>
    </div>
  );
}