import React from 'react';

type ImageSrc = string | { src: string };

type ImgProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  src: ImageSrc;
  alt?: string;
};

const NextImageMock: React.FC<ImgProps> = ({ src, alt = '', ...rest }) => {
  const resolved = typeof src === 'string' ? src : (src as { src?: string })?.src ?? '';
  return React.createElement('img', { src: resolved, alt, ...rest });
};

export default NextImageMock;
