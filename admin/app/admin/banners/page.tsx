import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BannerTable } from "./components/banner-table";
import { AddBannerDialog } from "./components/add-banner-dialog";
import prisma from "@/lib/prisma";

async function getBanners() {
	return await prisma.banner.findMany({
		orderBy: { position: "asc" },
	});
}

export default async function BannerManagementPage() {
	const banners = await getBanners();
	const maxPosition =
		banners.length > 0 ? Math.max(...banners.map((b) => b.position)) : 0;

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Banner Management</h1>
					<p className="text-muted-foreground">
						Manage your website banners and promotional content
					</p>
				</div>
				<AddBannerDialog maxPosition={maxPosition} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Banners ({banners.length})</CardTitle>
				</CardHeader>
				<CardContent>
					<BannerTable banners={banners} />
				</CardContent>
			</Card>
		</div>
	);
}
