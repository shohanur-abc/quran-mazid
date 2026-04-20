
export default function ArabicText({
    children,
    size = 'text-3xl',
    className = '',
}: ArabicTextProps) {
    return (
        <p dir="rtl" className={`font-arabic leading-loose text-right ${size} ${className}`}>
            {children}
        </p>
    )
}

interface ArabicTextProps {
    children: React.ReactNode
    size?: string
    className?: string
}
