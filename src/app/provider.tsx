import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <QueryProvider>
                <TooltipProvider>
                    {children}
                    <Toaster position="top-right" />
                </TooltipProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}