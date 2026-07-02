"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconMail, IconLoader2, IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const schema = z.object({
    email: z.email({ error: "Email invalide" }),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values: FormValues) => {
        setServerError(null);
        // Toujours naviguer vers reset-password, quelle que soit l'existence du compte
        // Évite l'énumération d'emails : l'utilisateur reçoit le code uniquement si le compte existe
        await authClient.emailOtp.sendVerificationOtp({
            email: values.email,
            type: "forget-password",
        });
        toast.success("Si un compte existe avec cet email, vous recevrez un code.");
        router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
    };

    return (
        <section className="w-full bg-card rounded-2xl shadow-md p-6">
            <header className="mb-6">
                <h1 className="text-xl font-semibold">Mot de passe oublié</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Entrez votre email pour recevoir un code de réinitialisation
                </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-4">
                {serverError && (
                    <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                        {serverError}
                    </p>
                )}

                <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <IconMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="vous@exemple.com"
                            className="pl-9"
                            autoComplete="off"
                            {...register("email")}
                        />
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                    {isSubmitting && <IconLoader2 size={16} className="mr-2 animate-spin" />}
                    Envoyer le code
                </Button>
            </form>

            <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
            >
                <IconArrowLeft size={14} />
                Retour à la connexion
            </Link>
        </section>
    );
}
