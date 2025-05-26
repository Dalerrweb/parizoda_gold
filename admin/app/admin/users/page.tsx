import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Search,
	Plus,
	MoreHorizontal,
	Eye,
	Edit,
	Trash2,
	Users,
	UserCheck,
	Clock,
} from "lucide-react";
import prisma from "@/lib/prisma";

// Mock data based on your User model
const mockUsers = [
	{
		id: 1,
		telegramId: 123456789,
		username: "john_doe",
		first_name: "John",
		last_name: "Doe",
		photo_url: "/placeholder.svg?height=40&width=40",
		language_code: "en",
		orders: [{ id: 1 }, { id: 2 }], // Mock orders count
		createdAt: new Date("2024-01-15T10:30:00Z"),
	},
	{
		id: 2,
		telegramId: 987654321,
		username: "jane_smith",
		first_name: "Jane",
		last_name: "Smith",
		photo_url: "/placeholder.svg?height=40&width=40",
		language_code: "es",
		orders: [{ id: 3 }],
		createdAt: new Date("2024-01-20T14:45:00Z"),
	},
	{
		id: 3,
		telegramId: 456789123,
		username: null,
		first_name: "Alex",
		last_name: null,
		photo_url: null,
		language_code: "fr",
		orders: [],
		createdAt: new Date("2024-02-01T09:15:00Z"),
	},
	{
		id: 4,
		telegramId: 789123456,
		username: "maria_garcia",
		first_name: "Maria",
		last_name: "Garcia",
		photo_url: "/placeholder.svg?height=40&width=40",
		language_code: "es",
		orders: [{ id: 4 }, { id: 5 }, { id: 6 }],
		createdAt: new Date("2024-02-10T16:20:00Z"),
	},
	{
		id: 5,
		telegramId: 321654987,
		username: "david_wilson",
		first_name: "David",
		last_name: "Wilson",
		photo_url: null,
		language_code: "en",
		orders: [{ id: 7 }],
		createdAt: new Date("2024-02-15T11:30:00Z"),
	},
];

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

function getInitials(firstName?: string | null, lastName?: string | null) {
	const first = firstName?.charAt(0) || "";
	const last = lastName?.charAt(0) || "";
	return (first + last).toUpperCase() || "U";
}

function getFullName(firstName?: string | null, lastName?: string | null) {
	const parts = [firstName, lastName].filter(Boolean);
	return parts.length > 0 ? parts.join(" ") : "No name";
}

export default async function UsersPage() {
	const mockUsers = await prisma.user.findMany({
		include: {
			orders: true,
		},
	});

	const totalUsers = mockUsers.length;
	const usersWithOrders = mockUsers.filter(
		(user) => user.orders.length > 0
	).length;
	const recentUsers = mockUsers.filter((user) => {
		const daysDiff =
			(Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24);
		return daysDiff <= 7;
	}).length;

	return (
		<div className="flex flex-col min-h-screen">
			<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<SidebarTrigger className="-ml-1" />
				<div className="flex flex-1 items-center gap-2">
					<h1 className="text-lg font-semibold">Users</h1>
				</div>
			</header>

			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-3xl font-bold tracking-tight">
						Users Management
					</h2>
					<div></div>
					{/* <Button>
						<Plus className="mr-2 h-4 w-4" />
						Add User
					</Button> */}
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Users
							</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{totalUsers}
							</div>
							<p className="text-xs text-muted-foreground">
								Registered users
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Active Users
							</CardTitle>
							<UserCheck className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{usersWithOrders}
							</div>
							<p className="text-xs text-muted-foreground">
								Users with orders
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								New This Week
							</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{recentUsers}
							</div>
							<p className="text-xs text-muted-foreground">
								Recent registrations
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Search and Filters */}
				<Card>
					<CardHeader>
						<CardTitle>Users</CardTitle>
						<CardDescription>
							Manage and view all registered users
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-2 mb-4">
							<div className="relative flex-1">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search users..."
									className="pl-8"
								/>
							</div>
							<Button variant="outline">Filter</Button>
						</div>

						{/* Users Table */}
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>User</TableHead>
										<TableHead>Telegram ID</TableHead>
										<TableHead>Username</TableHead>
										<TableHead>Language</TableHead>
										<TableHead>Orders</TableHead>
										<TableHead>Joined</TableHead>
										<TableHead className="text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{mockUsers.map((user) => (
										<TableRow key={user.id}>
											<TableCell>
												<div className="flex items-center space-x-3">
													<Avatar className="h-8 w-8">
														<AvatarImage
															src={
																user.photo_url ||
																undefined
															}
														/>
														<AvatarFallback className="text-xs">
															{getInitials(
																user.first_name,
																user.last_name
															)}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-medium">
															{getFullName(
																user.first_name,
																user.last_name
															)}
														</div>
														<div className="text-sm text-muted-foreground">
															ID: {user.id}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<code className="text-sm bg-muted px-1 py-0.5 rounded">
													{user.telegramId}
												</code>
											</TableCell>
											<TableCell>
												{user.username ? (
													<Badge variant="secondary">
														@{user.username}
													</Badge>
												) : (
													<span className="text-muted-foreground text-sm">
														No username
													</span>
												)}
											</TableCell>
											<TableCell>
												<Badge variant="outline">
													{user.language_code?.toUpperCase() ||
														"N/A"}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center space-x-2">
													<span className="font-medium">
														{user.orders.length}
													</span>
													{user.orders.length > 0 && (
														<Badge
															variant="default"
															className="text-xs"
														>
															Active
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>
												<div className="text-sm">
													{formatDate(user.createdAt)}
												</div>
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
													>
														<Button
															variant="ghost"
															className="h-8 w-8 p-0"
														>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem>
															<Eye className="mr-2 h-4 w-4" />
															View Details
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Edit className="mr-2 h-4 w-4" />
															Edit User
														</DropdownMenuItem>
														<DropdownMenuItem className="text-destructive">
															<Trash2 className="mr-2 h-4 w-4" />
															Delete User
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{/* Pagination */}
						<div className="flex items-center justify-between space-x-2 py-4">
							<div className="text-sm text-muted-foreground">
								Showing 1-{mockUsers.length} of{" "}
								{mockUsers.length} users
							</div>
							<div className="flex space-x-2">
								<Button variant="outline" size="sm" disabled>
									Previous
								</Button>
								<Button variant="outline" size="sm" disabled>
									Next
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
