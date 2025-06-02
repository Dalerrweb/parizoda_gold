import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { BannerTableRow } from "./banner-table-row";
import type { Banner } from "../types";

interface BannerTableProps {
	banners: Banner[];
}

export function BannerTable({ banners }: BannerTableProps) {
	const maxPosition =
		banners.length > 0 ? Math.max(...banners.map((b) => b.position)) : 0;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-12">Order</TableHead>
					<TableHead>Preview</TableHead>
					<TableHead>Link</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Position</TableHead>
					<TableHead>Created</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{banners.map((banner) => (
					<BannerTableRow
						key={banner.id}
						banner={banner}
						isFirst={banner.position === 1}
						isLast={banner.position === maxPosition}
					/>
				))}
			</TableBody>
		</Table>
	);
}
