import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { usePrice } from "@/context/PriceContext";
import { formatPrice } from "@/lib/utils";
import { Product, ProductType } from "@/types";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export function ProductCard({
	id,
	name,
	description,
	images,
	sizes,
	markup,
	type,
}: Product) {
	const { calculate } = usePrice();

	const price = useMemo(() => {
		return calculate({
			weight: sizes?.[0]?.weight || 0,
			markup: markup || 0,
		});
	}, []);

	return (
		<Link to={`/product/${id}`} className="block h-full">
			<Card className="h-full overflow-hidden transition-all hover:shadow-md border-0 shadow-sm">
				<div className="aspect-square overflow-hidden">
					<img
						src={images?.[0].url || "/placeholder.svg"}
						alt={name || "parizoda_gold"}
						className="h-full w-full object-cover transition-transform hover:scale-105"
					/>
				</div>
				<CardContent className="px-2">
					<h3
						className="font-medium text-sm line-clamp-1"
						title={name}
					>
						{name}
					</h3>
					<p className="text-xs text-muted-foreground line-clamp-1">
						{description}
					</p>
				</CardContent>
				{type !== ProductType.BUNDLE && (
					<CardFooter className="p-2 pt-0">
						<p className="font-semibold text-sm">
							{formatPrice(price)}
						</p>
					</CardFooter>
				)}
			</Card>
		</Link>
	);
}
