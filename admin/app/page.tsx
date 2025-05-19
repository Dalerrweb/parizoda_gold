import prisma from "@/lib/prisma";

export default async function Home() {
	const data = await prisma.user.findMany();

	console.log(data);

	return <div></div>;
}
