// Mock data store using localStorage. Replace with Supabase later.
import { useEffect, useState } from "react";

export type ReportStatus = "Baru" | "Diproses" | "Dikerjakan" | "Selesai" | "Ditolak";
export type BudgetStatus = "Belum Diajukan" | "Diajukan" | "Disetujui" | "Cair Sebagian" | "Ditolak";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  photoUrl: string;
  urgency: number; // 0-100
  status: ReportStatus;
  agency: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updates: { date: string; status: ReportStatus; note: string }[];
  budgetEstimate: number; // IDR
  budgetStatus: BudgetStatus;
  upvotes: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  reportsCount: number;
  avatar?: string;
  isAdmin?: boolean;
  password?: string;
}

const REPORTS_KEY = "lwc_reports";
const USER_KEY = "lwc_user";
const USERS_KEY = "lwc_users";

export const ADMIN_EMAIL = "admin@admin.com";
export const ADMIN_PASS = "adminpass";

const seedReports: Report[] = [
  {
    id: "r1",
    title: "Jalan Berlubang Parah di Jl. Siliwangi",
    description: "Jalan utama menuju pusat kota berlubang dalam, sudah memakan korban motor jatuh 3 kali minggu ini.",
    category: "Infrastruktur Jalan",
    location: "Jl. Siliwangi, Kejaksan, Kota Cirebon",
    photoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
    urgency: 92,
    status: "Diproses",
    agency: "Dinas PUPR Kota Cirebon",
    authorId: "u2",
    authorName: "Bagas Pratama",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updates: [
      { date: new Date(Date.now() - 86400000 * 2).toISOString(), status: "Baru", note: "Laporan diterima sistem." },
      { date: new Date(Date.now() - 86400000).toISOString(), status: "Diproses", note: "Tim survei dijadwalkan turun ke lokasi." },
    ],
    budgetEstimate: 45000000,
    budgetStatus: "Diajukan",
    upvotes: 142,
  },
  {
    id: "r2",
    title: "Tumpukan Sampah Menggunung di TPS Pasar Kanoman",
    description: "Sampah tidak diangkut 5 hari berturut-turut, bau menyengat dan menghalangi akses pasar.",
    category: "Kebersihan",
    location: "Pasar Kanoman, Lemahwungkuk",
    photoUrl: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800",
    urgency: 88,
    status: "Dikerjakan",
    agency: "DLH Kota Cirebon",
    authorId: "u3",
    authorName: "Siti Maryam",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updates: [
      { date: new Date(Date.now() - 86400000 * 3).toISOString(), status: "Baru", note: "Laporan masuk." },
      { date: new Date(Date.now() - 86400000 * 2).toISOString(), status: "Diproses", note: "Diteruskan ke DLH." },
      { date: new Date(Date.now() - 86400000).toISOString(), status: "Dikerjakan", note: "Truk sampah dikerahkan hari ini." },
    ],
    budgetEstimate: 8000000,
    budgetStatus: "Disetujui",
    upvotes: 98,
  },
  {
    id: "r3",
    title: "Lampu Jalan Mati Sepanjang Jl. By Pass Brigjen Dharsono",
    description: "Lampu jalan padam total 800m, rawan kecelakaan dan kriminalitas di malam hari.",
    category: "Penerangan",
    location: "Jl. By Pass Brigjen Dharsono",
    photoUrl: "https://images.unsplash.com/photo-1519872775884-29b3463b29c0?w=800",
    urgency: 76,
    status: "Baru",
    agency: "Dinas Perhubungan",
    authorId: "u4",
    authorName: "Rendra Wijaya",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updates: [
      { date: new Date(Date.now() - 86400000).toISOString(), status: "Baru", note: "Menunggu verifikasi." },
    ],
    budgetEstimate: 22000000,
    budgetStatus: "Belum Diajukan",
    upvotes: 67,
  },
  {
    id: "r4",
    title: "Saluran Drainase Tersumbat di Perumnas Gunung Sari",
    description: "Setiap hujan banjir setinggi lutut karena got tersumbat sampah dan lumpur.",
    category: "Drainase",
    location: "Perumnas Gunung Sari, Harjamukti",
    photoUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800",
    urgency: 81,
    status: "Diproses",
    agency: "Dinas PUPR",
    authorId: "u5",
    authorName: "Nurul Hidayah",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updates: [
      { date: new Date(Date.now() - 86400000 * 4).toISOString(), status: "Baru", note: "Laporan diterima." },
      { date: new Date(Date.now() - 86400000 * 2).toISOString(), status: "Diproses", note: "Survei lapangan dijadwalkan." },
    ],
    budgetEstimate: 35000000,
    budgetStatus: "Diajukan",
    upvotes: 54,
  },
  {
    id: "r5",
    title: "Trotoar Rusak di Sekitar Alun-Alun Kejaksan",
    description: "Paving trotoar pecah, membahayakan pejalan kaki terutama lansia.",
    category: "Infrastruktur Jalan",
    location: "Alun-Alun Kejaksan",
    photoUrl: "https://images.unsplash.com/photo-1597008641621-cefdcf718025?w=800",
    urgency: 58,
    status: "Selesai",
    agency: "Dinas PUPR",
    authorId: "u2",
    authorName: "Bagas Pratama",
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updates: [
      { date: new Date(Date.now() - 86400000 * 14).toISOString(), status: "Baru", note: "Laporan diterima." },
      { date: new Date(Date.now() - 86400000 * 10).toISOString(), status: "Dikerjakan", note: "Perbaikan paving dimulai." },
      { date: new Date(Date.now() - 86400000 * 3).toISOString(), status: "Selesai", note: "Pekerjaan rampung, trotoar bisa digunakan kembali." },
    ],
    budgetEstimate: 18000000,
    budgetStatus: "Cair Sebagian",
    upvotes: 41,
  },
  {
    id: "r6",
    title: "Pipa Air PDAM Bocor di Jl. Cipto Mangunkusumo",
    description: "Air mancur ke jalan sejak 3 hari, terbuang sia-sia dan menggenangi pengendara.",
    category: "Air Bersih",
    location: "Jl. Cipto Mangunkusumo",
    photoUrl: "https://images.unsplash.com/photo-1581088382203-9956d7d5b4ab?w=800",
    urgency: 84,
    status: "Dikerjakan",
    agency: "PDAM Tirta Giri Nata",
    authorId: "u3",
    authorName: "Siti Maryam",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updates: [
      { date: new Date(Date.now() - 86400000 * 2).toISOString(), status: "Baru", note: "Laporan diterima." },
      { date: new Date(Date.now() - 86400000).toISOString(), status: "Dikerjakan", note: "Tim PDAM turun ke lokasi." },
    ],
    budgetEstimate: 12000000,
    budgetStatus: "Disetujui",
    upvotes: 78,
  },
];

