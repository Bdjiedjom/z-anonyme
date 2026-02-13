import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Envoyer un message anonyme",
    description:
        "Envoyez un message anonyme à cet utilisateur. Votre identité sera protégée.",
    openGraph: {
        title: "Envoyez-moi un message anonyme !",
        description:
            "Dites ce que vous pensez vraiment, en toute confidentialité sur Z-Anonyme.",
    },
};

export default function UsernameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
