'use client';

import { useState, useEffect } from 'react';
import { Heart, QrCode, Smile, Star, Zap } from 'lucide-react';

export default function DonatePage() {
    const [loading, setLoading] = useState(true);
    const [activeMethod, setActiveMethod] = useState('alipay');

    // 模拟加载二维码
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-auto py-12">
            <div className="container max-w-4xl mx-auto px-4">
                <div className="rounded-xl">
                    <div className="p-4 md:p-6">
                        <div className="text-center mb-10">
                            <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
                                <span>捐赠支持🌷</span>
                            </h1>
                            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                                欢迎支持开源产品，您的捐赠会支持产品的继续开发和改进。
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 md:p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-stretch">
                                <div className="flex-1">
                                    <div className="text-center mb-6">
                                        <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                                            <QrCode className="h-5 w-5 text-amber-600" />
                                            <span>扫码捐赠</span>
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            选择您方便的支付方式完成捐赠
                                        </p>
                                    </div>

                                    {/* 支付方式选择 */}
                                    <div className="flex justify-center mb-6">
                                        <div className="inline-flex bg-background p-1 rounded-lg">
                                            <button
                                                onClick={() => setActiveMethod('alipay')}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    activeMethod === 'alipay'
                                                        ? 'bg-amber-100 dark:bg-amber-900/40 shadow-sm'
                                                        : 'hover:bg-muted/50'
                                                }`}
                                            >
                                                <div className="bg-blue-100 dark:bg-blue-900/40 p-1 rounded-md">
                                                    <div className="bg-white dark:bg-background w-6 h-6 flex items-center justify-center rounded-sm">
                                                        <div className="bg-blue-600 w-4 h-4 rounded-full flex items-center justify-center">
                                                            <div className="bg-white w-2 h-2 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span>支付宝</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveMethod('wechat')}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    activeMethod === 'wechat'
                                                        ? 'bg-green-100 dark:bg-green-900/40 shadow-sm'
                                                        : 'hover:bg-muted/50'
                                                }`}
                                            >
                                                <div className="bg-green-100 dark:bg-green-900/40 p-1 rounded-md">
                                                    <div className="bg-white dark:bg-background w-6 h-6 flex items-center justify-center rounded-sm">
                                                        <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <span>微信支付</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* 二维码展示 */}
                                    <div className="flex justify-center">
                                        {loading ? (
                                            <div className="bg-gray-200 animate-pulse rounded-xl w-64 h-64 flex items-center justify-center">
                                                {activeMethod === 'alipay' ? (
                                                    <div className="bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center">
                                                        <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
                                                            <div className="bg-white w-4 h-4 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-green-500/20 w-16 h-16 rounded-xl flex items-center justify-center">
                                                        <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                                                            <div className="bg-white w-4 h-4 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <div className="bg-white p-4 rounded-xl border shadow-lg">
                                                    <img
                                                        src={`/donate/${
                                                            activeMethod === 'alipay'
                                                                ? 'zfb.jpg'
                                                                : 'wx.jpg'
                                                        }`}
                                                        alt={`${
                                                            activeMethod === 'alipay'
                                                                ? '支付宝'
                                                                : '微信'
                                                        }收款码`}
                                                        className="w-64 h-64 object-cover"
                                                    />
                                                </div>
                                                <div className="absolute -bottom-3 -right-3 bg-white dark:bg-background px-3 py-1 rounded-full text-xs font-medium shadow-md flex items-center gap-1">
                                                    <QrCode className="h-3 w-3" />
                                                    <span>
                                                        {activeMethod === 'alipay'
                                                            ? '支付宝'
                                                            : '微信'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="bg-white dark:bg-background rounded-2xl p-6 h-full">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <Star className="h-5 w-5 text-amber-500 fill-current" />
                                            <span>捐赠说明</span>
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                                    <Zap className="h-4 w-4 text-yellow-500" />
                                                    <span>捐赠权益</span>
                                                </h4>
                                                <ul className="text-sm text-muted-foreground space-y-1">
                                                    <li className="flex items-start">
                                                        <Smile className="h-4 w-4 mt-0.5 text-green-500 mr-2 flex-shrink-0" />
                                                        <span>捐赠者昵称和头像将在首页展示</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <Smile className="h-4 w-4 mt-0.5 text-green-500 mr-2 flex-shrink-0" />
                                                        <span>框架需求优先处理</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <Smile className="h-4 w-4 mt-0.5 text-green-500 mr-2 flex-shrink-0" />
                                                        <span>作者实时沟通解惑</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                                                    <span>资金使用</span>
                                                </h4>
                                                <ul className="text-sm text-muted-foreground space-y-1">
                                                    <li className="flex items-start">
                                                        <span className="font-medium mr-2">•</span>
                                                        <span>核心功能开发</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="font-medium mr-2">•</span>
                                                        <span>扩展插件开发</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="font-medium mr-2">•</span>
                                                        <span>网站维护</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
                                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                                    <span className="font-medium">
                                                        感谢支持开源！
                                                    </span>
                                                    您的每一份捐赠都是对我们莫大的鼓励，将推动 MK
                                                    框架持续进步。
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="mt-10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
                            <h3 className="text-lg font-bold mb-3 text-center">特别鸣谢</h3>
                            <p className="text-muted-foreground text-center">
                                以下捐赠者已支持我们:
                            </p>
                            <div className="mt-4 flex justify-center">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4, 5].map((id) => (
                                        <div
                                            key={id}
                                            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium border-2 border-background"
                                        >
                                            {id}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div> */}
                    </div>

                    <div className="p-6 text-center text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} MKFramework 社区 | 您的支持让开源更美好</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