const seedUsers: User[] = [
  { id: "u2", name: "Bagas Pratama", email: "bagas@cerbon.id", points: 1240, reportsCount: 18 },
  { id: "u3", name: "Siti Maryam", email: "siti@cerbon.id", points: 1180, reportsCount: 16 },
  { id: "u4", name: "Rendra Wijaya", email: "rendra@cerbon.id", points: 920, reportsCount: 12 },
  { id: "u5", name: "Nurul Hidayah", email: "nurul@cerbon.id", points: 870, reportsCount: 11 },
  { id: "u6", name: "Ahmad Fauzi", email: "fauzi@cerbon.id", points: 720, reportsCount: 9 },
  { id: "u7", name: "Dewi Anggraini", email: "dewi@cerbon.id", points: 650, reportsCount: 8 },
  { id: "u8", name: "Tono Sugiarto", email: "tono@cerbon.id", points: 540, reportsCount: 7 },
  { id: "u9", name: "Lina Kusuma", email: "lina@cerbon.id", points: 420, reportsCount: 5 },
];

function isBrowser() { return typeof window !== "undefined"; }

function ensureSeed() {
  if (!isBrowser()) return;
  if (!localStorage.getItem(REPORTS_KEY)) {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(seedReports));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
  }
}

export function getReports(): Report[] {
  if (!isBrowser()) return seedReports;
  ensureSeed();
  return JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
}

export function saveReports(reports: Report[]) {
  if (!isBrowser()) return;
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  window.dispatchEvent(new Event("lwc_data_change"));
}

export function addReport(r: Report) {
  const all = getReports();
  saveReports([r, ...all]);
}

