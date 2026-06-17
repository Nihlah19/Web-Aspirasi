import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCurrentUser, addReport, analyzeUrgency, getUsers, saveUsers, getCurrentUser, setCurrentUser, formatIDR } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Upload, MapPin, Camera, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/lapor")({
  head: () => ({ meta: [{ title: "Buat Laporan — LAPOR WONG CERBON" }] }),
  component: LaporPage,
});

const CATEGORIES = ["Infrastruktur Jalan", "Kebersihan", "Penerangan", "Drainase", "Air Bersih", "Fasilitas Umum", "Lainnya"];
const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
  "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800",
  "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800",
  "https://images.unsplash.com/photo-1597008641621-cefdcf718025?w=800",
];

function LaporPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Infrastruktur Jalan");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeUrgency> | null>(null);

  useEffect(() => {
    if (user === null) {
      const t = setTimeout(() => {
        if (!getCurrentUser()) {
          toast.error("Silakan masuk dulu untuk membuat laporan.");
          router.navigate({ to: "/auth" });
        }
      }, 200);
      return () => clearTimeout(t);
    }
  }, [user, router]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(f);
  }

  function runAnalysis() {
    if (!title || !desc || !location || !photo) {
      toast.error("Lengkapi semua field termasuk foto.");
      return;
    }
    setAnalyzing(true);
    setAnalysis(null);
    setTimeout(() => {
      setAnalysis(analyzeUrgency(title, desc, category));
      setAnalyzing(false);
    }, 1800);
  }

  function submit() {
    if (!analysis || !user) return;
    const id = "r" + Date.now();
    addReport({
      id,
      title,
      description: desc,
      category,
      location,
      photoUrl: photo,
      urgency: analysis.urgency,
      status: "Baru",
      agency: analysis.agency,
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date().toISOString(),
      updates: [{ date: new Date().toISOString(), status: "Baru", note: "Laporan diterima sistem & dianalisis AI." }],
      budgetEstimate: analysis.budget,
      budgetStatus: "Belum Diajukan",
      upvotes: 1,
    });
    // award points
    const users = getUsers();
    const updated = users.map((u) => u.id === user.id ? { ...u, points: u.points + 50, reportsCount: u.reportsCount + 1 } : u);
    saveUsers(updated);
    const me = updated.find((u) => u.id === user.id);
    if (me) setCurrentUser(me);
    toast.success("Laporan terkirim! Kamu dapat +50 poin 🎉");
    router.navigate({ to: "/laporan/$id", params: { id } });
  }

  if (!user) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Memuat...</div>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <Link to="/laporan" className="text-sm text-muted-foreground hover:text-foreground">← Semua Laporan</Link>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold tracking-tight">Buat Laporan Baru</h1>
        <p className="mt-2 text-muted-foreground">Isi detail di bawah. AI akan menganalisis foto & teks untuk menentukan tingkat urgensi.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-5 rounded-2xl border border-border bg-card p-6">
          <div>
            <Label>Foto Bukti *</Label>
            {photo ? (
              <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border border-border">
                <img src={photo} alt="preview" className="h-full w-full object-cover" />
                <button onClick={() => setPhoto("")} className="absolute top-2 right-2 bg-card/90 backdrop-blur px-3 py-1 rounded text-xs font-medium">Ganti</button>
              </div>
            ) : (
              <div className="mt-2 rounded-lg border-2 border-dashed border-border p-6 text-center">
                <Camera className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Unggah foto masalah</p>
                <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium cursor-pointer">
                  <Upload className="h-4 w-4" /> Pilih File
                  <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
                <p className="mt-3 text-xs text-muted-foreground">atau pilih contoh:</p>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {SAMPLE_PHOTOS.map((p) => (
                    <button key={p} onClick={() => setPhoto(p)} className="aspect-square rounded overflow-hidden border border-border hover:border-primary">
                      <img src={p} alt="sample" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="title">Judul Laporan *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Jalan berlubang parah di Jl. Siliwangi" className="mt-1.5" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Kategori *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="loc">Lokasi *</Label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Jl. Siliwangi, Kejaksan" className="pl-9" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="desc">Deskripsi Lengkap *</Label>
            <Textarea id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} rows={5} className="mt-1.5" placeholder="Jelaskan kondisi masalah, sudah berapa lama, dampak ke warga..." />
          </div>

          <Button onClick={runAnalysis} disabled={analyzing} className="w-full bg-gradient-primary shadow-elegant h-12 text-base">
            {analyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> AI menganalisis...</> : <><Sparkles className="mr-2 h-4 w-4" /> Analisis dengan AI</>}
          </Button>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-20 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hasil Analisis AI</span>
            </div>
            <h3 className="font-display text-lg font-bold">Gemini Urgency Engine</h3>

            {!analysis && !analyzing && (
              <div className="mt-6 py-10 text-center text-sm text-muted-foreground">
                <Sparkles className="h-10 w-10 mx-auto opacity-30" />
                <p className="mt-3">Isi form lalu klik "Analisis dengan AI" untuk melihat hasil.</p>
              </div>
            )}

            {analyzing && (
              <div className="mt-6 py-10 text-center">
                <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Memproses foto & deskripsi...</p>
              </div>
            )}

            {analysis && (
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tingkat Urgensi</span>
                    <span className={`font-display text-2xl font-bold ${analysis.urgency >= 80 ? "text-urgent" : analysis.urgency >= 60 ? "text-accent" : "text-primary"}`}>{analysis.urgency}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${analysis.urgency >= 80 ? "bg-gradient-urgent" : "bg-gradient-primary"}`} style={{ width: `${analysis.urgency}%` }} />
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-sm">{analysis.reasoning}</div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">Dinas Terkait</div>
                    <div className="font-semibold text-sm mt-0.5">{analysis.agency}</div>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground">Estimasi Anggaran Perbaikan</div>
                    <div className="font-display font-bold text-primary mt-0.5">{formatIDR(analysis.budget)}</div>
                  </div>
                </div>
                <Button onClick={submit} className="w-full bg-gradient-primary shadow-elegant h-11">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Kirim Laporan (+50 poin)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
