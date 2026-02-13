// ==========================================
// Z-Anonyme — Admin Seed Script
// ==========================================
// Run this script to set admin role for specific emails.
// Usage:
//   1. Set GOOGLE_APPLICATION_CREDENTIALS env var to your service account key
//   2. Run: npx ts-node scripts/seed-admin.ts
//
// Or use the Firebase Console to manually set role: "ADMIN"
// on the user document in the `users` collection.

const admin = require("firebase-admin");

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

// Email addresses to grant admin role
const ADMIN_EMAILS = ["rodolphebenawo@gmail.com"];

async function seedAdmins() {
    console.log("🔑 Setting admin roles...\n");

    for (const email of ADMIN_EMAILS) {
        try {
            // Find user by email
            const usersSnap = await db
                .collection("users")
                .where("email", "==", email)
                .get();

            if (usersSnap.empty) {
                console.log(`⚠️  User not found: ${email}`);
                console.log(`   → The user must sign in at least once before being set as admin.`);
                continue;
            }

            const userDoc = usersSnap.docs[0];
            await userDoc.ref.update({ role: "ADMIN" });
            console.log(`✅ Admin role set for: ${email} (uid: ${userDoc.id})`);
        } catch (err) {
            console.error(`❌ Error setting admin for ${email}:`, err);
        }
    }

    console.log("\n🎉 Done!");
}

seedAdmins().catch(console.error);
