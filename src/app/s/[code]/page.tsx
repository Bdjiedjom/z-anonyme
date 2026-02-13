"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLinkByShortCode } from "@/lib/firestore-helpers";

export default function ShortLinkPage() {
    const params = useParams();
    const router = useRouter();
    const code = params?.code as string;
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!code) return;

        const resolve = async () => {
            try {
                const link = await getLinkByShortCode(code);
                if (link && link.isActive) {
                    router.replace(`/l/${link.token}`);
                } else {
                    setError(true);
                }
            } catch {
                setError(true);
            }
        };

        resolve();
    }, [code, router]);

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">Lien introuvable</h1>
                    <p className="text-muted-foreground">
                        Ce lien court n&apos;existe pas ou a expiré.
                    </p>
                    <a
                        href="/"
                        className="inline-block text-primary underline hover:no-underline"
                    >
                        Retour à l&apos;accueil
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );
}
