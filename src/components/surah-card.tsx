import { cn } from "@/lib/utils";
import Link from "next/link";

export const SurahCard = ({
    idx,
    href,
    title,
    subtitle,
    arabicName,
    isActive = false,
    classNames: cns
}: SurahCardProps) => {
    return (
        <Link href={href}
            className={cn(
                "group/card flex w-full min-w-[200px] cursor-pointer select-none items-center justify-between gap-5 rounded-md border px-4 py-4 hover:border-primary/50 transition-colors bg-card hover:bg-card/80",
                isActive && "active border-primary/30 bg-primary/10", cns?.card
            )}
        >
            <div className={cn("flex size-[32px] min-h-8 min-w-8 rotate-45 items-center justify-center rounded-[6px] bg-accent group-hover/card:bg-primary/10 group-[.active]/card:bg-primary/20", cns?.idx)}>
                <span className="-rotate-45 text-muted-foreground font-medium group-hover/card:text-primary group-[.active]/card:text-primary text-sm">
                    {idx}
                </span>
            </div>
            <div className="grow text-start flex flex-col justify-center">
                <p className={cn("line-clamp-1 break-all pr-3 font-medium text-foreground ", cns?.title)}>
                    {title}
                </p>
                {subtitle && (
                    <p className={cn("line-clamp-1 break-all text-muted-foreground text-xs", cns?.subtitle)}>
                        {subtitle}
                    </p>
                )}
            </div>
            {arabicName && (
                <span className={cn("text-right font-uthmani text-2xl text-foreground", cns?.arabicName)}>
                    {arabicName || idx}
                </span>
            )}
        </Link>
    );
};

interface SurahCardProps {
    idx: number | string;
    href: string;
    title: string;
    subtitle?: string;
    arabicName?: string;
    isActive?: boolean;
    classNames?: {
        card?: string;
        idx?: string;
        title?: string;
        subtitle?: string;
        arabicName?: string;
    }
}
