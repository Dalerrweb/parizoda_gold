import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartProvider";
import { Product } from "@/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import React from "react";

interface cartFooterProps {
	product: Product;
}

const CartFooter: React.FC<cartFooterProps> = ({ product }) => {
	const { cart, cartLength } = useCart();
	const isAlreadyInCart = cart.find((elem) => elem.id === product.id);

	return (
		<div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
			{/* Buy Now Button */}
			<Button
				className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
				size="lg"
			>
				Buy Now
			</Button>

			{/* Add to Cart / Counter */}
			{isAlreadyInCart ? (
				<div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1 min-w-[120px]">
					<Button
						variant="ghost"
						size="sm"
						className="h-10 w-10 rounded-md hover:bg-gray-200 transition-colors duration-200"
					>
						<Minus className="h-4 w-4" />
					</Button>

					<div className="flex items-center justify-center flex-1 px-2">
						<span className="font-semibold text-lg">
							{cartLength}
						</span>
					</div>

					<Button
						variant="ghost"
						size="sm"
						className="h-10 w-10 rounded-md hover:bg-gray-200 transition-colors duration-200"
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			) : (
				<Button
					variant="outline"
					className="flex-1 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 bg-transparent"
					size="lg"
				>
					<ShoppingCart className="h-5 w-5" />
					Add to Cart
				</Button>
			)}
		</div>
	);
};

export default CartFooter;
