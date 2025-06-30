import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { User } from "@/types";

interface ProfileHeaderProps {
	user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
	const getInitials = () => {
		if (user.first_name && user.last_name) {
			return `${user.first_name.charAt(0)}${user.last_name.charAt(
				0
			)}`.toUpperCase();
		}
		if (user.first_name) {
			return user.first_name.charAt(0).toUpperCase();
		}
		if (user.username) {
			return user.username.charAt(0).toUpperCase();
		}
		return "U";
	};

	const getDisplayName = () => {
		if (user.first_name && user.last_name) {
			return `${user.first_name} ${user.last_name}`;
		}
		return user.username || `User #${user.id}`;
	};

	return (
		<CardHeader className="flex flex-row items-center gap-4 pb-2">
			<Avatar className="h-16 w-16">
				<AvatarImage
					src={
						user.photo_url || "/placeholder.svg?height=64&width=64"
					}
					alt={user.username || "User"}
				/>
				<AvatarFallback className="text-lg">
					{getInitials()}
				</AvatarFallback>
			</Avatar>
			<div>
				<CardTitle className="text-2xl">{getDisplayName()}</CardTitle>
				<CardDescription>
					В приложении с {formatDate(user.createdAt)}
				</CardDescription>
			</div>
		</CardHeader>
	);
}
