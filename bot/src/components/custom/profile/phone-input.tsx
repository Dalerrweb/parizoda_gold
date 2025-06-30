import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
	defaultValue?: string;
	register: any;
	errors: Record<string, any>;
}

const PhoneInput = ({
	defaultValue = "",
	register,
	errors,
}: PhoneInputProps) => {
	// Функция валидации номера телефона
	const validatePhone = (value: string) => {
		if (!value) return "Номер телефона обязателен";

		// Очистка от всех нецифровых символов кроме плюса
		const cleaned = value.replace(/[^\d+]/g, "");

		// Проверка формата: +998XXXXXXXXX или 998XXXXXXXXX
		if (!/^(\+998|998)\d{9}$/.test(cleaned)) {
			return "Неверный формат номера. Пример: +998901234567";
		}

		return true;
	};

	// Преобразование значения по умолчанию
	const formatDefaultValue = (value: string) => {
		if (!value) return "";

		// Удаление всех нецифровых символов
		const digits = value.replace(/\D/g, "");

		// Добавление +998 если нужно
		if (digits.length === 9) return `+998${digits}`;
		if (digits.startsWith("998") && digits.length === 12)
			return `+${digits}`;
		if (digits.startsWith("+998") && digits.length === 13) return value;

		return value;
	};

	return (
		<div className="space-y-2">
			<Label htmlFor="phone">Номер телефона</Label>
			<Input
				id="phone"
				type="tel"
				className={cn(
					"transition-colors",
					errors.phone && "border-red-500 focus:ring-red-500"
				)}
				{...register("phone", {
					required: true,
					validate: validatePhone,
				})}
				defaultValue={formatDefaultValue(defaultValue)}
				placeholder="+998901234567"
			/>
			{errors.phone && (
				<p className="text-red-500 text-sm mt-1">
					Неверный формат номера. Пример: +998901234567
				</p>
			)}
		</div>
	);
};

export default PhoneInput;
