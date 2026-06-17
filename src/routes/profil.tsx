import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCurrentUser, useReports, setCurrentUser, getCurrentUser, timeAgo } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, FileText, Trophy, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/profil")({
  head: () => ({ meta: [{ title: "Profil — LAPOR WONG CERBON" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const user = useCurrentUser();
  const router = useRouter();
  const reports = useReports();

  useEffect(() => {
    const t = setTimeout(() => {
      if (!getCurrentUser()) router.navigate({ to: "/auth" });
    }, 200);
    return () => clearTimeout(t);
  }, [router]);

  if (!user)
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        Memuat...
      </div>
    );

  const myReports = reports.filter((r) => r.authorId === user.id);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="rounded-2xl bg-gradient-hero p-8 text-white shadow-elegant relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 80% 30%, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-display text-3xl font-bold">
            {user.name[0]}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl md:text-3xl font-bold">{user.name}</h1>
            <p className="text-white/80 text-sm">{user.email}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4" /> <span className="font-bold">{user.points}</span> poin
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />{" "}
                <span className="font-bold">{myReports.length}</span> laporan
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            onClick={() => {
              setCurrentUser(null);
              router.navigate({ to: "/" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Keluar
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" /> Laporan Saya
        </h2>

        {myReports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground">Kamu belum membuat laporan apapun.</p>
            <Button asChild className="mt-4 bg-gradient-primary">
              <Link to="/lapor">+ Buat Laporan Pertama</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {myReports.map((r) => (
              <Link
                key={r.id}
                to="/laporan/$id"
                params={{ id: r.id }}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors"
              >
                <img src={r.photoUrl} alt={r.title} className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold line-clamp-1">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {timeAgo(r.createdAt)} • {r.category}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={r.status === "Selesai" ? "default" : "secondary"}
                    className={r.status === "Selesai" ? "bg-success" : ""}
                  >
                    {r.status}
                  </Badge>
                  <span className="text-xs font-semibold text-accent">▲ {r.upvotes}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
