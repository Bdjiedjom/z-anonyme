"use client";

import Link from "next/link";
import { MessageCircle, Twitter, Instagram } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold">Z-Anonyme</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            La plateforme de messagerie anonyme la plus sécurisée et moderne.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Produit</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#features" className="hover:text-foreground">Fonctionnalités</Link></li>
                            <li><Link href="#how-it-works" className="hover:text-foreground">Comment ça marche</Link></li>
                            <li><Link href="/login" className="hover:text-foreground">Se connecter</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Légal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-foreground">Confidentialité</Link></li>
                            <li><Link href="/terms" className="hover:text-foreground">Conditions d'utilisation</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Suivez-nous</h4>
                        <div className="flex gap-4">
                            <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Z-Anonyme. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
