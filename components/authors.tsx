'use client';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Link } from 'lucide-react';

export function Authors({ authors }: { authors: any[] }) {
    return (
        <div className="flex items-center gap-8 flex-wrap">
            {authors.map((author: any) => {
                return (
                    <Link
                        href={author.handleUrl}
                        className="flex items-center gap-2"
                        key={author.username}
                    >
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={author.avatar} />
                            <AvatarFallback>
                                {author.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="">
                            <p className="text-sm font-medium">{author.username}</p>
                            <p className="font-code text-[13px] text-muted-foreground">
                                @{author.handle}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
