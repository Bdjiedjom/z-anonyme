"use client";

import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";
import { app } from "@/lib/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

let messaging: Messaging | null = null;

function getMessagingInstance(): Messaging | null {
    if (typeof window === "undefined") return null;
    if (!app) return null;
    if (!messaging) {
        try {
            messaging = getMessaging(app);
        } catch (error) {
            console.error("Failed to initialize messaging:", error);
            return null;
        }
    }
    return messaging;
}

/**
 * Request notification permission and save the FCM token to Firestore.
 */
export async function requestNotificationPermission(userId: string): Promise<string | null> {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.log("Notification permission denied");
            return null;
        }

        const messagingInstance = getMessagingInstance();
        if (!messagingInstance) return null;

        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
            console.warn("VAPID key is missing. Set NEXT_PUBLIC_FIREBASE_VAPID_KEY in .env.local");
            return null;
        }

        const token = await getToken(messagingInstance, { vapidKey });

        if (token && db) {
            // Save token to user's document
            await setDoc(
                doc(db, "users", userId),
                { fcmTokens: arrayUnion(token) },
                { merge: true }
            );
        }

        return token;
    } catch (error) {
        console.error("Error getting notification token:", error);
        return null;
    }
}

/**
 * Listen for foreground messages and show a toast/notification.
 */
export function onForegroundMessage(callback: (payload: any) => void): (() => void) | null {
    const messagingInstance = getMessagingInstance();
    if (!messagingInstance) return null;

    return onMessage(messagingInstance, (payload) => {
        callback(payload);
    });
}

/**
 * Check if notifications are currently supported and enabled.
 */
export function isNotificationSupported(): boolean {
    return (
        typeof window !== "undefined" &&
        "Notification" in window &&
        "serviceWorker" in navigator
    );
}

/**
 * Get the current notification permission status.
 */
export function getNotificationStatus(): NotificationPermission | "unsupported" {
    if (!isNotificationSupported()) return "unsupported";
    return Notification.permission;
}
