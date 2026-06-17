import { Link } from "@tanstack/react-router";
import { Report } from "@/lib/store";
import { timeAgo } from "@/lib/store";
import { MapPin, TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  "Baru": "bg-muted text-foreground",
  "Diproses": "bg-warning/15 text-warning-foreground border border-warning/30",
  "Dikerjakan": "bg-primary/10 text-primary border border-primary/30",
  "Selesai": "bg-success/15 text-success border border-success/30",
  "Ditolak": "bg-destructive/15 text-destructive border border-destructive/30",
};

export function urgencyColor(u: number) {
  if (u >= 80) return "text-urgent";
  if (u >= 60) return "text-accent";
  return "text-muted-foreground";
}

export function UrgencyBadge({ urgency }: { urgency: number }) {
  const label = urgency >= 80 ? "DARURAT" : urgency >= 60 ? "PENTING" : "NORMAL";
  const cls =
    urgency >= 80
      ? "bg-gradient-urgent text-urgent-foreground"
      : urgency >= 60
      ? "bg-accent text-accent-foreground"
      : "bg-muted text-muted-foreground";
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold tracking-wide ${cls}`}>
      <TrendingUp className="h-3 w-3" />
      {label} • {urgency}%
    </div>
  );
}

export function ReportCard({ report }: { report: Report }) {
  return (
    <Link
      to="/laporan/$id"
      params={{ id: report.id }}
      className="group block overflow-hidden rounded-xl bg-card border border-border hover:border-primary/40 shadow-card-soft hover:shadow-elegant transition-all"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={report.photoUrl}
          alt={report.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3"><UrgencyBadge urgency={report.urgency} /></div>
        <div className="absolute top-3 right-3">
          <Badge className={statusColors[report.status]}>{report.status}</Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-xs text-white/90 font-medium">{report.category}</div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {report.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{report.description}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {report.location.split(",")[0]}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {timeAgo(report.createdAt)}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">oleh <span className="font-medium text-foreground">{report.authorName}</span></span>
          <span className="font-semibold text-accent">▲ {report.upvotes} dukungan</span>
        </div>
      </div>
    </Link>
  );
}
