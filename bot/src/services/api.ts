// src/services/api.ts
import { Banner, Category, Product } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ProductResponse {
	products: Product[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_URL,
	}),
	endpoints: (builder) => ({
		getProducts: builder.query<
			ProductResponse,
			{ limit?: number; categoryId?: number; page?: number }
		>({
			query: ({ limit, categoryId, page }) => {
				const params = new URLSearchParams();

				if (limit) params.append("limit", limit.toString());
				if (page) params.append("page", page.toString());
				if (categoryId)
					params.append("categoryId", categoryId.toString());

				return `/products?${params.toString()}`;
			},
		}),
		getProductsById: builder.query<Product, number>({
			query: (id) => `/products/${id}`,
		}),
		getCategories: builder.query<Category[], void>({
			query: () => "/categories",
		}),
		getBanners: builder.query<Banner[], void>({
			query: () => "/banners",
		}),
		// POST /posts (пример мутации)
		// createPost: builder.mutation<Post, Partial<Post>>({
		// 	query: (body) => ({
		// 		url: "/posts",
		// 		method: "POST",
		// 		body,
		// 	}),
		// 	invalidatesTags: ["Post"],
		// }),
	}),
});

export const {
	useGetProductsQuery,
	useGetProductsByIdQuery,
	useGetCategoriesQuery,
	useGetBannersQuery,
} = api;
