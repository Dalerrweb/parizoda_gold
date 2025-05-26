import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Admin Dashboard",
	description: "Admin dashboard for managing users, products, and more",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<SidebarProvider>
				<AppSidebar />
				<main className="flex-1 overflow-auto">{children}</main>
			</SidebarProvider>
		</>
	);
}
