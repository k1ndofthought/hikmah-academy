/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Download, 
  Library, 
  Book, 
  Search, 
  ChevronDown, 
  Bookmark, 
  Share2, 
  ArrowLeft, 
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Surah } from '../types';
import { quranData } from '../data/quran';
import QuranView from './QuranView';
import { bibleData, BibleBook, BibleVerse } from '../data/bible';
import { authorsData, ScholarBook, ScholarAuthor } from '../data/authors';

interface ReadViewProps {
  onStartRecitation: (surah: Surah, verseNumber: number) => void;
  activeVerseNumber: number | null;
  bookmarkedVerses: string[];
  onToggleVerseBookmark: (surahId: number, verseNumber: number) => void;
  initialSurahId?: number | null;
  initialVerseNumber?: number | null;
  clearInitialSurahAndVerse?: () => void;
  initialBibleBookId?: number | null;
  initialBibleChapter?: number | null;
  initialBibleVerseNumber?: number | null;
  clearInitialBibleLink?: () => void;
  scholars?: Record<string, ScholarAuthor>;
}

export interface BibleVersion {
  id: string;
  name: string;
  nameEnglish: string;
  lang: 'amharic' | 'english' | 'original';
  description: string;
  size: string;
}

export const BIBLE_VERSIONS: BibleVersion[] = [
  { id: 'am_orth', name: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ 1954 (ዕትም)', nameEnglish: 'Amharic Orthodox Bible 1954', lang: 'amharic', description: 'ክላሲካል የአማርኛ ትርጉም ከጥንታዊ ምንጮች ጋር የተዋሐደ። (Pre-installed)', size: '4.8 MB' },
  { id: 'am_std', name: 'አማርኛ አዲሱ መደበኛ ትርጉም', nameEnglish: 'Amharic New Standard Version', lang: 'amharic', description: 'ዘመናዊ፣ ግልጽ እና በቀላሉ የሚረዳ የአማርኛ ትርጉም። (Requires App-Storage)', size: '3.9 MB' },
  { id: 'en_kjv', name: 'ኪንግ ጄምስ ቨርሽን (KJV)', nameEnglish: 'King James Version (KJV)', lang: 'english', description: 'Classical, poetic, and highly precise literal English translation.', size: '4.2 MB' },
  { id: 'en_esv', name: 'እንግሊዝኛ ስታንዳርድ ቨርሽን (ESV)', nameEnglish: 'English Standard Version', lang: 'english', description: 'Highly accurate, modern word-for-word literary translation.', size: '4.5 MB' },
  { id: 'original', name: 'የመጀመሪያው ኮዴክስ (እብራይስጥ/ግሪክ)', nameEnglish: 'Original Hebrew & Greek Codex', lang: 'original', description: 'Original scriptural languages (Hebrew Masoretic & Greek Textus Receptus).', size: '5.6 MB' },
];

export default function ReadView({
  onStartRecitation,
  activeVerseNumber,
  bookmarkedVerses,
  onToggleVerseBookmark,
  initialSurahId,
  initialVerseNumber,
  clearInitialSurahAndVerse,
  initialBibleBookId,
  initialBibleChapter,
  initialBibleVerseNumber,
  clearInitialBibleLink,
  scholars
}: ReadViewProps) {
  // Modes: 'quran' | 'bible' | 'other'
  const [activeSubTab, setActiveSubTab] = useState<'quran' | 'bible' | 'other'>('quran');

  // Bible Versions & Download States
  const [downloadedBibleVersions, setDownloadedBibleVersions] = useState<string[]>(() => {
    const cached = localStorage.getItem('downloaded_bible_versions');
    return cached ? JSON.parse(cached) : ['am_orth']; // am_orth is pre-loaded
  });
  const [selectedBibleVersionId, setSelectedBibleVersionId] = useState<string>('am_orth');
  const [downloadingBibleVersion, setDownloadingBibleVersion] = useState<string | null>(null);
  const [bibleVersionProgress, setBibleVersionProgress] = useState<number>(0);

  // Bible States
  const [selectedBibleBook, setSelectedBibleBook] = useState<BibleBook>(bibleData[0]);
  const [selectedBibleChapter, setSelectedBibleChapter] = useState<number>(1);
  const [showBibleBookDropdown, setShowBibleBookDropdown] = useState(false);
  const [bibleLang, setBibleLang] = useState<'amharic' | 'english' | 'original'>('amharic');
  const [bookmarkedBibleVerses, setBookmarkedBibleVerses] = useState<string[]>([]); // "bookId:chapter:verseNum"

  const bibleVerseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [highlightedBibleVerse, setHighlightedBibleVerse] = useState<number | null>(null);

  // Bible Deep Linking Effect
  useEffect(() => {
    if (initialBibleBookId) {
      const targetBook = bibleData.find(bk => bk.id === initialBibleBookId);
      if (targetBook) {
        setActiveSubTab('bible');
        setSelectedBibleBook(targetBook);
        const targetChapter = initialBibleChapter || 1;
        setSelectedBibleChapter(targetChapter);

        const timer = setTimeout(() => {
          if (initialBibleVerseNumber) {
            const element = bibleVerseRefs.current[initialBibleVerseNumber];
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setHighlightedBibleVerse(initialBibleVerseNumber);
              setTimeout(() => {
                setHighlightedBibleVerse(null);
              }, 2500);
            }
          }
        }, 400);
        return () => clearTimeout(timer);
      }
      if (clearInitialBibleLink) {
        clearInitialBibleLink();
      }
    }
  }, [initialBibleBookId, initialBibleChapter, initialBibleVerseNumber]);

  // Scholar Books Download & Read States
  const [downloadedScholarBooks, setDownloadedScholarBooks] = useState<string[]>(() => {
    const cached = localStorage.getItem('downloaded_scholar_books');
    return cached ? JSON.parse(cached) : []; // initially empty to showcase download feature
  });
  const [downloadingScholarBookTitle, setDownloadingScholarBookTitle] = useState<string | null>(null);
  const [scholarBookProgress, setScholarBookProgress] = useState<number>(0);

  // Other Books States
  const [booksSearchQuery, setBooksSearchQuery] = useState('');
  const [readingScholasticBook, setReadingScholasticBook] = useState<{ book: ScholarBook; author: ScholarAuthor } | null>(null);
  const [readingBookPage, setReadingBookPage] = useState<number>(1);

  const startDownloadVersion = (versionId: string) => {
    setDownloadingBibleVersion(versionId);
    setBibleVersionProgress(0);
    const interval = setInterval(() => {
      setBibleVersionProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          const next = [...downloadedBibleVersions, versionId];
          setDownloadedBibleVersions(next);
          localStorage.setItem('downloaded_bible_versions', JSON.stringify(next));
          setDownloadingBibleVersion(null);
          setSelectedBibleVersionId(versionId);
          const ver = BIBLE_VERSIONS.find(v => v.id === versionId);
          if (ver) {
            setBibleLang(ver.lang);
          }
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  const startDownloadScholarBook = (title: string) => {
    setDownloadingScholarBookTitle(title);
    setScholarBookProgress(0);
    const interval = setInterval(() => {
      setScholarBookProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          const next = [...downloadedScholarBooks, title];
          setDownloadedScholarBooks(next);
          localStorage.setItem('downloaded_scholar_books', JSON.stringify(next));
          setDownloadingScholarBookTitle(null);
          return 100;
        }
        return p + 20;
      });
    }, 120);
  };

  // Collect all scholar books from authorsData
  const allScholarBooks: Array<{ book: ScholarBook; author: ScholarAuthor }> = [];
  const scholarsMap = scholars || authorsData;
  Object.values(scholarsMap).forEach((author) => {
    if (author.books && author.books.length > 0) {
      author.books.forEach((book) => {
        allScholarBooks.push({ book, author });
      });
    }
  });

  const filteredScholarBooks = allScholarBooks.filter((item) => {
    const query = booksSearchQuery.toLowerCase();
    return (
      item.book.title.toLowerCase().includes(query) ||
      item.book.description.toLowerCase().includes(query) ||
      item.author.name.toLowerCase().includes(query)
    );
  });

  const handleToggleBibleBookmark = (bookId: number, chapter: number, verseNum: number) => {
    const key = `${bookId}:${chapter}:${verseNum}`;
    const next = bookmarkedBibleVerses.includes(key)
      ? bookmarkedBibleVerses.filter(v => v !== key)
      : [...bookmarkedBibleVerses, key];
    setBookmarkedBibleVerses(next);
  };

  const handleShareBibleVerse = (bookName: string, chapter: number, verse: BibleVerse) => {
    const text = `${bookName} [Ch ${chapter}: Verse ${verse.number}]\n\nOriginal/Hebrew/Greek: ${verse.text}\n\nAmharic: ${verse.translationAmharic}\n\nEnglish: ${verse.translationEnglish}`;
    if (navigator.share) {
      navigator.share({
        title: `${bookName} ${chapter}:${verse.number}`,
        text: text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("Verse copied to clipboard!");
    }
  };

  const handleDownloadBook = (book: ScholarBook) => {
    try {
      const element = document.createElement("a");
      const file = new Blob([book.content], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `${book.title.replace(/\s+/g, '_')}_HikmahAcademy.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (e) {
      alert("Failed to download book: " + e);
    }
  };

  const currentBookPages = readingScholasticBook 
    ? readingScholasticBook.book.content.split('PAGE ') 
    : [];
  const cleanedBookPages = currentBookPages.filter(p => p.trim() !== '');
  const currentBookPageText = readingScholasticBook && cleanedBookPages[readingBookPage - 1]
    ? cleanedBookPages[readingBookPage - 1]
    : 'No content available.';

  return (
    <div className="space-y-6 pb-12">
      
      {/* Dynamic Sub Tab Selector inside Read room */}
      <section className="bg-white rounded-2xl border border-gray-200/60 p-1 shadow-sm flex">
        <button
          onClick={() => { setActiveSubTab('quran'); setReadingScholasticBook(null); }}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'quran'
              ? 'bg-[#003527] text-white shadow-sm'
              : 'text-gray-600 hover:text-primary hover:bg-gray-50'
          }`}
        >
          <Library className="h-4 w-4" />
          <span>ቅዱስ ቁርኣን (Quran)</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('bible'); setReadingScholasticBook(null); }}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'bible'
              ? 'bg-[#003527] text-white shadow-sm'
              : 'text-gray-600 hover:text-primary hover:bg-gray-50'
          }`}
        >
          <Book className="h-4 w-4" />
          <span>ቅዱስ መጽሐፍ (Bible)</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('other'); }}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'other'
              ? 'bg-[#003527] text-white shadow-sm'
              : 'text-gray-600 hover:text-primary hover:bg-gray-50'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>ሌሎች መጽሐፍት (Books)</span>
        </button>
      </section>

      {/* Render selected scripture mode */}
      <AnimatePresence mode="wait">
        
        {/* QURAN MODE */}
        {activeSubTab === 'quran' && (
          <motion.div
            key="quran-room"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <QuranView
              onStartRecitation={onStartRecitation}
              activeVerseNumber={activeVerseNumber}
              bookmarkedVerses={bookmarkedVerses}
              onToggleVerseBookmark={onToggleVerseBookmark}
              initialSurahId={initialSurahId}
              initialVerseNumber={initialVerseNumber}
              clearInitialSurahAndVerse={clearInitialSurahAndVerse}
            />
          </motion.div>
        )}

        {/* BIBLE MODE */}
        {activeSubTab === 'bible' && (
          <motion.div
            key="bible-room"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Bible Book Header Control */}
            <div className="bg-white rounded-2xl border border-gray-200/50 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowBibleBookDropdown(!showBibleBookDropdown)}
                    className="flex items-center gap-2 bg-[#003527]/5 hover:bg-[#003527]/10 active:scale-95 text-[#003527] font-bold px-4 py-2.5 rounded-xl border border-[#003527]/10 transition-all text-sm"
                  >
                    <span>{selectedBibleBook.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {showBibleBookDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowBibleBookDropdown(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 mt-2 z-50 w-56 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden py-1"
                        >
                          {bibleData.map((book) => (
                            <button
                              key={book.id}
                              onClick={() => {
                                setSelectedBibleBook(book);
                                setSelectedBibleChapter(1);
                                setShowBibleBookDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs flex justify-between items-center transition-colors ${
                                selectedBibleBook.id === book.id
                                  ? 'bg-[#003527]/5 text-[#003527] font-bold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <div>
                                <span className="font-serif block text-xs">{book.name}</span>
                                <span className="text-[10px] text-gray-400 font-medium">{book.nameEnglish}</span>
                              </div>
                              <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded font-mono">
                                {book.testament}
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Chapter selection list */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                  {Array.from({ length: selectedBibleBook.totalChapters }, (_, i) => i + 1).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setSelectedBibleChapter(ch)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        selectedBibleChapter === ch
                          ? 'bg-[#003527] text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Ch {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="text-[11px] font-bold text-gray-400 font-mono">
                {selectedBibleBook.nameEnglish} · CH {selectedBibleChapter}
              </div>
            </div>

            {/* Translation Selection & Downloader Portal */}
            <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-3 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100/60 pb-2">
                <div>
                  <h4 className="text-xs font-bold text-[#003527] flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    የመጽሐፍ ቅዱስ ትርጉሞች (Bible Translations / Versions)
                  </h4>
                  <p className="text-[10px] text-gray-500 font-medium">Choose a translation or download one for in-app offline study.</p>
                </div>
                <span className="text-[9px] bg-[#003527]/5 text-[#003527] font-bold px-2 py-0.5 rounded font-mono border border-[#003527]/15">
                  {downloadedBibleVersions.length} Installed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {BIBLE_VERSIONS.map((v) => {
                  const isDownloaded = downloadedBibleVersions.includes(v.id);
                  const isSelected = selectedBibleVersionId === v.id;
                  const isDownloading = downloadingBibleVersion === v.id;

                  return (
                    <div 
                      key={v.id} 
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                        isSelected 
                          ? 'bg-[#003527] text-white border-[#003527] shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-800 hover:border-emerald-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-start justify-between gap-1">
                          <span className={`text-[10px] font-bold block leading-tight ${isSelected ? 'text-amber-300' : 'text-emerald-800 font-serif'}`}>
                            {v.name}
                          </span>
                          <span className={`text-[8px] font-mono font-bold px-1 rounded flex-shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            {v.size}
                          </span>
                        </div>
                        <span className={`text-[9px] block leading-normal ${isSelected ? 'text-gray-200' : 'text-gray-400 font-medium'}`}>
                          {v.nameEnglish} — {v.description}
                        </span>
                      </div>

                      <div className="pt-1.5 border-t border-dashed border-gray-100/10">
                        {isDownloading ? (
                          <div className="w-full space-y-1">
                            <div className="flex justify-between text-[8px] font-bold font-mono tracking-wider text-amber-300 animate-pulse">
                              <span>DOWNLOADING...</span>
                              <span>{bibleVersionProgress}%</span>
                            </div>
                            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-amber-400 h-full transition-all duration-150" style={{ width: `${bibleVersionProgress}%` }} />
                            </div>
                          </div>
                        ) : isDownloaded ? (
                          <button
                            onClick={() => {
                              setSelectedBibleVersionId(v.id);
                              setBibleLang(v.lang);
                            }}
                            className={`w-full py-1.5 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-all active:scale-95 ${
                              isSelected 
                                ? 'bg-amber-400 hover:bg-amber-500 text-[#003527]' 
                                : 'bg-emerald-50 hover:bg-emerald-100 text-[#003527] border border-emerald-100'
                            }`}
                          >
                            {isSelected ? '✓ Currently Reading' : 'Select Version'}
                          </button>
                        ) : (
                          <button
                            onClick={() => startDownloadVersion(v.id)}
                            className="w-full py-1.5 rounded-lg text-[10px] font-bold text-center bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 cursor-pointer flex items-center justify-center gap-1 transition-all active:scale-95"
                          >
                            <Download className="h-3 w-3 text-gray-500" />
                            <span>Download ({v.size})</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bible Verse Feed List - Render only if selected version is downloaded */}
            {!downloadedBibleVersions.includes(selectedBibleVersionId) ? (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-8 text-center space-y-3 max-w-md mx-auto">
                <Download className="h-8 w-8 text-amber-600 mx-auto animate-bounce" />
                <h4 className="font-bold text-sm text-amber-900 font-serif">ትርጉሙ አልወረደም (Translation Database Offline)</h4>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  ይህን የመጽሐፍ ቅዱስ ትርጉም ለማንበብ በመጀመሪያ ከላይ ያለውን "Download" ቁልፍ በመጫን ያውርዱት። መጻሕፍቱ የተሟላ ይዘት እንዲኖራቸው ያግዛል።
                </p>
                <button
                  onClick={() => startDownloadVersion(selectedBibleVersionId)}
                  className="bg-[#003527] hover:bg-[#00251c] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Download {BIBLE_VERSIONS.find(v => v.id === selectedBibleVersionId)?.nameEnglish} Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedBibleBook.chapters[selectedBibleChapter]?.map((verse) => {
                  const bookmarkKey = `${selectedBibleBook.id}:${selectedBibleChapter}:${verse.number}`;
                  const isBookmarked = bookmarkedBibleVerses.includes(bookmarkKey);
                  const currentVer = BIBLE_VERSIONS.find(v => v.id === selectedBibleVersionId);
                  const isHighlighted = highlightedBibleVerse === verse.number;

                  return (
                    <div
                      key={verse.number}
                      ref={el => { bibleVerseRefs.current[verse.number] = el; }}
                      className={`bg-white rounded-2xl border p-5 shadow-xs hover:border-gray-300 transition-all space-y-4 text-left ${
                        isHighlighted 
                          ? 'ring-2 ring-rose-500 bg-rose-50/20 border-rose-400' 
                          : 'border-gray-200/60'
                      }`}
                    >
                      {/* Verse Identification Header */}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                        <span className="text-xs font-bold text-[#003527]/80 font-serif flex items-center gap-1.5">
                          <span className="bg-[#003527]/5 text-[#003527] text-[9px] px-1.5 py-0.5 rounded font-bold font-sans">
                            {currentVer?.nameEnglish.split(' ')[0]}
                          </span>
                          {selectedBibleBook.name} {selectedBibleChapter}:{verse.number}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleBibleBookmark(selectedBibleBook.id, selectedBibleChapter, verse.number)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isBookmarked ? 'text-amber-600 bg-amber-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                            title="Bookmark Verse"
                          >
                            <Bookmark className="h-4 w-4" style={{ fill: isBookmarked ? 'currentColor' : 'none' }} />
                          </button>
                          <button
                            onClick={() => handleShareBibleVerse(selectedBibleBook.name, selectedBibleChapter, verse)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                            title="Share Verse"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Verse Texts according to selected active version */}
                      <div className="space-y-3 font-serif">
                        {selectedBibleVersionId === 'original' && (
                          <p className="text-right text-lg font-bold text-[#003527] tracking-wide leading-relaxed">
                            {verse.text}
                          </p>
                        )}

                        {(selectedBibleVersionId === 'am_orth' || selectedBibleVersionId === 'am_std') && (
                          <p className="text-sm text-gray-900 leading-relaxed font-semibold">
                            {verse.translationAmharic}
                          </p>
                        )}

                        {(selectedBibleVersionId === 'en_kjv' || selectedBibleVersionId === 'en_esv') && (
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                            {verse.translationEnglish}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* OTHER BOOKS MODE WITH DOWNLOADS */}
        {activeSubTab === 'other' && (
          <motion.div
            key="other-books-room"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Book Reader View overlay inside Books Tab if a book is being read */}
            {readingScholasticBook ? (
              <div className="bg-[#1b2320] text-gray-100 rounded-3xl p-5 sm:p-6 border border-white/10 space-y-5 text-left relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                
                {/* Book Header info */}
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <button
                      onClick={() => setReadingScholasticBook(null)}
                      className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline mb-2 cursor-pointer"
                    >
                      <ArrowLeft className="h-3 w-3" /> Back to Books List
                    </button>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-amber-100 leading-tight">
                      {readingScholasticBook.book.title}
                    </h3>
                    <p className="text-xs text-gray-300 font-medium">
                      By {readingScholasticBook.author.name}
                    </p>
                  </div>
                </div>

                {/* Reader Canvas Content */}
                <div className="bg-white/5 backdrop-blur-xs border border-white/5 p-5 rounded-2xl min-h-[250px] text-gray-200">
                  <div className="flex justify-between items-center text-[10px] text-amber-400/80 border-b border-white/5 pb-2 mb-4 font-mono font-bold tracking-wider">
                    <span>DIGITAL E-READER</span>
                    <span>PAGE {readingBookPage} OF {readingScholasticBook.book.pagesCount}</span>
                  </div>

                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif">
                    {currentBookPageText.trim().replace(/^\d+:\s*/, '').replace(/^PAGE \d+\s*/, '')}
                  </p>
                </div>

                {/* Page Controls Footer */}
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <button
                    disabled={readingBookPage <= 1}
                    onClick={() => setReadingBookPage(readingBookPage - 1)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    Previous Page
                  </button>
                  <span className="text-xs font-semibold text-gray-300">
                    Page {readingBookPage} / {readingScholasticBook.book.pagesCount}
                  </span>
                  <button
                    disabled={readingBookPage >= readingScholasticBook.book.pagesCount}
                    onClick={() => setReadingBookPage(readingBookPage + 1)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    Next Page
                  </button>
                </div>
              </div>
            ) : (
              // GENERAL OTHER BOOKS GRID
              <div className="space-y-6">
                
                {/* Search Bar for Other Books */}
                <div className="relative flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-xs">
                  <div className="flex items-center pl-3 text-gray-400 pointer-events-none">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="ለማንበብ ርዕስ ወይም ጸሐፊ ስም ይፈልጉ... (Search contributed books...)"
                    value={booksSearchQuery}
                    onChange={(e) => setBooksSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                {/* Info Note about books and download option */}
                <div className="bg-amber-500/5 border border-amber-500/25 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
                  <Info className="h-4.5 w-4.5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">የዲጂታል መጻሕፍት ማውረጃ (Scholarly Publications Portal)</p>
                    <p className="leading-relaxed font-medium text-amber-800">
                      የእምነት እና ስነ-መለኮት ጥናት መጻሕፍትን እዚህ ያገኛሉ። መጻሕፍቱ በመተግበሪያው ውስጥ ብቻ እንዲነበቡ በመጀመሪያ ወደ ስልክዎ መሸጎጫ ማውረድ (Download to App Storage) ይኖርብዎታል። ይህም የስልክዎን ሜሞሪ ከመሙላት ያድናል። ካወረዱ በኋላ መጽሐፉን ከጓደኛዎ ጋር ማጋራት (Share) ይችላሉ።
                    </p>
                  </div>
                </div>

                {/* Grid list of Books */}
                <div className="grid grid-cols-1 gap-4">
                  {filteredScholarBooks.map((item, idx) => {
                    const isDownloaded = downloadedScholarBooks.includes(item.book.title);
                    const isDownloading = downloadingScholarBookTitle === item.book.title;

                    return (
                      <div
                        key={idx}
                        className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all text-left space-y-4 ${
                          isDownloaded 
                            ? 'border-emerald-200/80 shadow-xs' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border ${
                              isDownloaded 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {isDownloaded ? 'Downloaded (Offline Ready)' : 'Available in Cloud (2.4 MB)'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium font-mono">
                              {item.book.pagesCount} Pages
                            </span>
                          </div>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-primary leading-snug">
                            {item.book.title}
                          </h4>
                          <p className="text-[11px] font-bold text-[#003527]/80">
                            By {item.author.name}
                          </p>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {item.book.description}
                          </p>
                        </div>

                        {/* Download Button is prominent beside the Read button */}
                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                            <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                            <span>Academic Press</span>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {isDownloading ? (
                              <div className="w-full sm:w-44 space-y-1">
                                <div className="flex justify-between text-[9px] font-mono font-bold text-[#003527] animate-pulse">
                                  <span>DOWNLOADING STREAM...</span>
                                  <span>{scholarBookProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-[#003527] h-full transition-all duration-150" style={{ width: `${scholarBookProgress}%` }} />
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* Share/Save to device files button (enabled once downloaded) */}
                                {isDownloaded && (
                                  <button
                                    onClick={() => handleDownloadBook(item.book)}
                                    className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer active:scale-95"
                                    title="Save file to your device / Share with friends"
                                  >
                                    <Share2 className="h-3.5 w-3.5 text-gray-500" />
                                    <span>Export/Share File</span>
                                  </button>
                                )}

                                {/* Main Button (Download vs Read) */}
                                {!isDownloaded ? (
                                  <button
                                    onClick={() => startDownloadScholarBook(item.book.title)}
                                    className="flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-[#003527] text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 w-full sm:w-auto"
                                  >
                                    <Download className="h-3.5 w-3.5 text-[#003527]" />
                                    <span>Download (አውርድ)</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setReadingScholasticBook(item);
                                      setReadingBookPage(1);
                                    }}
                                    className="flex items-center justify-center gap-1.5 bg-[#003527] hover:bg-[#02251c] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 w-full sm:w-auto"
                                  >
                                    <BookOpen className="h-3.5 w-3.5 text-gray-100" />
                                    <span>Read Inside App</span>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredScholarBooks.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-xs italic bg-gray-50 rounded-2xl border">
                      ያልተገኘ መጽሐፍ የለም (No books found matching your filter).
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
