import React from 'react';

export const SkullIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-2-9a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm-2 4c-2.43 0-4.414-1.638-4.912-3.854a1 1 0 111.936-.436C9.42 13.921 10.63 15 12 15s2.58-1.079 2.976-2.29a1 1 0 111.936.436C16.414 15.362 14.43 17 12 17z" />
  </svg>
);

export const GhostIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2a9.963 9.963 0 00-7.393 3.387A9.963 9.963 0 002 12c0 5.523 4.477 10 10 10 .377 0 .749-.025 1.117-.07a1 1 0 00.86-1.16l-.75-3.75a1 1 0 01.273-.928L17 12.5a1 1 0 00-.273-1.654l-3.75-.75a1 1 0 01-.928-.273L8.5 6.273a1 1 0 00-1.654-.273l-.75 3.75a1 1 0 01-.928.273l-3.543-.708A8.01 8.01 0 014 12a8 8 0 018-8 7.91 7.91 0 013.75.928A8.01 8.01 0 0120 12a8 8 0 01-8 8zm-3-7a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
);

export const FilmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h16v2H4V6zm0 4h3v2H4v-2zm0 4h3v2H4v-2zm5 0h6v2H9v-2zm8-4h3v2h-3v-2zm-8-4h6v2H9V6zm8 0h3v2h-3V6zm-8 8h6v2H9v-2zm8 0h3v2h-3v-2z" />
  </svg>
);

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636l4.95 4.95z" />
  </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 15l5-5h-4V4h-2v6H7l5 5zm-6 2h12v2H6v-2z" />
  </svg>
);
