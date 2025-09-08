import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Daily Dua Reminder';
  const completed = searchParams.get('completed') === 'true';
  const bookmarked = searchParams.get('bookmarked') === 'true';

  // Create SVG image for the frame
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#14b8a6;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Pattern overlay -->
      <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/>
      </pattern>
      <rect width="1200" height="630" fill="url(#pattern)"/>
      
      <!-- Main card -->
      <rect x="100" y="100" width="1000" height="430" rx="24" fill="rgba(255,255,255,0.95)" filter="url(#shadow)"/>
      
      <!-- Header -->
      <text x="150" y="180" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#1f2937">
        DuaFlow
      </text>
      
      <!-- Subtitle -->
      <text x="150" y="220" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">
        Never miss a spiritual practice
      </text>
      
      <!-- Title -->
      <text x="150" y="300" font-family="Arial, sans-serif" font-size="36" font-weight="600" fill="#1f2937">
        ${title.length > 40 ? title.substring(0, 40) + '...' : title}
      </text>
      
      <!-- Status indicator -->
      ${completed ? `
        <circle cx="150" cy="380" r="12" fill="#10b981"/>
        <text x="180" y="390" font-family="Arial, sans-serif" font-size="24" fill="#10b981">
          ✓ Completed
        </text>
      ` : bookmarked ? `
        <circle cx="150" cy="380" r="12" fill="#f59e0b"/>
        <text x="180" y="390" font-family="Arial, sans-serif" font-size="24" fill="#f59e0b">
          📖 Bookmarked
        </text>
      ` : `
        <circle cx="150" cy="380" r="12" fill="#6b7280"/>
        <text x="180" y="390" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">
          🤲 Ready for practice
        </text>
      `}
      
      <!-- Islamic pattern decoration -->
      <g transform="translate(800, 200)" opacity="0.1">
        <circle cx="0" cy="0" r="80" fill="none" stroke="#1f2937" stroke-width="2"/>
        <circle cx="0" cy="0" r="60" fill="none" stroke="#1f2937" stroke-width="2"/>
        <circle cx="0" cy="0" r="40" fill="none" stroke="#1f2937" stroke-width="2"/>
        <circle cx="0" cy="0" r="20" fill="none" stroke="#1f2937" stroke-width="2"/>
      </g>
      
      <!-- Footer -->
      <text x="600" y="580" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.8)" text-anchor="middle">
        Built on Base with ❤️ for the Muslim community
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
