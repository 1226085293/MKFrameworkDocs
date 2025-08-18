import { NextResponse } from "next/server";
import { getRoutes } from "@/lib/server/getRoutes";

export async function GET() {
	const routes = getRoutes();
	return NextResponse.json(routes);
}
