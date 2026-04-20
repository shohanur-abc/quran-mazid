import { Play, BookOpen, Bookmark, Copy, LinkIcon, Share2 } from "lucide-react";

export const ayahActions: AyahActionsProps[] = [
    {
        label: "Play",
        icon: <Play />,
    },
    {
        label: "Tafsir",
        icon: <BookOpen />,
    },
    {
        label: "Bookmark",
        icon: <Bookmark />,
    },
    {
        label: "Copy Ayah",
        icon: <Copy />,
    },
    {
        label: "Copy Link",
        icon: <LinkIcon />,
    },
    {
        label: "Share Ayah",
        icon: <Share2 />,
    },
]

interface AyahActionsProps {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    hidden?: boolean;
    disabled?: boolean;
}