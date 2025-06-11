"use client";

import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserProvider";

export function UserProfileHeader() {
	const { user } = useUser();

	if (!user) return null;

	const fullOrUsername =
		user?.first_name && user?.last_name
			? `${user?.first_name} ${user?.last_name}`
			: user?.username;

	return (
		<div className="bg-background border-b border-border p-4">
			<div className="flex items-center gap-3">
				<Avatar className="h-12 w-12">
					<AvatarImage
						src={user?.photo_url || "/placeholder.svg"}
						alt={user?.first_name || user?.username || "User"}
					/>
					<AvatarFallback className="text-sm">
						{user?.first_name?.[0]}
						{user?.last_name?.[0]}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 min-w-0">
					<p className="font-medium text-foreground truncate">
						{fullOrUsername}
					</p>
					<div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
						<MapPin className="h-3 w-3 flex-shrink-0" />
						<span className="truncate">New York, USA</span>
					</div>
				</div>
			</div>
		</div>
	);
}
