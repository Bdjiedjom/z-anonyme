import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conditions d'utilisation — Z-Anonyme",
    description: "Consultez les conditions d'utilisation de Z-Anonyme, la plateforme de messagerie anonyme sécurisée.",
};

export default function TermsPage() {
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
                    Conditions d&apos;utilisation
                </h1>
                <p className="text-muted-foreground mb-8">
                    Dernière mise à jour : 13 février 2026
                </p>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Acceptation des conditions</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            En utilisant Z-Anonyme, vous acceptez les présentes conditions d&apos;utilisation dans leur intégralité.
                            Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser le service.
                            L&apos;utilisation continue du service après modification des conditions vaut acceptation
                            des nouvelles conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Description du service</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Z-Anonyme est une plateforme de messagerie anonyme qui permet aux utilisateurs inscrits
                            de recevoir des messages anonymes via des liens de partage uniques. Le service est
                            fourni &quot;en l&apos;état&quot; et son accès est gratuit.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Inscription et compte</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>L&apos;inscription se fait exclusivement via Google Sign-In.</li>
                            <li>Vous devez choisir un nom d&apos;utilisateur unique pour créer votre profil public.</li>
                            <li>Vous êtes responsable de la sécurité de votre compte Google.</li>
                            <li>Vous devez avoir au moins 13 ans pour utiliser le service.</li>
                            <li>Un seul compte par personne est autorisé.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Utilisation acceptable</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            En utilisant Z-Anonyme, vous vous engagez à <strong className="text-foreground">ne pas</strong> :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Envoyer des messages de harcèlement, menaces, intimidation ou contenu haineux.</li>
                            <li>Publier du contenu illégal, diffamatoire, obscène ou autrement répréhensible.</li>
                            <li>Usurper l&apos;identité d&apos;une autre personne.</li>
                            <li>Utiliser le service à des fins de spam ou de publicité non sollicitée.</li>
                            <li>Tenter de compromettre la sécurité du service ou d&apos;accéder à des données non autorisées.</li>
                            <li>Utiliser des bots ou des scripts automatisés pour envoyer des messages en masse.</li>
                            <li>Contourner les mécanismes de sécurité ou de modération du service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Modération et signalements</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Z-Anonyme met à disposition des outils de signalement pour les messages abusifs.
                            Tout message signalé sera examiné par notre équipe. Nous nous réservons le droit de
                            supprimer tout contenu jugé inapproprié et de suspendre ou supprimer les comptes
                            des utilisateurs qui enfreignent ces conditions, sans préavis.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Propriété intellectuelle</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Le nom &quot;Z-Anonyme&quot;, le logo, le design et le code source du service sont la propriété
                            de Z-Anonyme. Toute reproduction, modification ou distribution non autorisée est interdite.
                            Les messages envoyés par les utilisateurs restent leur propriété.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Limitation de responsabilité</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Z-Anonyme ne peut être tenu responsable du contenu des messages envoyés par les utilisateurs.
                            Le service est fourni &quot;en l&apos;état&quot;, sans garantie d&apos;aucune sorte.
                            Nous ne garantissons pas la disponibilité continue du service et ne pourrons être
                            tenus responsables en cas d&apos;interruption, de perte de données ou de tout dommage
                            résultant de l&apos;utilisation du service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Suppression de compte</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Vous pouvez supprimer votre compte à tout moment depuis les paramètres de l&apos;application.
                            La suppression du compte entraîne la suppression définitive et irréversible de toutes
                            vos données, y compris votre profil, vos liens de partage et tous les messages reçus.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">9. Modifications des conditions</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Nous nous réservons le droit de modifier ces conditions d&apos;utilisation à tout moment.
                            Les utilisateurs seront informés des modifications importantes. La date de
                            &quot;dernière mise à jour&quot; en haut de cette page indique la dernière modification.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">10. Droit applicable</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Les présentes conditions sont régies par le droit en vigueur. En cas de litige,
                            les parties s&apos;engagent à rechercher une solution amiable avant toute action judiciaire.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">11. Contact</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Pour toute question relative à ces conditions d&apos;utilisation, vous pouvez nous contacter
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
