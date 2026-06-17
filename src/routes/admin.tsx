import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  useReports,
  useUsers,
  useCurrentUser,
  saveReports,
  saveUsers,
  formatIDR,
  timeAgo,
  type Report,
  type ReportStatus,
  type BudgetStatus,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  FileText,
  Users as UsersIcon,
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Dasbor Admin — LAPOR WONG CERBON" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

const STATUSES: ReportStatus[] = ["Baru", "Diproses", "Dikerjakan", "Selesai", "Ditolak"];
const BUDGETS: BudgetStatus[] = [
  "Belum Diajukan",
  "Diajukan",
  "Disetujui",
  "Cair Sebagian",
  "Ditolak",
];

function AdminPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const reports = useReports();
  const users = useUsers();
  const [q, setQ] = useState("");

  // Client-only auth gate
  useEffect(() => {
    if (user === null) return;
    if (!user?.isAdmin) {
      toast.error("Akses ditolak. Hanya untuk admin.");
      router.navigate({ to: "/auth" });
    }
  }, [user, router]);

  const stats = useMemo(() => {
    const total = reports.length;
    const baru = reports.filter((r) => r.status === "Baru").length;
    const proses = reports.filter(
      (r) => r.status === "Diproses" || r.status === "Dikerjakan",
    ).length;
    const selesai = reports.filter((r) => r.status === "Selesai").length;
    const urgent = reports.filter((r) => r.urgency >= 80 && r.status !== "Selesai").length;
    const totalBudget = reports.reduce((a, r) => a + r.budgetEstimate, 0);
    const approvedBudget = reports
      .filter((r) => r.budgetStatus === "Disetujui" || r.budgetStatus === "Cair Sebagian")
      .reduce((a, r) => a + r.budgetEstimate, 0);
    return { total, baru, proses, selesai, urgent, totalBudget, approvedBudget };
  }, [reports]);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return reports.filter(
      (r) =>
        !s ||
        r.title.toLowerCase().includes(s) ||
        r.location.toLowerCase().includes(s) ||
        r.authorName.toLowerCase().includes(s),
    );
  }, [reports, q]);

  function updateReport(id: string, patch: Partial<Report>, note?: string) {
    const next = reports.map((r) => {
      if (r.id !== id) return r;
      const updated: Report = { ...r, ...patch };
      if (patch.status && patch.status !== r.status) {
        updated.updates = [
          ...r.updates,
          {
            date: new Date().toISOString(),
            status: patch.status,
            note: note || `Status diubah oleh admin menjadi ${patch.status}.`,
          },
        ];
      }
      return updated;
    });
    saveReports(next);
    toast.success("Laporan diperbarui.");
  }

  function deleteReport(id: string) {
    if (!confirm("Hapus laporan ini? Tindakan tidak dapat dibatalkan.")) return;
    saveReports(reports.filter((r) => r.id !== id));
    toast.success("Laporan dihapus.");
  }

  function addUserPoints(id: string, delta: number) {
    saveUsers(
      users.map((u) => (u.id === id ? { ...u, points: Math.max(0, u.points + delta) } : u)),
    );
    toast.success(delta > 0 ? `+${delta} poin diberikan.` : `${delta} poin.`);
  }

  function deleteUser(id: string) {
    if (!confirm("Hapus user ini?")) return;
    saveUsers(users.filter((u) => u.id !== id));
    toast.success("User dihapus.");
  }

  if (!user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Memeriksa akses admin…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <Shield className="h-3.5 w-3.5" /> Mode Administrator
          </div>
          <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold tracking-tight">
            Dasbor Admin
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola laporan, status pengerjaan, anggaran, dan pengguna LAPOR WONG CERBON.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">← Kembali ke situs</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Total Laporan"
          value={stats.total}
          hint={`${stats.baru} baru`}
          tone="primary"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Dalam Proses"
          value={stats.proses}
          hint={`${stats.selesai} selesai`}
          tone="default"
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Urgensi Tinggi"
          value={stats.urgent}
          hint="≥ 80% urgensi"
          tone="urgent"
        />
        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          label="Anggaran Disetujui"
          value={formatIDR(stats.approvedBudget)}
          hint={`dari ${formatIDR(stats.totalBudget)}`}
          tone="accent"
        />
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            Laporan
          </TabsTrigger>
          <TabsTrigger value="users">
            <UsersIcon className="h-4 w-4 mr-2" />
            Pengguna
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analitik
          </TabsTrigger>
        </TabsList>

        {/* REPORTS */}
        <TabsContent value="reports" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <CardTitle>Manajemen Laporan</CardTitle>
                  <CardDescription>
                    Ubah status pengerjaan, anggaran, atau hapus laporan tidak valid.
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari judul / lokasi / pelapor…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[260px]">Laporan</TableHead>
                    <TableHead>Urgensi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Anggaran</TableHead>
                    <TableHead>Pelapor</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Link
                          to="/laporan/$id"
                          params={{ id: r.id }}
                          className="font-medium hover:text-primary line-clamp-1"
                        >
                          {r.title}
                        </Link>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {r.location} • {timeAgo(r.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            r.urgency >= 80
                              ? "destructive"
                              : r.urgency >= 60
                                ? "default"
                                : "secondary"
                          }
                        >
                          {r.urgency}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={r.status}
                          onValueChange={(v) => updateReport(r.id, { status: v as ReportStatus })}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-medium">{formatIDR(r.budgetEstimate)}</div>
                        <Select
                          value={r.budgetStatus}
                          onValueChange={(v) =>
                            updateReport(r.id, { budgetStatus: v as BudgetStatus })
                          }
                        >
                          <SelectTrigger className="w-[140px] h-7 text-xs mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {BUDGETS.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs">{r.authorName}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteReport(r.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Tidak ada laporan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USERS */}
        <TabsContent value="users" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Pengguna</CardTitle>
              <CardDescription>Kelola poin reward dan akun warga pelapor.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Laporan</TableHead>
                    <TableHead>Poin</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users
                    .sort((a, b) => b.points - a.points)
                    .map((u, i) => (
                      <TableRow key={u.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{u.email}</TableCell>
                        <TableCell>{u.reportsCount}</TableCell>
                        <TableCell>
                          <Badge className="bg-accent/15 text-accent hover:bg-accent/15">
                            {u.points}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addUserPoints(u.id, 50)}
                          >
                            +50
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addUserPoints(u.id, -50)}
                          >
                            -50
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteUser(u.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Belum ada pengguna.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS */}
        <TabsContent value="analytics" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {STATUSES.map((s) => {
                  const count = reports.filter((r) => r.status === s).length;
                  const pct = stats.total ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={s}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{s}</span>
                        <span className="text-muted-foreground">
                          {count} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performa Dinas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from(new Set(reports.map((r) => r.agency))).map((agency) => {
                  const items = reports.filter((r) => r.agency === agency);
                  const done = items.filter((r) => r.status === "Selesai").length;
                  const pct = items.length ? (done / items.length) * 100 : 0;
                  return (
                    <div key={agency}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="line-clamp-1">{agency}</span>
                        <span className="text-muted-foreground">
                          {done}/{items.length}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone: "primary" | "accent" | "urgent" | "default";
}) {
  const toneCls =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : tone === "accent"
        ? "bg-accent/10 text-accent"
        : tone === "urgent"
          ? "bg-destructive/10 text-destructive"
          : "bg-muted text-foreground";
  return (
    <Card>
      <CardContent className="p-5">
        <div
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${toneCls} mb-3`}
        >
          {icon}
        </div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold font-display mt-1 leading-tight">{value}</div>
        {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
      </CardContent>
    </Card>
  );
}
