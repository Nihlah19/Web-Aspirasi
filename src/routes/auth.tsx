import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { loginOrRegister } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Megaphone, Mail, User as UserIcon, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk / Daftar — LAPOR WONG CERBON" },
      {
        name: "description",
        content: "Masuk atau daftar untuk mulai melaporkan masalah di Cirebon.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || (mode === "register" && !name)) {
      toast.error("Lengkapi semua field.");
      return;
    }
    if (password.length < 4) {
      toast.error("Password minimal 4 karakter.");
      return;
    }
    const res = loginOrRegister(name || email.split("@")[0], email, password);
    if (!res.user) {
      toast.error(res.error || "Login gagal.");
      return;
    }
    toast.success(`Selamat datang, ${res.user.name}!`);
    router.navigate({ to: res.user.isAdmin ? "/admin" : "/" });
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-center">
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Megaphone className="h-3.5 w-3.5" /> Bergabung dengan Wong Cerbon
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight">
            Satu akun untuk <span className="text-gradient-primary">menjaga Cirebon</span> tetap
            hidup & layak huni.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Buat akun gratis dalam 10 detik. Mulai melapor, dapatkan poin, dan jadi bagian dari
            perubahan.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span> Laporan diproses AI dalam hitungan
              detik
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span> Poin & reward dari Pemkot Cirebon
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span> Pantau progres laporan secara
              transparan
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-elegant">
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${mode === "login" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Masuk
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${mode === "register" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Daftar Baru
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative mt-1.5">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bagas Pratama"
                    className="pl-9"
                  />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kamu@email.com"
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pass">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-primary shadow-elegant h-11">
              {mode === "login" ? "Masuk Akun" : "Buat Akun Baru"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Dengan melanjutkan, kamu setuju dengan ketentuan layanan LAPOR WONG CERBON.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
