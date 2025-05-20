import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
	onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
	return (
		<header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4">
			<Button
				variant="ghost"
				size="icon"
				onClick={onMenuClick}
				className="mr-2"
			>
				<Menu className="h-5 w-5" />
				<span className="sr-only">Open menu</span>
			</Button>
			<h1 className="text-xl font-bold">Parizoda Gold</h1>
			<div className="w-9"></div> {/* Spacer for alignment */}
		</header>
	);
}
