"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { useAuth } from "@/lib/auth-context";
import { Link2, MessageCircle, Share2, Sparkles, X } from "lucide-react";

const ONBOARDING_KEY = "z_anonyme_onboarding_seen";

export function OnboardingGuide() {
    const { appUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    const appUrl = typeof window !== "undefined" ? window.location.origin : "";

    useEffect(() => {
        // Delay slightly for smooth entrance after login
        if (appUser && typeof window !== "undefined") {
            const hasSeen = localStorage.getItem(ONBOARDING_KEY);
            if (!hasSeen) {
                const timer = setTimeout(() => setIsOpen(true), 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [appUser]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem(ONBOARDING_KEY, "true");
    };

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep((prev) => prev + 1);
        } else {
            handleClose();
        }
    };

    if (!isOpen || !appUser) return null;

    const steps = [
        {
            id: "welcome",
            title: "Bienvenue sur Z-Anonyme ! 🎉",
            description:
                "Nous sommes ravis de vous compter parmi nous. Voici un petit guide rapide pour commencer à recevoir vos premiers messages anonymes.",
            icon: <Sparkles className="h-10 w-10 text-primary" />,
            action: "Commencer"
        },
        {
            id: "share",
            title: "Votre lien public",
            description:
                "C'est votre lien principal. Copiez-le et ajoutez-le à votre bio Instagram, Snapchat, ou partagez-le dans vos stories pour recevoir des messages !",
            icon: <Share2 className="h-10 w-10 text-blue-500" />,
            content: (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/30 p-3">
                    <span className="truncate text-sm font-medium">
                        {appUrl}/u/{appUser.username}
                    </span>
                    <CopyButton text={`${appUrl}/u/${appUser.username}`} variant="outline" size="sm" />
                </div>
            ),
            action: "Suivant"
        },
        {
            id: "messages",
            title: "Vos messages",
            description:
                "Tous les messages que l'on vous envoie apparaîtront ici. Ils sont 100% anonymes. Vous pouvez les lire, les archiver ou les supprimer en toute sécurité.",
            icon: <MessageCircle className="h-10 w-10 text-green-500" />,
            action: "Suivant"
        },
        {
            id: "links",
            title: "Liens personnalisés",
            description:
                "Besoin d'un lien pour une story spécifique ? Vous pouvez créer des liens avec un nombre de messages limité ou une date d'expiration dans l'onglet \"Mes Liens\".",
            icon: <Link2 className="h-10 w-10 text-purple-500" />,
            action: "J'ai compris !"
        }
    ];

    const currentStep = steps[step];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/50 bg-card p-6 shadow-2xl sm:p-8"
                >
                    <button
                        onClick={handleClose}
                        className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            key={currentStep.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50"
                        >
                            {currentStep.icon}
                        </motion.div>

                        <motion.div
                            key={`text-${currentStep.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="mb-3 text-2xl font-bold">{currentStep.title}</h2>
                            <p className="text-muted-foreground">{currentStep.description}</p>

                            {currentStep.content}
                        </motion.div>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-4">
                        <div className="flex gap-1.5">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-primary" : "w-1.5 bg-primary/20"
                                        }`}
                                />
                            ))}
                        </div>
                        <Button onClick={nextStep} className="rounded-xl px-6">
                            {currentStep.action}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
