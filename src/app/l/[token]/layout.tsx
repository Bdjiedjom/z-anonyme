import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Envoyer un message anonyme",
    description:
        "Envoyez un message anonyme via ce lien sécurisé. Votre identité restera totalement confidentielle.",
    openGraph: {
        title: "Envoyez-moi un message anonyme !",
        description:
            "Dites-moi ce que vous pensez vraiment, en toute confidentialité. Votre identité restera secrète.",
    },
};

export default function TokenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
