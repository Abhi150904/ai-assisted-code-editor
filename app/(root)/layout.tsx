
import { Footer } from "@/features/home/footer";
import { Header } from "@/features/home/header"
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
// import { usePathname } from "next/navigation";

export const metadata: Metadata = {
    title: {
        template: "VibeCode - Editor ",
        default: "Code Editor For VibeCoders - VibeCode",
    },
};

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <div className="flex min-h-screen flex-col">
                <div className="relative flex-1">
                    <div
                        className={cn(
                            "pointer-events-none absolute inset-0",
                            "bg-size-[40px_40px]",
                            "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                            "dark:bg-[linear-gradient(to_right,#4b5563_1px,transparent_1px),linear-gradient(to_bottom,#4b5563_1px,transparent_1px)]",
                        )}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

                    <main className="relative z-20 w-full pt-0 md:pt-0">
                        {children}
                    </main>
                </div>
                <div className="relative z-20">
                    <Footer />
                </div>
            </div>
        </>
    );
}
