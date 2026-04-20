"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Type, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function RightSidebar({ }: { isMobile?: boolean } = {}) {
    const [mounted, setMounted] = useState(false);
    const [arabicFontSize, setArabicFontSize] = useLocalStorage<number>("arabic-font-size", 32);
    const [translationFontSize, setTranslationFontSize] = useLocalStorage<number>("translation-font-size", 18);
    const [arabicFontFace, setArabicFontFace] = useLocalStorage<string>("arabic-font-face", "uthmani");

    const [selectedTranslations, setSelectedTranslations] = useLocalStorage<string[]>("selected-translations", ["bengali"]);
    const [wbwTranslationLang, setWbwTranslationLang] = useLocalStorage<string>("wbw-translation-lang", "bengali");
    const [showWordByWord, setShowWordByWord] = useLocalStorage<boolean>("show-word-by-word", true);
    const [showTajweed, setShowTajweed] = useLocalStorage<boolean>("show-tajweed", false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.style.setProperty("--arabic-font-size", `${arabicFontSize}px`);
    }, [arabicFontSize, mounted]);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.style.setProperty("--translation-font-size", `${translationFontSize}px`);
    }, [translationFontSize, mounted]);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.setAttribute("data-font", arabicFontFace);
    }, [arabicFontFace, mounted]);

    // Don't render content until mounted to prevent hydration mismatches
    if (!mounted) {
        return (
            <div className="flex h-full flex-col bg-background text-foreground border-l animate-pulse">
                <div className="p-4">
                    <div className="h-10 bg-muted rounded-full w-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-background text-foreground border-l">
            <Tabs defaultValue="translation" className="flex flex-col h-full w-full">
                <div className="p-4 border-b border-border/50">
                    <TabsList className="grid w-full grid-cols-2 bg-muted">
                        <TabsTrigger value="translation">Translation</TabsTrigger>
                        <TabsTrigger value="reading">Reading</TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <TabsContent value="translation" className="m-0 p-4 outline-none space-y-6">

                        <Accordion type="single" defaultValue={"font-settings"} className="w-full rounded-md">

                            <AccordionItem value="reading-settings" className="bg-card shadow-sm">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">Reading Settings</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4 text-sm">
                                    <div className="space-y-6 flex flex-col">
                                        <div className="space-y-3 flex flex-col">
                                            <Label className="text-base font-medium text-foreground">Translations</Label>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <div className="flex items-center justify-between w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {selectedTranslations.length === 0
                                                                ? "None Selected"
                                                                : selectedTranslations.length === 1
                                                                    ? selectedTranslations[0].charAt(0).toUpperCase() + selectedTranslations[0].slice(1)
                                                                    : "Multiple Selected"}
                                                        </span>
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
                                                    <DropdownMenuCheckboxItem
                                                        checked={selectedTranslations.includes("bengali")}
                                                        onCheckedChange={(checked) => {
                                                            setSelectedTranslations((prev) => checked ? [...prev, "bengali"] : prev.filter((t) => t !== "bengali"));
                                                        }}
                                                    >
                                                        Bengali
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        checked={selectedTranslations.includes("english")}
                                                        onCheckedChange={(checked) => {
                                                            setSelectedTranslations((prev) => checked ? [...prev, "english"] : prev.filter((t) => t !== "english"));
                                                        }}
                                                    >
                                                        English
                                                    </DropdownMenuCheckboxItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="space-y-3 flex flex-col">
                                            <Label className="text-base font-medium text-foreground">Word-by-word translations</Label>
                                            <Select value={wbwTranslationLang} onValueChange={setWbwTranslationLang}>
                                                <SelectTrigger className="w-full bg-muted/30 border-border/50 hover:bg-accent/50 transition-colors h-[46px]">
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="bengali">Bengali</SelectItem>
                                                    <SelectItem value="english">English</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-base font-medium text-foreground cursor-pointer" htmlFor="show-wbw-toggle">Show by words</Label>
                                            <Switch id="show-wbw-toggle" checked={showWordByWord} onCheckedChange={setShowWordByWord} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-base font-medium text-muted-foreground cursor-pointer" htmlFor="show-tajweed-toggle">Tajweed</Label>
                                            <Switch id="show-tajweed-toggle" disabled checked={showTajweed} onCheckedChange={setShowTajweed} />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="font-settings" className="bg-card ">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-3">
                                        <Type className="h-5 w-5 text-primary" />
                                        <span className="font-medium text-primary">Font Settings</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-sm font-medium">Arabic Font Size</Label>
                                            <span className="text-primary text-sm font-medium">{arabicFontSize}px</span>
                                        </div>
                                        <Slider
                                            value={[arabicFontSize]}
                                            min={20}
                                            max={64}
                                            step={1}
                                            onValueChange={(val) => setArabicFontSize(val[0])}
                                            className="cursor-pointer"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-sm font-medium">Translation Font Size</Label>
                                            <span className="text-primary text-sm font-medium">{translationFontSize}px</span>
                                        </div>
                                        <Slider
                                            value={[translationFontSize]}
                                            min={12}
                                            max={40}
                                            step={1}
                                            onValueChange={(val) => setTranslationFontSize(val[0])}
                                            className="cursor-pointer"
                                        />
                                    </div>

                                    <div className="space-y-3 flex flex-col">
                                        <Label className="text-sm font-medium">Arabic Font Face</Label>
                                        <Select value={arabicFontFace} onValueChange={setArabicFontFace}>
                                            <SelectTrigger className="w-full bg-background border-border hover:bg-accent transition-colors">
                                                <SelectValue placeholder="Select a font face" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="uthmani">Uthmani</SelectItem>
                                                <SelectItem value="amiri">Amiri Quran</SelectItem>
                                                <SelectItem value="cairo">Cairo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>

                        {/* Support Banner */}
                        <div className="border border-border bg-card p-5 space-y-4 shadow-sm rounded-md">
                            <h3 className="font-semibold text-lg">Help spread the knowledge of Islam</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Your regular support helps us reach our religious brothers and sisters with the message of Islam. Join our mission and be part of the big change.
                            </p>
                            <Button className="w-full text-primary-foreground font-semibold">
                                Support Us
                            </Button>
                        </div>

                    </TabsContent>

                    <TabsContent value="reading" className="m-0 p-4 outline-none">
                        <div className="flex flex-col items-center justify-center p-8 text-center h-full text-muted-foreground">
                            <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                            <p>Reading mode settings unavailable.</p>
                        </div>
                    </TabsContent>

                </ScrollArea>
            </Tabs>
        </div>
    );
}
