"use client";

import { motion } from "framer-motion";

export function SocialProof() {
    return (
        <section className="py-10 border-y border-border/50 bg-background/50">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-medium text-muted-foreground mb-6">
                    Rejoignez plus de 10 000 utilisateurs quotidiens
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholder Logos */}
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span className="h-6 w-6 rounded-full bg-foreground" />
                        InstaLink
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span className="h-6 w-6 rounded-full bg-foreground" />
                        SnapMsg
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span className="h-6 w-6 rounded-full bg-foreground" />
                        TikTalk
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span className="h-6 w-6 rounded-full bg-foreground" />
                        Whisper
                    </div>
                </div>
            </div>
        </section>
    );
}
