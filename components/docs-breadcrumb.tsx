"use client";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

export type BreadcrumbItemType = {
	title: string;
	href: string;
	noLink?: boolean;
};

export default function DocsBreadcrumb({
	items,
}: {
	items: BreadcrumbItemType[];
}) {
	return (
		<div className="pb-5">
			<Breadcrumb>
				<BreadcrumbList>
					{/* ...这里可以添加 Home 键返回文档第一页 */}
					{/* <BreadcrumbItem>
						{root.noLink ? (
							<BreadcrumbPage>{root.title}</BreadcrumbPage>
						) : (
							<BreadcrumbLink href={root.href}>{root.title}</BreadcrumbLink>
						)}
					</BreadcrumbItem> */}

					{items.map((item, index) => (
						<Fragment key={item.href}>
							<BreadcrumbItem>
								{/* 最后一级总是 BreadcrumbPage */}
								{item.noLink ? (
									<BreadcrumbPage>{item.title}</BreadcrumbPage>
								) : (
									<BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{index < items.length - 1 && <BreadcrumbSeparator />}
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}
