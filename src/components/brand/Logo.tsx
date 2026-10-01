import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md'
}) => {
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16'
  }[size];

  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 110 102"
        className={`${heightClasses} w-auto ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Digital Hashtag Emblem"
      >
        <defs>
          <linearGradient id="dh_d_mark_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F99B1D" />
            <stop offset="50%" stopColor="#F58220" />
            <stop offset="100%" stopColor="#EE6500" />
          </linearGradient>
        </defs>
        <g transform="translate(2, 2)">
          <path
            d="M6 2 H48 C80 2 100 24 100 49 C100 74 80 96 48 96 H6 V80 H46 C68 80 82 66 82 49 C82 32 68 18 46 18 H6 Z"
            fill="url(#dh_d_mark_grad)"
          />
          <rect x="14" y="22" width="13" height="54" rx="2" fill="#282B33" />
          <rect x="38" y="22" width="13" height="54" rx="2" fill="#282B33" />
          <rect x="0" y="36" width="65" height="13" rx="2" fill="#323640" />
          <rect x="0" y="57" width="65" height="13" rx="2" fill="#323640" />
          <rect x="14" y="36" width="13" height="13" fill="#202229" opacity="0.6" />
          <rect x="38" y="36" width="13" height="13" fill="#202229" opacity="0.6" />
          <rect x="14" y="57" width="13" height="13" fill="#202229" opacity="0.6" />
          <rect x="38" y="57" width="13" height="13" fill="#202229" opacity="0.6" />
        </g>
      </svg>
    );
  }

  // Full official logo as provided in reference image
  return (
    <svg
      viewBox="0 0 540 106"
      className={`${heightClasses} w-auto ${className} select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Digital Hashtag - We Create Your Identity"
    >
      <defs>
        <linearGradient id="dh_d_grad_comp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F99B1D" />
          <stop offset="50%" stopColor="#F58220" />
          <stop offset="100%" stopColor="#EE6500" />
        </linearGradient>
      </defs>

      {/* Left Icon: Stylized Orange D with nested Charcoal Hashtag */}
      <g transform="translate(4, 2)">
        <path
          d="M8 4 H50 C82 4 102 26 102 51 C102 76 82 98 50 98 H8 V82 H48 C70 82 84 68 84 51 C84 34 70 20 48 20 H8 Z"
          fill="url(#dh_d_grad_comp)"
        />
        <rect x="16" y="24" width="13" height="54" rx="2" fill="#282B33" />
        <rect x="40" y="24" width="13" height="54" rx="2" fill="#282B33" />
        <rect x="2" y="38" width="65" height="13" rx="2" fill="#323640" />
        <rect x="2" y="59" width="65" height="13" rx="2" fill="#323640" />
        <rect x="16" y="38" width="13" height="13" fill="#202229" opacity="0.6" />
        <rect x="40" y="38" width="13" height="13" fill="#202229" opacity="0.6" />
        <rect x="16" y="59" width="13" height="13" fill="#202229" opacity="0.6" />
        <rect x="40" y="59" width="13" height="13" fill="#202229" opacity="0.6" />
      </g>

      {/* DIGITAL (Orange) */}
      <text
        x="122"
        y="60"
        fontFamily="'Plus Jakarta Sans', 'Montserrat', 'Inter', -apple-system, sans-serif"
        fontSize="44"
        fontWeight="400"
        letterSpacing="1"
        fill="#F58220"
      >
        DIGITAL
      </text>

      {/* HASHTAG (Charcoal Bold) */}
      <text
        x="300"
        y="60"
        fontFamily="'Plus Jakarta Sans', 'Montserrat', 'Inter', -apple-system, sans-serif"
        fontSize="44"
        fontWeight="800"
        letterSpacing="0.5"
        fill="#2B2E38"
      >
        HASHTAG
      </text>

      {/* Trademark (TM) in circle */}
      <g transform="translate(506, 26)">
        <circle cx="11" cy="11" r="10" stroke="#2B2E38" strokeWidth="1.8" fill="none" />
        <text
          x="11"
          y="15"
          fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
          fontSize="9"
          fontWeight="700"
          textAnchor="middle"
          fill="#2B2E38"
        >
          TM
        </text>
      </g>

      {/* Tagline: WE CREATE YOUR IDENTITY */}
      <text
        x="318"
        y="88"
        fontFamily="'Plus Jakarta Sans', 'Montserrat', 'Inter', -apple-system, sans-serif"
        fontSize="14"
        fontWeight="500"
        letterSpacing="6.8"
        textAnchor="middle"
        fill="#F58220"
      >
        WE CREATE YOUR IDENTITY
      </text>
    </svg>
  );
};
