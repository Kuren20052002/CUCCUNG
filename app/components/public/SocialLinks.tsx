import React from 'react';

export const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M9.101 24V13.481H6.079v-3.546h3.022V7.456c0-2.997 1.83-4.63 4.503-4.63 1.282 0 2.384.094 2.705.137v3.135h-1.854c-1.455 0-1.737.691-1.737 1.706v2.231h3.469l-.452 3.546h-3.017V24H9.101z" />
  </svg>
);

export const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
);

export const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

export const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/ngoanxinhlU',
    icon: FacebookIcon,
    hoverBg: 'hover:bg-[#1877F2]',
  },
  {
    name: 'X (Twitter)',
    href: 'https://x.com/NgoanXinhlU',
    icon: XIcon,
    hoverBg: 'hover:bg-black',
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@ngoanxinhlu',
    icon: TikTokIcon,
    hoverBg: 'hover:bg-black',
  },
];
