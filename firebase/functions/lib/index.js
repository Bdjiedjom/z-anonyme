"use strict";
// ==========================================
// Z-Anonyme — Cloud Functions
// ==========================================
// Deploy: firebase deploy --only functions
//
// Functions:
// 1. onUserCreate - Set admin role for predefined emails
// 2. onMessageCreate - Rate limiting + notification placeholder
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.onMessageCreate = exports.onUserCreate = void 0;
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
// Admin emails list
const ADMIN_EMAILS = ["rodolphebenawo@gmail.com"];
// Rate limit config
const RATE_LIMIT_MAX = 10; // max messages per hour per IP per recipient
const RATE_LIMIT_WINDOW_HOURS = 1;
// ==========================================
// 1. Auto-set admin role on user creation
// ==========================================
exports.onUserCreate = functions.firestore
    .document("users/{uid}")
    .onCreate(async (snap, context) => {
    const userData = snap.data();
    if (userData && typeof userData.email === "string" && ADMIN_EMAILS.includes(userData.email)) {
        await snap.ref.update({ role: "ADMIN" });
        console.log(`Admin role set for: ${userData.email}`);
    }
});
// ==========================================
// 2. Rate limiting on message creation
// ==========================================
exports.onMessageCreate = functions.firestore
    .document("messages/{messageId}")
    .onCreate(async (snap, context) => {
    const messageData = snap.data();
    if (!messageData)
        return;
    // Check if recipient is suspended
    try {
        const recipientDoc = await db
            .collection("users")
            .doc(messageData.recipientUid)
            .get();
        if (recipientDoc.exists) {
            const recipient = recipientDoc.data();
            if ((recipient === null || recipient === void 0 ? void 0 : recipient.status) === "SUSPENDED") {
                // Delete the message if recipient is suspended
                await snap.ref.delete();
                console.log("Message deleted: recipient is suspended");
                return;
            }
        }
    }
    catch (err) {
        console.error("Error checking recipient:", err);
    }
    // Optional: Add IP hash for rate limiting
    // This requires the message to include ipHash field
    // For client-side, we skip IP-based rate limiting
    // and rely on Firestore rules + this function
    console.log(`New message created: ${context.params.messageId} for user ${messageData.recipientUid}`);
});
// ==========================================
// 3. HTTP function for rate-limited message sending
// ==========================================
exports.sendMessage = functions.https.onRequest(async (req, res) => {
    // CORS
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    const { recipientUid, linkId, content, linkName } = req.body;
    // Validate
    if (!recipientUid || !linkId || !content) {
        res.status(400).json({ error: "Missing fields" });
        return;
    }
    if (typeof content !== "string" || content.length < 1 || content.length > 500) {
        res.status(400).json({ error: "Invalid content length" });
        return;
    }
    // Check HTML
    if (/<[^>]*>/g.test(content)) {
        res.status(400).json({ error: "HTML not allowed" });
        return;
    }
    // Rate limiting by IP
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
    const ipHash = Buffer.from(String(ip)).toString("base64").substring(0, 20);
    const windowStart = new Date();
    windowStart.setHours(windowStart.getHours() - RATE_LIMIT_WINDOW_HOURS);
    try {
        const recentMessages = await db
            .collection("messages")
            .where("recipientUid", "==", recipientUid)
            .where("ipHash", "==", ipHash)
            .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(windowStart))
            .get();
        if (recentMessages.size >= RATE_LIMIT_MAX) {
            res.status(429).json({ error: "Rate limit exceeded" });
            return;
        }
        // Create message
        const messageRef = db.collection("messages").doc();
        await messageRef.set({
            messageId: messageRef.id,
            recipientUid,
            linkId,
            content,
            status: "NEW",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            ipHash,
            reportedCount: 0,
            linkName: linkName || "Lien inconnu",
        });
        // Increment link message count
        try {
            await db.collection("links").doc(linkId).update({
                messageCount: admin.firestore.FieldValue.increment(1),
            });
        }
        catch (_a) {
            // Link may not exist
        }
        res.status(200).json({ success: true, messageId: messageRef.id });
    }
    catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
//# sourceMappingURL=index.js.map