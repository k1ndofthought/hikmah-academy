import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  BookOpen, 
  FileText, 
  Youtube, 
  Send, 
  Globe, 
  ArrowRight, 
  GraduationCap, 
  Sparkles,
  Users
} from 'lucide-react';
import { ScholarAuthor, authorsData } from '../data/authors';
import { articlesData } from '../data/articles';

interface AuthorsViewProps {
  onSelectAuthor: (name: string) => void;
  articles?: any[];
  scholars?: Record<string, ScholarAuthor>;
}

export default function AuthorsView({ onSelectAuthor, articles, scholars }: AuthorsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const scholarsMap = scholars || authorsData;

  // Get list of authors
  const authorsList = Object.values(scholarsMap);

  const articlesListForAuthors = articles || articlesData;

  // Filter based on search query
  const filteredAuthors = authorsList.filter(author => {
    const nameMatch = author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const titleMatch = (author.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const bioMatch = (author.bio || '').toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || titleMatch || bioMatch;
  });

  // Calculate works count for each author helper
  const getAuthorWorksCount = (authorName: string) => {
    const booksCount = scholarsMap[authorName]?.books?.length || 0;
    const scholarArticles = articlesListForAuthors.filter(
      a => a.author.toLowerCase().trim().includes(authorName.toLowerCase().trim()) || 
           authorName.toLowerCase().trim().includes(a.author.toLowerCase().trim())
    );
    return {
      books: booksCount,
      articles: scholarArticles.length
    };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Block */}
      <section className="bg-gradient-to-br from-amber-800 to-amber-950 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 text-amber-200 px-3 py-1.5 rounded-full w-max">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>የምሁራንና ኡስታዞች መድረክ</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
              የአካዳሚው ምሁራንና ኡስታዞች
            </h2>
            <p className="text-amber-100/80 text-xs md:text-sm font-medium">
              Scholars, Writers, and Ustazs Contributing to Hikmah Academy
            </p>
          </div>
          
          <p className="text-xs text-amber-50/70 leading-relaxed font-medium pt-2 max-w-xl">
            እዚህ የአካዳሚያችንን ታዋቂ ምሁራን፣ ኡስታዞችና ተመራማሪዎች ዝርዝር ያገኛሉ። ስራዎቻቸውን (ያዘጋጇቸውን መጻሕፍትና የጻፏቸውን የእውቀት ፅሁፎች) ለማንበብ እያንዳንዱን ምሁር ይጫኑ።
          </p>
        </div>
      </section>

      {/* Search and Stats Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ምሁር ወይም ኡስታዝ በስም፣ በሙያ ይፈልጉ..."
            className="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium outline-none transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-amber-700" />
          <span>በአጠቃላይ፦ {filteredAuthors.length} ምሁራን ተገኝተዋል</span>
        </div>
      </div>

      {/* Authors Grid */}
      {filteredAuthors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-12 text-center space-y-3">
          <p className="text-sm text-gray-400 italic">የፈለጉትን ምሁር ወይም ኡስታዝ ማግኘት አልተቻለም።</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-amber-800 hover:underline"
          >
            ፍለጋውን ያጽዱ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAuthors.map((author, idx) => {
            const counts = getAuthorWorksCount(author.name);
            
            return (
              <motion.div
                key={author.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: idx * 0.05 }}
                onClick={() => onSelectAuthor(author.name)}
                className="group bg-white rounded-2xl border border-gray-200/60 hover:border-amber-700/20 p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Scholar Identity Row */}
                  <div className="flex gap-4 items-start">
                    <img
                      src={author.image}
                      alt={author.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-100 shadow-2xs shrink-0"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="font-serif text-sm sm:text-base font-bold text-primary group-hover:text-amber-800 transition-colors leading-snug line-clamp-2">
                        {author.name}
                      </h3>
                      <p className="text-[10px] font-bold text-amber-700 truncate">
                        {author.title}
                      </p>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 font-medium">
                    {author.bio}
                  </p>

                  {/* Works Badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {counts.books > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100 px-2 py-0.5 rounded-md">
                        <FileText className="h-3 w-3" />
                        {counts.books} መጽሐፍ{counts.books > 1 ? 'ት' : ''} (Books)
                      </span>
                    )}
                    {counts.articles > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-md">
                        <BookOpen className="h-3 w-3" />
                        {counts.articles} ፅሁፍ{counts.articles > 1 ? 'ቶች' : ''} (Articles)
                      </span>
                    )}
                    {counts.books === 0 && counts.articles === 0 && (
                      <span className="text-[10px] font-medium text-gray-400 italic">
                        ስራዎች በቅርቡ ይጫናሉ
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Section */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4 text-xs font-bold text-amber-800">
                  <div className="flex gap-2">
                    {author.socials.youtube && <Youtube className="h-3.5 w-3.5 text-red-500" />}
                    {author.socials.telegram && <Send className="h-3.5 w-3.5 text-blue-500" />}
                    {author.socials.website && <Globe className="h-3.5 w-3.5 text-emerald-600" />}
                  </div>
                  <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>ስራዎችና የሕይወት ታሪክ</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
