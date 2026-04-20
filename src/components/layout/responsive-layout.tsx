"use client";

import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-1 overflow-hidden h-full">
            {/* Left Sidebar (Desktop/Tablet) */}
            <aside className="hidden md:flex w-80 flex-col border-r border-border/5 shrink-0 overflow-hidden">
                <LeftSidebar />
            </aside>

            {/* Center Main Content */}
            <main id="main-scroll-container" className="flex-1 overflow-y-auto relative scrollbar-thin ">
                <div className="mx-auto max-w-4xl p-4">
                    {children}
                </div>
            </main>

            {/* Right Sidebar (Desktop) */}
            <aside className="hidden xl:flex w-80 flex-col border-l border-border/5 shrink-0 overflow-hidden">
                <RightSidebar />
            </aside>
        </div>
    );
}
