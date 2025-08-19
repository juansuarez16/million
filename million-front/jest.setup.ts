import '@testing-library/jest-dom';
import 'whatwg-fetch';
import React from 'react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: {
    src: string | { src?: string };
    alt?: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
    loading?: 'eager' | 'lazy';
    referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>['referrerPolicy'];
    fill?: boolean;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    quality?: number | string;
    sizes?: string;
    onLoadingComplete?: unknown;
    loader?: unknown;
  } & Record<string, unknown>) => {
    const {
      src,
      alt = '',
      width,
      height,
      className,
      style,
      loading,
      referrerPolicy
    } = props;

    const resolved = typeof src === 'string' ? src : src?.src ?? '';

    return React.createElement('img', {
      src: resolved,
      alt,
      width,
      height,
      className,
      style,
      loading,
      referrerPolicy
    });
  }
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/'
}));

process.env.NEXT_PUBLIC_API_BASE ||= 'https://api.example.test';
