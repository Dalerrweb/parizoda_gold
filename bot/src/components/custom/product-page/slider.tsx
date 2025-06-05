import React, { useState } from "react";
import { Product } from "../product-details";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface sliderProps {
	product: Product;
}

const Slider: React.FC<sliderProps> = ({ product }) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const nextImage = (): void => {
		const newIndex = (currentImageIndex + 1) % product.images.length;
		setCurrentImageIndex(newIndex);
		// onImageChange?.(newIndex);
	};

	const prevImage = (): void => {
		const newIndex =
			(currentImageIndex - 1 + product.images.length) %
			product.images.length;
		setCurrentImageIndex(newIndex);
		// onImageChange?.(newIndex);
	};

	const handleImageSelect = (index: number): void => {
		setCurrentImageIndex(index);
		// onImageChange?.(index);
	};

	return (
		<div className="space-y-6">
			<div className="relative aspect-square overflow-hidden rounded-lg">
				{product.images.length > 0 ? (
					<>
						<div className="relative h-full w-full">
							{product.images.map((image, index) => (
								<div
									key={image.id}
									className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
										index === currentImageIndex
											? "opacity-100"
											: "opacity-0"
									}`}
								>
									<img
										src={image.url || "/placeholder.svg"}
										alt={
											image.alt ||
											`${product.name} - Image ${
												index + 1
											}`
										}
										className="object-cover w-full h-full"
									/>
								</div>
							))}
						</div>
						{product.images.length > 1 && (
							<>
								<button
									className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-sm hover:bg-white/90 transition-colors"
									onClick={prevImage}
									aria-label="Previous image"
								>
									<ChevronLeft className="h-5 w-5 text-gray-700" />
								</button>
								<button
									className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-sm hover:bg-white/90 transition-colors"
									onClick={nextImage}
									aria-label="Next image"
								>
									<ChevronRight className="h-5 w-5 text-gray-700" />
								</button>
							</>
						)}
					</>
				) : (
					<div className="flex h-full items-center justify-center bg-secondary/20">
						<p className="text-muted-foreground">
							No image available
						</p>
					</div>
				)}
			</div>

			{product.images.length > 1 && (
				<>
					{/* Slide indicators */}
					<div className="flex justify-center space-x-2 mt-4">
						{product.images.map((_, index) => (
							<button
								key={index}
								onClick={() => handleImageSelect(index)}
								className={`h-1.5 rounded-full transition-all ${
									index === currentImageIndex
										? "w-6 bg-primary"
										: "w-2 bg-gray-300"
								}`}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>

					{/* Thumbnails */}
					<div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
						{product.images.map((image, index) => (
							<button
								key={image.id}
								className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md transition-all ${
									index === currentImageIndex
										? "ring-2 ring-primary scale-105"
										: "opacity-70 hover:opacity-100"
								}`}
								onClick={() => handleImageSelect(index)}
							>
								<img
									src={image.url || "/placeholder.svg"}
									alt={
										image.alt ||
										`${product.name} thumbnail ${index + 1}`
									}
									className="object-cover w-full h-full"
								/>
							</button>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default Slider;
