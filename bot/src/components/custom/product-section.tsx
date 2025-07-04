import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";
import { useGetProductsQuery } from "@/services/api";

const scrollbarHideClass =
	"scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

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
	const {
		data: products,
		error,
		isLoading,
	} = useGetProductsQuery({ categoryId, limit: 5 });

	function RenderProducts() {
		if (!products || products.products.length === 0)
			return "Тут пока что пусто";

		return products.products.map((product) => (
			<div key={product.id} className="flex-none w-[170px]">
				<ProductCard {...product} />
			</div>
		));
	}

	return (
		<section className="mt-8">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold">{title}</h2>
				<Link
					to={viewAllHref}
					state={{ title }}
					className="flex items-center text-sm font-medium text-primary"
				>
					Посмотреть все
					<ChevronRight className="h-4 w-4 ml-1" />
				</Link>
			</div>

			<div
				className={cn(
					"flex overflow-x-auto gap-4 pb-4 snap-x -mx-4 px-4",
					scrollbarHideClass
				)}
			>
				{error &&
					"Видимо что то пошло не так! перезапустите приложение"}
				{isLoading ? "loading..." : RenderProducts()}
			</div>
		</section>
	);
}
