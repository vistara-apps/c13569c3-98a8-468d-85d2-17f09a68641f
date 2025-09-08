import { DuaContent } from './types';

export const DAILY_DUAS: DuaContent[] = [
  {
    id: '1',
    title: 'Morning Dhikr',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Asbahna wa asbahal-mulku lillahi, walhamdu lillah',
    translation: 'We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.',
    category: 'Morning',
    source: 'Muslim',
    benefits: 'Protection and blessings for the day'
  },
  {
    id: '2',
    title: 'Evening Dhikr',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Amsayna wa amsal-mulku lillahi, walhamdu lillah',
    translation: 'We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.',
    category: 'Evening',
    source: 'Muslim',
    benefits: 'Protection and peace for the night'
  },
  {
    id: '3',
    title: 'Before Sleep',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your name, O Allah, I die and I live.',
    category: 'Sleep',
    source: 'Bukhari',
    benefits: 'Peaceful sleep and protection'
  },
  {
    id: '4',
    title: 'Upon Waking',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana baada ma amatana wa ilayhin-nushur',
    translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
    category: 'Morning',
    source: 'Bukhari',
    benefits: 'Gratitude for a new day'
  }
];

export const DUA_CATEGORIES = [
  'Morning',
  'Evening',
  'Sleep',
  'Travel',
  'Food',
  'Protection',
  'Forgiveness',
  'Gratitude'
];

export const DEFAULT_NOTIFICATION_TIMES = [
  '06:00', // Fajr time
  '12:00', // Dhuhr time
  '15:00', // Asr time
  '18:00', // Maghrib time
  '20:00', // Isha time
];
