import { Header } from "@/components/custom/header";
import { ProductCard } from "@/components/custom/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { products } from "./home";

interface catalogProps {}

const Catalog: React.FC<catalogProps> = () => {
	const [_, setSidebarOpen] = useState(false);
	const { category } = useParams();
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen flex-col">
			<Header onMenuClick={() => setSidebarOpen(true)} />
			<main>
				<div className="flex items-center p-4 border-b">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate(-1)}
						className="mr-2"
					>
						<ChevronLeft className="h-5 w-5" />
					</Button>
					<h1 className="text-lg font-semibold">
						{category || "All Products"}
					</h1>
				</div>
				<div className="p-4">
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
						{products.rings.map((product) => (
							<ProductCard key={product.id} {...product} />
						))}
					</div>
				</div>
			</main>
		</div>
	);
};

export default Catalog;
