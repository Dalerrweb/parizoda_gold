import { Heart, Home, MapPin, ShoppingCart, User } from "lucide-react";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	SidebarProvider,
	Sidebar,
	SidebarContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserProvider";
import { Link } from "react-router-dom";

interface SidebarNavProps {
	open: boolean;
	onClose: () => void;
}

export function SidebarNav({ open, onClose }: SidebarNavProps) {
	const { user } = useUser();

	console.log({ user });

	const fullOrUsername =
		user?.first_name && user?.last_name
			? `${user?.first_name} ${user?.last_name}`
			: user?.username;

	return (
		<Sheet open={open} onOpenChange={onClose}>
			<SheetContent side="left" className="p-0 w-[280px]">
				<SheetHeader className="p-4 border-b">
					<SheetTitle className="text-left">Menu</SheetTitle>
				</SheetHeader>

				{user && (
					<div className="p-4 border-b">
						<div className="flex items-center gap-3">
							<Avatar>
								<AvatarImage
									src={user?.photo_url || "/placeholder.svg"}
									alt={
										user?.first_name ||
										user?.username ||
										"User"
									}
								/>
								<AvatarFallback>
									{user?.first_name?.[0]}
									{user?.last_name?.[0]}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-medium">{fullOrUsername}</p>
								{/* <p className="text-sm text-muted-foreground">
								+1 234 567 8900
							</p> */}
							</div>
						</div>

						<div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
							<MapPin className="h-4 w-4" />
							<span>New York, USA</span>
						</div>
					</div>
				)}

				<SidebarProvider>
					<Sidebar collapsible="none" className="border-none">
						<SidebarContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link to="/">
											<Home className="h-4 w-4" />
											<span>Home</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								{/* <SidebarMenuItem>
									<SidebarMenuButton asChild>
										<a href="/catalog">
											<ShoppingBag className="h-4 w-4" />
											<span>Catalog</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem> */}
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link to="/history">
											<Home className="h-4 w-4" />
											<span>History</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link to="/favorites">
											<Heart className="h-4 w-4" />
											<span>Favorites</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link to="/cart">
											<ShoppingCart className="h-4 w-4" />
											<span>Cart</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<Link to="/profile">
											<User className="h-4 w-4" />
											<span>Profile</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarContent>
					</Sidebar>
				</SidebarProvider>
			</SheetContent>
		</Sheet>
	);
}
