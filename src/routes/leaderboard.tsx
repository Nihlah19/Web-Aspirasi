import { createFileRoute } from "@tanstack/react-router";
import { useUsers, useCurrentUser } from "@/lib/store";
import { Trophy, Medal, Award, Gift } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — LAPOR WONG CERBON" }] }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const users = useUsers();
  const me = useCurrentUser();
  const sorted = [...users].sort((a, b) => b.points - a.points);
  const myRank = me ? sorted.findIndex((u) => u.id === me.id) + 1 : 0;

  const rewards = [
    { rank: "Top 1", reward: "Voucher belanja Rp 1.000.000 + Sertifikat Walikota", icon: Trophy, color: "text-urgent" },
    { rank: "Top 2-3", reward: "Voucher belanja Rp 500.000", icon: Medal, color: "text-accent" },
    { rank: "Top 4-10", reward: "Voucher belanja Rp 200.000", icon: Award, color: "text-primary" },
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-foreground">
          <Trophy className="h-3.5 w-3.5" /> Periode: Bulan Ini
        </div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">Leaderboard Wong Cerbon</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Warga paling aktif & berdampak. Top 10 mendapat reward dari Pemkot Cirebon.</p>
        {me && (
          <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-5 py-2">
            <span className="text-sm text-muted-foreground">Peringkat kamu:</span>
            <span className="font-display font-bold text-primary">#{myRank || "—"}</span>
            <span className="text-muted-foreground">•</span>
            <span className="font-semibold text-accent">{me.points} poin</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Podium top 3 */}
        <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4 mb-6">
          {[1, 0, 2].map((idx) => {
            const u = sorted[idx];
            if (!u) return null;
            const place = idx + 1;
            const isFirst = place === 1;
            return (
              <div key={u.id} className={`rounded-2xl border ${isFirst ? "border-accent/50 sm:-mt-4" : "border-border"} bg-card p-6 text-center shadow-card-soft`}>
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  place === 1 ? "bg-gradient-urgent text-urgent-foreground" :
                  place === 2 ? "bg-muted-foreground text-background" : "bg-accent text-accent-foreground"
                }`}>
                  {place === 1 ? <Trophy className="h-8 w-8" /> : place === 2 ? <Medal className="h-7 w-7" /> : <Award className="h-7 w-7" />}
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Peringkat #{place}</div>
                <div className="mt-1 font-display text-lg font-bold">{u.name}</div>
                <div className="mt-2 font-display text-3xl font-bold text-gradient-primary">{u.points}</div>
                <div className="text-xs text-muted-foreground">{u.reportsCount} laporan valid</div>
              </div>
            );
          })}
        </div>

        {/* Rest of leaderboard */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {sorted.slice(3).map((u, i) => {
              const isMe = me?.id === u.id;
              return (
                <div key={u.id} className={`flex items-center gap-4 p-4 ${isMe ? "bg-primary/5" : ""}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-display font-bold text-muted-foreground">#{i + 4}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{u.name} {isMe && <span className="text-xs text-primary">(kamu)</span>}</div>
                    <div className="text-xs text-muted-foreground">{u.reportsCount} laporan valid</div>
                  </div>
                  <div className="font-display font-bold text-accent">{u.points}<span className="text-xs text-muted-foreground ml-1">pts</span></div>
                </div>
              );
            })}
            {sorted.length <= 3 && <div className="p-8 text-center text-sm text-muted-foreground">Belum ada warga lain.</div>}
          </div>
        </div>

        {/* Rewards */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="h-5 w-5 text-accent" />
            <h3 className="font-display font-bold text-lg">Reward Bulan Ini</h3>
          </div>
          <div className="space-y-4">
            {rewards.map((r) => (
              <div key={r.rank} className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2">
                  <r.icon className={`h-4 w-4 ${r.color}`} />
                  <span className="font-semibold text-sm">{r.rank}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.reward}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-gradient-primary p-4 text-primary-foreground">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-90">Cara dapat poin</div>
            <ul className="mt-2 text-xs space-y-1">
              <li>+50 untuk setiap laporan terkirim</li>
              <li>+100 saat laporan diverifikasi dinas</li>
              <li>+150 saat laporan selesai dikerjakan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
