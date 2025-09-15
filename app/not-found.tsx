import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[87vh] px-2 sm:py-28 py-36 flex flex-col gap-4 items-center">
            <div className="text-center flex flex-col items-center justify-center w-fit gap-2">
                <h2 className="text-7xl font-bold pr-1">404</h2>
                <p className="text-muted-foreground text-md font-medium">页面没找到 {':('}</p>
                <p>您要寻找的页面不存在, 请检查路径是否正确</p>
            </div>
            <Link href="/" className={buttonVariants({})}>
                返回主页
            </Link>
        </div>
    );
}
