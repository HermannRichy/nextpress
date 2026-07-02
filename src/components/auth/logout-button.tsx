"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconLogout, IconLoader2 } from "@tabler/icons-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface LogoutButtonProps {
    variant?: "default" | "ghost" | "outline" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export function LogoutButton({ variant = "ghost", size = "default", className }: LogoutButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await authClient.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variant} size={size} className={className} disabled={loading}>
                    {loading ? (
                        <IconLoader2 size={16} className="animate-spin" />
                    ) : (
                        <IconLogout size={16} />
                    )}
                    <span className="ml-2">Déconnexion</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Voulez-vous vous déconnecter ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Vous serez redirigé vers la page de connexion.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                        {loading && <IconLoader2 size={14} className="mr-1.5 animate-spin" />}
                        Se déconnecter
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
