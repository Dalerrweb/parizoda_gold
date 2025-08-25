"use client";

import { useState, useMemo } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Eye,
	Package,
	User,
	Calendar,
	CreditCard,
	Banknote,
	Redo2,
	RotateCcw,
} from "lucide-react";
import { OrderStatusSelect } from "./order-status-select";
import { formatDate, formatPrice } from "@/lib/utils";
import { PaymentType } from "@/app/types";

interface OrdersTableProps {
	orders: Array<{
		id: number;
		userId: number;
		status: string;
		totalAmount: number;
		paymentType: string;
		createdAt: Date;
		updatedAt: Date;
		user: any;
		items: any;
	}>;
	onStatusUpdate?: (orderId: number, newStatus: string) => Promise<void>;
}

// const paymentTypeLabels: Record<string, string> = {
// 	PREPAYMENTBYCARD: "Предоплата картой",
// 	CASH: "Наличные",
// 	REFUND: "Возврат",
// };

export function OrdersTable({ orders, onStatusUpdate }: OrdersTableProps) {
	const [updatingOrders, setUpdatingOrders] = useState<Set<number>>(
		new Set()
	);

	const handleStatusChange = async (orderId: number, newStatus: string) => {
		setUpdatingOrders((prev) => new Set(prev).add(orderId));

		try {
			if (onStatusUpdate) {
				await onStatusUpdate(orderId, newStatus);
				// toast({
				// 	title: "Статус обновлен",
				// 	description: `Заказ #${orderId} успешно обновлен`,
				// });
			}
		} catch (error) {
			// toast({
			// 	title: "Ошибка",
			// 	description: "Не удалось обновить статус заказа",
			// 	variant: "destructive",
			// });
		} finally {
			setUpdatingOrders((prev) => {
				const newSet = new Set(prev);
				newSet.delete(orderId);
				return newSet;
			});
		}
	};

	const getDateGroup = (date: Date) => {
		const now = new Date();
		const orderDate = new Date(date);
		const diffTime = now.getTime() - orderDate.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Сегодня";
		if (diffDays === 1) return "Вчера";

		return orderDate.toLocaleDateString("ru-RU", {
			day: "numeric",
			month: "long",
			year:
				orderDate.getFullYear() !== now.getFullYear()
					? "numeric"
					: undefined,
		});
	};

	const ordersWithSeparators = useMemo(() => {
		const groupedOrders = orders.reduce((groups, order) => {
			const dateGroup = getDateGroup(order.createdAt);
			if (!groups[dateGroup]) {
				groups[dateGroup] = [];
			}
			groups[dateGroup].push(order);
			return groups;
		}, {} as Record<string, typeof orders>);

		const sortedGroups = Object.entries(groupedOrders).sort(([a], [b]) => {
			if (a === "Сегодня") return -1;
			if (b === "Сегодня") return 1;
			if (a === "Вчера") return -1;
			if (b === "Вчера") return 1;
			return new Date(b).getTime() - new Date(a).getTime();
		});

		const result: Array<
			| { type: "separator"; date: string; count: number }
			| { type: "order"; order: (typeof orders)[0] }
		> = [];

		sortedGroups.forEach(([dateGroup, groupOrders]) => {
			result.push({
				type: "separator",
				date: dateGroup,
				count: groupOrders.length,
			});
			groupOrders
				.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() -
						new Date(a.createdAt).getTime()
				)
				.forEach((order) => {
					result.push({ type: "order", order });
				});
		});

		return result;
	}, [orders]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Package className="h-5 w-5" />
					Управление заказами
				</CardTitle>
				<CardDescription>
					Просматривайте и управляйте всеми заказами в системе
				</CardDescription>
			</CardHeader>
			<CardContent>
				{orders.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						Заказы не найдены
					</div>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">
										ID
									</TableHead>
									<TableHead>Клиент</TableHead>
									<TableHead>Товары</TableHead>
									<TableHead>Сумма</TableHead>
									<TableHead>Оплата</TableHead>
									<TableHead>Статус</TableHead>
									<TableHead>Время</TableHead>
									<TableHead className="text-right">
										Действия
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{ordersWithSeparators.map((item, index) => {
									if (item.type === "separator") {
										return (
											<TableRow
												key={`separator-${index}`}
												className="hover:bg-transparent"
											>
												<TableCell
													colSpan={8}
													className="p-0"
												>
													<div className="flex items-center gap-3 py-2 px-4 bg-muted/20">
														<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
															<Calendar className="h-4 w-4" />
															{item.date}
															<Badge
																variant="secondary"
																className="text-xs ml-1"
															>
																{item.count}
															</Badge>
														</div>
														<div className="h-px bg-border flex-1" />
													</div>
												</TableCell>
											</TableRow>
										);
									}

									const order = item.order;
									return (
										<TableRow key={order.id}>
											<TableCell className="font-medium">
												#{order.id}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<User className="h-4 w-4 text-muted-foreground" />
													<div>
														<div className="font-medium">
															{order.user
																.first_name ||
																"Без имени"}
														</div>
														<div className="text-sm text-muted-foreground">
															{order.user.phone ||
																`ID: ${order.userId}`}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="text-sm">
													{order.items.length}{" "}
													товар(ов)
												</div>
												<div className="text-xs text-muted-foreground">
													{order.items
														.slice(0, 2)
														.map(
															(item: any) =>
																item.product
																	.name
														)
														.join(", ")}
													{order.items.length > 2 &&
														"..."}
												</div>
											</TableCell>
											<TableCell className="font-medium">
												{formatPrice(order.totalAmount)}
											</TableCell>
											<TableCell>
												{order.paymentType ===
													PaymentType.PREPAYMENTBYCARD && (
													<CreditCard className="h-4 w-4 mr-1 text-blue-500" />
												)}
												{order.paymentType ===
													PaymentType.CASH && (
													<Banknote className="h-4 w-4 mr-1 text-green-500" />
												)}
												{order.paymentType ===
													PaymentType.REFUND && (
													<RotateCcw className="h-4 w-4 mr-1 text-red-500" />
												)}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<div
														className={`w-2 h-2 rounded-full ${
															order.status ===
															"PENDING"
																? "bg-yellow-500"
																: order.status ===
																  "CONFIRMED"
																? "bg-blue-500"
																: order.status ===
																  "DELIVERED"
																? "bg-green-500"
																: "bg-red-500"
														}`}
													/>
													<OrderStatusSelect
														currentStatus={
															order.status
														}
														orderId={order.id}
														onStatusChange={
															handleStatusChange
														}
														disabled={updatingOrders.has(
															order.id
														)}
													/>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1 text-sm text-muted-foreground">
													<Calendar className="h-3 w-3" />
													{formatDate(
														order.createdAt
													)}
												</div>
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="sm"
												>
													<Eye className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
