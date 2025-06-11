import { Heart, Home, ShoppingCart, User, History } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
	className?: string;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
	const location = useLocation();

	const navItems = [
		{
			to: "/",
			icon: Home,
			label: "Home",
		},
		{
			to: "/history",
			icon: History,
			label: "History",
		},
		{
			to: "/favorites",
			icon: Heart,
			label: "Favorites",
		},
		{
			to: "/cart",
			icon: ShoppingCart,
			label: "Cart",
		},
		{
			to: "/profile",
			icon: User,
			label: "Profile",
		},
	];

	return (
		<nav
			className={cn(
				"fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border",
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
							<Icon
								className={cn(
									"h-5 w-5 mb-1",
									isActive
										? "text-primary"
										: "text-muted-foreground"
								)}
							/>
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
