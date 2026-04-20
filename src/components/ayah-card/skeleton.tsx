import { Skeleton } from "@/components/ui/skeleton";

interface AyahCardSkeletonProps {
    desktopActions?: boolean;
    mobileActions?: boolean;
}

export function AyahCardSkeleton({
    desktopActions = true,
    mobileActions = true,
}: AyahCardSkeletonProps) {
    return (
        <div>
            <div className="overflow-hidden border-b py-6 transition-colors duration-200 relative">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-16 rounded-md" />

                    {mobileActions ? (
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    ) : null}
                </div>

                <div className="grid grid-cols-1 gap-7 pt-3 @3xl:grid-cols-[auto_1fr]">
                    {desktopActions ? (
                        <div className="hidden @3xl:flex @3xl:flex-col @3xl:items-center @3xl:gap-3">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    ) : null}

                    <div>
                        <Skeleton className="h-12 w-full @3xl:h-16" />

                        <div className="mt-8 space-y-6">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-44 rounded-md" />
                                <Skeleton className="h-5 w-full rounded-md" />
                                <Skeleton className="h-5 w-3/4 rounded-md" />
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-6 w-52 rounded-md" />
                                <Skeleton className="h-5 w-full rounded-md" />
                                <Skeleton className="h-5 w-5/6 rounded-md" />
                                <Skeleton className="h-5 w-2/3 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
