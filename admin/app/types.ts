export type Category = {
	id: string;
	name: string;
	imageUrl?: string;
	products: Product[];
	createdAt: Date;
};

type Product = {
	id: number;
	sku: string;
	name: string;
	description?: string;
	price: number; // цена в минимальной единице (тийины и т.п.)
	weight?: number;
	type: ProductType; // enum: SINGLE | BUNDLE и т.п.
	preciousMetal?: PreciousMetal; // enum, если указан
	categoryId: number;
	category: Category;
	images: string[];
	orders: Order[];
	sizes: ProductSize[];

	parentBundle: any[]; // продукты, в которые этот входит
	childBundles: any[]; // продукты, из которых этот состоит

	createdAt: Date;
	updatedAt: Date;
};

export type User = {
	id: number;
	telegramId: number;
	username: string;
	first_name: string;
	last_name: string;
	photo_url: string;
	language_code: string;
	orders: [];
	createdAt: Date;
};

enum ProductType {
	SINGLE = "SINGLE",
	BUNDLE = "BUNDLE",
}

enum PreciousMetal {
	GOLD = "GOLD", // Золото
	SILVER = "SILVER", // Серебро
	PLATINUM = "PLATINUM", // Платина
	PALLADIUM = "PALLADIUM", // Палладий
	OTHER = "OTHER", // Другие материалы
}

export type ProductSize = {
	id: number;
	value: string;
	product: Product;
	productId: number;
	quantity: number;
};
export type Order = {
	id: number;
	user: User;
	userId: number;
	product: Product;
	productId: number;
	status: OrderStatus;
	createdAt: Date;
};

enum OrderStatus {
	PENDING = "PENDING",
	PAID = "PAID",
	SHIPPED = "SHIPPED",
	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED",
}

export type AdminUser = {
	id: number;
	email: string;
	password: string;
	createdAt: Date;
};
