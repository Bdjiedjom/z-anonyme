"use client";

import { motion } from "framer-motion";
import { Lock, Zap, Share2, MessageCircle, EyeOff, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
    {
        icon: EyeOff,
        title: "100% Anonyme",
        description: "L'identité de l'expéditeur est toujours masquée. Aucune donnée personnelle n'est stockée sans consentement.",
    },
    {
        icon: Lock,
        title: "Chiffrement Sécurisé",
        description: "Vos messages sont protégés par des protocoles de sécurité de pointe. Vos secrets restent secrets.",
    },
    {
        icon: Share2,
        title: "Partage Facile",
        description: "Générez un lien unique en un clic et partagez-le sur Instagram, Snapchat, WhatsApp, ou Twitter.",
    },
    {
        icon: MessageCircle,
        title: "Réponses Privées",
        description: "Répondez aux messages directement ou partagez-les sur vos réseaux pour engager votre communauté.",
    },
    {
        icon: ShieldCheck,
        title: "Modération Intelligente",
        description: "Filtres anti-spam et outils de signalement pour une expérience saine et positive.",
    },
    {
        icon: Zap,
        title: "Instantané",
        description: "Recevez des notifications en temps réel dès qu'un nouveau message arrive dans votre boîte.",
    },
];

export function Features() {
    return (
        <section id="features" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Tout ce qu'il vous faut pour des échanges authentiques
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Conçu pour la confidentialité, optimisé pour l'engagement.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
