"use client";

import type React from "react";

import { useState } from "react";
import UZSPriceInput from "@/components/custom/uzs-input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

type Props = {
	initialPrice: number;
	handleUpdatePrice: (newPrice: bigint) => Promise<void>;
};

export default function GoldPriceEditor({
	initialPrice,
	handleUpdatePrice,
}: Props) {
	const [price, setPrice] = useState(initialPrice.toString());
	const [numericValue, setNumericValue] = useState(initialPrice);
	const [loading, setLoading] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [confirmationText, setConfirmationText] = useState("");
	const [confirmationError, setConfirmationError] = useState("");

	const CONFIRMATION_PHRASE = "update price";

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setShowConfirmModal(true);
		setConfirmationText("");
		setConfirmationError("");
	}

	async function handleConfirmUpdate() {
		if (confirmationText.toLowerCase().trim() !== CONFIRMATION_PHRASE) {
			setConfirmationError(
				`Пожалуйста, введите "${CONFIRMATION_PHRASE}" для подтверждения`
			);
			return;
		}

		setLoading(true);
		setConfirmationError("");

		try {
			await handleUpdatePrice(BigInt(numericValue));
			setShowConfirmModal(false);
			alert("Цена обновлена");
		} catch (error) {
			alert("Ошибка обновления");
		} finally {
			setLoading(false);
		}
	}

	function handleCancelConfirmation() {
		setShowConfirmModal(false);
		setConfirmationText("");
		setConfirmationError("");
	}

	return (
		<>
			<form onSubmit={handleSubmit} className="space-y-4">
				<UZSPriceInput
					value={price}
					onChange={(formatted, numeric) => {
						setPrice(formatted);
						setNumericValue(numeric);
					}}
					placeholder="Введите цену"
				/>
				<button
					type="submit"
					disabled={loading}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? "Обновление..." : "Обновить цену"}
				</button>
			</form>

			<Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-amber-500" />
							Подтверждение обновления цены
						</DialogTitle>
						<DialogDescription>
							Вы собираетесь обновить цену золота на{" "}
							<strong>{price || "0"} UZS</strong>. Это действие
							повлияет на все расчеты в системе.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div className="bg-amber-50 border border-amber-200 rounded-md p-3">
							<p className="text-sm text-amber-800">
								Для подтверждения введите:{" "}
								<code className="bg-amber-100 px-1 rounded">
									{CONFIRMATION_PHRASE}
								</code>
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmation">Подтверждение</Label>
							<Input
								id="confirmation"
								value={confirmationText}
								onChange={(e) => {
									setConfirmationText(e.target.value);
									setConfirmationError("");
								}}
								placeholder={CONFIRMATION_PHRASE}
								className={
									confirmationError ? "border-red-500" : ""
								}
							/>
							{confirmationError && (
								<p className="text-sm text-red-600">
									{confirmationError}
								</p>
							)}
						</div>
					</div>

					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							onClick={handleCancelConfirmation}
							disabled={loading}
						>
							Отмена
						</Button>
						<Button
							onClick={handleConfirmUpdate}
							disabled={loading}
							className="bg-red-600 hover:bg-red-700"
						>
							{loading
								? "Обновление..."
								: "Подтвердить обновление"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
