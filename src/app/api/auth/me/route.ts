import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/server/application/auth/get-current-customer";

export async function GET() {
  const customer = await getCurrentCustomer();
  return NextResponse.json({ customer });
}
