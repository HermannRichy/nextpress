import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { sendVerificationOtpEmail, sendWelcomeEmail } from "@/lib/email";
import { ac, ADMIN, EDITOR, CLIENT } from "@/lib/auth-permissions";

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET!,

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },

    plugins: [
        emailOTP({
            otpLength: 6,
            expiresIn: 300,
            allowedAttempts: 3,
            sendVerificationOnSignUp: true,
            overrideDefaultEmailVerification: true,
            sendVerificationOTP: async ({ email, otp, type }) => {
                sendVerificationOtpEmail({ email, otp, type });
            },
        }),
        admin({
            ac,
            defaultRole: "CLIENT",
            adminRoles: ["ADMIN", "EDITOR"],
            roles: { ADMIN, EDITOR, CLIENT },
        }),
        nextCookies(),
    ],

    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    sendWelcomeEmail({ email: user.email, name: user.name });
                },
            },
        },
    },
});

export type Session = typeof auth.$Infer.Session;
