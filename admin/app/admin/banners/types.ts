export type Banner = {
	id: number;
	imageUrl: string;
	link: string | null;
	isActive: boolean;
	position: number;
	createdAt: Date;
	updatedAt: Date;
};

export type BannerFormData = Omit<Banner, "id" | "createdAt" | "updatedAt">;
