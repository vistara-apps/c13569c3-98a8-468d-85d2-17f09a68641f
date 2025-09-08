# DuaFlow - Base Mini App

Never miss a spiritual practice. Organize your divine connections.

## Features

- **Daily Dua Reminders**: Receive timely notifications for specific Duas with customizable preferences
- **Smart Bookmark Organization**: Save and organize spiritual content with tags and categories
- **Farcaster Frame Integration**: Interact with Dua reminders directly within Farcaster frames
- **Base Chain Integration**: Built on Base with OnchainKit for seamless Web3 experience

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit & MiniKit)
- **Styling**: Tailwind CSS with custom Islamic design system
- **TypeScript**: Full type safety throughout
- **Social**: Farcaster integration for social features

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your OnchainKit API key:
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design System

The app uses a custom Islamic-inspired design system with:

- **Colors**: Islamic green (#10b981) and accent teal (#14b8a6)
- **Typography**: Amiri font for Arabic text, modern sans-serif for English
- **Components**: Glass morphism cards with subtle shadows
- **Layout**: Mobile-first responsive design optimized for mini-apps

## Data Model

### User
- userId (Farcaster ID or Wallet Address)
- username
- notificationPreferences
- savedBookmarks

### Bookmark
- bookmarkId
- userId
- contentTitle
- contentBody
- sourceUrl
- tags
- createdAt
- ipfsHash (optional)

### Reminder
- reminderId
- userId
- duaTitle
- duaText
- duaArabic
- scheduledTime
- notificationSent
- createdAt

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ for the Muslim community on Base & Farcaster.
