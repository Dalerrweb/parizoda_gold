"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";
import { User } from "@/types";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

interface ProfileEditFormProps {
	user: User;
	onCancel: () => void;
	onSuccess: () => void;
}

export function ProfileEditForm({
	user,
	onCancel,
	onSuccess,
}: ProfileEditFormProps) {
	const form = useForm({
		defaultValues: {
			first_name: user.first_name || "",
			last_name: user.last_name || "",
			phone: user.phone || "",
		},
	});

	const { handleSubmit, reset } = form;

	const onSubmit = async (data: any) => {
		console.log("Submitting profile data:", data);

		try {
			const res = await fetch(
				import.meta.env.VITE_API_URL + `/user/${user.id}`,
				{
					method: "PATCH",
					body: JSON.stringify({
						first_name: data.first_name,
						last_name: data.last_name,
						phone: data.phone,
					}),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);

			if (!res.ok) {
				throw new Error(
					`Error updating profile: ${
						res.statusText || "Unknown error"
					}`
				);
			}

			onSuccess();
		} catch (err) {
			// Error is handled by the hook
			console.error("Failed to update profile:", err);
		}
	};

	const handleCancel = () => {
		reset();
		onCancel();
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<fieldset
					// disabled={isLoading}
					className="space-y-4"
				>
					<legend className="sr-only">
						Edit Profile Information
					</legend>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								value={user.username}
								disabled
								className="bg-muted"
								aria-describedby="telegram-username"
							/>
							<p id="telegram-username" className="sr-only">
								Username cannot be changed
							</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="telegramId">Telegram ID</Label>
							<Input
								id="telegramId"
								value={user.telegramId}
								disabled
								className="bg-muted"
								aria-describedby="telegram-id-description"
							/>
							<p id="telegram-id-description" className="sr-only">
								Telegram ID cannot be changed
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="first_name"
							rules={{ required: "First name is required" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input
											placeholder="First Name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="last_name"
							rules={{ required: "Last name is required" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Last Name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							rules={{
								required: "Phone number is required",
								pattern: {
									value: /^\+998\d{9}$/,
									message:
										"Неверный формат номера. Пример: +998901234567",
								},
							}}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone number</FormLabel>
									<FormControl>
										<Input
											placeholder="Phone Number"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							// disabled={isLoading}
						>
							<X className="mr-2 h-4 w-4" />
							Cancel
						</Button>
						<Button
							type="submit"
							// disabled={isLoading || !isDirty}
						>
							<Save className="mr-2 h-4 w-4" />
							Save Changes
							{/* {isLoading ? "Saving..." : "Save Changes"} */}
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	);
}
