import { Heart, Home, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartProvider";

interface BottomNavigationProps {
	className?: string;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
	const location = useLocation();
	const { cartLength } = useCart();

	const navItems = [
		{
			to: "/",
			icon: Home,
			label: "Главная",
		},
		{
			to: "/favorites",
			icon: Heart,
			label: "Избранное",
		},
		{
			to: "/cart",
			icon: ShoppingCart,
			label: "Корзина",
			badgeCount: cartLength,
		},
		{
			to: "/profile",
			icon: User,
			label: "Профиль",
		},
	];

	return (
		<nav
			className={cn(
				"fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-3",
				"safe-area-inset-bottom", // For devices with home indicator
				className
			)}
		>
			<div className="flex items-center justify-around px-2 py-2">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = location.pathname === item.to;

					return (
						<Link
							key={item.to}
							to={item.to}
							className={cn(
								"flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-lg transition-colors",
								"hover:bg-accent hover:text-accent-foreground",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								isActive && "text-primary bg-primary/10"
							)}
						>
							<div className="relative">
								<Icon
									className={cn(
										"h-5 w-5 mb-1",
										isActive
											? "text-primary"
											: "text-muted-foreground"
									)}
								/>
								{item.badgeCount && item.badgeCount > 0 ? (
									<span className="absolute text-white -top-2 -right-2 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center min-w-[16px] px-1">
										{item.badgeCount > 99
											? "99+"
											: item.badgeCount}
									</span>
								) : null}
							</div>
							<span
								className={cn(
									"text-xs font-medium truncate",
									isActive
										? "text-primary"
										: "text-muted-foreground"
								)}
							>
								{item.label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
