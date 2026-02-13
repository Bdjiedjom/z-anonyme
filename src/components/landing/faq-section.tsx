"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Est-ce vraiment 100% anonyme ?",
        answer: "Oui. Nous ne stockons pas l'adresse IP associée aux messages envoyés. Votre identité est protégée. Cependant, en cas de menaces graves ou d'activités illégales, nous coopérons avec les autorités.",
    },
    {
        question: "Comment puis-je partager mon lien ?",
        answer: "Une fois votre compte créé, vous obtenez un lien unique (z-anonyme.app/l/votre-token). Copiez-le et collez-le dans votre bio Instagram, story Snapchat ou statut WhatsApp.",
    },
    {
        question: "Puis-je savoir qui m'a envoyé un message ?",
        answer: "Non, c'est le principe de l'application. Vous ne saurez jamais qui est l'expéditeur, sauf s'il signe son message.",
    },
    {
        question: "Est-ce gratuit ?",
        answer: "L'utilisation de base est 100% gratuite. Certaines fonctionnalités avancées pourraient devenir payantes à l'avenir, mais l'envoi et la réception de messages resteront gratuits.",
    },
    {
        question: "Comment signaler un message abusif ?",
        answer: "Sous chaque message reçu, vous avez un bouton de signalement. Notre équipe de modération examinera le contenu et pourra bannir l'expéditeur.",
    },
    {
        question: "Puis-je supprimer mon compte ?",
        answer: "Oui, à tout moment depuis les paramètres de votre compte. Toutes vos données seront effacées définitivement.",
    },
    {
        question: "Faut-il installer une application ?",
        answer: "Non ! Z-Anonyme est une web-app (PWA). Vous pouvez l'utiliser directement depuis votre navigateur et même l'installer sur votre écran d'accueil sans passer par l'App Store.",
    },
];

export function FaqSection() {
    return (
        <section id="faq" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Questions Fréquentes</h2>
                    <p className="text-muted-foreground">Tout ce que vous devez savoir.</p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-medium">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
