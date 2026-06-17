import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useReports } from "@/lib/store";
import { ReportCard } from "@/components/ReportCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Route = createFileRoute("/laporan/")({
  head: () => ({ meta: [{ title: "Semua Laporan — LAPOR WONG CERBON" }] }),
  component: LaporanList,
});

const FILTERS = ["Semua", "Darurat", "Diproses", "Selesai"];

function LaporanList() {
  const reports = useReports();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("Semua");

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchQ = !q || (r.title + r.description + r.location).toLowerCase().includes(q.toLowerCase());
      const matchF =
        filter === "Semua" ? true :
        filter === "Darurat" ? r.urgency >= 80 :
        filter === "Diproses" ? r.status === "Diproses" || r.status === "Dikerjakan" :
        filter === "Selesai" ? r.status === "Selesai" : true;
      return matchQ && matchF;
    });
  }, [reports, q, filter]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Semua Laporan Warga</h1>
        <p className="mt-2 text-muted-foreground">{reports.length} laporan total — disaring berdasarkan urgensi & status.</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari berdasarkan judul, lokasi..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 h-11" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 h-11 rounded-md text-sm font-semibold whitespace-nowrap transition-colors border ${
                filter === f ? "bg-gradient-primary text-primary-foreground border-transparent shadow-elegant" : "bg-card border-border hover:border-primary/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">Tidak ada laporan yang cocok.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => <ReportCard key={r.id} report={r} />)}
        </div>
      )}
    </div>
  );
}
