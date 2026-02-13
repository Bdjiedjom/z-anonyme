import { describe, it, expect } from "vitest";
import { strings } from "@/lib/strings";

describe("strings", () => {
    it("has an app name", () => {
        expect(strings.appName).toBe("Z-Anonyme");
    });

    it("has navigation strings", () => {
        expect(strings.nav.home).toBeDefined();
        expect(strings.nav.inbox).toBeDefined();
        expect(strings.nav.links).toBeDefined();
        expect(strings.nav.settings).toBeDefined();
        expect(strings.nav.admin).toBeDefined();
        expect(strings.nav.login).toBeDefined();
        expect(strings.nav.logout).toBeDefined();
        expect(strings.nav.stats).toBeDefined();
    });

    it("has all report reasons", () => {
        expect(strings.reportDialog.reasons.spam).toBeDefined();
        expect(strings.reportDialog.reasons.harassment).toBeDefined();
        expect(strings.reportDialog.reasons.inappropriate).toBeDefined();
        expect(strings.reportDialog.reasons.threat).toBeDefined();
        expect(strings.reportDialog.reasons.other).toBeDefined();
    });

    it("has all message status labels", () => {
        expect(strings.messages.new).toBeDefined();
        expect(strings.messages.read).toBeDefined();
        expect(strings.messages.archived).toBeDefined();
        expect(strings.messages.all).toBeDefined();
    });
});
