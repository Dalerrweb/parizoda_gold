import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="flex flex-col min-h-screen p-4 md:p-8 pt-6">
			<div className="flex items-center w-full justify-between gap-2 mb-4">
				<Skeleton className="h-20 w-full bg-gray-400" />
				<Skeleton className="h-20 w-full bg-gray-400" />
				<Skeleton className="h-20 w-full bg-gray-400" />
				<Skeleton className="h-20 w-full bg-gray-400" />
			</div>
			<div className="w-full space-y-2">
				<Skeleton className="h-8 w-full bg-gray-400" />
				<Skeleton className="h-8 w-full bg-gray-400" />
				<Skeleton className="h-8 w-full bg-gray-400" />
				<Skeleton className="h-8 w-full bg-gray-400" />
				<Skeleton className="h-8 w-full bg-gray-400" />
				<Skeleton className="h-8 w-full bg-gray-400" />
				<Skeleton className="h-8 w-full bg-gray-400" />
				<Skeleton className="h-8 w-full bg-gray-400" />
			</div>
		</div>
	);
}
