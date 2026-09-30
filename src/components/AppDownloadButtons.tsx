import React from 'react';

export function AppleLogo({ className = 'w-6 h-7 text-white fill-current' }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 170" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.64-13.99-5.99-9.13-10.7-19.46-14.13-30.98-3.43-11.52-5.15-22.39-5.15-32.61 0-14.68 3.7-26.75 11.09-36.21 7.4-9.46 16.7-14.28 27.91-14.46 4.35 0 9.28 1.13 14.79 3.39 5.51 2.26 9.37 3.44 11.59 3.53 2.01 0 5.99-1.25 11.94-3.75 5.95-2.5 11.21-3.6 15.78-3.3 11.52.76 20.88 4.97 28.08 12.63-9.9 5.99-14.73 14.47-14.49 25.44.25 8.7 3.57 15.93 9.96 21.69 6.39 5.76 13.9 8.97 22.53 9.63-2.07 6.31-4.7 12.61-7.89 18.91zM119.22 33.15c0-6.85 2.5-13.25 7.5-19.2 5-5.95 11.19-9.68 18.57-11.19.43 1.09.65 2.18.65 3.27 0 6.63-2.61 13.1-7.83 19.41-5.22 6.31-11.52 10.06-18.89 11.26v-3.55z" />
    </svg>
  );
}

export function GooglePlayLogo({ className = 'w-6 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#00E676" />
      <path d="M47 0C34 6.8 24 19.8 24 35.2v441.6c0 15.4 10 28.4 23 35.2l255.4-255.4L47 0z" fill="#00D3FF" />
      <path d="M325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z" fill="#FF3A44" />
      <path d="M482.4 238.4l-75.3-43.2-60.4 60.4 60.4 60.4 75.3-43.2c16.3-9.4 16.3-25 0-34.4z" fill="#FFC800" />
    </svg>
  );
}

interface AppButtonProps {
  className?: string;
  appleUrl?: string;
  playUrl?: string;
}

export function AppStoreButton({
  url = 'https://apps.apple.com/us/app/ushspa/id6771279814',
  className = '',
}: {
  url?: string;
  className?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download USH Spa on Apple App Store"
      className={`inline-flex items-center justify-center bg-[#171717] hover:bg-[#262626] active:scale-95 transition-all duration-300 w-[140px] h-[52px] rounded-[16px] shadow-md hover:shadow-lg border border-white/10 ${className}`}
    >
      <AppleLogo className="w-6 h-7 text-white" />
    </a>
  );
}

export function GooglePlayButton({
  url = 'https://play.google.com/store/apps/details?id=com.spaush.ushspa',
  className = '',
}: {
  url?: string;
  className?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get USH Spa on Google Play"
      className={`inline-flex items-center justify-center bg-[#171717] hover:bg-[#262626] active:scale-95 transition-all duration-300 w-[140px] h-[52px] rounded-[16px] shadow-md hover:shadow-lg border border-white/10 ${className}`}
    >
      <GooglePlayLogo className="w-6 h-7" />
    </a>
  );
}

export default function AppDownloadButtons({
  className = '',
  appleUrl,
  playUrl,
}: AppButtonProps) {
  return (
    <div className={`flex items-center gap-3.5 flex-wrap ${className}`}>
      <AppStoreButton url={appleUrl} />
      <GooglePlayButton url={playUrl} />
    </div>
  );
}
