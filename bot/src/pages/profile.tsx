import ProfileView from "@/components/custom/profile-view";
import { useUser } from "@/context/UserProvider";

export default function ProfilePage() {
	const { user } = useUser();

	return (
		<>
			<div className="container mx-auto px-4 pb-8">
				{user && <ProfileView user={user} />}
			</div>
		</>
	);
}
