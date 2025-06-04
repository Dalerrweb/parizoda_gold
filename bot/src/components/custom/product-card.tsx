import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ProductCardProps {
	id: number;
	name: string;
	description: string;
	price: number;
	images: any;
}

export function ProductCard({
	id,
	name,
	description,
	price,
	images,
}: ProductCardProps) {
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
				<CardContent className="p-2">
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
				<CardFooter className="p-2 pt-0">
					<p className="font-semibold text-sm">
						{price.toLocaleString("uz")} сум
					</p>
				</CardFooter>
			</Card>
		</Link>
	);
}
