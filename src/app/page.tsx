import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <Button asChild>
                <Link href="/login">Start NextPress</Link>
            </Button>
        </main>
    );
}
