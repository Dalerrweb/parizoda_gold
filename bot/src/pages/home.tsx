import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductSection } from "@/components/custom/product-section";
import { Category } from "@/types";
import axios from "@/lib/axios";
import Banners from "@/components/custom/banners";

// export const products = {
// 	rings: [
// 		{
// 			id: 7,
// 			name: "Diamond Engagement Ring",
// 			description: "Ring 999 purity",
// 			price: "$3000",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 		{
// 			id: 8,
// 			name: "Gold Wedding Band",
// 			description: "Ring 999 purity",
// 			price: "$1200",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 		{
// 			id: 9,
// 			name: "Platinum Ring",
// 			description: "Ring 999 purity",
// 			price: "$2500",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 		{
// 			id: 12,
// 			name: "Silver Ring",
// 			description: "Ring 999 purity",
// 			price: "$800",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 		{
// 			id: 13,
// 			name: "Emerald Ring",
// 			description: "Ring 999 purity",
// 			price: "$1500",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 		{
// 			id: 14,
// 			name: "Ruby Ring",
// 			description: "Ring 999 purity",
// 			price: "$1700",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 	],
// 	earrings: [
// 		{
// 			id: 1,
// 			name: "Diamond Stud Earrings",
// 			description: "Earrings 999 purity",
// 			price: "$1000",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 		{
// 			id: 2,
// 			name: "Gold Hoop Earrings",
// 			description: "Earrings 999 purity",
// 			price: "$850",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 		{
// 			id: 3,
// 			name: "Pearl Drop Earrings",
// 			description: "Earrings 999 purity",
// 			price: "$1200",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 	],
// 	bracelets: [
// 		{
// 			id: 4,
// 			name: "Gold Chain Bracelet",
// 			description: "Bracelet 999 purity",
// 			price: "$1500",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 		{
// 			id: 5,
// 			name: "Diamond Tennis Bracelet",
// 			description: "Bracelet 999 purity",
// 			price: "$2000",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 		{
// 			id: 6,
// 			name: "Charm Bracelet",
// 			description: "Bracelet 999 purity",
// 			price: "$1300",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 	],
// 	necklaces: [
// 		{
// 			id: 10,
// 			name: "Diamond Pendant",
// 			description: "Necklace 999 purity",
// 			price: "$2200",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 		{
// 			id: 11,
// 			name: "Gold Chain",
// 			description: "Necklace 999 purity",
// 			price: "$1800",
// 			image: "/placeholder.svg?height=200&width=200",
// 		},
// 	],
// };

// const categories = [
// 	{ id: "rings", label: "Rings" },
// 	{ id: "earrings", label: "Earrings" },
// 	{ id: "bracelets", label: "Bracelet" },
// 	{ id: "necklaces", label: "Necklaces" },
// ];

export default function HomePage() {
	const [activeCategory, setActiveCategory] = useState("rings");
	const [categories, setCategories] = useState<Category[]>([]);
	const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

	const handleTabClick = (category: string) => {
		setActiveCategory(category);
		const section = sectionRefs.current[category];

		if (section) {
			const header = document.querySelector("header");
			const tabs = document.querySelector('[role="tablist"]');

			const headerHeight = header?.clientHeight || 0;
			const tabsHeight = tabs?.clientHeight || 0;
			const totalOffset = headerHeight + tabsHeight;

			section.scrollIntoView({ behavior: "smooth", block: "start" });

			// Ручная корректировка через асинхронный коллбэк
			setTimeout(() => {
				window.scrollBy(0, -totalOffset);
			}, 500);
		}
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const sectionId =
							entry.target.getAttribute("data-category");
						if (sectionId) setActiveCategory(sectionId);
					}
				});
			},
			{
				root: null,
				rootMargin: "-200px 0px -50% 0px",
				threshold: 0,
			}
		);

		Object.values(sectionRefs.current).forEach((section) => {
			if (section) observer.observe(section);
		});

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		async function fetchCategories() {
			try {
				const res = await axios.get("/categories");

				setCategories(res.data);
			} catch (e: any) {
				console.log(e.message);
				setCategories([]);
			}
		}

		fetchCategories();
	}, []);

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1 pb-8">
				<div className="pt-4 pb-2 px-4">
					<div className="relative mt-4">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Enter value" className="pl-9" />
					</div>

					<Banners />
				</div>

				<div className="sticky top-0 z-10 bg-background pt-4 pb-2 px-4 border-b">
					<Tabs value={activeCategory} onValueChange={handleTabClick}>
						<TabsList className="w-full h-auto justify-start overflow-auto">
							{categories.map((category) => (
								<TabsTrigger
									key={category.name}
									value={category.name}
									className="scroll-mt-8 cursor-pointer flex flex-col items-center justify-center"
								>
									<img
										className="size-14 object-cover rounded-md"
										src={category.imageUrl}
										alt=""
									/>
									<span className="truncate w-[8ch]">
										{category.name}
									</span>
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>

				<div className="px-4">
					{/* Поиск и баннер */}

					{categories.map((category) => (
						<div
							key={category.id}
							ref={(el) =>
								(sectionRefs.current[category.name] = el)
							}
							data-category={category.name}
							className="scroll-mt-[200px]"
						>
							<ProductSection
								title={category.name}
								viewAllHref={`/catalog/${category.name}`}
								categoryId={category.id}
							/>
						</div>
					))}
				</div>
			</main>
		</div>
	);
}
