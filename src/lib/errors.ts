// src/lib/errors.ts

// ==============================
// Error Codes
// ==============================

export const ERROR_CODES = {
  // Chat
  CHAT_THREAD_NOT_FOUND: "CHAT_THREAD_NOT_FOUND",
  CHAT_ACCESS_DENIED: "CHAT_ACCESS_DENIED",
  CHAT_MATCH_NOT_FOUND: "CHAT_MATCH_NOT_FOUND",
  CHAT_SEND_EMPTY_MESSAGE: "CHAT_SEND_EMPTY_MESSAGE",

  // Invite
  INVITE_NOT_FOUND: "INVITE_NOT_FOUND",
  INVITE_ALREADY_RESPONDED: "INVITE_ALREADY_RESPONDED",

  // Auth
  UNAUTHORIZED: "UNAUTHORIZED",

  // Generic
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

// ==============================
// Error Messages
// ==============================

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Chat
  CHAT_THREAD_NOT_FOUND: "Chat thread not found",
  CHAT_ACCESS_DENIED: "You do not have access to this chat",
  CHAT_MATCH_NOT_FOUND: "Match not found",
  CHAT_SEND_EMPTY_MESSAGE: "Message cannot be empty",

  // Invite
  INVITE_NOT_FOUND: "Invite not found",
  INVITE_ALREADY_RESPONDED: "Invite already handled",

  // Auth
  UNAUTHORIZED: "You are not authorized",

  // Generic
  UNKNOWN_ERROR: "Something went wrong",
}

// ==============================
// AppError Class
// ==============================

export class AppError extends Error {
  code: ErrorCode

  constructor(code: ErrorCode) {
    super(ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN_ERROR)
    this.code = code

    // Fix prototype chain (important for instanceof)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

// ==============================
// Helpers
// ==============================

export function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN_ERROR
}