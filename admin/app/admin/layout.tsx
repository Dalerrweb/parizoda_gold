import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/app-sidebar";
import prisma from "@/lib/prisma";
import { PriceProvider } from "@/context/PriceContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Admin Dashboard",
	description: "Admin dashboard for managing users, products, and more",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const auPrice = await prisma.auPrice.findFirst();

	return (
		<>
			<PriceProvider value={auPrice}>
				<SidebarProvider>
					<AppSidebar />
					<main className="flex-1 overflow-auto">{children}</main>
				</SidebarProvider>
			</PriceProvider>
		</>
	);
}
