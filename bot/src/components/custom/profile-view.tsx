import { useState } from "react";
import {
	ShoppingBag,
	Edit,
	Save,
	X,
	ChevronDown,
	ChevronUp,
	ExternalLink,
	ChevronLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import { formatDate, formatPrice } from "@/lib/utils";

const getStatusColor = (status: string) => {
	switch (status.toUpperCase()) {
		case "DELIVERED":
			return "bg-green-500";
		case "PROCESSING":
			return "bg-blue-500";
		case "CANCELLED":
			return "bg-red-500";
		case "PENDING":
			return "bg-yellow-500";
		default:
			return "bg-gray-500";
	}
};

export default function ProfileView({ user }: { user: User }) {
	const [isEditing, setIsEditing] = useState(false);
	const [userData, setUserData] = useState({
		username: user.username || "",
		first_name: user.first_name || "",
		last_name: user.last_name || "",
	});
	const navigate = useNavigate();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		// This would be replaced with your actual update logic
		console.log("Saving user data:", userData);
		setIsEditing(false);
		// Here you would typically call an API to update the user data
	};

	const handleCancel = () => {
		setUserData({
			username: user.username || "",
			first_name: user.first_name || "",
			last_name: user.last_name || "",
		});
		setIsEditing(false);
	};

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

	return (
		<div className="space-y-8">
			<Tabs defaultValue="profile" className="w-full">
				<div className="flex items-center justify-between py-4 border-b mb-6">
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => navigate(-1)}
							className="mr-2"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
						<h1 className="text-lg font-semibold truncate">
							My Profile
						</h1>
					</div>
					<TabsList>
						<TabsTrigger value="profile">Profile</TabsTrigger>
						<TabsTrigger value="orders">Orders</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="profile" className="space-y-6">
					<Card>
						<CardHeader className="flex flex-row items-center gap-4 pb-2">
							<Avatar className="h-16 w-16">
								<AvatarImage
									src={user.photo_url || "/placeholder.svg"}
									alt={user.username || "User"}
								/>
								<AvatarFallback className="text-lg">
									{getInitials()}
								</AvatarFallback>
							</Avatar>
							<div>
								<CardTitle className="text-2xl">
									{user.first_name && user.last_name
										? `${user.first_name} ${user.last_name}`
										: user.username || `User #${user.id}`}
								</CardTitle>
								<CardDescription>
									Member since {formatDate(user.createdAt)}
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="pt-6">
							{isEditing ? (
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<label
												htmlFor="username"
												className="text-sm font-medium"
											>
												Username
											</label>
											<Input
												id="username"
												name="username"
												value={userData.username}
												onChange={handleInputChange}
												placeholder="Username"
											/>
										</div>
										<div className="space-y-2">
											<label
												htmlFor="telegramId"
												className="text-sm font-medium"
											>
												Telegram ID
											</label>
											<Input
												id="telegramId"
												value={user.telegramId}
												disabled
												className="bg-muted"
											/>
										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<label
												htmlFor="firstName"
												className="text-sm font-medium"
											>
												First Name
											</label>
											<Input
												id="firstName"
												name="firstName"
												value={userData.first_name}
												onChange={handleInputChange}
												placeholder="First Name"
											/>
										</div>
										<div className="space-y-2">
											<label
												htmlFor="lastName"
												className="text-sm font-medium"
											>
												Last Name
											</label>
											<Input
												id="lastName"
												name="lastName"
												value={userData.last_name}
												onChange={handleInputChange}
												placeholder="Last Name"
											/>
										</div>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<p className="text-sm font-medium text-muted-foreground">
												Username
											</p>
											<p className="text-base">
												{user.username || "Not set"}
											</p>
										</div>
										<div>
											<p className="text-sm font-medium text-muted-foreground">
												Telegram ID
											</p>
											<p className="text-base">
												{user.telegramId}
											</p>
										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<p className="text-sm font-medium text-muted-foreground">
												First Name
											</p>
											<p className="text-base">
												{user.first_name || "Not set"}
											</p>
										</div>
										<div>
											<p className="text-sm font-medium text-muted-foreground">
												Last Name
											</p>
											<p className="text-base">
												{user.last_name || "Not set"}
											</p>
										</div>
									</div>
								</div>
							)}
						</CardContent>
						<CardFooter className="flex justify-end gap-2">
							{isEditing ? (
								<>
									<Button
										variant="outline"
										onClick={handleCancel}
									>
										<X className="mr-2 h-4 w-4" />
										Cancel
									</Button>
									<Button onClick={handleSave}>
										<Save className="mr-2 h-4 w-4" />
										Save Changes
									</Button>
								</>
							) : (
								<Button onClick={() => setIsEditing(true)}>
									<Edit className="mr-2 h-4 w-4" />
									Edit Profile
								</Button>
							)}
						</CardFooter>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-xl">
								Account Information
							</CardTitle>
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
								<p className="text-base">
									{formatDate(user.createdAt)}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Total Orders
								</p>
								<p className="text-base">
									{user.orders.length}
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="orders" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-xl">
								Order History
							</CardTitle>
							<CardDescription>
								You have placed {user.orders.length} order
								{user.orders.length !== 1 ? "s" : ""}.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{user.orders.length === 0 ? (
								<div className="text-center py-8">
									<ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
									<p className="mt-4 text-lg font-medium">
										No orders yet
									</p>
									<p className="text-muted-foreground">
										When you place an order, it will appear
										here.
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{user.orders.map((order) => (
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
																Order #
																{order.id}
															</p>
															<p className="text-sm text-muted-foreground">
																{formatDate(
																	order.createdAt
																)}
															</p>
														</div>
													</div>
													<div className="flex items-center gap-4">
														<p className="font-medium">
															{formatPrice(
																order.totalAmount
															)}
														</p>
														<ChevronDown className="h-5 w-5 text-muted-foreground collapsible-closed" />
														<ChevronUp className="h-5 w-5 text-muted-foreground collapsible-open" />
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
															{order.items.map(
																(
																	item: any,
																	index: any
																) => (
																	<div
																		key={
																			index
																		}
																		className="flex justify-between"
																	>
																		<p>
																			{
																				item.name
																			}{" "}
																			<span className="text-muted-foreground">
																				x
																				{
																					item.quantity
																				}
																			</span>
																		</p>
																		<p>
																			{formatPrice(
																				item.price
																			)}
																		</p>
																	</div>
																)
															)}
														</div>
													</div>
													<Separator />
													<div className="flex justify-between font-medium">
														<p>Total</p>
														<p>
															{formatPrice(
																order.totalAmount
															)}
														</p>
													</div>
													<div className="flex justify-end">
														<Button
															variant="outline"
															size="sm"
														>
															<ExternalLink className="mr-2 h-4 w-4" />
															View Details
														</Button>
													</div>
												</div>
											</CollapsibleContent>
										</Collapsible>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
