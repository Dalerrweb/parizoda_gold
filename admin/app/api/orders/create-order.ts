import { ProductType } from "@/app/types";
import prisma from "@/lib/prisma";

type OrderInput = {
    userId: number;
    body: any;
};

const calculate = ({
    weight,
    markup,
    pricePerGram,
}: {
    weight: string | null;
    markup: string;
    pricePerGram: bigint;
}) => {
    const priceWithoutMarkup = Number(pricePerGram) * Number(weight);

    return priceWithoutMarkup * (1 + Number(markup) / 100);
};

export async function createOrder({ userId, body }: OrderInput) {
    const user = await prisma.user.findFirst({
        where: {
            OR: [{ telegramId: userId }, { id: userId }],
        },
        select: { id: true },
    });
    if (!user) throw new Error("User not found");

    const auPrice = await prisma.auPrice.findFirst();
    if (!auPrice) throw new Error("Gold price not found");

    let totalAmount = 0;
    const orderItemsData: any[] = [];

    for (const item of body.order.items) {
        const dbProduct = await prisma.product.findUnique({
            where: { id: item.productId },
        });
        if (!dbProduct) throw new Error(`Product with ID ${item.productId} not found`);

        if (dbProduct.type === ProductType.SINGLE) {
            const dbSize = await prisma.productSize.findUnique({
                where: { id: item.variantId },
            });
            if (!dbSize) throw new Error(`Size with ID ${item.variantId} not found`);

            const price = calculate({
                weight: dbSize.weight,
                markup: dbProduct.markup,
                pricePerGram: BigInt(auPrice.pricePerGram),
            });

            totalAmount += price * item.quantity;

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price,
                weight: dbSize.weight,
                markup: dbProduct.markup,
                variantId: dbSize.id,
                type: ProductType.SINGLE,
                bundleItems: [],
            });
        }

        if (dbProduct.type === ProductType.BUNDLE) {
            const bundleItems: any[] = [];
            let bundleTotalPrice = 0;

            for (const b of item.bundleItems) {
                const bundleDbProduct = await prisma.product.findUnique({
                    where: { id: b.productId },
                });
                if (!bundleDbProduct) throw new Error(`Bundle product with ID ${b.productId} not found`);

                const dbSize = await prisma.productSize.findUnique({
                    where: { id: b.variantId },
                });
                if (!dbSize) throw new Error(`Size with ID ${b.variantId} not found`);

                const price = calculate({
                    weight: dbSize.weight,
                    markup: bundleDbProduct.markup,
                    pricePerGram: BigInt(auPrice.pricePerGram),
                });

                bundleTotalPrice += price;

                bundleItems.push({
                    productId: b.productId,
                    variantId: b.variantId,
                    weight: dbSize.weight,
                    markup: bundleDbProduct.markup,
                    price,
                });
            }

            totalAmount += bundleTotalPrice * item.quantity;

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: bundleTotalPrice,
                weight: bundleItems.reduce((sum, it) => sum + Number(it.weight ?? 0), 0).toString(),
                markup: dbProduct.markup,
                type: ProductType.BUNDLE,
                bundleItems,
            });
        }
    }

    return prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                userId: user.id,
                paymentType: body.order.paymentType,
                goldPrice: Number(auPrice.pricePerGram),
                totalAmount: Number(totalAmount),
            },
        });

        for (const itemData of orderItemsData) {
            const orderItem = await tx.orderItem.create({
                data: {
                    orderId: newOrder.id,
                    productId: itemData.productId,
                    quantity: itemData.quantity,
                    price: Number(itemData.price),
                    weight: itemData.weight,
                    markup: itemData.markup,
                    variantId: itemData.variantId,
                    type: itemData.type,
                },
            });

            if (itemData.type === ProductType.BUNDLE && itemData.bundleItems.length > 0) {
                await tx.bundleItem.createMany({
                    data: itemData.bundleItems.map((b: any) => ({
                        orderItemId: orderItem.id,
                        productId: b.productId,
                        variantId: b.variantId,
                        weight: b.weight,
                        markup: b.markup,
                        price: Number(b.price),
                    })),
                });
            }
        }

        return newOrder;
    });
}