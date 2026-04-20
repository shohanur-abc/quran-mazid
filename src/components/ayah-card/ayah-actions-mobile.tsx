"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Ellipsis, Play, BookOpen, Bookmark } from "lucide-react";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

export interface AyahMenuAction {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    hidden?: boolean;
    disabled?: boolean;
}

export interface AyahActionsMobileProps {
    onPlay?: () => void;
    onTafsir?: () => void;
    onBookmark?: () => void;
    menuActions: AyahMenuAction[];
}

export function AyahActionsMobile({
    onPlay,
    onTafsir,
    onBookmark,
    menuActions,
}: AyahActionsMobileProps) {
    return (
        <div className="@3xl:hidden">
            <Drawer>
                <DrawerTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                    >
                        <Ellipsis className="size-5" strokeWidth={2.5} />
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="sr-only">
                        <DrawerTitle>Ayah actions</DrawerTitle>
                        <DrawerDescription>Ayah actions menu</DrawerDescription>
                    </DrawerHeader>

                    <div className="space-y-0 pb-8 pt-4">
                        {[
                            {
                                key: "play",
                                label: "Play",
                                icon: <Play />,
                                onClick: onPlay,
                            },
                            {
                                key: "tafsir",
                                label: "Tafsir",
                                icon: <BookOpen />,
                                onClick: onTafsir,
                            },
                            {
                                key: "bookmark",
                                label: "Bookmark",
                                icon: <Bookmark />,
                                onClick: onBookmark,
                            },
                        ].map((action) => (
                            <Button
                                key={action.key}
                                type="button"
                                variant="ghost"
                                onClick={action.onClick}
                                className="flex w-full items-center justify-start gap-4 rounded-none px-4 py-2 hover:bg-transparent "
                            >
                                {action.icon}
                                <span>{action.label}</span>
                            </Button>
                        ))}

                        {menuActions.map((action) => (
                            <Button
                                key={action.label}
                                variant="ghost"
                                onClick={action.onClick}
                                disabled={action.disabled}
                                className="flex w-full items-center justify-start gap-4 rounded-none px-4 py-2 hover:bg-transparent "
                            >
                                <span className="shrink-0">{action.icon}</span>
                                <span>{action.label}</span>
                            </Button>
                        ))}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
