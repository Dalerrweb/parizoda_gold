import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { CheckoutCallback } from "./checkout-callback.type";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const data = (await req.json()) as CheckoutCallback;

  const expectedSign = crypto
    .createHash("md5")
    .update(
      `${data.store_id}${data.invoice_id}${data.amount}${process.env.MULTICARD_SECRET}`
    )
    .digest("hex");

  if (data.sign !== expectedSign) {
    return NextResponse.json(
      { success: false, message: "Invalid sign" },
      { status: 403 }
    );
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      invoiceId: data.invoice_id
    }
  });

  if (!transaction) {
    return NextResponse.json(
      {
        success: false,
        message: "Не найден инвойс"
      },
      { status: 200 }
    );
  }

  if (transaction.status !== "pending") {
    return NextResponse.json(null, { status: 200 });
  }

  await prisma.transaction.updateMany({
    where: {
      invoiceId: data.invoice_id
    },
    data: {
      status: "success",
      extraData: {
        billing_id: data.billing_id,
        payment_time: data.payment_time,
        phone: data.phone,
        card_pan: data.card_pan,
        card_token: data.card_token,
        receipt_url: data.receipt_url
      }
    }
  });

  return NextResponse.json(null, { status: 200 });
}
