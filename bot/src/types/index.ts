export type AuPrice = {
	id: number;
	name: string;
	pricePerGram: number;
};

export type Category = {
	id: number;
	name: string;
	imageUrl?: string;
	products: Product[];
	createdAt: Date;
};

export type Product = {
	id: number;
	sku: string;
	name: string;
	description?: string;
	markup: number;
	type: ProductType; // enum: SINGLE | BUNDLE и т.п.
	categoryId: number;
	category: Category;
	images: any[];
	orders?: Order[];
	sizes: ProductSize[];

	parentBundle: any[]; // продукты, в которые этот входит
	childBundles?: any[]; // продукты, из которых этот состоит

	createdAt: Date;
	updatedAt: Date;
};
export enum ProductType {
	SINGLE = "SINGLE",
	BUNDLE = "BUNDLE",
}

export type ProductSize = {
	id?: number;
	size: string;
	quantity: number;
	weight: number;
	product?: Product;
	productId?: number;
};

export type User = {
	id: number;
	telegramId: number;
	username: string;
	first_name: string;
	last_name: string;
	language_code: string;
	photo_url: string;
	phone: string;
	orders: any[];
	createdAt: Date;
};

export type Banner = {
	id: number;
	imageUrl: string;
	title: string;
	link: string;
	isActive: boolean;
	position: number;
	createdAt: Date;
	updatedAt: Date;
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

export type CartItem = {
	product: Product;
	quantity: number;
};
