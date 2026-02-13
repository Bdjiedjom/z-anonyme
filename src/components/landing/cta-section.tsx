"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto space-y-8"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        Prêt à entendre la vérité ?
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Créez votre compte en 30 secondes et commencer à recevoir vos premiers messages anonymes.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20">
                            <Link href="/login">
                                Commencer maintenant
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Pas de carte bancaire requise • Annulable à tout moment
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
