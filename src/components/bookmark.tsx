"use client"

import * as React from "react"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { useLocalStorage } from "@/hooks/use-local-storage"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Folder } from "lucide-react"

export type BookmarkCollection = {
    name: string
    color: string
    ayahs: string[]
    createdAt: number
    updatedAt: number
}

export type BookmarksData = Record<string, BookmarkCollection>

interface BookmarkModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    ayahKey: string // e.g. "1:1"
}

function BookmarkContent({
    ayahKey,
    bookmarks,
    setBookmarks,
    onClose
}: {
    ayahKey: string
    bookmarks: BookmarksData
    setBookmarks: React.Dispatch<React.SetStateAction<BookmarksData>>
    onClose: () => void
}) {
    const [searchQuery, setSearchQuery] = React.useState("")

    const toggleBookmark = React.useCallback((collectionId: string, checked: boolean) => {
        const now = Date.now()
        setBookmarks((prev: BookmarksData) => {
            const collection = prev[collectionId]
            const next: BookmarksData = {
                ...prev,
                [collectionId]: {
                    ...collection,
                    ayahs: checked
                        ? Array.from(new Set([...collection.ayahs, ayahKey]))
                        : collection.ayahs.filter((a: string) => a !== ayahKey),
                    updatedAt: now,
                },
            }
            return next
        })
    }, [ayahKey, setBookmarks])

    const filteredCollections = Object.entries(bookmarks).filter(([, data]) =>
        data.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-4">
            <Tabs defaultValue="bookmark" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted border border-border rounded-full h-10 p-1">
                    <TabsTrigger value="bookmark" className="rounded-full data-[state=active]:bg-zinc-800 text-sm h-8">
                        Bookmark
                    </TabsTrigger>
                    <TabsTrigger value="pin" className="rounded-full data-[state=active]:bg-zinc-800 text-sm h-8 text-muted-foreground">
                        Pin
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search Bookmark Folder"
                    className="pl-9 bg-muted border-border focus-visible:ring-1 focus-visible:ring-border rounded-lg text-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-3 py-2 max-h-[250px] overflow-y-auto">
                {filteredCollections.map(([id, collection]) => {
                    const isSelected = collection.ayahs.includes(ayahKey)
                    return (
                        <div key={id} className="flex items-center space-x-3">
                            <Checkbox
                                id={id}
                                checked={isSelected}
                                onCheckedChange={(checked) => toggleBookmark(id, checked as boolean)}
                                className="rounded-full data-[state=checked]:bg-primary data-[state=checked]:border-primary border-muted-foreground"
                            />
                            <label
                                htmlFor={id}
                                className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer flex-1 text-foreground"
                            >
                                <Folder className="h-5 w-5 text-green-500 fill-green-500" />
                                {collection.name}
                            </label>
                        </div>
                    )
                })}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-border border-opacity-50">
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
                    Create
                </Button>
                <Button variant="ghost" className="flex-1 bg-muted hover:bg-muted/80 text-foreground rounded-lg border-none" onClick={onClose}>
                    Done
                </Button>
            </div>
        </div>
    )
}

export function BookmarkModal({ open, onOpenChange, ayahKey }: BookmarkModalProps) {
    const isMobile = useIsMobile()
    const [bookmarks, setBookmarks] = useLocalStorage<BookmarksData>("bookmarks", React.useMemo(() => {
        const defaultTime = 1776573008820 // Use a constant for initial seed if desired, or 0
        return {
            "1f2k-jvzb": {
                name: "Favorites",
                color: "#5EAF7F",
                ayahs: [],
                createdAt: defaultTime,
                updatedAt: defaultTime,
            },
            "ousx-kmwo": {
                name: "demo",
                color: "#5EAF7F",
                ayahs: [],
                createdAt: defaultTime,
                updatedAt: defaultTime,
            }
        }
    }, []))

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="bg-card border-border text-foreground">
                    <DrawerHeader>
                        <DrawerTitle className="text-center font-normal">Add to Collections</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-6">
                        <BookmarkContent
                            ayahKey={ayahKey}
                            bookmarks={bookmarks}
                            setBookmarks={setBookmarks}
                            onClose={() => onOpenChange(false)}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card border-border text-foreground shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-center font-normal">Add to Collections</DialogTitle>
                </DialogHeader>
                <BookmarkContent
                    ayahKey={ayahKey}
                    bookmarks={bookmarks}
                    setBookmarks={setBookmarks}
                    onClose={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    )
}
