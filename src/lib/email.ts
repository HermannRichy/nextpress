import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "NextPress <noreply@nextpress.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ─── Senders ─────────────────────────────────────────────────────────────────

export async function sendVerificationOtpEmail({
    email,
    otp,
    type,
}: {
    email: string;
    otp: string;
    type: "sign-in" | "email-verification" | "forget-password" | "change-email";
}) {
    const subjects: Record<string, string> = {
        "email-verification": "Vérifiez votre adresse email",
        "forget-password": "Réinitialisation de votre mot de passe",
        "sign-in": "Votre code de connexion",
        "change-email": "Confirmez votre nouvel email",
    };
    await resend.emails.send({
        from: FROM,
        to: email,
        subject: subjects[type] ?? "Votre code de vérification",
        html: otpHtml(otp, type),
    });
}

export async function sendWelcomeEmail({ email, name }: { email: string; name: string }) {
    await resend.emails.send({
        from: FROM,
        to: email,
        subject: "Bienvenue sur NextPress 🎉",
        html: welcomeHtml(name),
    });
}

// ─── Templates ───────────────────────────────────────────────────────────────

function otpHtml(otp: string, type: string) {
    const messages: Record<string, string> = {
        "email-verification": "Entrez ce code pour vérifier votre adresse email.",
        "forget-password": "Entrez ce code pour réinitialiser votre mot de passe.",
        "sign-in": "Entrez ce code pour vous connecter.",
        "change-email": "Entrez ce code pour confirmer votre nouvel email.",
    };
    const message = messages[type] ?? "Entrez ce code pour continuer.";

    return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;padding:48px 40px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
        <tr><td style="padding-bottom:32px;border-bottom:1px solid #F1F5F9;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#0F172A;">NextPress</p>
        </td></tr>
        <tr><td style="padding-top:32px;">
          <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#0F172A;">Votre code de vérification</p>
          <p style="margin:0 0 32px;font-size:15px;color:#64748B;line-height:1.6;">${message}</p>
          <div style="background:#EFF6FF;border:2px solid #BFDBFE;border-radius:10px;padding:24px;text-align:center;margin-bottom:32px;">
            <span style="font-size:40px;font-weight:700;letter-spacing:14px;color:#2563EB;">${otp}</span>
          </div>
          <p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.6;">Ce code expire dans <strong>5 minutes</strong>.<br>Si vous n'avez pas effectué cette action, ignorez cet email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function welcomeHtml(name: string) {
    return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;padding:48px 40px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
        <tr><td style="padding-bottom:32px;border-bottom:1px solid #F1F5F9;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#0F172A;">NextPress</p>
        </td></tr>
        <tr><td style="padding-top:32px;">
          <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#0F172A;">Bienvenue, ${name} 👋</p>
          <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.6;">Votre compte est prêt. Vérifiez votre email pour activer votre compte, puis accédez à votre espace.</p>
          <a href="${APP_URL}/account" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:15px;font-weight:600;">Accéder à mon espace →</a>
        </td></tr>
        <tr><td style="padding-top:40px;border-top:1px solid #F1F5F9;margin-top:40px;">
          <p style="margin:16px 0 0;font-size:13px;color:#94A3B8;line-height:1.6;">
            NextPress — L'alternative moderne à WordPress.<br>
            Liberté totale sur votre frontend, zéro thème payant.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
