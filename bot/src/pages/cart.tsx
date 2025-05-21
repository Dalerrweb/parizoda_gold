import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/custom/header";
import { useNavigate } from "react-router-dom";

import { SidebarNav } from "@/components/custom/sidebar-nav";

export default function CartPage() {
	const navigate = useNavigate();

	const [sidebarOpen, setSidebarOpen] = useState(false);

	// const handleCheckout = () => {
	// 	navigate("/");
	// };

	return (
		<div className="flex min-h-screen flex-col">
			<Header onMenuClick={() => setSidebarOpen(true)} />
			<SidebarNav
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>

			<main className="flex-1 pb-8">
				<div className="flex items-center p-4 border-b">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate(-1)}
						className="mr-2"
					>
						<ChevronLeft className="h-5 w-5" />
					</Button>
					<h1 className="text-lg font-semibold">Shopping Cart</h1>
				</div>
			</main>
		</div>
	);
}
