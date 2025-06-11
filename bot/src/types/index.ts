export type Product = {
	id: number;
	sku: string;
	name: string;
	description: string | null;
	weight: number;
	type: "SINGLE" | "BUNDLE";
	price: number;
	categoryId: number;
	tags?: string[];
	images: ProductImage[];
	sizes: ProductSize[];
	parentBundle: BundleItem[]; // More specific type for bundle items
	isActive: boolean;
	isFeatured?: boolean;
	createdAt: Date;
	updatedAt: Date;
	publishedAt?: Date;
};

type ProductImage = {
	id: number;
	url: string;
	alt?: string;
	productId: number;
	isPrimary?: boolean;
	sortOrder?: number;
};

type ProductSize = {
	id: number;
	productId: number;
	quantity: number;
	value: string;
	isAvailable?: boolean;
	price?: number; // Different sizes might have different prices
};

type BundleItem = {
	id: number;
	parentId: number;
	bundleId: number;
	childId: number;
	quantity: number;
	child: Omit<Product, "parentBundle" | "sizes">; // Avoid circular reference
};

export type Category = {
	id: number;
	name: string;
	imageUrl: string;
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
	telegramId: number;
	username: string;
	first_name: string;
	last_name: string;
	language_code: string;
	photo_url: string;
	orders: any[];
	createdAt: Date;
};

export type CartItem = {
	product: Product;
	quantity: number;
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
