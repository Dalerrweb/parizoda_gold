import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductSection } from "@/components/custom/product-section";

import Banners from "@/components/custom/banners";
import { useGetCategoriesQuery } from "@/services/api";

export default function HomePage() {
	const [activeCategory, setActiveCategory] = useState("rings");
	const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	const { data, error } = useGetCategoriesQuery();

	const categories = data ?? [];

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

				{error ? (
					"Ошибка при получении категорий"
				) : (
					<div className="sticky top-0 z-10 bg-background pt-4 pb-2 px-4 border-b">
						<Tabs
							value={activeCategory}
							onValueChange={handleTabClick}
						>
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
				)}

				<div className="px-4">
					{/* Поиск и баннер */}

					{categories &&
						categories.map((category) => (
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
