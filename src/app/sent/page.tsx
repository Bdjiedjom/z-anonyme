import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function SentPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-3xl font-bold">Message envoyé !</h1>
                <p className="mt-3 text-muted-foreground">
                    Votre message a été transmis anonymement.
                    <br />
                    Le destinataire ne pourra pas connaître votre identité.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Button asChild variant="outline" className="rounded-xl">
                        <Link href="/">Retour à l&apos;accueil</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
