"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface UZSPriceInputProps {
	value?: string;
	onChange?: (value: string, numericValue: number) => void;
	placeholder?: string;
	className?: string;
}

export default function UZSPriceInput({
	value = "",
	onChange,
	placeholder = "0",
	className = "",
}: UZSPriceInputProps) {
	const [displayValue, setDisplayValue] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const cursorRef = useRef(0);

	// Memoized formatting function
	const formatToUZS = useCallback((num: number): string => {
		return new Intl.NumberFormat("en-US").format(Math.floor(num));
	}, []);

	// Parse display value to get numeric value
	const parseNumericValue = useCallback((str: string): number => {
		const cleaned = str.replace(/\D/g, "");
		return Number.parseInt(cleaned) || 0;
	}, []);

	// Handle input change with formatting
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		const cursorPos = e.target.selectionStart || 0;

		// Remove all non-digit characters
		const numericString = inputValue.replace(/\D/g, "");
		const numericValue = Number.parseInt(numericString) || 0;
		const formattedValue = numericString ? formatToUZS(numericValue) : "";

		// Update display value and cursor position
		setDisplayValue(formattedValue);
		cursorRef.current = cursorPos;

		// Propagate changes to parent
		onChange?.(formattedValue, numericValue);
	};

	// Handle key down for special cases
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// Allow: backspace, delete, tab, escape, enter, navigation keys, and shortcuts
		if (
			[8, 9, 27, 13, 46].includes(e.keyCode) ||
			(e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) ||
			(e.keyCode >= 35 && e.keyCode <= 39)
		) {
			return;
		}

		// Prevent non-numeric input
		if (
			(e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
			(e.keyCode < 96 || e.keyCode > 105)
		) {
			e.preventDefault();
		}
	};

	// Set cursor position after formatting
	useEffect(() => {
		if (inputRef.current && isFocused) {
			const newPosition = calculateCursorPosition(
				displayValue,
				cursorRef.current
			);
			inputRef.current.setSelectionRange(newPosition, newPosition);
		}
	}, [displayValue, isFocused]);

	// Synchronize with parent value when not focused
	useEffect(() => {
		if (!isFocused) {
			const numericValue = parseNumericValue(value);
			const formatted = value ? formatToUZS(numericValue) : "";
			setDisplayValue(formatted);
		}
	}, [value, isFocused, formatToUZS, parseNumericValue]);

	// Calculate new cursor position after formatting changes
	const calculateCursorPosition = (newValue: string, oldPosition: number) => {
		const valueBeforeChange = inputRef.current?.value || "";
		const prefix = getCommonPrefix(valueBeforeChange, newValue);

		if (oldPosition <= prefix.length) {
			return oldPosition;
		}

		const addedChars = newValue.slice(prefix.length).replace(/\d/g, "");
		const removedChars = valueBeforeChange
			.slice(prefix.length)
			.replace(/\d/g, "");
		const netChange = addedChars.length - removedChars.length;

		return Math.max(
			prefix.length,
			Math.min(newValue.length, oldPosition + netChange)
		);
	};

	// Find common prefix between two strings
	const getCommonPrefix = (a: string, b: string): string => {
		let i = 0;
		while (i < a.length && i < b.length && a[i] === b[i]) i++;
		return a.substring(0, i);
	};

	return (
		<input
			ref={inputRef}
			type="text"
			inputMode="numeric"
			value={displayValue}
			onChange={handleInputChange}
			onKeyDown={handleKeyDown}
			onFocus={() => setIsFocused(true)}
			onBlur={() => setIsFocused(false)}
			placeholder={placeholder}
			className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
		/>
	);
}
