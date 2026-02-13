"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Lock, MessageCircle, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                            <ShieldCheck className="h-4 w-4" />
                            <span>100% Anonyme & Sécurisé</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
                    >
                        Vos messages, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                            en toute liberté.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-muted-foreground mb-8 max-w-2xl"
                    >
                        Recevez des feedbacks honnêtes, des questions curieuses et des mots doux.
                        Créez votre lien unique et partagez-le sur vos réseaux.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <Button asChild size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-primary/20">
                            <Link href="/login">
                                Créer mon lien
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm">
                            <Link href="/login">
                                Se connecter
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 flex items-center gap-4 text-sm text-muted-foreground"
                    >
                        <span className="flex items-center gap-1">
                            <Lock className="h-3 w-3" /> Chiffrement de bout en bout
                        </span>
                        <span>•</span>
                        <span>Gratuit pour toujours</span>
                    </motion.div>
                </div>

                {/* Floating UI Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative max-w-3xl mx-auto perspective-1000"
                >
                    {/* Main Card */}
                    <div className="relative z-10 bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl p-6 md:p-8 transform rotate-x-12 hover:rotate-0 transition-transform duration-700 ease-out">
                        {/* Mock Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-500" />
                                <div>
                                    <div className="h-2.5 w-24 bg-foreground/10 rounded-full mb-1.5" />
                                    <div className="h-2 w-16 bg-foreground/5 rounded-full" />
                                </div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-foreground/5" />
                        </div>

                        {/* Mock Message */}
                        <Card className="bg-card/50 border-primary/20 p-4 mb-4">
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <MessageCircle className="h-4 w-4" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-2 w-3/4 bg-foreground/10 rounded-full" />
                                    <div className="h-2 w-1/2 bg-foreground/10 rounded-full" />
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-card/50 border-border/50 p-4">
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-2 w-full bg-foreground/5 rounded-full" />
                                    <div className="h-2 w-2/3 bg-foreground/5 rounded-full" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Floating Decorative Elements */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-12 -right-12 z-0 hidden md:block"
                    >
                        <Card className="p-4 bg-background/80 backdrop-blur-md shadow-xl border-primary/20 rotate-6 w-48">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-6 w-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xs">Admin</div>
                                <div className="text-xs font-medium">Nouveau message !</div>
                            </div>
                            <div className="h-1.5 w-full bg-foreground/10 rounded-full" />
                        </Card>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-8 -left-12 z-20 hidden md:block"
                    >
                        <Card className="p-4 bg-background/80 backdrop-blur-md shadow-xl border-blue-500/20 -rotate-3 w-40">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">10k+</div>
                                <div className="text-xs text-muted-foreground">Utilisateurs</div>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
