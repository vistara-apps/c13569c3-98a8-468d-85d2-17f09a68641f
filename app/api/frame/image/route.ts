import { NextRequest, NextResponse } from 'next/server';
import { DAILY_DUAS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'welcome';
    const duaId = searchParams.get('duaId');
    const message = searchParams.get('message');

    // Generate SVG image based on type
    let svg: string;

    switch (type) {
      case 'daily-dua':
        const dua = DAILY_DUAS.find(d => d.id === duaId) || DAILY_DUAS[0];
        svg = generateDuaSVG(dua);
        break;
      
      case 'success':
        svg = generateSuccessSVG(message || 'Success!');
        break;
      
      case 'error':
        svg = generateErrorSVG(message || 'An error occurred');
        break;
      
      case 'welcome':
      default:
        svg = generateWelcomeSVG();
        break;
    }

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Frame image generation error:', error);
    
    // Return a fallback error image
    const errorSvg = generateErrorSVG('Image generation failed');
    return new Response(errorSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }
}

function generateDuaSVG(dua: any): string {
  const arabicText = dua.arabic || '';
  const translationText = dua.translation || '';
  const titleText = dua.title || '';
  
  // Truncate text if too long
  const maxArabicLength = 80;
  const maxTranslationLength = 120;
  const displayArabic = arabicText.length > maxArabicLength 
    ? arabicText.substring(0, maxArabicLength) + '...' 
    : arabicText;
  const displayTranslation = translationText.length > maxTranslationLength 
    ? translationText.substring(0, maxTranslationLength) + '...' 
    : translationText;

  return `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Pattern overlay -->
      <pattern id="pattern" patternUnits="userSpaceOnUse" width="60" height="60">
        <circle cx="30" cy="30" r="2" fill="rgba(255,255,255,0.1)"/>
      </pattern>
      <rect width="1200" height="630" fill="url(#pattern)"/>
      
      <!-- Main content card -->
      <rect x="80" y="80" width="1040" height="470" rx="24" fill="rgba(255,255,255,0.95)" filter="url(#shadow)"/>
      
      <!-- Header -->
      <text x="600" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#1F2937">
        🕌 ${titleText}
      </text>
      
      <!-- Arabic text -->
      <text x="600" y="220" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="normal" fill="#374151" direction="rtl">
        ${displayArabic}
      </text>
      
      <!-- Translation -->
      <foreignObject x="120" y="260" width="960" height="200">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          font-family: Arial, sans-serif;
          font-size: 24px;
          line-height: 1.5;
          color: #4B5563;
          text-align: center;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        ">
          "${displayTranslation}"
        </div>
      </foreignObject>
      
      <!-- Footer -->
      <text x="600" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#6B7280">
        DuaFlow - Never miss a spiritual practice
      </text>
    </svg>
  `;
}

function generateSuccessSVG(message: string): string {
  return `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="successBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#successBg)"/>
      
      <!-- Main content card -->
      <rect x="150" y="150" width="900" height="330" rx="24" fill="rgba(255,255,255,0.95)" filter="url(#shadow)"/>
      
      <!-- Success icon -->
      <circle cx="600" cy="250" r="40" fill="#10B981"/>
      <path d="M580 250 L595 265 L620 235" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      
      <!-- Message -->
      <foreignObject x="200" y="320" width="800" height="100">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          font-family: Arial, sans-serif;
          font-size: 28px;
          font-weight: 600;
          color: #1F2937;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        ">
          ${message}
        </div>
      </foreignObject>
      
      <!-- Footer -->
      <text x="600" y="560" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.8)">
        DuaFlow
      </text>
    </svg>
  `;
}

function generateErrorSVG(message: string): string {
  return `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="errorBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#EF4444;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#DC2626;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#errorBg)"/>
      
      <!-- Main content card -->
      <rect x="150" y="150" width="900" height="330" rx="24" fill="rgba(255,255,255,0.95)" filter="url(#shadow)"/>
      
      <!-- Error icon -->
      <circle cx="600" cy="250" r="40" fill="#EF4444"/>
      <path d="M580 230 L620 270 M620 230 L580 270" stroke="white" stroke-width="4" stroke-linecap="round"/>
      
      <!-- Message -->
      <foreignObject x="200" y="320" width="800" height="100">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          font-family: Arial, sans-serif;
          font-size: 28px;
          font-weight: 600;
          color: #1F2937;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        ">
          ${message}
        </div>
      </foreignObject>
      
      <!-- Footer -->
      <text x="600" y="560" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.8)">
        DuaFlow
      </text>
    </svg>
  `;
}

function generateWelcomeSVG(): string {
  return `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="welcomeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#059669;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#welcomeBg)"/>
      
      <!-- Pattern overlay -->
      <pattern id="welcomePattern" patternUnits="userSpaceOnUse" width="80" height="80">
        <circle cx="40" cy="40" r="2" fill="rgba(255,255,255,0.1)"/>
      </pattern>
      <rect width="1200" height="630" fill="url(#welcomePattern)"/>
      
      <!-- Main content card -->
      <rect x="100" y="100" width="1000" height="430" rx="24" fill="rgba(255,255,255,0.95)" filter="url(#shadow)"/>
      
      <!-- Logo/Icon -->
      <text x="600" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="64">🕌</text>
      
      <!-- Title -->
      <text x="600" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#1F2937">
        DuaFlow
      </text>
      
      <!-- Tagline -->
      <text x="600" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#4B5563">
        Never miss a spiritual practice
      </text>
      
      <!-- Subtitle -->
      <text x="600" y="370" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#6B7280">
        Organize your divine connections
      </text>
      
      <!-- Call to action -->
      <rect x="450" y="420" width="300" height="60" rx="30" fill="#10B981"/>
      <text x="600" y="460" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="white">
        Start Your Journey
      </text>
      
      <!-- Footer -->
      <text x="600" y="580" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.7)">
        Powered by Base & Farcaster
      </text>
    </svg>
  `;
}
