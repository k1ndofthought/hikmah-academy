/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Share2, Bookmark, Type, ZoomIn, ZoomOut, Heart, ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { Article } from '../types';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onSelectAuthor?: (name: string) => void;
}

export default function ArticleModal({ article, onClose, isBookmarked, onToggleBookmark, onSelectAuthor }: ArticleModalProps) {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [useSerif, setUseSerif] = useState(true);
  const [liked, setLiked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activePartIndex, setActivePartIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // When active part changes, scroll to top of the reading container
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0 });
    }
    setScrollProgress(0);
  }, [activePartIndex]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(progress);
    setShowScrollTop(target.scrollTop > 400);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm leading-relaxed';
      case 'md': return 'text-base leading-relaxed';
      case 'lg': return 'text-lg leading-relaxed';
      case 'xl': return 'text-xl leading-relaxed';
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback
      navigator.clipboard.writeText(`${article.title} - Read on Hikmah Academy: ${window.location.href}`);
      alert("Article link copied to clipboard!");
    }
  };

  const hasParts = article.parts && article.parts.length > 0;
  const activePart = hasParts ? article.parts![activePartIndex] : null;

  const displayTitle = activePart ? activePart.title : article.title;
  const displayContent = activePart ? activePart.content : article.content;
  const displayReadTime = activePart && activePart.readTime ? activePart.readTime : article.readTime;
  const displayScholarQuote = activePart && activePart.scholarQuote ? activePart.scholarQuote : article.scholarQuote;

  return (
    <AnimatePresence>
      <div id="article-modal-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
        {/* Backdrop close area */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Sliding reader panel */}
        <motion.div
          id="article-reader-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative flex h-full w-full max-w-2xl flex-col bg-gray-50 text-gray-900 shadow-2xl"
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 h-1 bg-secondary-container transition-all duration-75" style={{ width: `${scrollProgress}%` }} />

          {/* Header Controls */}
          <header className="flex items-center justify-between border-b border-gray-200/60 bg-white/95 px-6 py-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                title="Close Reader"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="hidden sm:block max-w-[180px] md:max-w-[280px]">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  {article.category} {hasParts && `· Part ${activePartIndex + 1}/${article.parts!.length}`}
                </span>
                <h4 className="truncate font-serif text-sm font-semibold text-primary">
                  {article.title}
                </h4>
              </div>
            </div>

            {/* Quick reading adjustments */}
            <div className="flex items-center gap-2">
              {/* Serif Toggle */}
              <button
                onClick={() => setUseSerif(!useSerif)}
                className={`rounded-lg p-2 text-xs font-semibold border transition-all ${
                  useSerif 
                ? 'border-primary/20 bg-primary/5 text-primary' 
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
                title="Toggle Font Style"
              >
                <Type className="h-4 w-4 inline mr-1" />
                {useSerif ? 'Serif' : 'Sans'}
              </button>

              {/* Font Size Adjusters */}
              <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => fontSize !== 'sm' && setFontSize(fontSize === 'xl' ? 'lg' : fontSize === 'lg' ? 'md' : 'sm')}
                  disabled={fontSize === 'sm'}
                  className="p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  title="Decrease text size"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-xs font-semibold px-1 text-gray-700 select-none">
                  A
                </span>
                <button
                  onClick={() => fontSize !== 'xl' && setFontSize(fontSize === 'sm' ? 'md' : fontSize === 'md' ? 'lg' : 'xl')}
                  disabled={fontSize === 'xl'}
                  className="p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  title="Increase text size"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              {/* Share */}
              <button
                onClick={handleShare}
                className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                title="Share Article"
              >
                <Share2 className="h-4 w-4" />
              </button>

              {/* Bookmark */}
              <button
                onClick={onToggleBookmark}
                className={`rounded-lg border p-2 transition-all ${
                  isBookmarked
                    ? 'border-secondary/20 bg-secondary/10 text-secondary'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
              >
                <Bookmark className="h-4 w-4" style={{ fill: isBookmarked ? 'currentColor' : 'none' }} />
              </button>
            </div>
          </header>

          {/* Article Main Scrolling Area */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-8 sm:px-10"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="mx-auto max-w-xl space-y-6">
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary-container" />
                    <span className="text-xs font-semibold tracking-wide text-primary">
                      {article.category}
                    </span>
                  </div>
                  {hasParts && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 border border-secondary/20 px-3 py-1 text-xs font-bold text-secondary">
                      {article.parts!.length}-Part Study Series
                    </div>
                  )}
                </div>
                
                {hasParts && (
                  <p className="text-sm font-semibold text-secondary/80 font-serif mb-1">
                    {article.title}
                  </p>
                )}

                <h1 className="font-serif text-3xl font-bold tracking-tight text-primary leading-tight">
                  {displayTitle}
                </h1>

                <div 
                  onClick={() => onSelectAuthor && onSelectAuthor(article.author)}
                  className="flex items-center gap-3 pt-2 text-xs text-gray-500 border-b border-gray-100 pb-4 hover:bg-primary/[0.02] rounded-xl px-2 py-1 -mx-2 transition-all cursor-pointer group/author"
                  title="Click to view scholar profile"
                >
                  {article.authorImage ? (
                    <img src={article.authorImage} alt={article.author} className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/5 group-hover/author:ring-primary/20" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold group-hover/author:bg-primary/20">
                      {article.author[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800 group-hover/author:text-primary transition-colors">{article.author} (View Profile)</p>
                    <p className="text-[10px]">{article.date} · {displayReadTime} read</p>
                  </div>
                </div>
              </div>

              {/* Series Part Pill Navigator if exists */}
              {hasParts && (
                <div className="my-4 border-y border-gray-200/60 py-3 bg-gray-50/50 -mx-6 px-6 sm:-mx-10 sm:px-10">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-2 select-none">
                    Series Map & Chapters
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
                    {article.parts!.map((part, index) => (
                      <button
                        key={part.partNumber}
                        onClick={() => setActivePartIndex(index)}
                        className={`flex-shrink-0 px-3 py-2 rounded-lg border text-xs transition-all ${
                          activePartIndex === index
                            ? 'bg-primary border-primary text-white shadow-sm font-semibold'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="block text-[8px] uppercase tracking-wider opacity-80 text-left">
                          Part {part.partNumber}
                        </span>
                        <span className="block font-medium truncate max-w-[150px] mt-0.5">
                          {part.title.includes(': ') ? part.title.split(': ')[1] : part.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scholar Quote Callout if exists */}
              {displayScholarQuote && (
                <div className="relative border-l-4 border-secondary-container bg-secondary/5 p-4 rounded-r-xl">
                  <span className="absolute -top-3 -left-1 font-serif text-4xl text-secondary/20 select-none">“</span>
                  <p className="font-serif italic text-sm text-on-secondary-container leading-relaxed">
                    {displayScholarQuote}
                  </p>
                </div>
              )}

              {/* Banner Image / Fallback to Scholar Image */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <img
                  src={article.image || article.authorImage || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop"}
                  alt={article.title}
                  className="aspect-video w-full object-cover hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Curated Scholarly Content */}
              <div 
                className={`prose max-w-none text-gray-800 space-y-6 ${getFontSizeClass()} ${
                  useSerif ? 'font-serif' : 'font-sans'
                }`}
              >
                {/* Clean markdown rendering proxy */}
                {displayContent.split('\n\n').map((paragraph, idx) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  // Render Headings
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="font-serif text-lg font-bold text-primary pt-4 pb-1 border-b border-gray-100">
                        {trimmed.substring(4)}
                      </h3>
                    );
                  }
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="font-serif text-xl font-bold text-primary pt-6 pb-2">
                        {trimmed.substring(3)}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith('# ')) {
                    return null; // Skip main title as we rendered it nicely above
                  }

                  // Render blockquotes
                  if (trimmed.startsWith('> ')) {
                    const lines = trimmed.split('\n').map(l => l.replace(/^>\s*/, ''));
                    return (
                      <blockquote key={idx} className="border-l-4 border-primary bg-primary/5 px-4 py-3 rounded-r-lg italic my-4 text-primary font-serif">
                        {lines.map((line, lIdx) => (
                          <p key={lIdx} className="m-0 leading-relaxed">{line}</p>
                        ))}
                      </blockquote>
                    );
                  }

                  // Render lists
                  if (trimmed.includes('\n* ') || trimmed.includes('\n- ') || trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.includes('\n1. ') || trimmed.startsWith('1. ')) {
                    const items = trimmed.split('\n');
                    const isOrdered = /^\d+\./.test(items[0].trim());
                    
                    if (isOrdered) {
                      return (
                        <ol key={idx} className="list-decimal pl-6 space-y-2 my-4">
                          {items.map((item, iIdx) => (
                            <li key={iIdx}>{item.replace(/^\d+\.\s*/, '')}</li>
                          ))}
                        </ol>
                      );
                    } else {
                      return (
                        <ul key={idx} className="list-disc pl-6 space-y-2 my-4">
                          {items.map((item, iIdx) => (
                            <li key={iIdx}>{item.replace(/^[-*]\s*/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                  }

                  // Normal paragraph
                  // Handle inline bold formatting
                  return (
                    <p key={idx} className="leading-relaxed">
                      {trimmed.split('**').map((part, pIdx) => {
                        return pIdx % 2 === 1 ? <strong key={pIdx} className="text-primary font-bold">{part}</strong> : part;
                      })}
                    </p>
                  );
                })}
              </div>

              {/* Next Part navigation at bottom if has multiple parts */}
              {hasParts && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-10">
                  <button
                    disabled={activePartIndex === 0}
                    onClick={() => setActivePartIndex(prev => prev - 1)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous Part
                  </button>

                  {activePartIndex < article.parts!.length - 1 ? (
                    <button
                      onClick={() => setActivePartIndex(prev => prev + 1)}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#043d2e] active:scale-95 transition-all"
                    >
                      Next Part
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-gray-400">
                      Completed Series
                    </span>
                  )}
                </div>
              )}

              {/* End Decorative */}
              <div className="flex flex-col items-center justify-center py-10 border-t border-gray-100 space-y-3">
                <BookOpen className="h-6 w-6 text-secondary/60 animate-pulse" />
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                  End of Scholarly Article
                </p>
              </div>
            </div>
          </div>

          {/* Quick Footer Interaction */}
          <footer className="flex items-center justify-between border-t border-gray-200/60 bg-white px-6 py-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                liked
                  ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
              }`}
            >
              <Heart className="h-4 w-4" style={{ fill: liked ? 'currentColor' : 'none' }} />
              {liked ? 'Added to Recommended' : 'Recommend this Article'}
            </button>
            <span className="text-xs text-gray-400">
              Hikmah Academy Academic Press
            </span>
          </footer>

          {/* Back to top float button */}
          {showScrollTop && (
            <button
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="absolute bottom-20 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:scale-110 active:scale-95 transition-all"
              title="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
