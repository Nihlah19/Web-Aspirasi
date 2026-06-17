import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useReports, formatIDR, timeAgo, getReports, saveReports, ReportStatus } from "@/lib/store";
import { UrgencyBadge } from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building2, ArrowLeft, ThumbsUp, CheckCircle2, Circle, Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/laporan/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Laporan #${params.id} — LAPOR WONG CERBON` }],
  }),
  component: ReportDetail,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Laporan tidak ditemukan</h1>
      <Link to="/laporan" className="mt-4 inline-block text-primary">Lihat semua laporan</Link>
    </div>
  ),
});

const statusOrder: ReportStatus[] = ["Baru", "Diproses", "Dikerjakan", "Selesai"];

function ReportDetail() {
  const { id } = Route.useParams();
  const reports = useReports();
  const report = reports.find((r) => r.id === id);
  if (!report && reports.length > 0) throw notFound();
  if (!report) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Memuat...</div>;

  function upvote() {
    const all = getReports();
    saveReports(all.map((r) => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
    toast.success("Dukungan terkirim! +1 suara warga.");
  }

  const currentStepIdx = statusOrder.indexOf(report.status);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <Link to="/laporan" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-card-soft">
            <div className="relative aspect-[16/9] bg-muted">
              <img src={report.photoUrl} alt={report.title} className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4"><UrgencyBadge urgency={report.urgency} /></div>
            </div>
            <div className="p-6">
              <Badge variant="secondary">{report.category}</Badge>
              <h1 className="mt-3 font-display text-2xl md:text-3xl font-bold tracking-tight">{report.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {report.location}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {timeAgo(report.createdAt)}</span>
                <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {report.agency}</span>
              </div>
              <p className="mt-5 text-foreground/90 leading-relaxed">{report.description}</p>
              <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Dilaporkan oleh <span className="font-semibold text-foreground">{report.authorName}</span></div>
                <Button onClick={upvote} variant="outline"><ThumbsUp className="mr-2 h-4 w-4" /> Dukung ({report.upvotes})</Button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold mb-5">Progres Penanganan</h2>

            {/* Steps */}
            <div className="flex items-center mb-8">
              {statusOrder.map((step, i) => {
                const done = i <= currentStepIdx;
                const active = i === currentStepIdx;
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-initial">
                    <div className={`flex flex-col items-center ${i === statusOrder.length - 1 ? "" : "flex-1"}`}>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${done ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-border text-muted-foreground"}`}>
                        {done && !active ? <CheckCircle2 className="h-5 w-5" /> : active ? <Loader2 className="h-4 w-4 animate-spin" /> : <Circle className="h-4 w-4" />}
                      </div>
                      <div className={`mt-2 text-xs font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>{step}</div>
                    </div>
                    {i < statusOrder.length - 1 && (
                      <div className={`h-0.5 flex-1 -mt-6 ${i < currentStepIdx ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Updates */}
            <div className="space-y-4">
              {[...report.updates].reverse().map((u, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${i === 0 ? "bg-accent ring-4 ring-accent/20" : "bg-border"}`} />
                    {i < report.updates.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={i === 0 ? "default" : "secondary"} className={i === 0 ? "bg-gradient-primary" : ""}>{u.status}</Badge>
                      <span className="text-xs text-muted-foreground">{timeAgo(u.date)}</span>
                    </div>
                    <p className="mt-1.5 text-sm">{u.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Urgency card */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Analisis AI</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`font-display text-5xl font-bold ${report.urgency >= 80 ? "text-urgent" : "text-primary"}`}>{report.urgency}</span>
              <span className="text-2xl text-muted-foreground">%</span>
            </div>
            <div className="text-sm text-muted-foreground">Tingkat Urgensi</div>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full ${report.urgency >= 80 ? "bg-gradient-urgent" : "bg-gradient-primary"}`} style={{ width: `${report.urgency}%` }} />
            </div>
          </div>

          {/* Budget card */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              <Wallet className="h-4 w-4" /> Estimasi Anggaran
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-primary">{formatIDR(report.budgetEstimate)}</div>
            <div className="mt-3 text-xs text-muted-foreground">Status pencairan:</div>
            <Badge className="mt-1" variant={
              report.budgetStatus === "Disetujui" || report.budgetStatus === "Cair Sebagian" ? "default" :
              report.budgetStatus === "Ditolak" ? "destructive" : "secondary"
            }>{report.budgetStatus}</Badge>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Estimasi berdasarkan analisis AI atas tingkat kerusakan & standar anggaran daerah Cirebon.
            </p>
          </div>

          {/* Agency */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Dinas Penanggung Jawab</div>
            <div className="mt-2 font-semibold">{report.agency}</div>
            <Button variant="outline" className="mt-4 w-full">Hubungi Dinas</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
