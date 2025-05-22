import { Header } from "@/components/custom/header";
import ProfileView from "@/components/custom/profile-view";
import { SidebarNav } from "@/components/custom/sidebar-nav";
import { useState } from "react";

function getUser() {
	// Mock user data based on your model
	const user = {
		id: 1,
		telegramId: 123456789,
		username: "johndoe",
		firstName: "John",
		lastName: "Doe",
		createdAt: new Date("2023-01-15"),
		// Mock orders data
		orders: [
			{
				id: 101,
				status: "DELIVERED",
				totalAmount: 5999,
				items: [
					{ name: "Wireless Headphones", quantity: 1, price: 5999 },
				],
				createdAt: new Date("2023-05-20"),
			},
			{
				id: 102,
				status: "PROCESSING",
				totalAmount: 2499,
				items: [
					{ name: "Phone Case", quantity: 1, price: 1499 },
					{ name: "Screen Protector", quantity: 1, price: 1000 },
				],
				createdAt: new Date("2023-06-15"),
			},
			{
				id: 103,
				status: "CANCELLED",
				totalAmount: 8999,
				items: [{ name: "Smart Watch", quantity: 1, price: 8999 }],
				createdAt: new Date("2023-07-10"),
			},
		],
	};

	return user;
}

export default function ProfilePage() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const user = getUser();

	return (
		<>
			<Header onMenuClick={() => setSidebarOpen(true)} />
			<SidebarNav
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>
			<div className="container mx-auto px-4 pb-8">
				<ProfileView user={user} />
			</div>
		</>
	);
}
