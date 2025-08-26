import { ComponentProps } from 'react';
import NextImage from 'next/image';

type Height = ComponentProps<typeof NextImage>['height'];
type Width = ComponentProps<typeof NextImage>['width'];

export default function Image({
    src,
    alt = 'alt',
    width = 0,
    height = 0,
    ...props
}: ComponentProps<'img'>) {
    if (!src) return null;

    return (
        <NextImage
            className="w-auto h-auto"
            src={src as string}
            alt={alt}
            width={width as Width}
            height={height as Height}
            quality={40}
            {...props}
        />
    );
}
