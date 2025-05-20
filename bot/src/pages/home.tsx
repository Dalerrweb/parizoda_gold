import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/custom/header";
import { SidebarNav } from "@/components/custom/sidebar-nav";
import { ProductSection } from "@/components/custom/product-section";

const products = {
	rings: [
		{
			id: 7,
			name: "Diamond Engagement Ring",
			description: "Ring 999 purity",
			price: "$3000",
			image: "/placeholder.svg?height=200&width=200",
		},
		{
			id: 8,
			name: "Gold Wedding Band",
			description: "Ring 999 purity",
			price: "$1200",
			image: "/placeholder.svg?height=200&width=200",
		},
		{
			id: 9,
			name: "Platinum Ring",
			description: "Ring 999 purity",
			price: "$2500",
			image: "/placeholder.svg?height=200&width=200",
		},
	],
	earrings: [
		{
			id: 1,
			name: "Diamond Stud Earrings",
			description: "Earrings 999 purity",
			price: "$1000",
			image: "/placeholder.svg?height=200&width=200",
		},
		{
			id: 2,
			name: "Gold Hoop Earrings",
			description: "Earrings 999 purity",
			price: "$850",
			image: "/placeholder.svg?height=200&width=200",
		},
		{
			id: 3,
			name: "Pearl Drop Earrings",
			description: "Earrings 999 purity",
			price: "$1200",
			image: "/placeholder.svg?height=200&width=200",
		},
	],
	bracelets: [
		{
			id: 4,
			name: "Gold Chain Bracelet",
			description: "Bracelet 999 purity",
			price: "$1500",
			image: "/placeholder.svg?height=200&width=200",
		},
		{
			id: 5,
			name: "Diamond Tennis Bracelet",
			description: "Bracelet 999 purity",
			price: "$2000",
			image: "/placeholder.svg?height=200&width=200",
		},
		{
			id: 6,
			name: "Charm Bracelet",
			description: "Bracelet 999 purity",
			price: "$1300",
			image: "/placeholder.svg?height=200&width=200",
		},
	],
	necklaces: [
		{
			id: 10,
			name: "Diamond Pendant",
			description: "Necklace 999 purity",
			price: "$2200",
			image: "/placeholder.svg?height=200&width=200",
		},
		{
			id: 11,
			name: "Gold Chain",
			description: "Necklace 999 purity",
			price: "$1800",
			image: "/placeholder.svg?height=200&width=200",
		},
	],
};

// Categories in the order they should appear
const categories = [
	{ id: "rings", label: "Rings" },
	{ id: "earrings", label: "Earrings" },
	{ id: "bracelets", label: "Bracelet" },
	{ id: "necklaces", label: "Necklaces" },
	{ id: "more", label: "More" },
];

export default function HomePage() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState("rings");

	// Create refs for each product section
	const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

	// Handle tab click
	const handleTabClick = (category: string) => {
		setActiveCategory(category);

		// Scroll to the section
		if (sectionRefs.current[category]) {
			// Get the header height to offset the scroll position
			const headerHeight = 64; // 16 * 4 = 64px (h-16)
			const tabsHeight = 48; // Approximate height of the tabs
			const totalOffset = headerHeight + tabsHeight;

			const sectionTop =
				sectionRefs.current[category]!.getBoundingClientRect().top;
			const offsetPosition =
				sectionTop + window.pageYOffset - totalOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	};

	// Set up intersection observer to update active category on scroll
	useEffect(() => {
		const observerOptions = {
			root: null,
			rootMargin: "-100px 0px -70% 0px", // Adjust rootMargin to trigger at appropriate scroll position
			threshold: 0,
		};

		const observerCallback: IntersectionObserverCallback = (entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Extract category ID from the section's data attribute
					const sectionId =
						entry.target.getAttribute("data-category");
					if (sectionId) {
						setActiveCategory(sectionId);
					}
				}
			});
		};

		const observer = new IntersectionObserver(
			observerCallback,
			observerOptions
		);

		// Observe all section refs
		Object.entries(sectionRefs.current).forEach(([_, ref]) => {
			if (ref) observer.observe(ref);
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<div className="flex min-h-screen flex-col">
			<Header onMenuClick={() => setSidebarOpen(true)} />
			<SidebarNav
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>

			<main className="flex-1 pb-8">
				<div className="sticky top-16 z-10 bg-background pt-4 pb-2 px-4 border-b">
					<Tabs value={activeCategory} onValueChange={handleTabClick}>
						<TabsList className="w-full justify-start overflow-auto">
							{categories.map((category) => (
								<TabsTrigger
									key={category.id}
									value={category.id}
								>
									{category.label}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>

				<div className="px-4">
					<div className="relative mt-4">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Enter value" className="pl-9" />
					</div>

					<div className="mt-6">
						<div className="rounded-lg overflow-hidden">
							<img
								src="/placeholder.svg?height=200&width=800"
								alt="Banner"
								className="w-full h-40 object-cover"
							/>
						</div>
					</div>

					{/* Product sections with refs */}
					<div
						ref={(ref) => (sectionRefs.current.rings = ref)}
						data-category="rings"
					>
						<ProductSection
							title="Rings"
							products={products.rings}
							viewAllHref="/catalog/rings"
						/>
					</div>

					<div
						ref={(ref) => (sectionRefs.current.earrings = ref)}
						data-category="earrings"
					>
						<ProductSection
							title="Earrings"
							products={products.earrings}
							viewAllHref="/catalog/earrings"
						/>
					</div>

					<div
						ref={(ref) => (sectionRefs.current.bracelets = ref)}
						data-category="bracelets"
					>
						<ProductSection
							title="Bracelets"
							products={products.bracelets}
							viewAllHref="/catalog/bracelets"
						/>
					</div>

					<div
						ref={(ref) => (sectionRefs.current.necklaces = ref)}
						data-category="necklaces"
					>
						<ProductSection
							title="Necklaces"
							products={products.necklaces}
							viewAllHref="/catalog/necklaces"
						/>
					</div>
				</div>
			</main>
		</div>
	);
}
