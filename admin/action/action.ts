"use server";

import { revalidateTag } from "next/cache";

export default async function action(collection: string) {
	revalidateTag(collection);
}
