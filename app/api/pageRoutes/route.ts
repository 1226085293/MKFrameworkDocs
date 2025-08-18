import { NextResponse } from "next/server";
import { getPageRoutes } from "@/lib/server/getRoutes";

export async function GET() {
	return NextResponse.json(getPageRoutes());
}
