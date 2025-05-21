export type Product = {
	id: number;
	name: string;
	description: string;
	price: number; // Price in minimum unit (e.g., cents)
	categoryId: number;
	images: ProductImage[];
	createdAt: string;
	updatedAt: string;
};

export type ProductImage = {
	id: number;
	url: string;
	productId: number;
};

export type Category = {
	id: number;
	name: string;
	products: Product[];
};

export type OrderStatus =
	| "PENDING"
	| "PROCESSING"
	| "SHIPPED"
	| "DELIVERED"
	| "CANCELLED";

export type Order = {
	id: number;
	userId: number;
	productId: number;
	status: OrderStatus;
	createdAt: string;
};

export type User = {
	id: number;
	name: string;
	phone: string;
	location: string;
	avatar?: string;
};

export type CartItem = {
	product: Product;
	quantity: number;
};
