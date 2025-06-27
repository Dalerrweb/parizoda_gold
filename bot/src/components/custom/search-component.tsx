import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/services/api";
import { Product } from "@/types";

interface SearchDropdownProps {
	placeholder?: string;
}

const useDebounce = (value: string, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

export function SearchDropdown({
	placeholder = "Search products...",
}: SearchDropdownProps) {
	const [inputText, setInputText] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const debouncedSearchText = useDebounce(inputText.trim(), 500);

	const { data, isFetching } = useGetProductsQuery(
		{
			search: debouncedSearchText,
			limit: 5,
		},
		{ skip: debouncedSearchText.length === 0 }
	);

	useEffect(() => {
		setIsOpen(inputText.trim().length > 0);
	}, [inputText]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleClear = useCallback(() => {
		setInputText("");
		setIsOpen(false);
	}, []);

	const showLoading =
		(isFetching || debouncedSearchText !== inputText.trim()) && isOpen;

	return (
		<div className="relative">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					ref={inputRef}
					type="text"
					placeholder={placeholder}
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					className="pl-9"
					autoComplete="off"
				/>
				{inputText && (
					<button
						type="button"
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						onClick={handleClear}
					>
						✕
					</button>
				)}
			</div>

			{isOpen && (
				<Card
					ref={dropdownRef}
					className="absolute top-full left-0 right-0 mt-1 max-h-80 overflow-y-auto z-50 shadow-lg"
				>
					{showLoading ? (
						<div className="flex items-center justify-center py-4">
							<Loader2 className="h-4 w-4 animate-spin mr-2" />
							<span className="text-sm text-muted-foreground">
								Поиск...
							</span>
						</div>
					) : data?.products?.length === 0 ? (
						<div className="py-4 px-4 text-center text-sm text-muted-foreground">
							Ничего не найдено по запросу: "{inputText}"
						</div>
					) : (
						<div className="py-2">
							{data?.products?.map((product: Product) => (
								<Link
									key={product.id}
									to={`/products/${product.id}`}
									className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors"
									onClick={() => setIsOpen(false)}
								>
									<div className="flex-1">
										<div className="font-medium">
											{product.name}
										</div>
										<div className="text-sm text-muted-foreground">
											{product.category.name}
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</Card>
			)}
		</div>
	);
}
