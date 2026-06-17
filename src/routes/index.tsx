import { createFileRoute, Link } from "@tanstack/react-router";
import { useReports, useUsers } from "@/lib/store";
import { ReportCard } from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-cirebon.jpg";
import { Sparkles, Zap, Eye, Trophy, ArrowRight, Shield, MapPin, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LAPOR WONG CERBON — Suara Warga, Aksi Nyata" },
      {
        name: "description",
        content:
          "Lapor masalah Cirebon jalan rusak, sampah, drainase. AI menentukan urgensi, transparansi penuh, dan reward untuk warga aktif.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const reports = useReports();
  const users = useUsers();
  const urgent = [...reports].sort((a, b) => b.urgency - a.urgency).slice(0, 6);
  const topUsers = [...users].sort((a, b) => b.points - a.points).slice(0, 5);
  const stats = {
    total: reports.length,
    selesai: reports.filter((r) => r.status === "Selesai").length,
    diproses: reports.filter((r) => r.status === "Diproses" || r.status === "Dikerjakan").length,
    warga: users.length,
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Kota Cirebon"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-primary/40" />
        </div>
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Didukung AI Gemini • Khusus untuk Wong Cerbon
            </div>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              Suara Wong Cerbon,
              <br />
              <span className="text-gradient-primary">Aksi Nyata</span> dari Pemerintah.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              Foto jalan rusak, sampah menumpuk, atau drainase mampet AI akan menentukan tingkat
              urgensi, meneruskannya ke dinas terkait, dan menampilkan progres secara{" "}
              <span className="font-semibold text-foreground">transparan</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gradient-primary shadow-elegant text-base h-12 px-6"
              >
                <Link to="/lapor">
                  + Buat Laporan Sekarang <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base h-12 px-6 backdrop-blur"
              >
                <Link to="/laporan">Lihat Semua Laporan</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
              {[
                { label: "Laporan Masuk", value: stats.total, color: "text-primary" },
                { label: "Sedang Ditangani", value: stats.diproses, color: "text-accent" },
                { label: "Selesai", value: stats.selesai, color: "text-success" },
                { label: "Warga Aktif", value: stats.warga, color: "text-foreground" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border/60 bg-card/70 backdrop-blur p-4"
                >
                  <div className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* URGENT REPORTS */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 text-urgent font-semibold text-sm">
              <TrendingUp className="h-4 w-4" /> Sorotan Hari Ini
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold tracking-tight">
              Laporan dengan Urgensi Tertinggi
            </h2>
            <p className="mt-2 text-muted-foreground">
              AI menyaring laporan paling mendesak. Pemerintah wajib menanggapi.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/laporan">
              Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {urgent.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-muted/30 border-y border-border py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Cara Kerjanya
            </h2>
            <p className="mt-3 text-muted-foreground">Tiga langkah memotong birokrasi rumit.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "1. Lapor + Foto",
                desc: "Unggah foto masalah & deskripsi singkat. Selesai dalam 30 detik.",
              },
              {
                icon: Sparkles,
                title: "2. AI Analisis Urgensi",
                desc: "Gemini AI menganalisis foto, menentukan tingkat urgensi & estimasi anggaran perbaikan.",
              },
              {
                icon: Eye,
                title: "3. Transparansi Progres",
                desc: "Dinas terkait wajib update progres. Semua warga bisa memantau.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-card-soft"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elegant">
                  <step.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERBOARD PREVIEW */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 text-accent font-semibold text-sm">
              <Trophy className="h-4 w-4" /> Gamifikasi Warga
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold tracking-tight">
              Setiap Laporan Berarti.
              <br />
              Dapatkan Poin & Reward.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Setiap laporan valid memberi kamu poin. Posisi teratas di leaderboard berhak atas
              reward resmi dari Pemkot Cirebon.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-success" /> Laporan valid +50 poin
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-success" /> Disetujui dinas +100 poin
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-success" /> Selesai dikerjakan +150 poin
              </div>
            </div>
            <Button asChild className="mt-6 bg-gradient-primary shadow-elegant">
              <Link to="/leaderboard">
                Lihat Leaderboard Lengkap <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" /> Top 5 Pelapor
            </h3>
            <div className="space-y-2">
              {topUsers.map((u, i) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg font-display font-bold text-sm ${
                      i === 0
                        ? "bg-gradient-urgent text-urgent-foreground"
                        : i === 1
                          ? "bg-accent text-accent-foreground"
                          : i === 2
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{u.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {u.reportsCount} laporan valid
                    </div>
                  </div>
                  <div className="font-display font-bold text-accent">
                    {u.points}
                    <span className="text-xs text-muted-foreground ml-1">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 md:p-16 text-center shadow-elegant">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 30% 20%, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative">
            <MapPin className="h-12 w-12 mx-auto text-white/90" />
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
              Cirebon Lebih Baik Dimulai dari Kamu.
            </h2>
            <p className="mt-4 text-white/80 max-w-xl mx-auto">
              Bergabung dengan ribuan wong Cerbon yang mengubah keluhan jadi aksi nyata pemerintah.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-white text-primary hover:bg-white/90 h-12 px-8 text-base font-semibold"
            >
              <Link to="/auth">Daftar Gratis Sekarang</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
