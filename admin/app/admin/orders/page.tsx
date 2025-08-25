import { SidebarTrigger } from "@/components/ui/sidebar";
import { OrdersTable } from "./components/orders-table";
import prisma from "@/lib/prisma";

export default async function AdminOrdersPage() {
	const orders = await prisma.order.findMany({
		include: {
			user: {
				include: { orders: true },
			},
			items: {
				include: {
					product: true,
					bundleItems: true,
				},
			},
		},
	});

	return (
		<div className="flex-col min-h-screen">
			<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<div className="flex flex-1 items-center gap-2">
					<h1 className="text-lg font-semibold">Заказы</h1>
				</div>
			</header>

			<div className="flex-1 space-y-4 p-4 md:p-4 pt-6">
				<OrdersTable orders={orders} />
			</div>
		</div>
	);
}
