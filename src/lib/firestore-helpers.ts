import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    serverTimestamp,
    Timestamp,
    DocumentSnapshot,
    increment,
    writeBatch,
    onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
    AppUser,
    Message,
    MessageStatus,
    ShareLink,
    Report,
} from "@/lib/types";

// ==========================================
// User Helpers
// ==========================================

export async function getUserByUid(uid: string): Promise<AppUser | null> {
    const snap = await getDoc(doc(db!, "users", uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate?.() || new Date(),
    } as AppUser;
}

export async function getUserByUsername(username: string): Promise<AppUser | null> {
    // Secure lookup via public 'usernames' collection
    // This allows public profile access without checking the protected 'users' collection
    const usernameDoc = await getDoc(doc(db!, "usernames", username));
    if (!usernameDoc.exists()) return null;

    const data = usernameDoc.data();

    // Return a constructed AppUser with only public info
    return {
        uid: data.uid,
        name: data.name || "",
        username: username,
        photoURL: data.photoURL || "",
        email: "", // Privacy: do not expose
        role: "USER",
        status: "ACTIVE",
        createdAt: new Date(),
        lastLoginAt: new Date(),
        settings: {
            emailNotifications: false,
            showOnlineStatus: false,
            allowPublicProfile: true,
        },
    } as AppUser;
}

export async function isUsernameTaken(username: string): Promise<boolean> {
    const usernameDoc = await getDoc(doc(db!, "usernames", username));
    return usernameDoc.exists();
}

export async function claimUsername(
    uid: string,
    username: string,
    displayName: string,
    photoURL: string,
    oldUsername?: string
): Promise<boolean> {
    const batch = writeBatch(db!);

    // Release old username if exists
    if (oldUsername) {
        batch.delete(doc(db!, "usernames", oldUsername));
    }

    // Claim new username with public profile data
    batch.set(doc(db!, "usernames", username), { uid, name: displayName, photoURL });
    batch.update(doc(db!, "users", uid), { username });

    try {
        await batch.commit();
        return true;
    } catch {
        return false;
    }
}

export async function updateUserSettings(
    uid: string,
    data: Partial<AppUser>,
    username?: string
): Promise<void> {
    const batch = writeBatch(db!);
    batch.update(doc(db!, "users", uid), data as Record<string, unknown>);

    // If public fields are updated, sync to usernames collection
    if (username && (data.name !== undefined || data.photoURL !== undefined)) {
        const publicUpdates: Record<string, unknown> = {};
        if (data.name !== undefined) publicUpdates.name = data.name;
        if (data.photoURL !== undefined) publicUpdates.photoURL = data.photoURL;

        batch.update(doc(db!, "usernames", username), publicUpdates);
    }

    await batch.commit();
}

export async function getAllUsers(): Promise<AppUser[]> {
    const q = query(collection(db!, "users"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
        const data = d.data();
        return {
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            lastLoginAt: data.lastLoginAt?.toDate?.() || new Date(),
        } as AppUser;
    });
}

export async function updateUserRole(uid: string, role: "USER" | "ADMIN"): Promise<void> {
    await updateDoc(doc(db!, "users", uid), { role });
}

export async function updateUserStatus(uid: string, status: "ACTIVE" | "SUSPENDED"): Promise<void> {
    await updateDoc(doc(db!, "users", uid), { status });
}

// ==========================================
// Message Helpers
// ==========================================

export async function sendAnonymousMessage(
    recipientUid: string,
    linkId: string,
    content: string,
    linkName?: string
): Promise<string> {
    const messageRef = doc(collection(db!, "messages"));
    const messageData = {
        messageId: messageRef.id,
        recipientUid,
        linkId,
        content,
        status: "NEW",
        createdAt: serverTimestamp(),
        reportedCount: 0,
        linkName: linkName || "Lien inconnu",
    };
    await setDoc(messageRef, messageData);

    // Increment link message count
    try {
        await updateDoc(doc(db!, "links", linkId), {
            messageCount: increment(1),
        });
    } catch {
        // Link may not exist for public profile links
    }

    return messageRef.id;
}

export async function getMessages(
    uid: string,
    status?: MessageStatus,
    lastDoc?: DocumentSnapshot,
    pageSize = 20
): Promise<{ messages: Message[]; lastDoc: DocumentSnapshot | null }> {
    let q = query(
        collection(db!, "messages"),
        where("recipientUid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(pageSize)
    );

    if (status) {
        q = query(
            collection(db!, "messages"),
            where("recipientUid", "==", uid),
            where("status", "==", status),
            orderBy("createdAt", "desc"),
            limit(pageSize)
        );
    }

    if (lastDoc) {
        q = query(q, startAfter(lastDoc));
    }

    const snap = await getDocs(q);
    const messages = snap.docs.map((d) => {
        const data = d.data();
        return {
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
        } as Message;
    });

    return {
        messages,
        lastDoc: snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null,
    };
}

/**
 * Subscribe to messages in real-time using onSnapshot.
 * Returns an unsubscribe function.
 */
export function subscribeToMessages(
    uid: string,
    status: MessageStatus | undefined,
    pageSize: number,
    callback: (messages: Message[]) => void
): () => void {
    let q = query(
        collection(db!, "messages"),
        where("recipientUid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(pageSize)
    );

    if (status) {
        q = query(
            collection(db!, "messages"),
            where("recipientUid", "==", uid),
            where("status", "==", status),
            orderBy("createdAt", "desc"),
            limit(pageSize)
        );
    }

    return onSnapshot(q, (snap) => {
        const messages = snap.docs.map((d) => {
            const data = d.data();
            return {
                ...data,
                createdAt: data.createdAt?.toDate?.() || new Date(),
            } as Message;
        });
        callback(messages);
    });
}

export async function getMessage(messageId: string): Promise<Message | null> {
    const snap = await getDoc(doc(db!, "messages", messageId));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
    } as Message;
}

export async function updateMessageStatus(
    messageId: string,
    status: MessageStatus
): Promise<void> {
    await updateDoc(doc(db!, "messages", messageId), { status });
}

export async function deleteMessage(messageId: string): Promise<void> {
    await deleteDoc(doc(db!, "messages", messageId));
}

export async function bulkUpdateMessages(
    messageIds: string[],
    data: Partial<Message>
): Promise<void> {
    const batch = writeBatch(db!);
    messageIds.forEach((id) => {
        batch.update(doc(db!, "messages", id), data as Record<string, unknown>);
    });
    await batch.commit();
}

export async function bulkDeleteMessages(messageIds: string[]): Promise<void> {
    const batch = writeBatch(db!);
    messageIds.forEach((id) => {
        batch.delete(doc(db!, "messages", id));
    });
    await batch.commit();
}

// ==========================================
// Link Helpers
// ==========================================

function generateToken(): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 12; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

function generateShortCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export async function getLinks(uid: string): Promise<ShareLink[]> {
    const q = query(
        collection(db!, "links"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
        const data = d.data();
        return {
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            expiresAt: data.expiresAt?.toDate?.() || null,
        } as ShareLink;
    });
}

export async function getLinkByToken(token: string): Promise<ShareLink | null> {
    const q = query(
        collection(db!, "links"),
        where("token", "==", token),
        limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const data = snap.docs[0].data();
    return {
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        expiresAt: data.expiresAt?.toDate?.() || null,
    } as ShareLink;
}

export async function createLink(
    uid: string,
    name: string,
    expiresAt?: Date | null,
    maxMessages?: number | null
): Promise<ShareLink> {
    // Fetch user public details to copy into the link
    // This allows displaying the owner's name without giving read access to the 'users' collection
    const user = await getUserByUid(uid);
    if (!user) throw new Error("User found");

    const linkRef = doc(collection(db!, "links"));
    const token = generateToken();
    const shortCode = generateShortCode();
    const linkData: Record<string, unknown> = {
        linkId: linkRef.id,
        uid,
        token,
        shortCode,
        type: "TOKEN",
        name,
        isActive: true,
        expiresAt: expiresAt ? Timestamp.fromDate(expiresAt) : null,
        maxMessages: maxMessages || null,
        messageCount: 0,
        createdAt: serverTimestamp(),
        // Copy owner public info for secure display
        ownerName: user.name,
        ownerUsername: user.username,
        ownerPhotoURL: user.photoURL,
    };
    await setDoc(linkRef, linkData);
    return {
        linkId: linkRef.id,
        uid,
        token,
        shortCode,
        type: "TOKEN",
        name,
        isActive: true,
        expiresAt: expiresAt || null,
        maxMessages: maxMessages || null,
        messageCount: 0,
        createdAt: new Date(), // Local approx
        // Return copied data
        ownerName: user.name,
        ownerUsername: user.username,
        ownerPhotoURL: user.photoURL,
    } as ShareLink;
}

/**
 * Get a link by its short code for /s/[code] redirect.
 */
export async function getLinkByShortCode(shortCode: string): Promise<ShareLink | null> {
    const q = query(
        collection(db!, "links"),
        where("shortCode", "==", shortCode),
        limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const data = snap.docs[0].data();
    return {
        ...data,
        linkId: snap.docs[0].id,
        expiresAt: data.expiresAt?.toDate() || null,
        createdAt: data.createdAt?.toDate() || new Date(),
    } as ShareLink;
}

export async function updateLink(
    linkId: string,
    data: Partial<ShareLink>
): Promise<void> {
    const updateData: Record<string, unknown> = { ...data };
    if (data.expiresAt) {
        updateData.expiresAt = Timestamp.fromDate(data.expiresAt);
    }
    await updateDoc(doc(db!, "links", linkId), updateData);
}

export async function rotateToken(linkId: string): Promise<string> {
    const newToken = generateToken();
    await updateDoc(doc(db!, "links", linkId), { token: newToken });
    return newToken;
}

export async function deleteLink(linkId: string): Promise<void> {
    await deleteDoc(doc(db!, "links", linkId));
}

// ==========================================
// Report Helpers
// ==========================================

export async function createReport(
    messageId: string,
    reporterUid: string,
    reason: string,
    note?: string
): Promise<void> {
    const reportRef = doc(collection(db!, "reports"));
    await setDoc(reportRef, {
        reportId: reportRef.id,
        messageId,
        reporterUid,
        reason,
        note: note || "",
        status: "OPEN",
        createdAt: serverTimestamp(),
    });

    // Increment reported count on message
    await updateDoc(doc(db!, "messages", messageId), {
        reportedCount: increment(1),
    });
}

export async function getReports(
    status?: "OPEN" | "RESOLVED"
): Promise<Report[]> {
    let q;
    if (status) {
        q = query(
            collection(db!, "reports"),
            where("status", "==", status),
            orderBy("createdAt", "desc")
        );
    } else {
        q = query(collection(db!, "reports"), orderBy("createdAt", "desc"));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
        const data = d.data();
        return {
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
        } as Report;
    });
}

export async function resolveReport(reportId: string): Promise<void> {
    await updateDoc(doc(db!, "reports", reportId), { status: "RESOLVED" });
}

// ==========================================
// Stats Helpers (Admin)
// ==========================================

export async function getAdminStats(): Promise<{
    totalUsers: number;
    totalMessages: number;
    totalReports: number;
    activeLinks: number;
}> {
    const [users, messages, reports, links] = await Promise.all([
        getDocs(collection(db!, "users")),
        getDocs(collection(db!, "messages")),
        getDocs(query(collection(db!, "reports"), where("status", "==", "OPEN"))),
        getDocs(query(collection(db!, "links"), where("isActive", "==", true))),
    ]);

    return {
        totalUsers: users.size,
        totalMessages: messages.size,
        totalReports: reports.size,
        activeLinks: links.size,
    };
}
