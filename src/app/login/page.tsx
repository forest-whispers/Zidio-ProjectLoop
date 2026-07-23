import { LoginForm } from "@/features/auth/components/LoginForm";
import { Lock } from "lucide-react";

export const metadata = {
    title: "Sign In - LOOP",
    description: "Sign in to your LOOP workspace",
};

export default function LoginPage() {
    return (
        <main className="flex-1 flex flex-col justify-center items-center relative min-h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden px-4">
            {/* Background design accents */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[40%] left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px]" />
                <div className="absolute bottom-[40%] right-[20%] w-[80%] h-[80%] rounded-full bg-zinc-500/5 dark:bg-zinc-500/10 blur-[120px]" />
                <div 
                    className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: '24px 24px',
                    }}
                />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
                {/* Logo / Header */}
                <div className="flex items-center space-x-2.5 mb-6 text-zinc-900 dark:text-white">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md">
                        <Lock className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black tracking-wider uppercase">LOOP</span>
                </div>

                {/* Form Wrapper */}
                <LoginForm />
            </div>
        </main>
    );
}