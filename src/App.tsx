/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Compass, Bot, Menu, Search, Library, Bookmark, X, Star, Sun, Moon, Home, FileText, Book, ArrowLeft, Users, User } from 'lucide-react';
import { Article, Surah } from './types';
import ArticlesView from './components/ArticlesView';
import ReadView from './components/ReadView';
import YouView from './components/YouView';
import ArticleModal from './components/ArticleModal';
import AudioPlayer from './components/AudioPlayer';
import HomeView from './components/HomeView';
import NotesView from './components/NotesView';
import AuthorProfileModal from './components/AuthorProfileModal';
import AuthorsView from './components/AuthorsView';
import { quranData } from './data/quran';
import { articlesData } from './data/articles';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'articles' | 'quran' | 'notes' | 'authors' | 'you'>('home');
  
  // Dynamic Articles state loaded from PostgreSQL (via FastAPI) with fallback
  const [articles, setArticles] = useState<Article[]>(articlesData);
  const [apiUrl, setApiUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('hikmah_api_url');
      return saved || 'http://localhost:8000';
    } catch {
      return 'http://localhost:8000';
    }
  });
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');

  const fetchArticlesFromApi = async (urlToFetch: string): Promise<boolean> => {
    setApiStatus('loading');
    try {
      const cleanUrl = urlToFetch.replace(/\/$/, "");
      const res = await fetch(`${cleanUrl}/articles/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Normalize the articles from backend (snake_case database properties mapping to camelCase frontend interface)
          const normalized: Article[] = data.map((item: any) => ({
            id: item.id || '',
            title: item.title || '',
            description: item.description || '',
            content: item.content || '',
            category: item.category || 'General',
            author: item.author || 'Unknown',
            readTime: item.readTime || item.read_time || '5 min',
            date: item.date || 'June 2026',
            image: item.image || '',
            featured: item.featured || false,
            scholarQuote: item.scholarQuote || item.scholar_quote || '',
            tags: item.tags || [],
            parts: item.parts ? item.parts.map((p: any) => ({
              partNumber: p.partNumber || p.part_number || 1,
              title: p.title || '',
              content: p.content || '',
              readTime: p.readTime || p.read_time || ''
            })) : undefined
          }));

          // Merge loaded articles with local articles to make sure local ones are retained if not in backend!
          // This keeps the default beautiful curated articles alongside any newly uploaded ones!
          const merged = [...normalized];
          articlesData.forEach(localArt => {
            if (!merged.some(m => m.id === localArt.id)) {
              merged.push(localArt);
            }
          });

          setArticles(merged);
          setApiStatus('connected');
          return true;
        }
      }
      setApiStatus('error');
      return false;
    } catch (e) {
      console.warn("FastAPI offline or connection failed:", e);
      setApiStatus('error');
      return false;
    }
  };

  useEffect(() => {
    fetchArticlesFromApi(apiUrl);
  }, [apiUrl]);

  // Interactive Overlays
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedAuthorName, setSelectedAuthorName] = useState<string | null>(null);
  const [activeRecitation, setActiveRecitation] = useState<{ surah: Surah; verseNumber: number } | null>(null);
  
  // Global bookmarks states (with local storage caching)
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<string[]>([]);
  
  // Deep linking to specific Quran verse
  const [deepLinkSurahId, setDeepLinkSurahId] = useState<number | null>(null);
  const [deepLinkVerseNumber, setDeepLinkVerseNumber] = useState<number | null>(null);

  // Deep linking to specific Bible verse
  const [deepLinkBibleBookId, setDeepLinkBibleBookId] = useState<number | null>(null);
  const [deepLinkBibleChapter, setDeepLinkBibleChapter] = useState<number | null>(null);
  const [deepLinkBibleVerseNumber, setDeepLinkBibleVerseNumber] = useState<number | null>(null);

  // Filter bookmarked articles list flag
  const [filterBookmarkedArticlesOnly, setFilterBookmarkedArticlesOnly] = useState<boolean>(false);

  // Academic Study Notes Count
  const [notesCount, setNotesCount] = useState<number>(0);

  // Language & Theme states
  const [language, setLanguage] = useState<'en' | 'am'>(() => {
    try {
      const saved = localStorage.getItem('hikmah_language');
      return (saved === 'en' || saved === 'am') ? saved : 'am';
    } catch {
      return 'am';
    }
  });

  const [colorTheme, setColorTheme] = useState<'emerald' | 'saffron' | 'blue' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('hikmah_theme');
      return (saved === 'emerald' || saved === 'saffron' || saved === 'blue' || saved === 'dark') ? saved : 'emerald';
    } catch {
      return 'emerald';
    }
  });

  // Theme Synchronizer
  useEffect(() => {
    try {
      localStorage.setItem('hikmah_theme', colorTheme);
      document.documentElement.classList.remove('theme-saffron', 'theme-blue', 'theme-dark');
      if (colorTheme !== 'emerald') {
        document.documentElement.classList.add(`theme-${colorTheme}`);
      }
    } catch (e) {
      console.warn("Could not save theme:", e);
    }
  }, [colorTheme]);

  // Language Synchronizer
  useEffect(() => {
    try {
      localStorage.setItem('hikmah_language', language);
    } catch (e) {
      console.warn("Could not save language:", e);
    }
  }, [language]);

  // Sync notes count for the Home Page
  const updateNotesCount = () => {
    try {
      const cached = localStorage.getItem('hikmah_study_notes');
      if (cached) {
        setNotesCount(JSON.parse(cached).length);
      } else {
        setNotesCount(1); // Seed note
      }
    } catch (e) {
      console.warn("Storage access failed:", e);
    }
  };

  // responsive sidebar
  const [showSidebar, setShowSidebar] = useState(false);
  const [showQuickBookmarks, setShowQuickBookmarks] = useState(false);

  // Load bookmarks on startup and sync notes count
  useEffect(() => {
    try {
      const artCache = localStorage.getItem('hikmah_bookmarked_articles');
      if (artCache) setBookmarkedArticles(JSON.parse(artCache));

      const verCache = localStorage.getItem('hikmah_bookmarked_verses');
      if (verCache) setBookmarkedVerses(JSON.parse(verCache));

      updateNotesCount();
    } catch (e) {
      console.warn("Storage access failed:", e);
    }
  }, []);

  // Update notes count on tab transition to keep home stats perfectly in sync
  useEffect(() => {
    updateNotesCount();
  }, [activeTab]);

  // Save bookmarked articles to cache
  const toggleArticleBookmark = (id: string) => {
    const next = bookmarkedArticles.includes(id)
      ? bookmarkedArticles.filter(item => item !== id)
      : [...bookmarkedArticles, id];
    setBookmarkedArticles(next);
    localStorage.setItem('hikmah_bookmarked_articles', JSON.stringify(next));
  };

  // Save bookmarked verses to cache
  const toggleVerseBookmark = (surahId: number, verseNumber: number) => {
    const key = `${surahId}:${verseNumber}`;
    const next = bookmarkedVerses.includes(key)
      ? bookmarkedVerses.filter(item => item !== key)
      : [...bookmarkedVerses, key];
    setBookmarkedVerses(next);
    localStorage.setItem('hikmah_bookmarked_verses', JSON.stringify(next));
  };

  // Recite a verse selected inside the AI chat response
  const handleReciteRefVerse = (surahNumber: number, verseNumber: number) => {
    const targetSurah = quranData.find(s => s.id === surahNumber) || quranData[0];
    setActiveRecitation({
      surah: targetSurah,
      verseNumber: verseNumber
    });
    setActiveTab('quran'); // Navigate to Quran reader
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col antialiased">
      
      {/* Top App Bar Header */}
      <header className="flex justify-between items-center px-6 h-16 w-full z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 fixed top-0 shadow-xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSidebar(true)}
            className="text-primary hover:bg-gray-100 p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
            title="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <h1 className="font-serif text-xl font-bold tracking-tight text-primary flex items-center gap-2 select-none">
            <span className="text-secondary">✦</span> Hikmah Academy
          </h1>

          {activeTab !== 'home' && (
            <button 
              onClick={() => { setActiveTab('home'); setFilterBookmarkedArticlesOnly(false); }}
              className="hidden sm:flex items-center gap-1.5 bg-[#003527]/5 text-[#003527] hover:bg-[#003527]/10 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
              title="Back to Home"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>ወደ ዋና ገጽ (Back to Home)</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile small back to home arrow */}
          {activeTab !== 'home' && (
            <button 
              onClick={() => { setActiveTab('home'); setFilterBookmarkedArticlesOnly(false); }}
              className="flex sm:hidden p-2 text-gray-500 hover:text-primary rounded-xl hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
              title="Back to Home"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          {/* Quick Bookmarks Toggle */}
          <button 
            onClick={() => setShowQuickBookmarks(true)}
            className="text-primary hover:bg-gray-100 p-2.5 rounded-xl transition-all relative cursor-pointer"
            title="Saved Items"
          >
            <Bookmark className="h-5 w-5" />
            {(bookmarkedArticles.length > 0 || bookmarkedVerses.length > 0) && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-secondary-container ring-2 ring-white" />
            )}
          </button>
        </div>
      </header>

      {/* Main Container Canvas */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-5 mt-22 mb-24 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            {activeTab === 'home' && (
              <HomeView 
                onNavigate={(tab, options) => {
                  if (options?.showBookmarksOnly) {
                    setFilterBookmarkedArticlesOnly(true);
                  } else {
                    setFilterBookmarkedArticlesOnly(false);
                  }
                  setActiveTab(tab);
                }}
                stats={{
                  notesCount,
                  bookmarkedArticlesCount: bookmarkedArticles.length,
                  bookmarkedVersesCount: bookmarkedVerses.length
                }}
                articles={articles}
              />
            )}

            {activeTab === 'articles' && (
              <ArticlesView 
                articles={articles}
                onReadArticle={(art) => setSelectedArticle(art)}
                bookmarks={bookmarkedArticles}
                onToggleBookmark={toggleArticleBookmark}
                showBookmarksOnly={filterBookmarkedArticlesOnly}
                onSelectAuthor={(name) => setSelectedAuthorName(name)}
              />
            )}

            {activeTab === 'quran' && (
              <ReadView 
                onStartRecitation={(surah, verse) => setActiveRecitation({ surah, verseNumber: verse })}
                activeVerseNumber={activeRecitation?.surah.id === quranData[0].id ? activeRecitation.verseNumber : null}
                bookmarkedVerses={bookmarkedVerses}
                onToggleVerseBookmark={toggleVerseBookmark}
                initialSurahId={deepLinkSurahId}
                initialVerseNumber={deepLinkVerseNumber}
                clearInitialSurahAndVerse={() => {
                  setDeepLinkSurahId(null);
                  setDeepLinkVerseNumber(null);
                }}
                initialBibleBookId={deepLinkBibleBookId}
                initialBibleChapter={deepLinkBibleChapter}
                initialBibleVerseNumber={deepLinkBibleVerseNumber}
                clearInitialBibleLink={() => {
                  setDeepLinkBibleBookId(null);
                  setDeepLinkBibleChapter(null);
                  setDeepLinkBibleVerseNumber(null);
                }}
              />
            )}

            {activeTab === 'notes' && (
              <NotesView 
                onJumpToQuran={(surahId, verseNumber) => {
                  setDeepLinkSurahId(surahId);
                  setDeepLinkVerseNumber(verseNumber);
                  setActiveTab('quran');
                }}
                onJumpToBible={(bookId, chapterNum, verseNumber) => {
                  setDeepLinkBibleBookId(bookId);
                  setDeepLinkBibleChapter(chapterNum);
                  setDeepLinkBibleVerseNumber(verseNumber);
                  setActiveTab('quran');
                }}
              />
            )}

            {activeTab === 'you' && (
              <YouView 
                language={language}
                setLanguage={setLanguage}
                colorTheme={colorTheme}
                setColorTheme={setColorTheme}
                onReciteRefVerse={handleReciteRefVerse}
                apiUrl={apiUrl}
                setApiUrl={(url) => {
                  setApiUrl(url);
                  try {
                    localStorage.setItem('hikmah_api_url', url);
                  } catch (e) {
                    console.warn(e);
                  }
                }}
                apiStatus={apiStatus}
                onRefreshArticles={() => fetchArticlesFromApi(apiUrl)}
              />
            )}

            {activeTab === 'authors' && (
              <AuthorsView 
                onSelectAuthor={(name) => setSelectedAuthorName(name)}
                articles={articles}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dynamic Slide-in Article Reader overlay */}
      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          isBookmarked={bookmarkedArticles.includes(selectedArticle.id)}
          onToggleBookmark={() => toggleArticleBookmark(selectedArticle.id)}
          onSelectAuthor={(name) => {
            setSelectedAuthorName(name);
            setSelectedArticle(null); // Smooth transition to profile
          }}
        />
      )}

      {selectedAuthorName && (
        <AuthorProfileModal 
          authorName={selectedAuthorName}
          onClose={() => setSelectedAuthorName(null)}
          onReadArticle={(art) => setSelectedArticle(art)}
          articles={articles}
        />
      )}

      {/* Dynamic Recitation Audio Player controls at bottom */}
      <AnimatePresence>
        {activeRecitation && (
          <AudioPlayer 
            surah={activeRecitation.surah}
            currentVerseNumber={activeRecitation.verseNumber}
            onVerseSelect={(num) => setActiveRecitation({ ...activeRecitation, verseNumber: num })}
            onClose={() => setActiveRecitation(null)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Footer Tab Bar (sticky at absolute bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/60 shadow-lg px-2 py-2 pb-safe">
        <div className="max-w-xl mx-auto flex justify-between items-center h-12 gap-1">
          
          {/* Tab 1: Home */}
          <button
            onClick={() => { setActiveTab('home'); setFilterBookmarkedArticlesOnly(false); }}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 transition-all cursor-pointer flex-1 ${
              activeTab === 'home'
                ? 'bg-secondary-container text-on-secondary-container rounded-full shadow-xs scale-102 font-bold'
                : 'text-gray-400 hover:text-primary'
            }`}
          >
            <Home className="h-4.5 w-4.5" />
            <span className="text-[9px] tracking-wide">{language === 'en' ? 'Home' : 'ዋና ገጽ'}</span>
          </button>

          {/* Tab 2: Library */}
          <button
            onClick={() => { setActiveTab('quran'); setFilterBookmarkedArticlesOnly(false); }}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 transition-all cursor-pointer flex-1 ${
              activeTab === 'quran'
                ? 'bg-secondary-container text-on-secondary-container rounded-full shadow-xs scale-102 font-bold'
                : 'text-gray-400 hover:text-primary'
            }`}
          >
            <Library className="h-4.5 w-4.5" />
            <span className="text-[9px] tracking-wide font-medium">{language === 'en' ? 'Library' : 'ቤተ-መጻሕፍት'}</span>
          </button>

          {/* Tab 3: Articles */}
          <button
            onClick={() => { setActiveTab('articles'); setFilterBookmarkedArticlesOnly(false); }}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 transition-all cursor-pointer flex-1 ${
              activeTab === 'articles'
                ? 'bg-secondary-container text-on-secondary-container rounded-full shadow-xs scale-102 font-bold'
                : 'text-gray-400 hover:text-primary'
            }`}
          >
            <BookOpen className="h-4.5 w-4.5" />
            <span className="text-[9px] tracking-wide">{language === 'en' ? 'Articles' : 'ጽሁፎች'}</span>
          </button>

          {/* Tab 4: Notes */}
          <button
            onClick={() => { setActiveTab('notes'); setFilterBookmarkedArticlesOnly(false); }}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 transition-all cursor-pointer flex-1 ${
              activeTab === 'notes'
                ? 'bg-secondary-container text-on-secondary-container rounded-full shadow-xs scale-102 font-bold'
                : 'text-gray-400 hover:text-primary'
            }`}
          >
            <FileText className="h-4.5 w-4.5" />
            <span className="text-[9px] tracking-wide font-medium">{language === 'en' ? 'Notes' : 'ማስታወሻዎች'}</span>
          </button>

          {/* Tab 5: You */}
          <button
            onClick={() => { setActiveTab('you'); setFilterBookmarkedArticlesOnly(false); }}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 transition-all cursor-pointer flex-1 ${
              activeTab === 'you'
                ? 'bg-secondary-container text-on-secondary-container rounded-full shadow-xs scale-102 font-bold'
                : 'text-gray-400 hover:text-primary'
            }`}
          >
            <User className="h-4.5 w-4.5" />
            <span className="text-[9px] tracking-wide">{language === 'en' ? 'You' : 'መገለጫ'}</span>
          </button>

        </div>
      </nav>

      {/* Side drawer menu flyout */}
      <AnimatePresence>
        {showSidebar && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop area click-close */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowSidebar(false)} />
            
            {/* Flyout content panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 24 }}
              className="relative w-72 h-full bg-white border-r border-gray-200 shadow-2xl flex flex-col p-6 space-y-6"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-1.5">
                  <span className="text-secondary">✦</span> Academy Portal
                </h3>
                <button onClick={() => setShowSidebar(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation list */}
              <div className="space-y-2 flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                  {language === 'en' ? 'Academic Rooms' : 'አካዳሚክ ክፍሎች'}
                </p>
                
                <button 
                  onClick={() => { setActiveTab('home'); setFilterBookmarkedArticlesOnly(false); setShowSidebar(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2"
                >
                  <Home className="h-4.5 w-4.5 text-secondary" />
                  {language === 'en' ? 'Home Dashboard' : 'ዋና ዳሽቦርድ'}
                </button>

                <button 
                  onClick={() => { setActiveTab('quran'); setFilterBookmarkedArticlesOnly(false); setShowSidebar(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2"
                >
                  <Library className="h-4.5 w-4.5 text-secondary" />
                  {language === 'en' ? 'Library (Quran, Bible, Books)' : 'ቤተ-መጻሕፍት (ቁርኣን፣ መጽሐፍ ቅዱስ)'}
                </button>

                <button 
                  onClick={() => { setActiveTab('articles'); setFilterBookmarkedArticlesOnly(false); setShowSidebar(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2"
                >
                  <BookOpen className="h-4.5 w-4.5 text-secondary" />
                  {language === 'en' ? 'Scholarly Articles' : 'ጥናታዊ ፅሁፎች'}
                </button>

                <button 
                  onClick={() => { setActiveTab('authors'); setFilterBookmarkedArticlesOnly(false); setShowSidebar(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2"
                >
                  <Users className="h-4.5 w-4.5 text-secondary" />
                  {language === 'en' ? 'Scholars & Ustazs' : 'ምሁራንና ኡስታዞች'}
                </button>

                <button 
                  onClick={() => { setActiveTab('notes'); setFilterBookmarkedArticlesOnly(false); setShowSidebar(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2"
                >
                  <FileText className="h-4.5 w-4.5 text-secondary" />
                  {language === 'en' ? 'Academic Notes' : 'የጥናት ማስታወሻዎች'}
                </button>

                <button 
                  onClick={() => { setActiveTab('you'); setFilterBookmarkedArticlesOnly(false); setShowSidebar(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2"
                >
                  <User className="h-4.5 w-4.5 text-secondary" />
                  {language === 'en' ? 'You & Settings' : 'መገለጫና ቅንብሮች'}
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4 text-center space-y-1">
                <p className="text-[10px] text-gray-400 font-semibold tracking-wide">
                  {language === 'en' ? 'Hikmah Academy Portal' : 'ሂክማህ አካዳሚ ፖርታል'}
                </p>
                <p className="text-[9px] text-gray-400">© 2026 Academic Press · Version 1.0</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Saved Items sidebar flyout */}
      <AnimatePresence>
        {showQuickBookmarks && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop click close */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowQuickBookmarks(false)} />

            {/* Flyout content panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24 }}
              className="relative w-80 h-full bg-white border-l border-gray-200 shadow-2xl flex flex-col p-6 space-y-6"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="font-serif text-base font-bold text-primary flex items-center gap-1.5">
                  <Bookmark className="h-5 w-5 text-secondary" />
                  Your Saved Items
                </h3>
                <button onClick={() => setShowQuickBookmarks(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Bookmarks scrolling content */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-1 no-scrollbar">
                
                {/* Bookmarked articles */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">Articles ({bookmarkedArticles.length})</span>
                  {bookmarkedArticles.length === 0 ? (
                    <p className="text-xs text-gray-400 italic px-1">No bookmarked articles yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {bookmarkedArticles.map(id => {
                        // Resolve article from cache data
                        const found = articlesData.find(a => a.id === id);
                        if (!found) return null;
                        
                        return (
                          <div 
                            key={id}
                            onClick={() => { setSelectedArticle(found); setShowQuickBookmarks(false); }}
                            className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer text-left"
                          >
                            <h4 className="font-serif text-xs font-semibold text-primary truncate">{found.title}</h4>
                            <p className="text-[9px] text-gray-400 mt-0.5">{found.category} · {found.readTime}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bookmarked verses */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">Quranic Verses ({bookmarkedVerses.length})</span>
                  {bookmarkedVerses.length === 0 ? (
                    <p className="text-xs text-gray-400 italic px-1">No saved verses yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {bookmarkedVerses.map(key => {
                        const [surahId, verseNum] = key.split(':').map(Number);
                        const surah = quranData.find(s => s.id === surahId);
                        const verse = surah?.verses.find(v => v.number === verseNum);
                        if (!surah || !verse) return null;

                        return (
                          <div 
                            key={key}
                            onClick={() => {
                              setActiveRecitation({ surah, verseNumber: verseNum });
                              setActiveTab('quran');
                              setShowQuickBookmarks(false);
                            }}
                            className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer text-left space-y-1"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-primary font-serif">{surah.name} [{surah.id}:{verseNum}]</span>
                              <span className="text-[10px] font-serif text-[#003527]/70 font-bold" style={{ direction: 'rtl' }}>
                                {verse.text.substring(0, 16)}...
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 line-clamp-2 italic leading-relaxed">
                              "{verse.translationAmharic}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              <div className="border-t border-gray-100 pt-4 text-center">
                <button
                  onClick={() => {
                    setBookmarkedArticles([]);
                    setBookmarkedVerses([]);
                    localStorage.removeItem('hikmah_bookmarked_articles');
                    localStorage.removeItem('hikmah_bookmarked_verses');
                  }}
                  className="text-[10px] font-bold text-red-500 hover:text-red-700 underline cursor-pointer"
                >
                  Clear All Saved Items
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
