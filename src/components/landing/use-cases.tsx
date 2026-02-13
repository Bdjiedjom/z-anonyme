"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const useCases = [
    {
        tag: "Feedback",
        title: "Au bureau",
        description: "Recueillez des feedbacks honnêtes de vos collègues sur votre dernière présentation ou projet.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        tag: "Fun",
        title: "Entre amis",
        description: "Lancez un jeu de questions/réponses anonyme et découvrez ce que vos potes pensent vraiment.",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        tag: "Créateurs",
        title: "Sur les réseaux",
        description: "Engagez votre communauté Instagram ou TikTok avec des sessions Q&A sans filtre.",
        gradient: "from-orange-500 to-red-500",
    },
    {
        tag: "Love",
        title: "Crush secret",
        description: "Laissez une chance à quelqu'un de vous déclarer sa flamme sans risque de rejet public.",
        gradient: "from-pink-500 to-rose-500",
    },
];

export function UseCases() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Pour toutes les situations</h2>
                    <p className="text-muted-foreground">Une seule app, une infinité de possibilités.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden rounded-3xl bg-background border border-border/50 p-6 hover:border-primary/50 transition-colors"
                        >
                            <div className={`absolute top-0 right-0 p-32 bg-gradient-to-br ${useCase.gradient} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity`} />

                            <Badge variant="outline" className="mb-4 rounded-full">
                                {useCase.tag}
                            </Badge>
                            <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                            <p className="text-sm text-muted-foreground">{useCase.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
