"use client";

import { motion } from "framer-motion";
import { UserPlus, Share, Mail } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        title: "Créez votre compte",
        description: "En quelques secondes, configurez votre profil. C'est gratuit et sécurisé.",
    },
    {
        icon: Share,
        title: "Partagez votre lien",
        description: "Ajoutez-le à votre bio Instagram, story Snapchat ou statut WhatsApp.",
    },
    {
        icon: Mail,
        title: "Recevez des messages",
        description: "Découvrez ce que vos amis pensent vraiment, en tout anonymat.",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Comment ça marche ?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Trois étapes simples pour commencer à recevoir des messages.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className="h-24 w-24 rounded-2xl bg-background border border-border flex items-center justify-center shadow-lg mb-6 group-hover:border-primary/50 group-hover:shadow-primary/20 transition-all duration-300">
                                <step.icon className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
