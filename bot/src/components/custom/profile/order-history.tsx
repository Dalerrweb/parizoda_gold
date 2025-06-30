import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ExternalLink, ShoppingBag } from "lucide-react";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Order, User } from "@/types";

interface OrderHistoryProps {
	user: User;
}

export function OrderHistory({ user }: OrderHistoryProps) {
	if (user.orders.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-xl">Order History</CardTitle>
					<CardDescription>
						You haven't placed any orders yet.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8">
						<ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
						<p className="mt-4 text-lg font-medium">
							No orders yet
						</p>
						<p className="text-muted-foreground">
							When you place an order, it will appear here.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl">Order History</CardTitle>
				<CardDescription>
					You have placed {user.orders.length} order
					{user.orders.length !== 1 ? "s" : ""}.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{user.orders.map((order: Order) => (
						<Collapsible
							key={order.id}
							className="border rounded-lg"
						>
							<CollapsibleTrigger asChild>
								<div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
									<div className="flex items-center gap-4">
										<Badge
											className={`${getStatusColor(
												order.status
											)} text-white`}
										>
											{order.status}
										</Badge>
										<div>
											<p className="font-medium">
												Order #{order.id}
											</p>
											<p className="text-sm text-muted-foreground">
												{formatDate(order.createdAt)}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-4">
										{/* <p className="font-medium">
											{formatPrice(order.totalAmount)}
										</p> */}
										<ChevronDown className="h-5 w-5 text-muted-foreground" />
									</div>
								</div>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<Separator />
								<div className="p-4 space-y-4">
									<div>
										<p className="text-sm font-medium mb-2">
											Items
										</p>
										<div className="space-y-2">
											{/* {order.items.map((item, index) => (
												<div
													key={index}
													className="flex justify-between"
												>
													<p>
														{item.name}{" "}
														<span className="text-muted-foreground">
															x{item.quantity}
														</span>
													</p>
													<p>
														{formatPrice(
															item.price
														)}
													</p>
												</div>
											))} */}
										</div>
									</div>
									<Separator />
									<div className="flex justify-between font-medium">
										<p>Total</p>
										{/* <p>{formatPrice(order.totalAmount)}</p> */}
									</div>
									<div className="flex justify-end">
										<Button variant="outline" size="sm">
											<ExternalLink className="mr-2 h-4 w-4" />
											View Details
										</Button>
									</div>
								</div>
							</CollapsibleContent>
						</Collapsible>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
