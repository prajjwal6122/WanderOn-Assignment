/**
 * Application Constants
 * 
 */

export const JWT = {
  SECRET: process.env.JWT_SECRET || "IWASCREATEDBYPRAJJWAL",
  EXPIRE: process.env.JWT_EXPIRE || "7d",
  ISSUER: "wanderon-auth",
  AUDIENCE: "wanderon-users",
};

export const COOKIE = {
  NAME: "authToken",
  EXPIRE_DAYS: parseInt(process.env.COOKIE_EXPIRE) || 7,
  OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
  },
};
export const SECURITY = {
  BCRYPT_ROUNDS: 12,
  MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
  LOCKOUT_TIME_MINUTES: parseInt(process.env.LOCKOUT_TIME) || 15,
};
export const DATABASE = {
  MONGODB_URI: process.env.MONGODB_URI,
};
export const APP = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    REGEX: /^[a-zA-Z0-9_]+$/,
    RESERVED: [
      "admin",
      "root",
      "user",
      "guest",
      "test",
      "api",
      "www",
      "mail",
      "support",
    ],
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    REGEX: /^[a-zA-Z\s]+$/,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
};
