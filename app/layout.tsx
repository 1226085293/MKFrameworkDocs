import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/contexts/theme-provider';
import { Navbar } from '@/components/navbar';
import { Space_Mono, Space_Grotesk } from 'next/font/google';
import { Footer } from '@/components/footer';
import '@/styles/globals.css';
import HeadingAnchorHandler from '@/components/HeadingAnchorHandler';

const sansFont = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-geist-sans',
    display: 'swap',
    weight: '400',
});

const monoFont = Space_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
    display: 'swap',
    weight: '400',
});

export const metadata: Metadata = {
    title: 'MKFrameworkDocs',
    metadataBase: new URL('https://mkframework.muzzik.cc/'),
    description:
        'CocosCreator 游戏框架, 免费，开源，类型安全，完善的生命周期/新手引导/资源管理系统，支持纯脚本/组件式开发，支持单脚本多预制',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
            <head>
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
                />
            </head>
            <body
                className={`${sansFont.variable} ${monoFont.variable} font-regular antialiased tracking-wide`}
                suppressHydrationWarning
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar />
                    <main className="sm:container mx-auto w-[90vw] h-auto scroll-smooth">
                        {children}
                        <HeadingAnchorHandler />
                    </main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
