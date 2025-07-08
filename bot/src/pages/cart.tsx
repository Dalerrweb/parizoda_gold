import { useState } from "react";
import {
	Minus,
	Plus,
	MoreVertical,
	// AlertCircle,
	// Check,
	Heart,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/context/CartProvider";
import { ProductType } from "@/types";

// const mockCartData = [
// 	{
// 		productId: "ring-001",
// 		title: "Кольцо с бриллиантом",
// 		quantity: 1,
// 		image: "/placeholder.svg?height=80&width=80",
// 		deliveryDate: "12 июля",
// 		inStock: true,
// 		type: "single",
// 	},
// 	{
// 		productId: "set-002",
// 		title: "Подарочный набор: кольцо + серьги",
// 		quantity: 1,
// 		image: "/placeholder.svg?height=80&width=80",
// 		deliveryDate: "15 июля",
// 		inStock: true,
// 		type: "bundle",
// 		items: [
// 			{ title: "Кольцо из белого золота" },
// 			{ title: "Серьги с изумрудами" },
// 		],
// 	},
// 	{
// 		productId: "necklace-003",
// 		title: "Колье с жемчугом",
// 		quantity: 1,
// 		image: "/placeholder.svg?height=80&width=80",
// 		inStock: false,
// 		type: "single",
// 	},
// ];

export default function CartPage() {
	const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
	const { cart, increment, decrement } = useCart();

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 px-4 py-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Checkbox className="rounded-md" />
						<span className="text-sm font-medium">Выбрать все</span>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="text-purple-600"
					>
						Действия
					</Button>
				</div>
			</div>

			{/* Cart Items */}
			<div className="px-4 py-2 space-y-4">
				{cart.map((item) => (
					<div
						key={item.configKey}
						className="bg-white border border-gray-200 rounded-lg relative overflow-hidden"
					>
						{/* Action buttons behind the card */}
						<div className="absolute right-0 top-0 bottom-0 flex">
							<button className="bg-orange-500 hover:bg-orange-600 text-white px-6 flex items-center justify-center min-w-[120px] transition-colors duration-200">
								<Heart className="w-5 h-5 mr-2" />
							</button>
							<button className="bg-pink-500 hover:bg-pink-600 text-white px-6 flex items-center justify-center min-w-[120px] transition-colors duration-200">
								<Trash2 className="w-5 h-5 mr-2" />
							</button>
						</div>

						{/* Main card content that slides */}
						<div
							className={`bg-white p-4 transition-transform duration-300 ease-out relative z-10 ${
								activeMenuId === item.configKey
									? "-translate-x-60"
									: "translate-x-0"
							}`}
						>
							<div className="flex items-start space-x-3">
								<Checkbox className="mt-1 rounded-md" />

								<div className="flex-shrink-0">
									<img
										src={item?.image || "/placeholder.svg"}
										alt={item.title}
										className="rounded-lg object-cover size-[80px]"
									/>
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<h3 className="font-medium text-gray-900 mb-1">
												{item.title}
											</h3>

											{item.type === ProductType.BUNDLE &&
												item.items && (
													<div className="text-sm text-gray-600 mb-2">
														{item.items.map(
															(
																bundleItem,
																index
															) => (
																<div
																	key={index}
																>
																	•{" "}
																	{
																		bundleItem.title
																	}
																</div>
															)
														)}
													</div>
												)}
											<div className="text-sm text-gray-500">
												Бесплатный отказ при получении
											</div>
										</div>

										<Button
											variant="ghost"
											size="sm"
											className="text-gray-400"
											onClick={() =>
												setActiveMenuId(
													activeMenuId ===
														item.configKey
														? null
														: item.configKey
												)
											}
										>
											<MoreVertical className="w-4 h-4" />
										</Button>
									</div>

									<div className="flex items-center justify-between mt-4">
										<div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-3 py-2">
											<Button
												onClick={() =>
													decrement(item.configKey)
												}
												variant="ghost"
												size="sm"
												className="p-1 h-6 w-6"
											>
												<Minus className="w-4 h-4" />
											</Button>
											<span className="font-medium min-w-[20px] text-center">
												{item.quantity}
											</span>
											<Button
												onClick={() =>
													increment(item.configKey)
												}
												variant="ghost"
												size="sm"
												className="p-1 h-6 w-6"
											>
												<Plus className="w-4 h-4" />
											</Button>
										</div>

										<Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">
											Buy
										</Button>
									</div>
									{/* <div className="mt-4">
										<div className="flex items-center text-orange-600 text-sm mb-3">
											<Check className="w-4 h-4 mr-1" />
											<span>
												menen • Jewelry & Accessories
											</span>
										</div>
										<Button
											variant="outline"
											className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
										>
											View similar
										</Button>
									</div> */}
								</div>
							</div>
						</div>

						{/* Overlay to close menu when clicking outside */}
						{activeMenuId === item.configKey && (
							<div
								className="absolute inset-0 bg-transparent z-20"
								onClick={() => setActiveMenuId(null)}
							/>
						)}
					</div>
				))}
			</div>

			{/* Bottom spacing */}
			<div className="h-20" />
		</div>
	);
}
