"use client";

import { motion } from "framer-motion";
import { Ghost, Shield, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SecuritySection() {
    return (
        <section className="py-24 bg-primary/5 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Visual Side */}
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 blur-[100px] rounded-full" />
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative z-10 grid grid-cols-2 gap-4"
                        >
                            <div className="space-y-4 mt-8">
                                <div className="p-6 bg-background rounded-3xl shadow-xl border border-border/50">
                                    <Ghost className="h-8 w-8 text-primary mb-4" />
                                    <h4 className="font-bold mb-2">Anonymat Total</h4>
                                    <p className="text-sm text-muted-foreground">Aucun traceur, aucune donnée revendue.</p>
                                </div>
                                <div className="p-6 bg-background rounded-3xl shadow-xl border border-border/50">
                                    <Key className="h-8 w-8 text-blue-500 mb-4" />
                                    <h4 className="font-bold mb-2">Données Chiffrées</h4>
                                    <p className="text-sm text-muted-foreground">Base de données sécurisée par Google Firebase.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-6 bg-background rounded-3xl shadow-xl border border-border/50">
                                    <Shield className="h-8 w-8 text-green-500 mb-4" />
                                    <h4 className="font-bold mb-2">Anti-Harcèlement</h4>
                                    <p className="text-sm text-muted-foreground">Outils de modération et de signalement intégrés.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 space-y-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl font-bold tracking-tight"
                        >
                            Votre sécurité n'est pas une option.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-lg text-muted-foreground"
                        >
                            Z-Anonyme est conçu avec une approche "Privacy First". Nous ne collectons que le strict nécessaire pour faire fonctionner le service. Vos messages sont privés et le resteront.
                        </motion.p>

                        <motion.ul
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            {["Pas d'IP stockée avec les messages", "Suppression définitive de compte facile", "Contrôle total sur votre profil public"].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </motion.ul>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <Button variant="outline" size="lg" className="rounded-full" asChild>
                                <Link href="/privacy">En savoir plus sur la confidentialité</Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
