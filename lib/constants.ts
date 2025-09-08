import { DuaContent } from './types';

// Daily Duas collection for DuaFlow
export const DAILY_DUAS: DuaContent[] = [
  {
    id: 'morning-1',
    title: 'Morning Remembrance',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Asbahna wa asbahal-mulku lillahi, walhamdu lillah',
    translation: 'We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.',
    category: 'Morning',
    source: 'Muslim',
    benefits: 'Protection and blessings for the day'
  },
  {
    id: 'morning-2',
    title: 'Seeking Allah\'s Protection',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration: 'Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan-nushur',
    translation: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.',
    category: 'Morning',
    source: 'Abu Dawud, At-Tirmidhi',
    benefits: 'Acknowledging Allah\'s sovereignty over life and death'
  },
  {
    id: 'evening-1',
    title: 'Evening Remembrance',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Amsayna wa amsal-mulku lillahi, walhamdu lillah',
    translation: 'We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.',
    category: 'Evening',
    source: 'Muslim',
    benefits: 'Evening protection and gratitude'
  },
  {
    id: 'evening-2',
    title: 'Seeking Evening Protection',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    transliteration: 'Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal-masir',
    translation: 'O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.',
    category: 'Evening',
    source: 'Abu Dawud, At-Tirmidhi',
    benefits: 'Evening protection and remembrance of the afterlife'
  },
  {
    id: 'general-1',
    title: 'Seeking Forgiveness',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha alladhi la ilaha illa huwal-hayyul-qayyumu wa atubu ilayh',
    translation: 'I seek forgiveness of Allah, besides whom, none has the right to be worshipped except He, The Ever Living, The Self-Subsisting and Supporter of all, and I turn to Him in repentance.',
    category: 'Forgiveness',
    source: 'Abu Dawud, At-Tirmidhi',
    benefits: 'Forgiveness of sins and spiritual purification'
  },
  {
    id: 'general-2',
    title: 'Praising Allah',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'Subhanallahi wa bihamdihi, subhanallahil-azim',
    translation: 'How perfect Allah is and I praise Him. How perfect Allah is, The Supreme.',
    category: 'Gratitude',
    source: 'Bukhari, Muslim',
    benefits: 'Heavy on the scales of good deeds'
  },
  {
    id: 'protection-1',
    title: 'Seeking Allah\'s Protection',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A\'udhu bikalimatillahit-tammati min sharri ma khalaq',
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    category: 'Protection',
    source: 'Muslim',
    benefits: 'Protection from all forms of harm'
  },
  {
    id: 'sleep-1',
    title: 'Before Sleep',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your name, O Allah, I die and I live.',
    category: 'Sleep',
    source: 'Bukhari',
    benefits: 'Peaceful sleep and protection'
  },
  {
    id: 'waking-1',
    title: 'Upon Waking',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana baada ma amatana wa ilayhin-nushur',
    translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
    category: 'Morning',
    source: 'Bukhari',
    benefits: 'Gratitude for a new day'
  },
  {
    id: 'travel-1',
    title: 'Travel Dua',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun',
    translation: 'How perfect He is, the One Who has placed this (transport) at our service, and we ourselves would not have been capable of that, and to our Lord is our final destiny.',
    category: 'Travel',
    source: 'Abu Dawud, At-Tirmidhi',
    benefits: 'Safe travel and protection on journeys'
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

// App configuration constants
export const APP_CONFIG = {
  name: 'DuaFlow',
  tagline: 'Never miss a spiritual practice. Organize your divine connections.',
  version: '1.0.0',
  colors: {
    primary: 'hsl(210, 70%, 50%)',
    accent: 'hsl(160, 70%, 50%)',
    background: 'hsl(210, 36%, 96%)',
    surface: 'hsl(210, 36%, 98%)',
    text: 'hsl(210, 30%, 15%)',
    muted: 'hsl(210, 30%, 35%)',
  },
  defaultNotificationTimes: ['06:00', '18:00'],
  defaultDuaCategories: ['Morning', 'Evening'],
};

// Notification preferences structure
export const DEFAULT_NOTIFICATION_PREFERENCES = {
  enabled: true,
  morningReminder: true,
  eveningReminder: true,
  customTimes: APP_CONFIG.defaultNotificationTimes,
  duaTypes: APP_CONFIG.defaultDuaCategories,
  soundEnabled: true,
  vibrationEnabled: true,
};

// Common tags for bookmarks
export const COMMON_BOOKMARK_TAGS = [
  'dua',
  'morning',
  'evening',
  'protection',
  'gratitude',
  'guidance',
  'peace',
  'quran',
  'hadith',
  'dhikr',
  'favorite',
  'daily',
];

// Time slots for reminders
export const TIME_SLOTS = [
  { value: '05:00', label: 'Fajr (5:00 AM)' },
  { value: '06:00', label: 'Early Morning (6:00 AM)' },
  { value: '07:00', label: 'Morning (7:00 AM)' },
  { value: '08:00', label: '8:00 AM' },
  { value: '12:00', label: 'Dhuhr (12:00 PM)' },
  { value: '13:00', label: 'After Dhuhr (1:00 PM)' },
  { value: '15:00', label: 'Asr (3:00 PM)' },
  { value: '16:00', label: 'After Asr (4:00 PM)' },
  { value: '18:00', label: 'Maghrib (6:00 PM)' },
  { value: '19:00', label: 'After Maghrib (7:00 PM)' },
  { value: '20:00', label: 'Isha (8:00 PM)' },
  { value: '21:00', label: 'After Isha (9:00 PM)' },
  { value: '22:00', label: 'Before Sleep (10:00 PM)' },
];

// Frame configuration
export const FRAME_CONFIG = {
  aspectRatio: '1.91:1' as const,
  imageWidth: 1200,
  imageHeight: 630,
  maxButtons: 4,
  maxTextLength: 280,
};

// API endpoints
export const API_ENDPOINTS = {
  auth: '/api/auth',
  bookmarks: '/api/bookmarks',
  reminders: '/api/reminders',
  frame: '/api/frame',
  frameImage: '/api/frame/image',
} as const;