export function getUsers(): User[] {
  if (!isBrowser()) return seedUsers;
  ensureSeed();
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

export function saveUsers(users: User[]) {
  if (!isBrowser()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event("lwc_data_change"));
}

export function getCurrentUser(): User | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentUser(u: User | null) {
  if (!isBrowser()) return;
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("lwc_auth_change"));
}

export function loginOrRegister(name: string, email: string, password?: string): { user: User | null; error?: string } {
  // Admin shortcut
  if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASS) {
    const admin: User = {
      id: "admin",
      name: "Administrator",
      email: ADMIN_EMAIL,
      points: 0,
      reportsCount: 0,
      isAdmin: true,
    };
    setCurrentUser(admin);
    return { user: admin };
  }
  if (email.toLowerCase() === ADMIN_EMAIL && password !== ADMIN_PASS) {
    return { user: null, error: "Password admin salah." };
  }

  const users = getUsers();
  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: "u" + Date.now(),
      name: name || email.split("@")[0],
      email,
      points: 0,
      reportsCount: 0,
      password,
    };
    saveUsers([...users, user]);
  } else if (user.password && password && user.password !== password) {
    return { user: null, error: "Password salah." };
  } else if (!user.password && password) {
    // attach password on first login
    user.password = password;
    saveUsers(users.map(u => u.id === user!.id ? user! : u));
  }
  setCurrentUser(user);
  return { user };
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    setUser(getCurrentUser());
    const h = () => setUser(getCurrentUser());
    window.addEventListener("lwc_auth_change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("lwc_auth_change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return user;
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  useEffect(() => {
    setReports(getReports());
    const h = () => setReports(getReports());
    window.addEventListener("lwc_data_change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("lwc_data_change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return reports;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    setUsers(getUsers());
    const h = () => setUsers(getUsers());
    window.addEventListener("lwc_data_change", h);
    return () => window.removeEventListener("lwc_data_change", h);
  }, []);
  return users;
}

// Mock "Gemini AI" urgency analysis
export function analyzeUrgency(title: string, description: string, category: string): { urgency: number; reasoning: string; budget: number; agency: string } {
  const text = (title + " " + description).toLowerCase();
  let score = 35;
  const urgentKeywords = ["parah", "korban", "darurat", "rusak berat", "banjir", "kebakaran", "bahaya", "kecelakaan", "ambruk", "putus"];
  const mediumKeywords = ["rusak", "bocor", "mati", "tersumbat", "berlubang", "menumpuk"];
  urgentKeywords.forEach((k) => { if (text.includes(k)) score += 15; });
  mediumKeywords.forEach((k) => { if (text.includes(k)) score += 7; });
  score = Math.min(98, score + Math.floor(Math.random() * 10));

  const agencyMap: Record<string, string> = {
    "Infrastruktur Jalan": "Dinas PUPR Kota Cirebon",
    "Kebersihan": "DLH Kota Cirebon",
    "Penerangan": "Dinas Perhubungan",
    "Drainase": "Dinas PUPR Kota Cirebon",
    "Air Bersih": "PDAM Tirta Giri Nata",
    "Fasilitas Umum": "Dinas Pariwisata & Kebudayaan",
    "Lainnya": "Pemkot Cirebon",
  };

  const budgetBase: Record<string, number> = {
    "Infrastruktur Jalan": 40000000,
    "Kebersihan": 8000000,
    "Penerangan": 20000000,
    "Drainase": 30000000,
    "Air Bersih": 15000000,
    "Fasilitas Umum": 25000000,
    "Lainnya": 10000000,
  };
  const budget = Math.round((budgetBase[category] || 10000000) * (0.7 + Math.random() * 0.8));

  const reasoning = score >= 80
    ? "AI mendeteksi indikasi bahaya tinggi dan potensi korban. Direkomendasikan tindakan segera dalam 24 jam."
    : score >= 60
    ? "Tingkat urgensi sedang-tinggi. Sebaiknya ditangani dalam 3-7 hari kerja."
    : "Urgensi rendah-sedang. Masuk antrian penanganan reguler.";

  return { urgency: score, reasoning, budget, agency: agencyMap[category] || "Pemkot Cirebon" };
}

export function formatIDR(n: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
}
