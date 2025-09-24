'use client';

export default function QqWxGroupLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen py-12">
            <div className="container max-w-4xl mx-auto px-4">
                <div className="rounded-xl">
                    <div className="p-4 md:p-6">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold">社区交流群</h1>
                            <p className="text-muted-foreground mt-2">
                                加入我们的交流群，获取最新动态和技术支持
                            </p>
                        </div>

                        {children}
                    </div>

                    <div className="p-6 text-center text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} MKFramework 社区 | 加入我们共同进步</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
