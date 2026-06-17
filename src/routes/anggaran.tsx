import { createFileRoute, Link } from "@tanstack/react-router";
import { useReports, formatIDR } from "@/lib/store";
import { Wallet, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/anggaran")({
  head: () => ({ meta: [{ title: "Transparansi Anggaran — LAPOR WONG CERBON" }] }),
  component: BudgetPage,
});

function BudgetPage() {
  const reports = useReports();
  const withBudget = reports.filter((r) => r.budgetEstimate > 0);
  const totalEstimated = withBudget.reduce((s, r) => s + r.budgetEstimate, 0);
  const approved = withBudget.filter((r) => r.budgetStatus === "Disetujui" || r.budgetStatus === "Cair Sebagian");
  const totalApproved = approved.reduce((s, r) => s + r.budgetEstimate, 0);
  const submitted = withBudget.filter((r) => r.budgetStatus === "Diajukan");
  const rejected = withBudget.filter((r) => r.budgetStatus === "Ditolak");

  const statusIcon: Record<string, React.ReactNode> = {
    "Disetujui": <CheckCircle2 className="h-4 w-4 text-success" />,
    "Cair Sebagian": <CheckCircle2 className="h-4 w-4 text-success" />,
    "Diajukan": <Clock className="h-4 w-4 text-warning" />,
    "Ditolak": <XCircle className="h-4 w-4 text-destructive" />,
    "Belum Diajukan": <Clock className="h-4 w-4 text-muted-foreground" />,
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
          <Wallet className="h-4 w-4" /> Transparansi Anggaran Publik
        </div>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold tracking-tight">Estimasi & Pencairan Anggaran</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          AI menganalisis foto kerusakan & memberikan estimasi anggaran. Status pencairan ditampilkan transparan agar dana publik tetap terpantau.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Total Estimasi AI</div>
          <div className="mt-2 font-display text-2xl font-bold text-primary">{formatIDR(totalEstimated)}</div>
          <div className="text-xs text-muted-foreground mt-1">{withBudget.length} laporan</div>
        </div>
        <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
          <div className="text-xs uppercase tracking-wider font-semibold text-success">Disetujui / Cair</div>
          <div className="mt-2 font-display text-2xl font-bold text-success">{formatIDR(totalApproved)}</div>
          <div className="text-xs text-muted-foreground mt-1">{approved.length} laporan</div>
        </div>
        <div className="rounded-2xl border border-warning/40 bg-warning/5 p-5">
          <div className="text-xs uppercase tracking-wider font-semibold text-warning-foreground">Sedang Diajukan</div>
          <div className="mt-2 font-display text-2xl font-bold">{formatIDR(submitted.reduce((s, r) => s + r.budgetEstimate, 0))}</div>
          <div className="text-xs text-muted-foreground mt-1">{submitted.length} laporan</div>
        </div>
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="text-xs uppercase tracking-wider font-semibold text-destructive">Ditolak</div>
          <div className="mt-2 font-display text-2xl font-bold text-destructive">{formatIDR(rejected.reduce((s, r) => s + r.budgetEstimate, 0))}</div>
          <div className="text-xs text-muted-foreground mt-1">{rejected.length} laporan</div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-lg font-bold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Rincian per Laporan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="p-4 font-semibold">Laporan</th>
                <th className="p-4 font-semibold">Dinas</th>
                <th className="p-4 font-semibold">Estimasi AI</th>
                <th className="p-4 font-semibold">Status Pencairan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {withBudget.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="p-4">
                    <Link to="/laporan/$id" params={{ id: r.id }} className="font-semibold hover:text-primary line-clamp-1">{r.title}</Link>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.category} • {r.location.split(",")[0]}</div>
                  </td>
                  <td className="p-4 text-muted-foreground">{r.agency}</td>
                  <td className="p-4 font-display font-bold text-primary whitespace-nowrap">{formatIDR(r.budgetEstimate)}</td>
                  <td className="p-4">
                    <Badge variant="outline" className="gap-1.5">
                      {statusIcon[r.budgetStatus]} {r.budgetStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-muted/30 border border-border p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Catatan:</strong> Estimasi anggaran dihasilkan AI berdasarkan analisis foto kerusakan & standar HSPK Cirebon. Angka final dapat berbeda setelah survei lapangan dinas terkait.
      </div>
    </div>
  );
}
