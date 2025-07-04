"use client";

import { useGetBannersQuery } from "@/services/api";
import type React from "react";
import { useEffect, useState, useRef } from "react";

type BannersProps = {};

const Banners: React.FC<BannersProps> = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const { data, error, isLoading: loading } = useGetBannersQuery();

	const banners = data ?? [];

	// Auto-scroll effect
	useEffect(() => {
		if (banners.length > 1 && scrollContainerRef.current) {
			const id = setInterval(() => {
				setCurrentIndex((prevIndex) => {
					const nextIndex =
						prevIndex === banners.length - 1 ? 0 : prevIndex + 1;

					// Scroll to the next banner
					if (scrollContainerRef.current) {
						const bannerWidth =
							scrollContainerRef.current.scrollWidth /
							banners.length;
						scrollContainerRef.current.scrollTo({
							left: nextIndex * bannerWidth,
							behavior: "smooth",
						});
					}

					return nextIndex;
				});
			}, 4000); // Change image every 4 seconds

			setIntervalId(id);

			return () => {
				if (id) clearInterval(id);
			};
		}
	}, [banners?.length]);

	// Cleanup interval on unmount
	useEffect(() => {
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [intervalId]);

	const handleScroll = () => {
		if (scrollContainerRef.current && banners.length > 0) {
			const scrollLeft = scrollContainerRef.current.scrollLeft;
			const bannerWidth =
				scrollContainerRef.current.scrollWidth / banners.length;
			const newIndex = Math.round(scrollLeft / bannerWidth);

			if (newIndex !== currentIndex) {
				setCurrentIndex(newIndex);

				// Reset interval when user manually scrolls
				if (intervalId) {
					clearInterval(intervalId);
					const id = setInterval(() => {
						setCurrentIndex((prevIndex) => {
							const nextIndex =
								prevIndex === banners.length - 1
									? 0
									: prevIndex + 1;

							if (scrollContainerRef.current) {
								const bannerWidth =
									scrollContainerRef.current.scrollWidth /
									banners.length;
								scrollContainerRef.current.scrollTo({
									left: nextIndex * bannerWidth,
									behavior: "smooth",
								});
							}

							return nextIndex;
						});
					}, 4000);
					setIntervalId(id);
				}
			}
		}
	};

	const pauseAutoScroll = () => {
		if (intervalId) clearInterval(intervalId);
	};

	const resumeAutoScroll = () => {
		if (banners.length > 1) {
			const id = setInterval(() => {
				setCurrentIndex((prevIndex) => {
					const nextIndex =
						prevIndex === banners.length - 1 ? 0 : prevIndex + 1;

					if (scrollContainerRef.current) {
						const bannerWidth =
							scrollContainerRef.current.scrollWidth /
							banners.length;
						scrollContainerRef.current.scrollTo({
							left: nextIndex * bannerWidth,
							behavior: "smooth",
						});
					}

					return nextIndex;
				});
			}, 4000);
			setIntervalId(id);
		}
	};

	if (loading) {
		return (
			<div className="mt-6">
				<div className="rounded-lg overflow-hidden bg-gray-200 animate-pulse">
					<div className="w-full h-40 md:h-60 lg:h-80"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="mt-6">
				<div className="rounded-lg border border-red-200 bg-red-50 p-4">
					<p className="text-red-600 text-center">
						Что то пошло не так!
					</p>
				</div>
			</div>
		);
	}

	if (banners.length === 0) {
		return (
			<div className="mt-6">
				<div className="rounded-lg border border-gray-200 bg-gray-50 p-8">
					<p className="text-gray-500 text-center">
						No banners available
					</p>
				</div>
			</div>
		);
	}

	if (banners.length === 1) {
		return (
			<div className="mt-6">
				<div className="rounded-lg overflow-hidden shadow-lg relative">
					<img
						src={banners[0].imageUrl || "/placeholder.svg"}
						alt={banners[0].title || "Banner"}
						className="w-full h-40 md:h-60 lg:h-80 object-cover"
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							target.src =
								"/placeholder.svg?height=200&width=800";
						}}
					/>
					{banners[0].title && (
						<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
							{banners[0].title && (
								<h3 className="text-white text-lg font-semibold">
									{banners[0].title}
								</h3>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="mt-6">
			{/* Scrollable Banner Container */}
			<div
				className="rounded-lg overflow-hidden shadow-lg"
				onMouseEnter={pauseAutoScroll}
				onMouseLeave={resumeAutoScroll}
			>
				<div
					ref={scrollContainerRef}
					className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory h-40 md:h-60 lg:h-80"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					onScroll={handleScroll}
				>
					{banners.map((banner, index) => (
						<div
							key={banner.id}
							className="relative flex-shrink-0 w-full snap-center"
						>
							<img
								src={banner.imageUrl || "/placeholder.svg"}
								alt={banner.title || `Banner ${index + 1}`}
								className="w-full h-full object-cover"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src =
										"/placeholder.svg?height=200&width=800";
								}}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Banners;
