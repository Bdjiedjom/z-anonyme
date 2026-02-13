// ==========================================
// Z-Anonyme — TypeScript Type Definitions
// ==========================================

export type UserRole = "USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type MessageStatus = "NEW" | "READ" | "ARCHIVED";
export type LinkType = "TOKEN" | "PUBLIC";
export type ReportStatus = "OPEN" | "RESOLVED";

export interface UserSettings {
  emailNotifications: boolean;
  showOnlineStatus: boolean;
  allowPublicProfile: boolean;
}

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  lastLoginAt: Date;
  settings: UserSettings;
}

export interface ShareLink {
  linkId: string;
  uid: string;
  token: string;
  shortCode: string;
  type: LinkType;
  name: string;
  isActive: boolean;
  expiresAt: Date | null;
  maxMessages: number | null;
  messageCount: number;
  createdAt: Date;
  ownerName?: string;
  ownerUsername?: string;
  ownerPhotoURL?: string;
}

export interface Message {
  messageId: string;
  recipientUid: string;
  linkId: string;
  content: string;
  status: MessageStatus;
  createdAt: Date;
  ipHash?: string;
  userAgentHash?: string;
  reportedCount: number;
  linkName?: string;
}

export interface Report {
  reportId: string;
  messageId: string;
  reporterUid: string;
  reason: string;
  note: string;
  status: ReportStatus;
  createdAt: Date;
}

// Firestore document converters helpers
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}
