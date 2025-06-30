import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { User } from "@/types";

interface AccountInfoProps {
	user: User;
}

export function AccountInfo({ user }: AccountInfoProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl">Account Information</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<p className="text-sm font-medium text-muted-foreground">
						Account ID
					</p>
					<p className="text-base">{user.id}</p>
				</div>
				<div>
					<p className="text-sm font-medium text-muted-foreground">
						Member Since
					</p>
					<p className="text-base">{formatDate(user.createdAt)}</p>
				</div>
				<div>
					<p className="text-sm font-medium text-muted-foreground">
						Total Orders
					</p>
					<p className="text-base">{user.orders.length}</p>
				</div>
			</CardContent>
		</Card>
	);
}
