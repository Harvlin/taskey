import { ReactNode } from "react";
export function EmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
      {icon && <div className="mb-4 opacity-60">{icon}</div>}
      <p className="text-base font-medium text-foreground">{title}</p>
      {description && <p className="text-sm mt-1 max-w-sm">{description}</p>}
    </div>
  );
}