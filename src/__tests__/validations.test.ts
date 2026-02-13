import { describe, it, expect } from "vitest";
import {
    messageSchema,
    usernameSchema,
    settingsSchema,
    linkSchema,
    reportSchema,
} from "@/lib/validations";

// ==========================================
// Message Schema Tests
// ==========================================
describe("messageSchema", () => {
    it("accepts valid messages", () => {
        expect(messageSchema.safeParse({ content: "Hello!" }).success).toBe(true);
        expect(messageSchema.safeParse({ content: "a" }).success).toBe(true);
        expect(messageSchema.safeParse({ content: "x".repeat(500) }).success).toBe(true);
    });

    it("rejects empty messages", () => {
        expect(messageSchema.safeParse({ content: "" }).success).toBe(false);
    });

    it("rejects messages exceeding 500 characters", () => {
        expect(messageSchema.safeParse({ content: "x".repeat(501) }).success).toBe(false);
    });

    it("rejects messages containing HTML", () => {
        expect(messageSchema.safeParse({ content: "<script>alert('xss')</script>" }).success).toBe(false);
        expect(messageSchema.safeParse({ content: "Hello <b>bold</b>" }).success).toBe(false);
    });

    it("accepts messages with angle brackets that are not HTML", () => {
        expect(messageSchema.safeParse({ content: "5 > 3 && 2 < 4" }).success).toBe(true);
    });
});

// ==========================================
// Username Schema Tests
// ==========================================
describe("usernameSchema", () => {
    it("accepts valid usernames", () => {
        expect(usernameSchema.safeParse({ username: "john" }).success).toBe(true);
        expect(usernameSchema.safeParse({ username: "john-doe" }).success).toBe(true);
        expect(usernameSchema.safeParse({ username: "user123" }).success).toBe(true);
        expect(usernameSchema.safeParse({ username: "a1b" }).success).toBe(true);
    });

    it("rejects usernames shorter than 3 characters", () => {
        expect(usernameSchema.safeParse({ username: "ab" }).success).toBe(false);
    });

    it("rejects usernames longer than 30 characters", () => {
        expect(usernameSchema.safeParse({ username: "a".repeat(31) }).success).toBe(false);
    });

    it("rejects usernames with uppercase letters", () => {
        expect(usernameSchema.safeParse({ username: "John" }).success).toBe(false);
    });

    it("rejects usernames starting or ending with hyphen", () => {
        expect(usernameSchema.safeParse({ username: "-john" }).success).toBe(false);
        expect(usernameSchema.safeParse({ username: "john-" }).success).toBe(false);
    });

    it("rejects usernames with special characters", () => {
        expect(usernameSchema.safeParse({ username: "john_doe" }).success).toBe(false);
        expect(usernameSchema.safeParse({ username: "john.doe" }).success).toBe(false);
        expect(usernameSchema.safeParse({ username: "john doe" }).success).toBe(false);
    });
});

// ==========================================
// Settings Schema Tests
// ==========================================
describe("settingsSchema", () => {
    const validSettings = {
        name: "John Doe",
        username: "john-doe",
        emailNotifications: true,
        showOnlineStatus: true,
        allowPublicProfile: true,
    };

    it("accepts valid settings", () => {
        expect(settingsSchema.safeParse(validSettings).success).toBe(true);
    });

    it("rejects empty name", () => {
        expect(
            settingsSchema.safeParse({ ...validSettings, name: "" }).success
        ).toBe(false);
    });

    it("rejects name longer than 50 characters", () => {
        expect(
            settingsSchema.safeParse({ ...validSettings, name: "x".repeat(51) }).success
        ).toBe(false);
    });
});

// ==========================================
// Link Schema Tests
// ==========================================
describe("linkSchema", () => {
    it("accepts valid link data", () => {
        expect(
            linkSchema.safeParse({ name: "Mon lien", isActive: true }).success
        ).toBe(true);
    });

    it("accepts optional fields", () => {
        expect(
            linkSchema.safeParse({
                name: "Mon lien",
                isActive: true,
                expiresAt: "2025-12-31",
                maxMessages: 100,
            }).success
        ).toBe(true);
    });

    it("rejects empty link name", () => {
        expect(
            linkSchema.safeParse({ name: "", isActive: true }).success
        ).toBe(false);
    });
});

// ==========================================
// Report Schema Tests
// ==========================================
describe("reportSchema", () => {
    it("accepts valid report with reason", () => {
        expect(
            reportSchema.safeParse({ reason: "spam" }).success
        ).toBe(true);
    });

    it("accepts report with optional note", () => {
        expect(
            reportSchema.safeParse({ reason: "harassment", note: "Very rude message" }).success
        ).toBe(true);
    });

    it("rejects empty reason", () => {
        expect(
            reportSchema.safeParse({ reason: "" }).success
        ).toBe(false);
    });

    it("rejects note exceeding 500 characters", () => {
        expect(
            reportSchema.safeParse({ reason: "spam", note: "x".repeat(501) }).success
        ).toBe(false);
    });
});
