import { User } from "@/types";

interface ProfileDisplayProps {
	user: User;
}

export function ProfileDisplay({ user }: ProfileDisplayProps) {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<p className="text-sm font-medium text-muted-foreground">
						Username
					</p>
					<p className="text-base">{user.username || "Not set"}</p>
				</div>
				<div>
					<p className="text-sm font-medium text-muted-foreground">
						Telegram ID
					</p>
					<p className="text-base">{user.telegramId}</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<p className="text-sm font-medium text-muted-foreground">
						Имя
					</p>
					<p className="text-base">{user.first_name || "Not set"}</p>
				</div>
				<div>
					<p className="text-sm font-medium text-muted-foreground">
						Фамилия
					</p>
					<p className="text-base">{user.last_name || "Not set"}</p>
				</div>
				<div>
					<p className="text-sm font-medium text-muted-foreground">
						Номер телефона
					</p>
					<p className="text-base">
						{user.phone || "Установите номер телефона!"}
					</p>
				</div>
			</div>
		</div>
	);
}
