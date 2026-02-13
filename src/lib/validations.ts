import { z } from "zod";

// ==========================================
// Message Validation
// ==========================================
export const messageSchema = z.object({
    content: z
        .string()
        .min(1, "Le message ne peut pas être vide.")
        .max(500, "Le message ne peut pas dépasser 500 caractères.")
        .refine(
            (val) => !/<[^>]*>/g.test(val),
            "Le HTML n'est pas autorisé."
        ),
});

export type MessageFormData = z.infer<typeof messageSchema>;

// ==========================================
// Username Validation
// ==========================================
export const usernameSchema = z.object({
    username: z
        .string()
        .min(3, "Minimum 3 caractères.")
        .max(30, "Maximum 30 caractères.")
        .regex(
            /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
            "Lettres minuscules, chiffres et tirets uniquement. Doit commencer et finir par une lettre ou un chiffre."
        ),
});

export type UsernameFormData = z.infer<typeof usernameSchema>;

// ==========================================
// Settings Validation
// ==========================================
export const settingsSchema = z.object({
    name: z.string().min(1, "Le nom ne peut pas être vide.").max(50, "Maximum 50 caractères."),
    username: usernameSchema.shape.username,
    emailNotifications: z.boolean(),
    showOnlineStatus: z.boolean(),
    allowPublicProfile: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

// ==========================================
// Link Validation
// ==========================================
export const linkSchema = z.object({
    name: z.string().min(1, "Le nom est requis.").max(50, "Maximum 50 caractères."),
    isActive: z.boolean(),
    expiresAt: z.string().optional().nullable(),
    maxMessages: z.number().int().min(1).optional().nullable(),
});

export type LinkFormData = z.infer<typeof linkSchema>;

// ==========================================
// Report Validation
// ==========================================
export const reportSchema = z.object({
    reason: z.string().min(1, "La raison est requise."),
    note: z.string().max(500, "Maximum 500 caractères.").optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;
