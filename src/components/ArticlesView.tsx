/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, BookOpen, Clock, ArrowRight, Bookmark, Mail, CheckCircle, Shuffle, Compass, Book, Brain, User, RefreshCw, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Article } from '../types';
import { articlesData } from '../data/articles';

function getArticlePerspectives(article: Article): ('Islam' | 'Christianity' | 'Atheism')[] {
  const perspectives: ('Islam' | 'Christianity' | 'Atheism')[] = [];
  const text = (article.title + ' ' + article.description + ' ' + (article.tags || []).join(' ') + ' ' + (article.category || '')).toLowerCase();
  
  if (
    text.includes('islam') ||
    text.includes('kalam') ||
    text.includes('fitra') ||
    text.includes('hadith') ||
    text.includes('qur\'an') ||
    text.includes('quran') ||
    text.includes('sunnah') ||
    text.includes('andalus') ||
    text.includes('rijal') ||
    text.includes('ibrahim') ||
    article.author.toLowerCase().includes('wahid') ||
    article.author.toLowerCase().includes('qaradawi') ||
    article.author.toLowerCase().includes('al-faruqi') ||
    article.author.toLowerCase().includes('nasr') ||
    article.category === 'Hadith Sciences' ||
    article.category === 'Islamic History'
  ) {
    perspectives.push('Islam');
  }
  
  if (
    text.includes('christian') ||
    text.includes('bible') ||
    text.includes('testament') ||
    text.includes('jesus') ||
    text.includes('yhwh') ||
    text.includes('angelology') ||
    text.includes('eucharist') ||
    text.includes('lordship') ||
    text.includes('gospel') ||
    text.includes('christ') ||
    text.includes('trinity') ||
    text.includes('episodes') ||
    text.includes('adam') ||
    text.includes('ibrahimic') ||
    text.includes('coexistence')
  ) {
    perspectives.push('Christianity');
  }
  
  if (
    text.includes('atheism') ||
    text.includes('atheist') ||
    text.includes('secular') ||
    text.includes('philosophy') ||
    text.includes('existentialism') ||
    text.includes('necessary being') ||
    text.includes('burhan') ||
    text.includes('cosmological') ||
    text.includes('logic') ||
    text.includes('metaphysics') ||
    text.includes('materialism') ||
    text.includes('proof of the truthful') ||
    text.includes('aquinas')
  ) {
    perspectives.push('Atheism');
  }

  if (perspectives.length === 0) {
    perspectives.push('Islam');
  }

  return perspectives;
}

interface ArticlesViewProps {
  articles?: Article[];
  onReadArticle: (article: Article) => void;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  showBookmarksOnly?: boolean;
  onSelectAuthor?: (name: string) => void;
}

