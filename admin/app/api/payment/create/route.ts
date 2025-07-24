import axios, { AxiosError } from "axios";
import { getMulticardToken } from "@/lib/utils/multicard";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { ChekoutUrlResponseType } from "./create-checkout-response.type";
import { $Enums } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

function validateBody(body: Record<string, any>) {
  if (!body.amount) {
    return null;
  }

  if (typeof body.amount !== "number") {
    return null;
  }

  return {
    amount: +body.amount
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = validateBody(await req.json());
    if (!body) {
      return NextResponse.json(
        {
          error: "Invalid amount"
        },
        { status: 422 }
      );
    }

    const payload = {
      store_id: process.env.MULTICARD_STORE_ID,
      amount: body.amount * 100,
      invoice_id: randomUUID(),
      callback_url: process.env.MULTICARD_CALBACK_URL
    };

    const token = await getMulticardToken();
    const response = await axios.post(process.env.MULTICARD_URL!, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = response.data as ChekoutUrlResponseType;
    console.info({ request_body: payload, response_data: response.data });

    if (!data.success) {
      return NextResponse.json(null, { status: 400 });
    }

    await prisma.transaction.create({
      data: {
        invoiceId: payload.invoice_id,
        externalId: data.data.uuid,
        userId: 1, //// need specify,
        amount: payload.amount,
        status: $Enums.TransactionStatus.pending
      }
    });

    return NextResponse.json(
      {
        checkout_url: data.data.checkout_url
      },
      { status: 200 }
    );
  } catch (e) {
    const error = e as AxiosError;
    console.info({ error: error });
    return NextResponse.json(
      {
        checkout_url: null
      },
      { status: 200 }
    );
  }
}
