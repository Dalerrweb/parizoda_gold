import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Favs() {
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1 pb-8">
				<div className="flex items-center p-4 border-b">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate(-1)}
						className="mr-2"
					>
						<ChevronLeft className="h-5 w-5" />
					</Button>
					<h1 className="text-lg font-semibold">Понравившиеся</h1>
				</div>
			</main>
		</div>
	);
}