export default function ArticlesView({ 
  articles,
  onReadArticle, 
  bookmarks, 
  onToggleBookmark, 
  showBookmarksOnly = false,
  onSelectAuthor 
}: ArticlesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(showBookmarksOnly ? 'Bookmarks Only' : 'All Articles');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPerspective, setSelectedPerspective] = useState<'All' | 'Islam' | 'Christianity' | 'Atheism'>('All');
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const articlesList = articles || articlesData;

  const activeFiltersCount = 
    (selectedPerspective !== 'All' ? 1 : 0) +
    (selectedAuthor !== null ? 1 : 0) +
    ((activeCategory !== 'All Articles' && activeCategory !== 'Bookmarks Only') ? 1 : 0) +
    (selectedTag !== null ? 1 : 0);

  const categories = showBookmarksOnly ? ['Bookmarks Only'] : [
    'All Articles',
    'Comparative Religion',
    'Islamic History',
    'Philosophy',
    'Hadith Sciences',
    'Scholarly Insight'
  ];

  // Get all unique tags dynamically
  const allTags = Array.from(
    new Set(articlesList.flatMap(article => article.tags || []))
  );

  // Get all unique authors dynamically
  const allAuthors = Array.from(
    new Set(articlesList.map(article => article.author))
  );

  // Filter articles based on query, category, selected tag, perspective, and author
  const filteredArticles = articlesList.filter(article => {
    // If showing bookmarks only, filter out un-bookmarked ones
    if (showBookmarksOnly && !bookmarks.includes(article.id)) {
      return false;
    }

    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = 
      activeCategory === 'All Articles' || 
      activeCategory === 'Bookmarks Only' ||
      article.category === activeCategory;

    const matchesTag = 
      !selectedTag || 
      (article.tags && article.tags.includes(selectedTag));

    const matchesAuthor = 
      !selectedAuthor || 
      article.author === selectedAuthor;

    const matchesPerspective = 
      selectedPerspective === 'All' || 
      getArticlePerspectives(article).includes(selectedPerspective);

    return matchesSearch && matchesCategory && matchesTag && matchesAuthor && matchesPerspective;
  });

  // Choose a random article from filtered or all
  const handleRandomArticle = () => {
    const pool = filteredArticles.length > 0 ? filteredArticles : articlesList;
    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      onReadArticle(pool[randomIndex]);
    }
  };

  // Separate featured article (hide if filtering by bookmarks to keep view focused)
  const featuredArticle = showBookmarksOnly ? undefined : articlesList.find(a => a.featured && activeCategory === 'All Articles' && !searchQuery && selectedPerspective === 'All' && !selectedAuthor && !selectedTag);

  // Standard articles list (exclude featured from general grid if we are on "All Articles" to avoid double rendering)
  const displayArticles = filteredArticles.filter(a => {
    if (showBookmarksOnly) return true;
    if (activeCategory === 'All Articles' && !searchQuery) {
      return !a.featured;
    }
    return true;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Featured Article Card at the very top (Only when category is 'All Articles' and no search query) */}
      {featuredArticle && (
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-primary text-white shadow-xl border border-primary-container"
        >
          {/* Subtle Islamic pattern grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#064e3b_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-20" />
          
          <div className="relative p-6 sm:p-10 space-y-4">
            <span className="inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Featured Article
            </span>
            
            <div className="space-y-2 max-w-xl">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-sm text-on-primary-container leading-relaxed">
                {featuredArticle.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-primary-container/40">
              <div className="flex items-center gap-2 text-xs text-on-primary-container">
                <Clock className="h-4 w-4 text-secondary-container" />
                <span>{featuredArticle.readTime} read</span>
                <span className="text-primary-fixed-dim">|</span>
                <span>By {featuredArticle.author}</span>
              </div>

              <button 
                onClick={() => onReadArticle(featuredArticle)}
                className="flex items-center gap-2 bg-[#fe932c] hover:bg-[#e07f24] active:scale-95 text-on-secondary-container font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                Read Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Dynamic Search & Filters Area */}
      <section className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm space-y-4">
        
        {/* Search Input Bar & Control Buttons */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1 pr-3 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all">
            <div className="flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search by title, topic, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 border px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs group cursor-pointer ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-900'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className={`h-4 w-4 text-amber-700 transition-transform duration-200 ${showFilters ? 'rotate-90' : ''}`} />
              <span>{showFilters ? 'Hide Filters' : 'Filter Options'}</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#fe932c] text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button
              onClick={handleRandomArticle}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-[#fe932c] hover:bg-[#e07f24] text-white font-bold px-4 py-2.5 rounded-xl text-xs active:scale-95 transition-all shadow-sm group whitespace-nowrap cursor-pointer"
              title="Read a random article"
            >
              <Shuffle className="h-4 w-4 transition-transform group-hover:rotate-45 duration-300" />
              <span>🎲 Random Article</span>
            </button>
          </div>
        </div>

        {/* Expandable Filters Section */}
        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="space-y-4 pt-3 border-t border-gray-100 overflow-hidden"
            >
              {/* Major Perspectives (Islam, Christianity, Atheism) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-gray-400" />
                    Perspective Focus:
                  </label>
                  {selectedPerspective !== 'All' && (
                    <button 
                      onClick={() => setSelectedPerspective('All')}
                      className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { name: 'All', label: 'All Perspectives', icon: Compass, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200', activeColor: 'bg-primary border-primary text-white' },
                    { name: 'Islam', label: 'Islam & Kalam', icon: BookOpen, color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100', activeColor: 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-100' },
                    { name: 'Christianity', label: 'Christianity & Bible', icon: Book, color: 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-100', activeColor: 'bg-sky-600 border-sky-600 text-white shadow-sky-100' },
                    { name: 'Atheism', label: 'Atheism & Philosophy', icon: Brain, color: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100', activeColor: 'bg-slate-700 border-slate-700 text-white shadow-slate-100' }
                  ].map((p) => {
                    const Icon = p.icon;
                    const isActive = selectedPerspective === p.name;
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setSelectedPerspective(p.name as any)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all duration-200 text-left cursor-pointer border ${
                          isActive ? p.activeColor + ' shadow-sm scale-[1.02]' : p.color + ' border-transparent'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scholars Circle (Ustazs/Scholars Filter) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-gray-400" />
                    Scholars / Ustazs:
                  </label>
                  {selectedAuthor && (
                    <button 
                      onClick={() => setSelectedAuthor(null)}
                      className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                  <button
                    onClick={() => setSelectedAuthor(null)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !selectedAuthor
                        ? 'bg-secondary/15 text-secondary border border-secondary/20'
                        : 'bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    All Scholars
                  </button>
                  {allAuthors.map((author) => {
                    const isAuthorActive = selectedAuthor === author;
                    const displayName = author.includes('Ustaz Wahid') ? 'Ustaz Wahid' : author;
                    return (
                      <button
                        key={author}
                        onClick={() => setSelectedAuthor(isAuthorActive ? null : author)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          isAuthorActive
                            ? 'bg-primary/15 text-primary border-primary/20'
                            : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                        }`}
                      >
                        {displayName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Academic Categories */}
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-gray-400" />
                  Academic Category:
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                  {categories.map((category) => {
                    const isActive = activeCategory === category;
                    return (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-primary border-primary text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topics & Tags Chips Row */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-gray-100 mt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-gray-400" /> Tags:
                  </span>
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      !selectedTag
                        ? 'bg-secondary/15 text-secondary border border-secondary/20'
                        : 'bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    All Tags
                  </button>
                  {allTags.map((tag) => {
                    const isTagActive = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(isTagActive ? null : tag)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                          isTagActive
                            ? 'bg-[#fe932c]/15 text-[#fe932c] border-[#fe932c]/20'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300'
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Articles Feed List */}
      <section className="space-y-6">
        {displayArticles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200/60 p-6">
            <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-700">No articles found</h3>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search filters or select another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayArticles.map((article) => {
              const isBookmarked = bookmarks.includes(article.id);
              
              // Fallback to writer picture or a high-quality pattern image if article.image is empty or missing
              const coverImage = article.image || article.authorImage || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop";

              return (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200/60 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 text-left"
                >
                  {/* Article Banner Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-50 cursor-pointer" onClick={() => onReadArticle(article)}>
                    <img
                      src={coverImage}
                      alt={article.title}
                      className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm uppercase tracking-wide">
                      {article.category}
                    </div>
                  </div>

                  {/* Thick gold visual spacer lines */}
                  <div className="h-1 w-full bg-secondary-container" />

                  {/* Content Area */}
                  <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-2 cursor-pointer" onClick={() => onReadArticle(article)}>
                      <h3 className="font-serif text-lg font-bold tracking-tight text-primary leading-snug group-hover:text-secondary transition-colors duration-200">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                        {article.description}
                      </p>
                    </div>

                    {/* Article Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {article.tags.map(tag => {
                          const isTagActive = selectedTag === tag;
                          return (
                            <span
                              key={tag}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(isTagActive ? null : tag);
                              }}
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                                isTagActive 
                                  ? 'bg-primary/25 text-primary' 
                                  : 'bg-gray-100 hover:bg-primary/10 text-gray-600 hover:text-primary'
                              }`}
                            >
                              #{tag}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Scholar Author Row */}
                    <div 
                      onClick={() => onSelectAuthor && onSelectAuthor(article.author)}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 hover:bg-secondary/5 border border-gray-100 hover:border-secondary/20 transition-all cursor-pointer group/author"
                    >
                      {article.authorImage ? (
                        <img 
                          src={article.authorImage} 
                          alt={article.author} 
                          className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/5 group-hover/author:ring-secondary/20"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-primary/10 text-primary flex items-center justify-center rounded-full text-xs font-bold font-serif group-hover/author:bg-secondary/15">
                          {article.author[0]}
                        </div>
                      )}
                      <div className="text-left">
                        <span className="block text-[11px] font-bold text-gray-700 group-hover/author:text-primary transition-colors">{article.author}</span>
                        <span className="block text-[9px] text-gray-400 font-medium">የጸሐፊው ግለ-ታሪክ (View Scholar Profile)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-[10px] text-gray-400 font-semibold tracking-wide flex flex-wrap items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {article.readTime}
                        {article.parts && article.parts.length > 0 && (
                          <span className="inline-flex items-center rounded bg-secondary/10 px-1.5 py-0.5 text-[9px] font-bold text-secondary">
                            {article.parts.length}-Part Series
                          </span>
                        )}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        {/* Bookmark Button */}
                        <button
                          onClick={() => onToggleBookmark(article.id)}
                          className={`p-2 rounded-lg transition-colors mr-1 ${
                            isBookmarked 
                              ? 'text-secondary bg-secondary/10' 
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark className="h-4 w-4" style={{ fill: isBookmarked ? 'currentColor' : 'none' }} />
                        </button>

                        <button 
                          onClick={() => onReadArticle(article)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary group-hover:translate-x-1 transition-all duration-200"
                        >
                          Read Now
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Newsletter signup - Deepen Your Knowledge */}
      <section className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm overflow-hidden relative">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-36 w-36 rounded-full bg-primary/5 -z-0 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {!newsletterSubscribed ? (
            <motion.div 
              key="newsletter-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 text-center space-y-4 max-w-md mx-auto"
            >
              <div className="h-10 w-10 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-primary">Deepen Your Knowledge</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Receive weekly scholarly digests, academic papers, and translation insights curated by the Hikmah Council directly to your inbox.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your scholarly email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="bg-secondary hover:bg-[#a65600] active:scale-95 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="newsletter-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-3 max-w-sm mx-auto"
            >
              <div className="h-12 w-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-primary">Scholar Subscription Active</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Excellent. You have been added to our digital scholarly circle. The next academic bulletin will arrive on Friday.
                </p>
              </div>
              <button
                onClick={() => setNewsletterSubscribed(false)}
                className="text-xs font-semibold text-primary underline"
              >
                Subscribe another email
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
