import { ReactNode } from "react";

export function ViewHeader({ icon, title, subtitle, right }: { icon?: ReactNode; title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {icon}
          {title}
        </h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}