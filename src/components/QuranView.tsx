/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Settings2, PlayCircle, Bookmark, Share2, Zap, BookOpen, Volume2, HelpCircle } from 'lucide-react';
import { Surah, Verse } from '../types';
import { quranData } from '../data/quran';

interface QuranViewProps {
  onStartRecitation: (surah: Surah, verseNumber: number) => void;
  activeVerseNumber: number | null;
  bookmarkedVerses: string[]; // formatted as "surahId:verseNumber"
  onToggleVerseBookmark: (surahId: number, verseNumber: number) => void;
  initialSurahId?: number | null;
  initialVerseNumber?: number | null;
  clearInitialSurahAndVerse?: () => void;
}

export default function QuranView({ 
  onStartRecitation, 
  activeVerseNumber, 
  bookmarkedVerses, 
  onToggleVerseBookmark,
  initialSurahId,
  initialVerseNumber,
  clearInitialSurahAndVerse
}: QuranViewProps) {
  const [selectedSurah, setSelectedSurah] = useState<Surah>(quranData[0]);
  const [showSurahDropdown, setShowSurahDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  
  // Preferences
  const [translationLang, setTranslationLang] = useState<'amharic' | 'english' | 'arabic-only'>('amharic');
  const [transliterationEnabled, setTransliterationEnabled] = useState(true);

  // Jump to Ayah Modal
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [jumpVerseInput, setJumpVerseInput] = useState('');
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);

  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Deep linking scroll watcher
  useEffect(() => {
    if (initialSurahId) {
      const targetSurah = quranData.find(s => s.id === initialSurahId);
      if (targetSurah) {
        setSelectedSurah(targetSurah);
        // We delay scrolling slightly to allow rendering to complete
        const timer = setTimeout(() => {
          if (initialVerseNumber) {
            scrollToVerse(initialVerseNumber);
          }
        }, 350);
        return () => clearTimeout(timer);
      }
      if (clearInitialSurahAndVerse) {
        clearInitialSurahAndVerse();
      }
    }
  }, [initialSurahId, initialVerseNumber]);

  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah);
    setShowSurahDropdown(false);
    setJumpVerseInput('');
  };

  // Get Juz number based on Surah index
  const getJuzNumber = (surahId: number) => {
    if (surahId === 1) return 1;
    if (surahId >= 100) return 30;
    return 1;
  };

  const handleJumpToAyahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verseNum = parseInt(jumpVerseInput);
    if (!isNaN(verseNum) && verseNum >= 1 && verseNum <= selectedSurah.totalVerses) {
      scrollToVerse(verseNum);
      setShowJumpModal(false);
    } else {
      alert(`Please enter a valid verse number between 1 and ${selectedSurah.totalVerses}`);
    }
  };

  const scrollToVerse = (verseNumber: number) => {
    const element = verseRefs.current[verseNumber];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Trigger highlight flash
      setHighlightedVerse(verseNumber);
      setTimeout(() => {
        setHighlightedVerse(null);
      }, 2500);
    }
  };

  const handleShareVerse = (verse: Verse) => {
    const text = `${selectedSurah.name} [${selectedSurah.id}:${verse.number}]\n\nArabic: ${verse.text}\n\nAmharic: ${verse.translationAmharic}\n\nEnglish: ${verse.translationEnglish}`;
    if (navigator.share) {
      navigator.share({
        title: `Quran ${selectedSurah.id}:${verse.number}`,
        text: text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("Verse copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top sticky selection controls */}
      <section className="sticky top-16 z-30 bg-gray-50/95 backdrop-blur-md rounded-2xl border border-gray-200/50 p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          
          {/* selectors */}
          <div className="flex items-center gap-2">
            
            {/* Surah Dropdown selector */}
            <div className="relative">
              <button
                onClick={() => setShowSurahDropdown(!showSurahDropdown)}
                className="flex items-center gap-2 bg-[#003527]/5 hover:bg-[#003527]/10 active:scale-95 text-[#003527] font-bold px-4 py-2.5 rounded-xl border border-[#003527]/10 transition-all text-sm"
              >
                <span>{selectedSurah.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {showSurahDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSurahDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 z-50 w-56 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden py-1"
                    >
                      {quranData.map((surah) => (
                        <button
                          key={surah.id}
                          onClick={() => handleSurahSelect(surah)}
                          className={`w-full text-left px-4 py-2 text-xs flex justify-between items-center transition-colors ${
                            selectedSurah.id === surah.id
                              ? 'bg-[#003527]/5 text-[#003527] font-bold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <p>{surah.name}</p>
                            <p className="text-[10px] text-gray-400 font-normal">{surah.nameEnglish}</p>
                          </div>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                            {surah.type}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Juz tag */}
            <div className="bg-gray-100 px-3.5 py-2.5 rounded-xl border border-gray-200/50 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <span>Juz {getJuzNumber(selectedSurah.id)}</span>
            </div>
          </div>

          {/* Settings Control button */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className="p-2.5 rounded-xl text-primary hover:bg-primary/5 border border-transparent hover:border-primary/5 transition-all"
              title="Display Settings"
            >
              <Settings2 className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {showSettingsDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSettingsDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 z-50 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl space-y-3"
                  >
                    <h4 className="text-xs font-bold text-primary border-b border-gray-100 pb-1.5">
                      Reading Options
                    </h4>

                    {/* Language selections */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Translation
                      </span>
                      <div className="grid grid-cols-3 gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-200/60">
                        <button
                          onClick={() => setTranslationLang('amharic')}
                          className={`py-1 text-[10px] font-bold rounded ${
                            translationLang === 'amharic' 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          Amharic
                        </button>
                        <button
                          onClick={() => setTranslationLang('english')}
                          className={`py-1 text-[10px] font-bold rounded ${
                            translationLang === 'english' 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => setTranslationLang('arabic-only')}
                          className={`py-1 text-[10px] font-bold rounded ${
                            translationLang === 'arabic-only' 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'text-gray-500 hover:text-gray-800'
                          }`}
                        >
                          Arabic
                        </button>
                      </div>
                    </div>

                    {/* Transliteration toggle */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-semibold text-gray-500">
                        Show Transliteration
                      </span>
                      <button
                        onClick={() => setTransliterationEnabled(!transliterationEnabled)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                          transliterationEnabled ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            transliterationEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Main Quran Content card */}
      <article className="bg-white rounded-3xl border border-gray-200/60 shadow-sm p-6 sm:p-10 space-y-8 relative">
        
        {/* Bismillah banner */}
        {selectedSurah.bismillah && (
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <div className="h-[1px] w-20 bg-secondary/30" />
            <p className="font-serif text-2xl md:text-3xl text-primary leading-loose tracking-wide font-medium">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <div className="h-[1px] w-20 bg-secondary/30" />
          </div>
        )}

        {/* Verses Scroller wrapper */}
        <div className="space-y-1">
          {selectedSurah.verses.map((verse) => {
            const verseKey = `${selectedSurah.id}:${verse.number}`;
            const isBookmarked = bookmarkedVerses.includes(verseKey);
            const isReciting = activeVerseNumber === verse.number;
            const isHighlighted = highlightedVerse === verse.number;

            return (
              <div
                key={verse.number}
                ref={(el) => { verseRefs.current[verse.number] = el; }}
                className={`group relative space-y-4 p-4 rounded-2xl transition-all duration-300 border ${
                  isReciting 
                    ? 'bg-primary/5 border-primary/20 shadow-sm' 
                    : isHighlighted
                    ? 'bg-secondary/15 border-secondary/35 shadow-md scale-[1.01]'
                    : 'border-transparent hover:bg-gray-50/50'
                }`}
              >
                {/* Verse top row: orange marker and Arabic text */}
                <div className="flex justify-between items-start gap-4">
                  
                  {/* Octagonal orange verse index marker */}
                  <div className="flex-shrink-0 mt-2 h-9 w-9 bg-secondary-container rounded-lg text-on-secondary-container font-bold text-xs flex items-center justify-center select-none shadow-sm relative overflow-hidden"
                    style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
                  >
                    {verse.number}
                  </div>

                  {/* Right aligned Arabic Quranic script */}
                  <div className="flex-1 text-right">
                    <p className="font-serif text-2xl md:text-3xl text-primary font-medium tracking-wide leading-relaxed" style={{ direction: 'rtl' }}>
                      {verse.text}
                    </p>
                  </div>

                </div>

                {/* Transliteration (if enabled and present) */}
                {transliterationEnabled && verse.transliteration && translationLang !== 'arabic-only' && (
                  <div className="pl-13 pr-4">
                    <p className="text-xs font-semibold text-secondary italic leading-relaxed">
                      {verse.transliteration}
                    </p>
                  </div>
                )}

                {/* Translation texts */}
                {translationLang !== 'arabic-only' && (
                  <div className="pl-13 pr-4 space-y-1">
                    {translationLang === 'amharic' ? (
                      <p className="font-serif text-sm md:text-base text-gray-800 leading-relaxed font-medium">
                        {verse.translationAmharic}
                      </p>
                    ) : (
                      <p className="font-sans text-sm md:text-base text-gray-700 leading-relaxed">
                        {verse.translationEnglish}
                      </p>
                    )}
                  </div>
                )}

                {/* Action hovering ribbon bar for verse controls */}
                <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 flex items-center gap-4 pl-13 pt-1 transition-opacity duration-200">
                  
                  {/* Listen Recite */}
                  <button
                    onClick={() => onStartRecitation(selectedSurah, verse.number)}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      isReciting ? 'text-secondary font-bold' : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    <PlayCircle className="h-4.5 w-4.5" />
                    <span>{isReciting ? 'Reciting...' : 'Listen'}</span>
                  </button>

                  {/* Save Bookmark */}
                  <button
                    onClick={() => onToggleVerseBookmark(selectedSurah.id, verse.number)}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      isBookmarked ? 'text-secondary font-bold' : 'text-gray-500 hover:text-primary'
                    }`}
                  >
                    <Bookmark className="h-4.5 w-4.5" style={{ fill: isBookmarked ? 'currentColor' : 'none' }} />
                    <span>{isBookmarked ? 'Bookmarked' : 'Save'}</span>
                  </button>

                  {/* Share */}
                  <button
                    onClick={() => handleShareVerse(verse)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
                  >
                    <Share2 className="h-4.5 w-4.5" />
                    <span>Share</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>

        {/* End of Surah Icon Decoration */}
        <div className="flex justify-center py-6 border-t border-gray-100">
          <BookOpen className="h-8 w-8 text-secondary-container/40 animate-pulse" />
        </div>

      </article>

      {/* Floating Action Button (FAB) for Jump to Ayah */}
      <button
        onClick={() => setShowJumpModal(true)}
        className="fixed bottom-24 right-6 z-30 bg-[#fe932c] hover:bg-[#e07f24] text-on-secondary-container shadow-xl w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 hover:rotate-6 transition-all group"
        title="Jump to Ayah"
      >
        <Zap className="h-6 w-6" />
        <div className="absolute right-16 bg-primary text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md pointer-events-none">
          Jump to Ayah
        </div>
      </button>

      {/* Centered Modal: Jump to Ayah (with backdrop blur) */}
      <AnimatePresence>
        {showJumpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-6">
            
            {/* Click outer to close */}
            <div className="absolute inset-0" onClick={() => setShowJumpModal(false)} />
            
            {/* Modal Body card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-200/80 z-10"
            >
              <div className="p-5 border-b border-gray-100 bg-gray-50">
                <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                  <Zap className="h-5 w-5 text-secondary" />
                  Jump to Ayah
                </h3>
                <p className="text-[10px] text-gray-400 font-medium">
                  {selectedSurah.name} contains {selectedSurah.totalVerses} verses.
                </p>
              </div>

              <form onSubmit={handleJumpToAyahSubmit} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-500">
                    Enter Verse Number
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={selectedSurah.totalVerses}
                    placeholder={`1 - ${selectedSurah.totalVerses}`}
                    value={jumpVerseInput}
                    onChange={(e) => setJumpVerseInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-semibold"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowJumpModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-[#002117] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Navigate
                  </button>
                </div>
              </form>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
