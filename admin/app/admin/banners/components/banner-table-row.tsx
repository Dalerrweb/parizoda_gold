import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Banner } from "../types";
import { moveBannerPosition, toggleBannerStatus } from "@/lib/banner-actions";
import { EditBannerDialog } from "./edit-banner-dialog";
import { DeleteBannerDialog } from "./delete-banner-dialog";

interface BannerTableRowProps {
	banner: Banner;
	isFirst: boolean;
	isLast: boolean;
}

export function BannerTableRow({
	banner,
	isFirst,
	isLast,
}: BannerTableRowProps) {
	return (
		<TableRow>
			<TableCell>
				<div className="flex flex-col space-y-1">
					<form action={moveBannerPosition}>
						<input type="hidden" name="id" value={banner.id} />
						<input type="hidden" name="direction" value="up" />
						<Button
							type="submit"
							variant="ghost"
							size="sm"
							disabled={isFirst}
							className="h-6 w-6 p-0"
						>
							↑
						</Button>
					</form>
					<form action={moveBannerPosition}>
						<input type="hidden" name="id" value={banner.id} />
						<input type="hidden" name="direction" value="down" />
						<Button
							type="submit"
							variant="ghost"
							size="sm"
							disabled={isLast}
							className="h-6 w-6 p-0"
						>
							↓
						</Button>
					</form>
				</div>
			</TableCell>
			<TableCell>
				<img
					src={banner.imageUrl || "/placeholder.svg"}
					alt="Banner preview"
					className="h-16 w-32 object-cover rounded border"
				/>
			</TableCell>
			<TableCell>
				{banner.link ? (
					<div className="flex items-center space-x-2">
						<ExternalLink className="h-4 w-4" />
						<span className="truncate max-w-48">{banner.link}</span>
					</div>
				) : (
					<span className="text-muted-foreground">No link</span>
				)}
			</TableCell>
			<TableCell>
				<Badge variant={banner.isActive ? "default" : "secondary"}>
					{banner.isActive ? "Active" : "Inactive"}
				</Badge>
			</TableCell>
			<TableCell>{banner.position}</TableCell>
			<TableCell>{banner.createdAt.toLocaleDateString()}</TableCell>
			<TableCell>
				<div className="flex items-center space-x-2">
					<form action={toggleBannerStatus}>
						<input type="hidden" name="id" value={banner.id} />
						<Button type="submit" variant="ghost" size="sm">
							{banner.isActive ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</form>
					<EditBannerDialog banner={banner} />
					<DeleteBannerDialog banner={banner} />
				</div>
			</TableCell>
		</TableRow>
	);
}
