import { EditorialImage } from "@/components/ui/EditorialImage";
import { SaveButton } from "@/components/ui/SaveButton";
import { cn } from "@/lib/utils";
import type { Report } from "@/types";

export function ReportCard({ report, className }: { report: Report; className?: string }) {
  return (
    <article className={cn("group panel panel-hover flex flex-col overflow-hidden", className)}>
      <div className="flex items-start justify-between gap-2 p-3 pb-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-frost transition-colors group-hover:text-cyanpale">
            {report.title}
          </h3>
          <p className="label-caps-sm mt-0.5 text-steel-dim">{report.date}</p>
        </div>
      </div>
      <EditorialImage src={report.image} alt="" className="h-28 w-full" />
      <div className="flex items-center justify-between p-3 pt-2.5">
        <span className="label-caps-sm" style={{ color: report.categoryColor }}>
          {report.category}
        </span>
        <SaveButton
          id={`report-${report.id}`}
          kind="report"
          title={report.title}
          href="/insights"
          meta={report.category}
        />
      </div>
    </article>
  );
}
