# Z-Anonyme — Guide d'installation

## Prérequis

- Node.js 18+
- Un compte Google / Firebase
- npm

---

## 1. Créer un projet Firebase

1. Rendez-vous sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez **"Ajouter un projet"**
3. Nommez votre projet (ex: `z-anonyme`)
4. Désactivez Google Analytics si vous n'en avez pas besoin
5. Cliquez **"Créer le projet"**

## 2. Activer l'authentification Google

1. Dans votre projet Firebase, allez dans **Authentication > Sign-in method**
2. Activez **Google**
3. Remplissez l'e-mail d'assistance du projet
4. Cliquez **Enregistrer**

## 3. Créer la base Firestore

1. Allez dans **Firestore Database**
2. Cliquez **"Créer une base de données"**
3. Choisissez le mode **Production** (les règles de sécurité seront déployées ensuite)
4. Sélectionnez une région proche de vos utilisateurs (ex: `europe-west1`)
5. Cliquez **Créer**

## 4. Récupérer la configuration Firebase

1. Allez dans **Paramètres du projet** (icône engrenage)
2. Sous **"Vos applications"**, cliquez **"</>** (Web)"
3. Nommez votre app (ex: `z-anonyme-web`)
4. Copiez les valeurs de configuration

## 5. Configurer les variables d'environnement

1. Copiez le fichier `.env.local.example` en `.env.local`
2. Remplissez avec vos valeurs Firebase :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=z-anonyme.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=z-anonyme
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=z-anonyme.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAILS=rodolphebenawo@gmail.com
```

## 6. Déployer les règles de sécurité Firestore

### Option A : Via Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase init firestore  # Sélectionnez votre projet
# Copiez le contenu de firebase/firestore.rules dans le fichier généré
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Option B : Via la console Firebase

1. Allez dans **Firestore > Règles**
2. Collez le contenu de `firebase/firestore.rules`
3. Cliquez **Publier**
4. Allez dans **Firestore > Index**
5. Créez manuellement les index décrits dans `firebase/firestore.indexes.json`

## 7. Lancer le projet

```bash
cd z-anonyme
npm install
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 8. Créer le premier administrateur

### Option A : Via le script seed

```bash
# Assurez-vous que l'utilisateur rodolphebenawo@gmail.com s'est connecté au moins une fois
# Puis exécutez:
GOOGLE_APPLICATION_CREDENTIALS=./chemin-vers-service-account.json npx ts-node scripts/seed-admin.ts
```

### Option B : Manuellement dans Firebase Console

1. Allez dans **Firestore > users**
2. Trouvez le document de l'utilisateur `rodolphebenawo@gmail.com`
3. Changez le champ `role` de `"USER"` à `"ADMIN"`

### Option C : Via Cloud Functions (automatique)

Si vous déployez les Cloud Functions, le rôle admin sera automatiquement attribué lors de la création du compte.

## 9. Déployer les Cloud Functions (optionnel)

```bash
cd firebase/functions
npm install
cd ../..
firebase deploy --only functions
```

## 10. Déployer en production

```bash
npm run build
# Puis déployez sur Vercel, Netlify, ou Firebase Hosting
```

### Sur Vercel (recommandé)

1. Connectez votre repo GitHub à [Vercel](https://vercel.com)
2. Définissez les variables d'environnement dans les paramètres du projet
3. Déployez

---

## Structure du projet

```
z-anonyme/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   ├── login/page.tsx          # Google sign-in
│   │   ├── sent/page.tsx           # Thank you page
│   │   ├── u/[username]/page.tsx   # Public message form (by username)
│   │   ├── l/[token]/page.tsx      # Public message form (by token)
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Dashboard layout (auth guard)
│   │   │   └── app/
│   │   │       ├── page.tsx        # Inbox
│   │   │       ├── message/[id]/   # Message detail
│   │   │       ├── links/          # Manage links
│   │   │       └── settings/       # Profile settings
│   │   └── (admin)/
│   │       ├── layout.tsx          # Admin layout (role guard)
│   │       └── admin/
│   │           ├── page.tsx        # Overview stats
│   │           ├── users/          # Users table
│   │           └── reports/        # Reports moderation
│   ├── components/
│   │   ├── layout/                 # Navbar, Sidebar
│   │   ├── providers/              # ThemeProvider
│   │   └── ui/                     # shadcn/ui + custom components
│   └── lib/
│       ├── firebase.ts             # Firebase init
│       ├── auth-context.tsx        # Auth state management
│       ├── firestore-helpers.ts    # Firestore CRUD
│       ├── types.ts                # TypeScript types
│       ├── validations.ts          # Zod schemas
│       └── strings.ts             # French UI strings
├── firebase/
│   ├── firestore.rules             # Security rules
│   ├── firestore.indexes.json      # Composite indexes
│   └── functions/src/index.ts      # Cloud Functions
├── scripts/
│   └── seed-admin.ts               # Admin seed script
└── .env.local.example              # Environment template
```
