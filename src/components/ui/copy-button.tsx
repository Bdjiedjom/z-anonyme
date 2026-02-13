"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { strings } from "@/lib/strings";

interface CopyButtonProps {
    text: string;
    label?: string;
    variant?: "default" | "ghost" | "outline" | "secondary";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export function CopyButton({
    text,
    label,
    variant = "outline",
    size = "sm",
    className,
}: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success(strings.links.copied);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Impossible de copier le lien.");
        }
    };

    return (
        <Button variant={variant} size={size} onClick={handleCopy} className={className}>
            {copied ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
            {label && <span className="ml-2">{label}</span>}
        </Button>
    );
}
