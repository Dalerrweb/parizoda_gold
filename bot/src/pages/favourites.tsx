import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLikes } from "@/context/FavProvider";
import { ProductCard } from "@/components/custom/product-card";

export default function Favs() {
	const navigate = useNavigate();
	const { favs } = useLikes();

	return (
		<div className="flex min-h-screen flex-col">
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
					<h1 className="text-lg font-semibold">Понравившиеся</h1>
				</div>
				<div className="p-4">
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
						{favs.map((product) => (
							<ProductCard key={product.id} {...product} />
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
