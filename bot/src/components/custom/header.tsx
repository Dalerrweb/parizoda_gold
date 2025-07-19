import { usePrice } from "@/context/PriceContext";
import { formatPrice } from "@/lib/utils";

export function Header() {
	const { AuPrice } = usePrice();

	function PriceView() {
		if (!AuPrice) {
			return <span className="ml-1">Loading...</span>;
		}
		return (
			<span className="ml-1">
				{formatPrice(Number(AuPrice?.pricePerGram))}
			</span>
		);
	}

	return (
		<header className="sticky top-0 z-10 flex h-10 items-center justify-between border-b bg-background px-2">
			<div className="flex items-center text-start text-md font-medium text-muted-foreground mb-2 px-2 ">
				<span>Цена за грамм золота: </span>
				<PriceView />

				{/* Online indicator */}
				<span className="ml-3 flex items-center">
					<span
						className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"
						title="Online"
					></span>
				</span>
			</div>
		</header>
	);
}
