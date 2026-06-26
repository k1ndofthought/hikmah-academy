/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Youtube, 
  Send, 
  Globe, 
  BookOpen, 
  Download, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  BookmarkCheck,
  FileText,
  Clock,
  Info
} from 'lucide-react';
import { ScholarAuthor, ScholarBook, authorsData } from '../data/authors';
import { Article } from '../types';
import { articlesData } from '../data/articles';

interface AuthorProfileModalProps {
  authorName: string;
  onClose: () => void;
  onReadArticle: (article: Article) => void;
  articles?: Article[];
}

export default function AuthorProfileModal({ authorName, onClose, onReadArticle, articles }: AuthorProfileModalProps) {
  const [activeBook, setActiveBook] = useState<ScholarBook | null>(null);
  const [activeBookPage, setActiveBookPage] = useState<number>(1);

  const articlesList = articles || articlesData;

  // Look up author in database. If not found, use a fallback
  const author: ScholarAuthor = authorsData[authorName] || {
    name: authorName,
    title: "Scholarly Contributor",
    bio: `${authorName} is an esteemed writer and researcher contributing deep theological insights and comparative analyses to the Hikmah Academy.`,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    socials: {
      website: "https://ai.studio/build"
    },
    books: []
  };

  // Find articles by this author inside our app
  const scholarArticles = articlesList.filter(
    a => a.author.toLowerCase().trim().includes(author.name.toLowerCase().trim()) || 
         author.name.toLowerCase().trim().includes(a.author.toLowerCase().trim())
  );

  const handleOpenBook = (book: ScholarBook) => {
    setActiveBook(book);
    setActiveBookPage(1);
  };

  const handleCloseBook = () => {
    setActiveBook(null);
  };

  const handleDownloadBook = (book: ScholarBook) => {
    try {
      const element = document.createElement("a");
      const file = new Blob([book.content], {type: 'text/plain;charset=utf-8'});
      element.href = URL.createObjectURL(file);
      element.download = `${book.title.replace(/\s+/g, '_')}_HikmahAcademy.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (e) {
      alert("Failed to download book: " + e);
    }
  };

  // Resolve pages of current active book
  const bookPages = activeBook ? activeBook.content.split('PAGE ') : [];
  const cleanedBookPages = bookPages.filter(p => p.trim() !== '');
  const currentBookPageText = activeBook && cleanedBookPages[activeBookPage - 1] 
    ? cleanedBookPages[activeBookPage - 1] 
    : 'No content available.';

  return (
    <AnimatePresence>
      <div id="author-profile-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
        {/* Backdrop click close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Slide-in Profile Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="relative flex h-full w-full max-w-lg flex-col bg-gray-50 text-gray-900 shadow-2xl z-50 overflow-hidden"
        >
          
          {/* Header Bar */}
          <header className="flex items-center justify-between border-b border-gray-200/60 bg-white px-5 py-4 shrink-0">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 p-1.5 rounded-xl hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <span className="text-xs font-serif font-bold text-[#003527]">
              Scholar Profile
            </span>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* Profile Scroll Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            
            {/* Top Identity Block (Social Media Card style) */}
            <div className="bg-white rounded-3xl border border-gray-200/60 p-5 shadow-xs text-center space-y-4">
              <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-3 border-secondary-container bg-gray-50 shadow-sm">
                <img 
                  src={author.image} 
                  alt={author.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-primary tracking-tight">
                  {author.name}
                </h2>
                <p className="text-xs font-bold text-secondary-container">
                  {author.title}
                </p>
              </div>

              {/* Bio block */}
              <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto font-medium">
                {author.bio}
              </p>

              {/* Social Media Link Buttons */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {author.socials.youtube && (
                  <a 
                    href={author.socials.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-100 rounded-full px-3.5 py-1.5 text-[11px] font-bold hover:bg-red-100 transition-all"
                  >
                    <Youtube className="h-4 w-4" />
                    <span>YouTube Channel</span>
                  </a>
                )}
                {author.socials.telegram && (
                  <a 
                    href={author.socials.telegram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3.5 py-1.5 text-[11px] font-bold hover:bg-blue-100 transition-all"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Telegram Channel</span>
                  </a>
                )}
                {author.socials.website && (
                  <a 
                    href={author.socials.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full px-3.5 py-1.5 text-[11px] font-bold hover:bg-emerald-100 transition-all"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Official Portal</span>
                  </a>
                )}
              </div>
            </div>

            {/* Contributed PDF Books Section */}
            <div className="space-y-3.5">
              <h3 className="font-serif text-sm font-bold text-primary flex items-center gap-2 border-b border-gray-100 pb-2">
                <FileText className="h-4 w-4 text-secondary-container" />
                የተዘጋጁ መፅሃፎች (Contributed Books)
              </h3>
              
              {(!author.books || author.books.length === 0) ? (
                <p className="text-xs text-gray-400 italic bg-gray-50 p-4 rounded-2xl border text-center">
                  No scholastic books recorded for this scholar yet. More digital publications are added weekly.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {author.books.map((book, idx) => (
                    <div 
                      key={idx}
                      className="bg-white rounded-2xl border border-gray-200/60 p-4 hover:border-secondary-container/20 hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] bg-amber-50 text-amber-800 font-bold border border-amber-100 px-2 py-0.5 rounded uppercase">
                            Scholastic PDF
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium font-mono">{book.pagesCount} Pages</span>
                        </div>
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-primary leading-snug">
                          {book.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {book.description}
                        </p>
                      </div>

                      {/* Download and Read Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-50 mt-3.5 justify-end">
                        <button 
                          onClick={() => handleDownloadBook(book)}
                          className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                          title="Download book to device"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </button>
                        
                        <button 
                          onClick={() => handleOpenBook(book)}
                          className="flex items-center gap-1 bg-secondary hover:bg-[#a65600] text-white text-[10px] font-bold px-3.5 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer"
                        >
                          <BookOpen className="h-3 w-3" />
                          <span>Read Inside App</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Articles by This Scholar Section */}
            <div className="space-y-3.5">
              <h3 className="font-serif text-sm font-bold text-primary flex items-center gap-2 border-b border-gray-100 pb-2">
                <BookOpen className="h-4 w-4 text-secondary-container" />
                የምርምር ፅሁፎች (Articles in this App)
              </h3>

              {scholarArticles.length === 0 ? (
                <p className="text-xs text-gray-400 italic bg-gray-50 p-4 rounded-2xl border text-center">
                  No standalone articles written in this app version.
                </p>
              ) : (
                <div className="space-y-2">
                  {scholarArticles.map((art) => (
                    <div 
                      key={art.id}
                      onClick={() => {
                        onReadArticle(art);
                        onClose(); // Close the profile view when reading article
                      }}
                      className="group p-3 bg-white border border-gray-200 hover:border-[#003527]/20 rounded-xl hover:shadow-xs transition-all cursor-pointer flex justify-between items-center text-left"
                    >
                      <div className="space-y-1 max-w-[85%]">
                        <span className="text-[8px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          {art.category}
                        </span>
                        <h4 className="font-serif text-xs font-bold text-primary truncate group-hover:text-[#003527] transition-colors">
                          {art.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[9px] text-gray-400">
                          <span>{art.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            {art.readTime}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#003527] transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Integrated Scholar Book PDF Reader drawer overlay */}
          <AnimatePresence>
            {activeBook && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                className="absolute inset-0 z-50 bg-[#1e2522] text-gray-100 flex flex-col p-5"
              >
                {/* Book Reader Header */}
                <div className="flex justify-between items-start border-b border-white/10 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Integrated PDF Reader
                    </span>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-amber-100 leading-snug">
                      {activeBook.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium">By {author.name}</p>
                  </div>
                  <button 
                    onClick={handleCloseBook}
                    className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Book Reader Scroll Content */}
                <div className="flex-1 overflow-y-auto py-5 space-y-4 no-scrollbar">
                  <div className="bg-white/5 backdrop-blur-xs border border-white/5 p-6 rounded-2xl min-h-[300px] shadow-inner text-gray-200">
                    <div className="flex justify-between items-center text-[9px] text-gray-400 border-b border-white/5 pb-2 mb-4 font-mono font-bold tracking-wide">
                      <span>DIGITAL E-BOOK READER</span>
                      <span>PAGE {activeBookPage} OF {activeBook.pagesCount}</span>
                    </div>
                    
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif">
                      {currentBookPageText.trim().replace(/^\d+:\s*/, '').replace(/^PAGE \d+\s*/, '')}
                    </p>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-xs text-amber-200/95 flex items-start gap-2.5">
                    <Info className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-medium">
                      You are reading an official academic publication contributed by {author.name} for Hikmah Academy portal readers.
                    </p>
                  </div>
                </div>

                {/* Page Controls Footer */}
                <div className="border-t border-white/10 pt-4 flex justify-between items-center shrink-0">
                  <button
                    disabled={activeBookPage <= 1}
                    onClick={() => setActiveBookPage(activeBookPage - 1)}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Previous Page
                  </button>
                  <span className="text-xs font-semibold text-gray-300">
                    Page {activeBookPage} / {activeBook.pagesCount}
                  </span>
                  <button
                    disabled={activeBookPage >= activeBook.pagesCount}
                    onClick={() => setActiveBookPage(activeBookPage + 1)}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Next Page
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
