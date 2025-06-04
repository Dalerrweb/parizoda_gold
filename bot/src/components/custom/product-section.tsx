import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import axios from "@/lib/axios";

const scrollbarHideClass =
	"scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

// interface Product {
// 	id: number;
// 	name: string;
// 	description: string;
// 	price: string;
// 	image: string;
// }

// interface ProductSectionProps {
// 	title: string;
// 	products: Product[];
// 	viewAllHref: string;
// }

interface ProductSectionProps {
	categoryId: number;
	title: string;
	viewAllHref: string;
}

export function ProductSection({
	title,
	viewAllHref,
	categoryId,
}: ProductSectionProps) {
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		async function fetchProducts() {
			try {
				const res = await axios.get(
					"/products?categoryId=" + categoryId
				);
				setProducts(res.data.products);
			} catch (e: any) {
				console.log(e.message);
				setProducts([]);
			}
		}

		fetchProducts();
	}, []);

	return (
		<section className="mt-8">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold">{title}</h2>
				<Link
					to={viewAllHref}
					className="flex items-center text-sm font-medium text-primary"
				>
					View all
					<ChevronRight className="h-4 w-4 ml-1" />
				</Link>
			</div>

			<div
				className={cn(
					"flex overflow-x-auto gap-3 pb-4 snap-x -mx-4 px-4",
					scrollbarHideClass
				)}
			>
				{products.map((product) => (
					<div key={product.id} className="flex-none w-[140px]">
						<ProductCard {...product} />
					</div>
				))}
			</div>
		</section>
	);
}
