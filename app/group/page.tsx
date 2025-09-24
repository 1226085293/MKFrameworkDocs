'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, QrCode, Smartphone, Mail, ArrowUpRight } from 'lucide-react';
import siteConfig from '@/site-config';

export default function QqWxGroupPage() {
    const [activeTab, setActiveTab] = useState('qq');
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);

    // 模拟加载二维码
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // 复制文本到剪贴板
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="py-6">
            {/* 原生选项卡实现 */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex bg-muted/30 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('qq')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'qq'
                                ? 'bg-background shadow-sm'
                                : 'hover:bg-background/50'
                        }`}
                    >
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>QQ群</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('wechat')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === 'wechat'
                                ? 'bg-background shadow-sm'
                                : 'hover:bg-background/50'
                        }`}
                    >
                        <MessageSquare className="h-4 w-4 text-green-500" />
                        <span>微信群</span>
                    </button>
                </div>
            </div>

            {/* QQ群内容 - 最终优化版 */}
            {activeTab === 'qq' && (
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 flex flex-col items-center">
                            {loading ? (
                                <div className="bg-gray-200 animate-pulse rounded-lg w-64 h-64 flex items-center justify-center">
                                    <Users className="h-24 w-24 text-blue-500/30" />
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                                        <img
                                            src="/group/qq.jpg"
                                            alt="QQ群二维码"
                                            className="w-64 h-64 object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                                        扫码加入
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 w-full">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl">
                                        <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">综合交流群</h3>
                                        <p className="text-sm text-muted-foreground">
                                            MKFramework 官方QQ群
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-medium mb-2">添加方式</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {
                                                '扫码或点击下方申请入群按钮，备注"Cocos"，管理员审核后即可入群'
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium flex items-center gap-2 mb-3">
                                            <MessageSquare className="h-4 w-4 text-blue-500" />
                                            <span>入群须知</span>
                                        </h4>
                                        <div className="bg-white dark:bg-background rounded-lg p-4 text-sm space-y-2">
                                            <p className="flex items-start">
                                                <span className="font-medium mr-2">1.</span>
                                                <span>在群内交流框架和Cocos相关的问题</span>
                                            </p>
                                            <p className="flex items-start">
                                                <span className="font-medium mr-2">2.</span>
                                                <span>
                                                    禁止与游戏无关的广告，单个广告每天最多一次
                                                </span>
                                            </p>
                                            <p className="flex items-start text-red-500 dark:text-red-400">
                                                <span className="font-medium mr-2">3.</span>
                                                <span>
                                                    禁止讨论政治内容、攻击他人，违规者将被移出群组
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            className="w-full relative"
                                            variant="outline"
                                            onClick={() =>
                                                copyToClipboard(siteConfig.qqGroupInfo.number)
                                            }
                                        >
                                            <Mail className="mr-2 h-4 w-4" />
                                            复制群号
                                            {copySuccess && (
                                                <span className="absolute -top-8 right-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md animate-fade-in">
                                                    复制成功！
                                                </span>
                                            )}
                                        </Button>
                                        <Button
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            asChild
                                        >
                                            <a
                                                href={siteConfig.qqGroupInfo.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center"
                                            >
                                                申请入群
                                                <ArrowUpRight className="ml-2 h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 为什么需要验证？ */}
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/30">
                        <h4 className="font-medium flex items-center gap-2 mb-3">
                            <Smartphone className="h-4 w-4 text-blue-500" />
                            <span>为什么需要验证？</span>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            为了保证社区交流环境的质量，防止无关人员进入，我们要求加入群组的用户进行简单的身份验证。
                            管理员会在24小时内处理您的申请。
                        </p>
                    </div>
                </div>
            )}

            {/* 微信群内容 - 最终优化版 */}
            {activeTab === 'wechat' && (
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 flex flex-col items-center">
                            {loading ? (
                                <div className="bg-gray-200 animate-pulse rounded-lg w-64 h-64 flex items-center justify-center">
                                    <MessageSquare className="h-24 w-24 text-green-500/30" />
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                                        <img
                                            src="/group/wx.jpg"
                                            alt="微信个人二维码"
                                            className="w-64 h-64 object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                                        扫码添加
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 w-full">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-xl">
                                        <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">综合交流群</h3>
                                        <p className="text-sm text-muted-foreground">
                                            MKFramework 官方微信群
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-medium mb-2">添加方式</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {'扫码添加管理员微信，备注"进群"，通过后会被邀请进群'}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium flex items-center gap-2 mb-3">
                                            <QrCode className="h-4 w-4 text-green-500" />
                                            <span>入群须知</span>
                                        </h4>
                                        <div className="bg-white dark:bg-background rounded-lg p-4 text-sm space-y-2">
                                            <p className="flex items-start">
                                                <span className="font-medium mr-2">1.</span>
                                                <span>在群内交流框架和Cocos相关的问题</span>
                                            </p>
                                            <p className="flex items-start">
                                                <span className="font-medium mr-2">2.</span>
                                                <span>
                                                    禁止与游戏无关的广告，单个广告每天最多一次
                                                </span>
                                            </p>
                                            <p className="flex items-start text-red-500 dark:text-red-400">
                                                <span className="font-medium mr-2">3.</span>
                                                <span>
                                                    禁止讨论政治内容、攻击他人，违规者将被移出群组
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* 为什么需要验证？ */}
                                    <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                                        <h4 className="font-medium flex items-center gap-2 mb-2">
                                            <Smartphone className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                            <span>为什么需要验证？</span>
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            为了保证社区交流环境的质量，防止无关人员进入，我们要求加入群组的用户进行简单的身份验证。
                                            管理员会在24小时内处理您的申请。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
