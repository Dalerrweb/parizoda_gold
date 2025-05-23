import { Header } from "@/components/custom/header";
import ProfileView from "@/components/custom/profile-view";
import { SidebarNav } from "@/components/custom/sidebar-nav";
import { useUser } from "@/context/UserProvider";
import { useState } from "react";

export default function ProfilePage() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { user } = useUser();

	return (
		<>
			<Header onMenuClick={() => setSidebarOpen(true)} />
			<SidebarNav
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>
			<div className="container mx-auto px-4 pb-8">
				{user && <ProfileView user={user} />}
			</div>
		</>
	);
}
