import { Link, useRouter } from "@tanstack/react-router";
import { useCurrentUser, setCurrentUser } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { CirebonIcon } from "@/components/icons/CirebonIcon";
import { LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Beranda" },
  { to: "/laporan", label: "Semua Laporan" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/anggaran", label: "Transparansi Anggaran" },
];

export function Header() {
  const user = useCurrentUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
            <CirebonIcon size={200} className="text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight">
              LAPOR WONG CERBON
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Suara Warga, Aksi Nyata
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-muted transition-colors"
              activeProps={{ className: "text-primary bg-primary/5" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              {user.isAdmin && (
                <Button
                  asChild
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent/10"
                >
                  <Link to="/admin">⚡ Admin</Link>
                </Button>
              )}
              {!user.isAdmin && (
                <Button asChild variant="default" className="bg-gradient-primary shadow-elegant">
                  <Link to="/lapor">+ Buat Laporan</Link>
                </Button>
              )}
              <Link
                to={user.isAdmin ? "/admin" : "/profil"}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {user.name[0]}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-sm font-medium">{user.name.split(" ")[0]}</div>
                  <div className="text-xs text-accent font-semibold">
                    {user.isAdmin ? "Administrator" : `${user.points} poin`}
                  </div>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setCurrentUser(null);
                  router.navigate({ to: "/" });
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/auth">Masuk</Link>
              </Button>
              <Button asChild className="bg-gradient-primary shadow-elegant">
                <Link to="/auth">Daftar Gratis</Link>
              </Button>
            </>
          )}
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container mx-auto flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md hover:bg-muted text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border my-2" />
            {user ? (
              <>
                <Link
                  to="/lapor"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-md bg-gradient-primary text-primary-foreground text-sm font-semibold text-center"
                >
                  + Buat Laporan
                </Link>
                <Link
                  to="/profil"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-md hover:bg-muted text-sm flex items-center gap-2"
                >
                  <UserIcon className="h-4 w-4" /> {user.name} • {user.points} poin
                </Link>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setOpen(false);
                    router.navigate({ to: "/" });
                  }}
                  className="px-3 py-2.5 rounded-md hover:bg-muted text-sm text-left text-destructive flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Keluar
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md bg-gradient-primary text-primary-foreground text-sm font-semibold text-center"
              >
                Masuk / Daftar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <CirebonIcon size={200} className="text-primary-foreground" />
            </div>
            <span className="font-display font-bold">LAPOR WONG CERBON</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Platform pengaduan publik berbasis AI untuk warga Cirebon. Memotong birokrasi rumit
            lewat transparansi & tekanan publik yang terukur.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/laporan">Semua Laporan</Link>
            </li>
            <li>
              <Link to="/leaderboard">Leaderboard</Link>
            </li>
            <li>
              <Link to="/anggaran">Anggaran</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Kontak</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Pemkot Cirebon</li>
            <li>halo@laporwongcerbon.id</li>
            <li>0231-200xxxx</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Lapor Wong Cerbon-Dibuat oleh tim pengembang 3.
      </div>
    </footer>
  );
}
