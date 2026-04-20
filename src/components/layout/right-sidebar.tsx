"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Settings, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

export function RightSidebar({ isMobile }: { isMobile?: boolean }) {
    const [mounted, setMounted] = useState(false);
    const [arabicFontSize, setArabicFontSize] = useState<number>(32);
    const [translationFontSize, setTranslationFontSize] = useState<number>(18);
    const [arabicFontFace, setArabicFontFace] = useState<string>("uthmani");

    useEffect(() => {
        setMounted(true);
        const storedAraSize = localStorage.getItem("arabic-font-size");
        const storedTransSize = localStorage.getItem("translation-font-size");
        const storedFace = localStorage.getItem("arabic-font-face");

        if (storedAraSize) setArabicFontSize(Number(storedAraSize));
        if (storedTransSize) setTranslationFontSize(Number(storedTransSize));
        if (storedFace) setArabicFontFace(storedFace);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.style.setProperty("--arabic-font-size", `${arabicFontSize}px`);
        localStorage.setItem("arabic-font-size", String(arabicFontSize));
    }, [arabicFontSize, mounted]);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.style.setProperty("--translation-font-size", `${translationFontSize}px`);
        localStorage.setItem("translation-font-size", String(translationFontSize));
    }, [translationFontSize, mounted]);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.setAttribute("data-font", arabicFontFace);
        localStorage.setItem("arabic-font-face", arabicFontFace);
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

                        <Accordion type="multiple" defaultValue={["font-settings"]} className="w-full rounded-md">

                            <AccordionItem value="reading-settings" className="bg-card shadow-sm">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">Reading Settings</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4 text-muted-foreground text-sm">
                                    Reading settings configuration will appear here.
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
