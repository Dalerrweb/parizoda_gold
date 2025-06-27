import { ProductSize } from "@/types";
import { Button } from "../ui/button";

export default function SizeSelector({
	sizes,
	selectedSize,
	onSelectSize,
}: {
	sizes: ProductSize[];
	selectedSize: any;
	onSelectSize: (size: any) => void;
}) {
	return (
		<div className="flex flex-wrap gap-2">
			{sizes.map((size) => (
				<Button
					key={size.id}
					variant={
						selectedSize.id === size.id ? "default" : "outline"
					}
					size="sm"
					onClick={() => onSelectSize(size)}
					disabled={size.quantity === 0}
				>
					{size.size}
				</Button>
			))}
		</div>
	);
}
