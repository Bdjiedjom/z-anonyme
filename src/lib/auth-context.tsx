"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import type { AppUser, UserRole } from "@/lib/types";

// ==========================================
// Auth Context
// ==========================================

interface AuthContextType {
    firebaseUser: User | null;
    appUser: AppUser | null;
    loading: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    firebaseUser: null,
    appUser: null,
    loading: true,
    error: null,
    signInWithGoogle: async () => { },
    logout: async () => { },
    refreshUser: async () => { },
    isAdmin: false,
});

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch or create Firestore user document
    const fetchOrCreateUser = async (user: User): Promise<AppUser | null> => {
        try {
            const userRef = doc(db!, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                // Update lastLoginAt
                await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
                const data = userSnap.data();
                return {
                    uid: data.uid,
                    email: data.email,
                    name: data.name,
                    photoURL: data.photoURL,
                    username: data.username || "",
                    role: (data.role as UserRole) || "USER",
                    status: data.status || "ACTIVE",
                    createdAt: data.createdAt?.toDate?.() || new Date(),
                    lastLoginAt: new Date(),
                    settings: data.settings || {
                        emailNotifications: false,
                        showOnlineStatus: true,
                        allowPublicProfile: true,
                    },
                };
            } else {
                // Create new user document
                const newUser: Record<string, unknown> = {
                    uid: user.uid,
                    email: user.email || "",
                    name: user.displayName || "",
                    photoURL: user.photoURL || "",
                    username: "",
                    role: "USER",
                    status: "ACTIVE",
                    createdAt: serverTimestamp(),
                    lastLoginAt: serverTimestamp(),
                    settings: {
                        emailNotifications: false,
                        showOnlineStatus: true,
                        allowPublicProfile: true,
                    },
                };
                await setDoc(userRef, newUser);
                return {
                    uid: user.uid,
                    email: user.email || "",
                    name: user.displayName || "",
                    photoURL: user.photoURL || "",
                    username: "",
                    role: "USER",
                    status: "ACTIVE",
                    createdAt: new Date(),
                    lastLoginAt: new Date(),
                    settings: {
                        emailNotifications: false,
                        showOnlineStatus: true,
                        allowPublicProfile: true,
                    },
                };
            }
        } catch (err) {
            console.error("Error fetching/creating user:", err);
            setError("Erreur lors du chargement du profil.");
            return null;
        }
    };

    // Listen to auth state changes
    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            setError(null);

            if (user) {
                setFirebaseUser(user);
                const userData = await fetchOrCreateUser(user);
                setAppUser(userData);
            } else {
                setFirebaseUser(null);
                setAppUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signInWithGoogle = async () => {
        try {
            setError(null);
            await signInWithPopup(auth!, googleProvider);
        } catch (err) {
            console.error("Google sign-in error:", err);
            setError("Erreur lors de la connexion Google.");
        }
    };

    const logout = async () => {
        try {
            await signOut(auth!);
            setAppUser(null);
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const refreshUser = async () => {
        if (firebaseUser) {
            const userData = await fetchOrCreateUser(firebaseUser);
            setAppUser(userData);
        }
    };

    const isAdmin = appUser?.role === "ADMIN";

    return (
        <AuthContext.Provider
            value={{
                firebaseUser,
                appUser,
                loading,
                error,
                signInWithGoogle,
                logout,
                refreshUser,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
