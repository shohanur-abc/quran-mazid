"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Settings2, Search, Heart } from "lucide-react";
import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatedThemeToggler } from "@/components/animated-theme-toggler";
import { SearchDialog } from "@/components/search-dialog";

export function SiteHeader() {
    const [leftOpen, setLeftOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className={cn(
            "flex h-16 shrink-0 items-center justify-between border-b border-border/5 px-4 md:px-6 bg-background/80 sticky top-0 left-0 right-0 z-50",
            pathname === "/" && "max-w-7xl mx-auto w-full"
        )}>
            <div className="flex items-center gap-4">
                <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-100 p-0 border-r-border/r bg-background">
                        <LeftSidebar />
                    </SheetContent>
                </Sheet>
                <div>
                    <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
                        Quran Mazid
                    </Link>
                    {/* <p className="text-xs text-muted-foreground hidden sm:block">Read, Study, and Learn The Quran</p> */}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="rounded-full bg-foreground/5 hover:bg-foreground/10 text-muted-foreground">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                </Button>
                <SearchDialog open={searchOpen} setOpen={setSearchOpen} />
                <AnimatedThemeToggler className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 w-9 rounded-full bg-foreground/5 hover:bg-foreground/10 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4" />
                <Button className="hidden sm:flex rounded-full bg-primary/10 text-primary hover:bg-primary/20 gap-2 font-medium ml-2">
                    Support Us <Heart className="h-4 w-4 fill-current" />
                </Button>

                <Sheet open={rightOpen} onOpenChange={setRightOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="xl:hidden ml-2 rounded-full border border-border/10">
                            <Settings2 className="h-5 w-5" />
                            <span className="sr-only">Toggle settings panel</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-100 p-0 border-l-border/l bg-background">
                        <RightSidebar isMobile />
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
