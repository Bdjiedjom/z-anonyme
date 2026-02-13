import { MessageSquareOff, Link2Off, FileX } from "lucide-react";

interface EmptyStateProps {
    icon?: "messages" | "links" | "reports";
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

const icons = {
    messages: MessageSquareOff,
    links: Link2Off,
    reports: FileX,
};

export function EmptyState({ icon = "messages", title, subtitle, action }: EmptyStateProps) {
    const Icon = icons[icon];

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
                <Icon className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {subtitle && (
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">{subtitle}</p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
