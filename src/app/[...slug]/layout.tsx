import { ResponsiveLayout } from "@/components/layout/responsive-layout";

export default function SlugLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background text-foreground">
            <ResponsiveLayout>{children}</ResponsiveLayout>
        </div>
    );
}
