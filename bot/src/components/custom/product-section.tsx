import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

const scrollbarHideClass =
	"scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

interface Product {
	id: number;
	name: string;
	description: string;
	price: string;
	image: string;
}

interface ProductSectionProps {
	title: string;
	products: Product[];
	viewAllHref: string;
}

interface ProductSectionProps {
	title: string;
	products: Product[];
	viewAllHref: string;
}

export function ProductSection({
	title,
	products,
	viewAllHref,
}: ProductSectionProps) {
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
