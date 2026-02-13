import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de confidentialité — Z-Anonyme",
    description: "Découvrez comment Z-Anonyme protège vos données personnelles et respecte votre vie privée.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    ← Retour à l&apos;accueil
                </Link>

                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Politique de confidentialité
                </h1>
                <p className="text-muted-foreground mb-8">
                    Dernière mise à jour : 13 février 2026
                </p>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Bienvenue sur Z-Anonyme. La protection de vos données personnelles est une priorité absolue.
                            Cette politique de confidentialité explique quelles informations nous collectons,
                            comment nous les utilisons et quels sont vos droits.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Données collectées</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            Nous collectons uniquement les données strictement nécessaires au fonctionnement du service :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong className="text-foreground">Informations de compte :</strong> nom, adresse e-mail et photo de profil (via Google Sign-In).</li>
                            <li><strong className="text-foreground">Nom d&apos;utilisateur :</strong> choisi par vous lors de la configuration de votre profil.</li>
                            <li><strong className="text-foreground">Messages reçus :</strong> le contenu des messages anonymes envoyés via vos liens de partage.</li>
                            <li><strong className="text-foreground">Données techniques :</strong> logs d&apos;erreurs et données de performance pour améliorer le service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Données NON collectées</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            Nous nous engageons à ne <strong className="text-foreground">jamais</strong> collecter :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>L&apos;adresse IP des expéditeurs de messages anonymes.</li>
                            <li>Les données de géolocalisation.</li>
                            <li>Les cookies de traçage publicitaire.</li>
                            <li>Aucune donnée n&apos;est revendue à des tiers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Utilisation des données</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            Vos données sont utilisées exclusivement pour :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Vous permettre de vous connecter et gérer votre compte.</li>
                            <li>Afficher votre profil public (nom d&apos;utilisateur et photo).</li>
                            <li>Recevoir et consulter vos messages anonymes.</li>
                            <li>Vous envoyer des notifications push (si activées).</li>
                            <li>Améliorer la qualité et la sécurité du service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Stockage et sécurité</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Toutes les données sont stockées de manière sécurisée sur Google Firebase (Google Cloud Platform),
                            avec chiffrement en transit et au repos. L&apos;accès aux données est strictement contrôlé
                            par des règles de sécurité Firestore qui garantissent que seul le propriétaire peut
                            accéder à ses messages.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Partage des données</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Nous ne partageons, ne vendons et ne louons <strong className="text-foreground">aucune</strong> donnée
                            personnelle à des tiers. Les seuls sous-traitants impliqués sont Google (hébergement Firebase)
                            et Vercel (hébergement du site web), qui sont conformes au RGPD.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Vos droits</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            Conformément au RGPD, vous disposez des droits suivants :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong className="text-foreground">Droit d&apos;accès :</strong> consulter toutes vos données personnelles.</li>
                            <li><strong className="text-foreground">Droit de rectification :</strong> modifier vos informations de profil.</li>
                            <li><strong className="text-foreground">Droit de suppression :</strong> supprimer définitivement votre compte et toutes vos données.</li>
                            <li><strong className="text-foreground">Droit de portabilité :</strong> exporter vos données dans un format lisible.</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            Vous pouvez supprimer votre compte à tout moment depuis les paramètres de l&apos;application.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Z-Anonyme utilise uniquement des cookies essentiels au fonctionnement du service
                            (authentification, préférences de thème). Aucun cookie publicitaire ou de traçage n&apos;est utilisé.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Pour toute question relative à cette politique de confidentialité, vous pouvez nous contacter
                            à l&apos;adresse : <a href="mailto:contact@z-anonyme.app" className="text-primary hover:underline">contact@z-anonyme.app</a>
                        </p>
                    </section>
                </div>

                <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
                    © 2026 Z-Anonyme. Tous droits réservés.
                </div>
            </div>
        </div>
    );
}
