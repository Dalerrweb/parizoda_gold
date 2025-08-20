"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Banknote, ShieldAlert, PencilLine } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@/context/UserProvider";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";

const isValidPhone = (v: string) => /^\+?998\d{9}$/.test(v.replace(/\D/g, ""));

type ProfileForm = {
	first_name: string;
	last_name: string;
	phone: string;
	telegramId: string;
};

/**
 * Mobile-first checkout screen for Telegram Mini App.
 * Now powered by react-hook-form for simpler form control + validation,
 * with bright but tasteful accents for better visual feedback.
 */
export default function BuyNowPage() {
	// Payment UI state (kept small & explicit)
	const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
	const [isProcessing, setIsProcessing] = useState(false);
	const [profileSheetOpen, setProfileSheetOpen] = useState(false);

	const { user } = useUser();
	/**
	 * Initialize react-hook-form.
	 * - mode: "onChange" gives immediate validation feedback and keeps CTA state in sync.
	 * - defaultValues are initially empty; user data will be loaded in useEffect.
	 */
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		getValues,
		reset,
		watch,
	} = useForm<ProfileForm>({
		mode: "onChange",
		defaultValues: {
			first_name: "",
			last_name: "",
			phone: "",
			telegramId: "",
		},
	});

	/**
	 * Re-hydrate the form if the user context ever changes (e.g., after async load).
	 */
	useEffect(() => {
		if (user) {
			reset({
				first_name: user.first_name ?? "",
				last_name: user.last_name ?? "",
				phone: user.phone ?? "",
				telegramId: String(user.telegramId ?? user.id ?? ""),
			});
		}
	}, [user, reset]);

	/**
	 * hasRequiredProfile mirrors business gate: all fields must be present & valid.
	 * We rely primarily on RHF's `isValid`, but also add a strict phone check.
	 */
	const hasRequiredProfile = useMemo(() => {
		const v = getValues();
		return (
			isValid &&
			v.first_name?.trim().length > 1 &&
			v.last_name?.trim().length > 1 &&
			isValidPhone(v.phone || "") &&
			String(v.telegramId || "").trim().length > 0
		);
	}, [isValid, getValues, watch()]);

	const productPrice = 350_000; // Full price (UZS)
	const prepaymentAmount = 50_000; // Prepay for card (UZS)

	/**
	 * Purchase handler: guard with profile requirements.
	 * Simulates network delay; replace with real API call when integrating.
	 */
	const handlePurchase = async () => {
		if (!hasRequiredProfile) {
			alert("Заполните профиль: имя, фамилию, телефон и Telegram ID.");
			return;
		}

		setIsProcessing(true);
		await new Promise((r) => setTimeout(r, 1200));
		setIsProcessing(false);

		if (paymentMethod === "cash") {
			alert("Заказ оформлен! Оплата при получении.");
			return;
		}

		const res = await fetch(
			import.meta.env.VITE_API_URL + "/payment/create",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: user?.id })
			}
		);
		const data = await res.json();
		window.open(data.checkout_url, "_blank");
	};

	/**
	 * Small presentational component for selecting a payment method.
	 * Accessible and touch-friendly for mobile.
	 */
	const PayOption = ({
		id,
		icon: Icon,
		title,
		description,
		meta,
		active,
		onClick,
	}: {
		id: string;
		icon: any;
		title: string;
		description: string;
		meta?: string;
		active: boolean;
		onClick: () => void;
	}) => (
		<button
			id={id}
			type="button"
			onClick={onClick}
			aria-pressed={active}
			className={`w-full rounded-2xl border-2 p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${active
				? "border-transparent bg-gradient-to-r from-sky-100 via-violet-100 to-fuchsia-100 shadow"
				: "border-border hover:border-primary/50"
				}`}
		>
			<div className="flex items-start gap-3">
				<Icon
					className={`mt-0.5 h-6 w-6 ${active ? "opacity-100" : "opacity-80"
						}`}
				/>
				<div className="flex-1">
					<div className="text-base font-semibold leading-tight">
						{title}
					</div>
					<div className="text-sm text-muted-foreground">
						{description}
					</div>
					{meta ? (
						<div className="mt-1 text-sm font-medium">{meta}</div>
					) : null}
				</div>
			</div>
		</button>
	);

	return (
		<div className="min-h-screen bg-gradient-to-b from-white via-white to-sky-50">
			{/* Header with a subtle colorful underline for delight */}
			<div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="mx-auto max-w-md px-4 py-3">
					<h1 className="text-xl font-semibold">Оформить заказ</h1>
					<p className="text-xs text-muted-foreground">
						Telegram Mini App • Мобильный интерфейс
					</p>
					<div className="mt-2 h-1 w-20 rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400" />
				</div>
			</div>

			{/* Main content area */}
			<div className="mx-auto max-w-md px-4 pb-36 pt-4">
				{/* Order summary card */}
				<Card className="rounded-2xl shadow-sm">
					<CardContent className="space-y-5 p-4">
						<div className="flex items-start justify-between gap-3">
							<div>
								<div className="text-base font-semibold leading-tight">
									Premium Plan
								</div>
								<div className="text-xs text-muted-foreground">
									Подписка на 1 месяц
								</div>
							</div>
							<div className="text-lg font-bold text-violet-700">
								{formatPrice(productPrice)}
							</div>
						</div>

						<Separator />

						{/* Payment selection */}
						<section>
							<h3 className="mb-3 text-sm font-semibold">
								Способ оплаты
							</h3>
							<div className="space-y-3">
								<PayOption
									id="pm-cash"
									icon={Banknote}
									title="Наличными при получении"
									description="Оплата курьеру при доставке"
									meta={`К оплате: ${formatPrice(
										productPrice
									)}`}
									active={paymentMethod === "cash"}
									onClick={() => setPaymentMethod("cash")}
								/>
								<PayOption
									id="pm-card"
									icon={CreditCard}
									title="Предоплата картой"
									description="Остальную сумму доплатите при получении"
									meta={`Предоплата: ${formatPrice(
										prepaymentAmount
									)} • Доплата: ${formatPrice(
										productPrice - prepaymentAmount
									)}`}
									active={paymentMethod === "card"}
									onClick={() => setPaymentMethod("card")}
								/>
							</div>
						</section>

						<Separator />

						{/* Profile preview + edit entry point */}
						<section className="space-y-3">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-semibold">
									Ваши данные
								</h3>

								{/* Bottom sheet keeps the main screen clean and focused */}
								<Sheet
									open={profileSheetOpen}
									onOpenChange={setProfileSheetOpen}
								>
									<SheetTrigger asChild>
										<Link to="/profile">
											<Button
												size="sm"
												variant="outline"
												className="h-8 gap-2"
											>
												<PencilLine className="h-4 w-4" />{" "}
												Изменить
											</Button>
										</Link>
									</SheetTrigger>
									<SheetContent
										side="bottom"
										className="rounded-t-2xl p-4"
									>
										<SheetHeader>
											<SheetTitle>
												Заполните профиль
											</SheetTitle>
										</SheetHeader>

										{/* The form itself is powered by react-hook-form */}
										<form
											className="mt-4 space-y-4"
											onSubmit={handleSubmit(() =>
												setProfileSheetOpen(false)
											)}
										>
											<div>
												<Label htmlFor="first_name">
													Имя
												</Label>
												<Input
													id="first_name"
													className="mt-1 h-11"
													placeholder="Иван"
													autoComplete="given-name"
													// RHF: register field with validation rules
													{...register("first_name", {
														required: true,
														minLength: 2,
													})}
												/>
												{errors.first_name && (
													<p className="mt-1 text-xs text-destructive">
														Введите имя (минимум 2
														символа)
													</p>
												)}
											</div>

											<div>
												<Label htmlFor="last_name">
													Фамилия
												</Label>
												<Input
													id="last_name"
													className="mt-1 h-11"
													placeholder="Иванов"
													autoComplete="family-name"
													{...register("last_name", {
														required: true,
														minLength: 2,
													})}
												/>
												{errors.last_name && (
													<p className="mt-1 text-xs text-destructive">
														Введите фамилию (минимум
														2 символа)
													</p>
												)}
											</div>

											<div>
												<Label htmlFor="phone">
													Телефон
												</Label>
												<Input
													id="phone"
													className="mt-1 h-11"
													placeholder="+998 90 123 45 67"
													type="tel"
													inputMode="tel"
													autoComplete="tel"
													{...register("phone", {
														required: true,
														validate: (v) =>
															isValidPhone(v) ||
															"Введите номер в формате +998XXXXXXXXX",
													})}
												/>
												{errors.phone && (
													<p className="mt-1 text-xs text-destructive">
														{String(
															errors.phone
																.message ||
															"Неверный номер"
														)}
													</p>
												)}
											</div>

											<div>
												<Label htmlFor="telegramId">
													Telegram ID
												</Label>
												<Input
													id="telegramId"
													className="mt-1 h-11"
													placeholder="Напр. 123456789"
													inputMode="numeric"
													{...register("telegramId", {
														required: true,
														minLength: 3,
													})}
													readOnly
												/>
												{errors.telegramId && (
													<p className="mt-1 text-xs text-destructive">
														Укажите корректный
														Telegram ID
													</p>
												)}
											</div>

											<SheetFooter className="mt-4">
												<Button
													type="submit"
													className="h-11 w-full"
												>
													Сохранить
												</Button>
											</SheetFooter>
										</form>
									</SheetContent>
								</Sheet>
							</div>

							{/* If profile is incomplete, show a clear blocker message */}
							{!hasRequiredProfile ? (
								<div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-3">
									<ShieldAlert className="mt-0.5 h-5 w-5 text-destructive" />
									<div className="text-sm">
										<div className="font-medium">
											Покупка недоступна
										</div>
										<div className="text-muted-foreground">
											Заполните имя, фамилию, телефон и
											Telegram ID, чтобы продолжить.
										</div>
									</div>
								</div>
							) : (
								// Compact preview of saved profile for confirmation
								<div className="grid grid-cols-2 gap-3 text-sm">
									<div className="rounded-xl border p-3">
										<div className="text-xs text-muted-foreground">
											Имя
										</div>
										<div className="font-medium">
											{getValues("first_name")}
										</div>
									</div>
									<div className="rounded-xl border p-3">
										<div className="text-xs text-muted-foreground">
											Фамилия
										</div>
										<div className="font-medium">
											{getValues("last_name")}
										</div>
									</div>
									<div className="rounded-xl border p-3">
										<div className="text-xs text-muted-foreground">
											Телефон
										</div>
										<div className="font-medium">
											{getValues("phone")}
										</div>
									</div>
									<div className="rounded-xl border p-3">
										<div className="text-xs text-muted-foreground">
											Telegram ID
										</div>
										<div className="font-medium">
											{getValues("telegramId")}
										</div>
									</div>
								</div>
							)}
						</section>
					</CardContent>
				</Card>
			</div>

			{/* Sticky footer CTA with colorful accent */}
			<div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75">
				<div className="mx-auto flex max-w-md items-center gap-3">
					<div className="min-w-0 flex-1">
						<div className="text-xs text-muted-foreground">
							К оплате
						</div>
						<div className="truncate text-lg font-bold text-fuchsia-700">
							{paymentMethod === "card"
								? formatPrice(prepaymentAmount)
								: formatPrice(productPrice)}
						</div>
					</div>
					<Button
						className="h-12 flex-1 bg-gradient-to-r from-sky-600 via-violet-600 to-fuchsia-600 text-white hover:from-sky-700 hover:via-violet-700 hover:to-fuchsia-700"
						disabled={!hasRequiredProfile || isProcessing}
						onClick={handlePurchase}
					>
						{isProcessing
							? "Оформляем..."
							: paymentMethod === "cash"
								? "Оформить заказ"
								: `Внести предоплату ${formatPrice(
									prepaymentAmount
								)}`}
					</Button>
				</div>
			</div>
		</div>
	);
}
