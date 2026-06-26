/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ArticlePart {
  partNumber: number;
  title: string;
  content: string; // Markdown content for this part
  readTime?: string;
  scholarQuote?: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string; // Fallback content or Part 1 content
  category: string;
  author: string;
  readTime: string;
  image?: string;
  isBookmarked?: boolean;
  date: string;
  authorImage?: string;
  featured?: boolean;
  scholarQuote?: string;
  parts?: ArticlePart[]; // Array of parts for multi-part articles
  tags?: string[]; // Tags for filtering and categorization
}

export interface Verse {
  number: number;
  text: string;
  translationAmharic: string;
  translationEnglish: string;
  transliteration?: string;
}

export interface Surah {
  id: number;
  name: string;
  nameEnglish: string;
  totalVerses: number;
  type: 'Meccan' | 'Medinan';
  verses: Verse[];
  bismillah: boolean;
}

export interface MessageReference {
  surahName: string;
  surahNumber: number;
  verseNumber: number;
  text: string;
  translation: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  reference?: MessageReference;
  loading?: boolean;
}

export interface QuranReference {
  surahId: number;
  verseNumber: number;
}

export type NoteBlockType = 'text' | 'verse' | 'doc_quote' | 'image' | 'canvas';

export interface NoteBlock {
  id: string;
  type: NoteBlockType;
  content: string; // text content, specific quote, or canvas drawing description
  // Quran Properties
  surahId?: number; // for 'verse' type
  verseNumber?: number; // for 'verse' type (start verse)
  endVerseNumber?: number; // for 'verse' type (optional end verse for range selection)
  showArabic?: boolean;
  showAmharic?: boolean;
  showEnglish?: boolean;
  
  // Bible Properties
  bibleBookId?: number; // for 'verse' type of Bible
  bibleChapter?: number; // for Bible chapter
  bibleVerseNumber?: number; // for Bible start verse
  bibleEndVerseNumber?: number; // for Bible end verse
  showOriginal?: boolean; // for Bible original language Hebrew/Greek
  
  // Image & Canvas Properties
  imageUrl?: string; // for 'image' block type
  canvasData?: string; // serialized canvas paths/drawings or base64 data url
  
  // Layout customization fields
  hideNumbers?: boolean; // Hide verse numbers for smooth reading
  layoutStyle?: 'stacked' | 'parallel'; // Stacked vs. side-by-side comparison column layout
  
  // Academic Docs Properties
  docId?: string; // for 'doc_quote' type
  docPage?: number; // for 'doc_quote' type
}

export interface StudyNote {
  id: string;
  title: string;
  content: string; // Plain-text fallback for backward compatibility
  createdAt: string;
  updatedAt: string;
  references: QuranReference[]; // Extracted summary list of references
  attachedDocId?: string; // ID of any attached reference paper/PDF
  blocks?: NoteBlock[]; // Rich, interactive block stream (Canva-like flow)
}

export interface ReferenceDoc {
  id: string;
  title: string;
  author: string;
  category: string;
  url?: string; // can be virtual or real link
  content: string; // text representation for reading/searching
  pagesCount: number;
}

