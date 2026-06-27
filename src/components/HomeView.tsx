import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Bookmark, 
  FileText, 
  Library, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { articlesData } from '../data/articles';
import { authorsData } from '../data/authors';

interface HomeViewProps {
  onNavigate: (tab: 'articles' | 'quran' | 'chat' | 'notes' | 'authors', options?: { showBookmarksOnly?: boolean }) => void;
  stats: {
    notesCount: number;
    bookmarkedArticlesCount: number;
    bookmarkedVersesCount: number;
  };
  articles?: any[];
  scholars?: any;
}

export default function HomeView({ onNavigate, stats, articles, scholars }: HomeViewProps) {
  const articlesList = articles || articlesData;
  const scholarsMap = scholars || authorsData;
  // Beautiful comparative theology and research verses (15 in total)
  const slidingVerses = [
    {
      verse: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
      translation: "«በዚያ በፈጠረው ጌታህ ስም አንብብ።»",
      reference: "Surah Al-Alaq [96:1]",
      context: "የንባብ፣ የእውቀት እና የጥናት አስፈላጊነት"
    },
    {
      verse: "ይህችም እውነተኛ አምላክ ብቻ የሆንኸውን አንተን የላክኸውንም ኢየሱስ ክርስቶስን ያውቁ ዘንድ የዘላለም ሕይወት ናት።",
      translation: "«እውነተኛ አምላክ ብቻ የሆንኸውን አንተን የላክኸውንም ኢየሱስ ክርስቶስን ያውቁ ዘንድ ይህች የዘላለም ሕይወት ናት።»",
      reference: "ዮሐንስ 17:3 (John 17:3)",
      context: "ስለ ብቸኛው እውነተኛ አምላክ እውቀት"
    },
    {
      verse: "እስራኤል ሆይ፥ ስማ፤ አምላካችን እግዚአብሔር አንድ እግዚአብሔር ነው።",
      translation: "«እስራኤል ሆይ፥ ስማ፤ አምላካችን እግዚአብሔር አንድ እግዚአብሔር ነው።» (ሸማ ኢስራኤል)",
      reference: "ዘዳግም 6:4 (Deuteronomy 6:4)",
      context: "የአምላክ አንድነትና ብቸኛ መመለክ"
    },
    {
      verse: "ሁሉንም መርምሩ፥ መልካሙንም ያዙ፤",
      translation: "«ሁሉንም መርምሩ፥ መልካሙንም ያዙ፤»",
      reference: "1ኛ ተሰሎንቄ 5:21 (1 Thessalonians 5:21)",
      context: "ጥልቀት ያለው ምርምርና እውነትን መከተል"
    },
    {
      verse: "قُلْ هُوَ اللَّه أَحَدٌ",
      translation: "«በል፦ እርሱ አላህ አንድ ነው።»",
      reference: "Surah Al-Ikhlas [112:1]",
      context: "የአምላክ ፍጹም አንድነትና ራስ-በቂነት"
    },
    {
      verse: "ከሁሉ የምትቀድመው ትእዛዝ ይህች ናት፦ እስራኤል ሆይ፥ ስማ፤ ጌታ አምላካችን አንድ ጌታ ነው።",
      translation: "«ከሁሉ የምትቀድመው ትእዛዝ ይህች ናት፦ እስራኤል ሆይ፥ ስማ፤ ጌታ አምላካችን አንድ ጌታ ነው።»",
      reference: "ማርቆስ 12:29 (Mark 12:29)",
      context: "የመጀመሪያዋና ከሁሉ የምትበልጠው ትእዛዝ"
    },
    {
      verse: "لَوْ كَانَ فِيهِمَا آلِهَةٌ إِلَّا اللَّهُ لَفَسَدَتَا",
      translation: "«በሁለቱ (በሰማያትና በምድር) ውስጥ ከአላህ ሌላ አማልክት በነበሩ ኖሮ በተበላሹ ነበር።»",
      reference: "Surah Al-Anbiya [21:22]",
      context: "የአጽናፈ ዓለም ስምምነትና የአንድ አምላክ ህልውና"
    },
    {
      verse: "እኔ እግዚአብሔር ነኝ፥ ከእኔም ሌላ ማንም የለም፤ ከእኔ በቀር አምላክ የለም።",
      translation: "«እኔ እግዚአብሔር ነኝ፥ ከእኔም ሌላ ማንም የለም፤ ከእኔ በቀር አምላክ የለም።»",
      reference: "ኢሳይያስ 45:5 (Isaiah 45:5)",
      context: "የአምላክ ፍጹም ብቸኝነትና ሉዓላዊነት"
    },
    {
      verse: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
      translation: "«ጌታዬ ሆይ! እውቀትን ጨምርልኝ በል»",
      reference: "Surah Taha [20:114]",
      context: "ዕውቀትንና ጥናትን ማሳደግ"
    },
    {
      verse: "እግዚአብሔር ጥበብን ይሰጣልና፤ ከአፉም እውቀትና ማስተዋል ይወጣሉ፤",
      translation: "«እግዚአብሔር ጥበብን ይሰጣልና፤ ከአፉም እውቀትና ማስተዋል ይወጣሉ፤»",
      reference: "ምሳሌ 2:6 (Proverbs 2:6)",
      context: "የጥበብና የማስተዋል ምንጭ"
    },
    {
      verse: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
      translation: "«እነዚያ የሚያውቁና እነዚያ የማያውቁ እኩል ይሆናሉን? በል።»",
      reference: "Surah Az-Zumar [39:9]",
      context: "የሚያውቁና የማያውቁ ሰዎች ልዩነት"
    },
    {
      verse: "እግዚአብሔር እርሱ አምላክ እንደ ሆነ፥ ከእርሱም በቀር ሌላ እንደሌለ ታውቅ ዘንድ ይህ ለአንተ ተገለጠ።",
      translation: "«እግዚአብሔር እርሱ አምላክ እንደ ሆነ፥ ከእርሱም በቀር ሌላ እንደሌለ ታውቅ ዘንድ ይህ ለአንተ ተገለጠ።»",
      reference: "ዘዳግም 4:35 (Deuteronomy 4:35)",
      context: "እግዚአብሔር ብቸኛ አምላክ መሆኑን ማወቅ"
    },
    {
      verse: "وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ ۖ لَّا إِلَٰهَ إِلَّا هُوَ الرَّحْمَٰንُ الرَّحِيمُ",
      translation: "«አምላካችሁም አንድ አምላክ ብቻ ነው፤ ከእርሱ በስተቀር ሌላ አምላክ የለም፤ (እርሱ) እጅግ በጣም ርኅሩኅ አዛኝ ነው።»",
      reference: "Surah Al-Baqarah [2:163]",
      context: "የአምላክ አንድነትና አጠቃላይ እዝነት"
    },
    {
      verse: "ለሁላችን አንድ አባት የለንምን? አንድ አምላክስ የፈጠረን አይደለምን?",
      translation: "«ለሁላችን አንድ አባት የለንምን? አንድ አምላክስ የፈጠረን አይደለምን? እኛስ አንዳችን በወንድማችን ላይ ለምን እናታልላለን?»",
      reference: "ሚልክያስ 2:10 (Malachi 2:10)",
      context: "አንድ የፈጠረን አምላክና የወንድማማችነት መሠረት"
    },
    {
      verse: "ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ وَأَنَّهُ يُحْيِي الْمَوْتَىٰ وَأَنَّهُ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
      translation: "«ይህም አላህ እርሱ እውነት በመሆኑና እርሱም ሙታንን ሕያው የሚያደርግ በመሆኑና እርሱም በነገሩ ሁሉ ላይ ቻይ በመሆኑ ነው።»",
      reference: "Surah Al-Hajj [22:6]",
      context: "አላህ ፍጹም እውነት መሆኑ"
    }
  ];

  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);

  // Gentle automatic slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVerseIndex((prev) => (prev + 1) % slidingVerses.length);
    }, 12000); // 12 seconds interval - slower and more readable
    return () => clearInterval(interval);
  }, [slidingVerses.length]);

  const handleNextVerse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentVerseIndex((prev) => (prev + 1) % slidingVerses.length);
  };

  const handlePrevVerse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentVerseIndex((prev) => (prev - 1 + slidingVerses.length) % slidingVerses.length);
  };

  const menuItems = [
    {
      id: 'quran',
      title: 'የንባብ ክፍል (Scriptures & Books)',
      titleEnglish: 'Library (Quran, Bible, Other Books)',
      description: 'ቅዱስ ቁርኣንን፣ መጽሐፍ ቅዱስን እና ሌሎች ጥናታዊ መጻሕፍትን በአማርኛና እንግሊዝኛ ያንብቡ፣ ያጥኑ፤ ያውርዱ።',
      icon: Library,
      color: 'from-[#003527] to-[#0d5c46]',
      accentBg: 'bg-[#003527]/5 text-[#003527]',
      badge: 'Quran, Bible & Scholarly Downloads',
      actionLabel: 'ለማንበብና ለማውረድ ይግቡ'
    },
    {
      id: 'articles',
      title: 'የእውቀት ፅሁፎች',
      titleEnglish: 'Scholarly Articles',
      description: 'በንፅፅር እምነት እና ስነ-መለኮት ዙሪያ የተዘጋጁ ጥልቅ ትንተናዊ ፅሁፎችን ያንብቡ።',
      icon: BookOpen,
      color: 'from-amber-700 to-amber-900',
      accentBg: 'bg-amber-50 text-amber-800',
      badge: 'Amharic Articles Hub',
      actionLabel: 'ፅሁፎችን ያንብቡ'
    },
    {
      id: 'authors',
      title: 'ምሁራንና ኡስታዞች (Scholars & Ustazs)',
      titleEnglish: 'Authors & Ustazs List',
      description: 'የአካዳሚውን ምሁራን፣ ኡስታዞችና አስተማሪዎች ዝርዝር፣ የሕይወት ታሪክ እና ያዘጋጇቸውን መጻሕፍት እዚህ ያግኙ።',
      icon: Users,
      color: 'from-emerald-700 to-teal-900',
      accentBg: 'bg-emerald-50 text-emerald-800',
      badge: `${Object.keys(scholarsMap).length} Scholars`,
      actionLabel: 'የምሁራንን ዝርዝር ለመመልከት'
    },
    {
      id: 'bookmarks',
      title: 'የተቀመጡ ማስታወሻዎች',
      titleEnglish: 'Your Saved Library',
      description: 'በጥናትዎ ወቅት ምልክት ያደረጓቸውን አንቀጾች እና ፅሁፎች እዚህ ያገኟቸዋል።',
      icon: Bookmark,
      color: 'from-blue-700 to-indigo-900',
      accentBg: 'bg-blue-50 text-blue-800',
      badge: `${stats.bookmarkedArticlesCount + stats.bookmarkedVersesCount} Items Saved`,
      actionLabel: 'የተቀመጡትን ይመልከቱ',
      isBookmarkShortcut: true
    },
    {
      id: 'notes',
      title: 'የጥናት ማስታወሻ ደብተር',
      titleEnglish: 'Academic Notes Engine',
      description: 'የራስዎን ፅሁፍ ይፃፉ፣ የቁርኣን አንቀጾችን ያጣቅሱ፣ ጥናታዊ ፅሁፎችን ያንብቡ እና ማስታወሻውን በPDF ኤክስፖርት ያድርጉ።',
      icon: FileText,
      color: 'from-orange-600 to-amber-600',
      accentBg: 'bg-orange-50 text-orange-800',
      badge: `${stats.notesCount} Active Notes`,
      actionLabel: 'ማስታወሻ ለመጻፍ'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner with auto-playing scripture slider */}
      <section className="bg-gradient-to-br from-[#003527] to-[#04261d] text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 text-[#59d5b4] px-3 py-1.5 rounded-full w-max">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>እንኳን በደህና መጡ ወደ ሂክማህ አካዳሚ</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
              የእውቀትና የምርምር መድረክ
            </h2>
            <p className="text-gray-300 text-xs md:text-sm font-medium">
              Islamic Comparative Religion, Theology & Arabic Studies
            </p>
          </div>

          {/* Sliding Quote Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-5 mt-2 flex flex-col justify-between min-h-[160px] md:min-h-[150px] transition-all">
            
            <div className="flex items-center gap-2 sm:gap-4 flex-1">
              {/* Prev Button beside verse text */}
              <button
                type="button"
                onClick={handlePrevVerse}
                className="p-1.5 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                title="የቀደመው አንቀጽ"
              >
                <ChevronLeft className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </button>

              {/* Central Verse Text container */}
              <div className="overflow-hidden relative flex-1 flex flex-col justify-center min-h-[90px] px-1 sm:px-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentVerseIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="space-y-3"
                  >
                    {/* Text representation (Arabic or Ethiopic) */}
                    <p 
                      className="font-serif text-base md:text-lg text-center font-bold text-amber-200 tracking-wide leading-relaxed"
                      style={{ direction: /[\u0600-\u06FF]/.test(slidingVerses[currentVerseIndex].verse) ? 'rtl' : 'ltr' }}
                    >
                      {slidingVerses[currentVerseIndex].verse}
                    </p>
                    
                    <div className="border-t border-white/5 pt-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-gray-200 font-medium leading-relaxed">
                          {slidingVerses[currentVerseIndex].translation}
                        </p>
                        <p className="text-[10px] text-[#59d5b4] font-semibold mt-1 flex items-center gap-1">
                          ✦ {slidingVerses[currentVerseIndex].context}
                        </p>
                      </div>
                      <span className="text-[10px] text-amber-100 bg-white/10 px-2.5 py-1 rounded-md font-mono flex-shrink-0 self-end md:self-auto">
                        {slidingVerses[currentVerseIndex].reference}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Button beside verse text */}
              <button
                type="button"
                onClick={handleNextVerse}
                className="p-1.5 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                title="ቀጣዩ አንቀጽ"
              >
                <ChevronRight className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-center border-t border-white/5 pt-3 mt-3">
              {/* Pagination Indicators - No numeric pagination display */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {slidingVerses.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentVerseIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentVerseIndex 
                        ? 'w-4 bg-[#59d5b4]' 
                        : 'w-1.5 bg-white/30 hover:bg-white/50'
                    }`}
                    title={`ቁጥር ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Statistics Bar */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3 md:p-4 border border-gray-200/50 text-center shadow-xs">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">ማስታወሻዎች</span>
          <span className="font-serif text-lg md:text-xl font-bold text-[#003527]">{stats.notesCount}</span>
        </div>
        <div className="bg-white rounded-2xl p-3 md:p-4 border border-gray-200/50 text-center shadow-xs">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">የተቀመጡ ፅሁፎች</span>
          <span className="font-serif text-lg md:text-xl font-bold text-amber-800">{stats.bookmarkedArticlesCount}</span>
        </div>
        <div className="bg-white rounded-2xl p-3 md:p-4 border border-gray-200/50 text-center shadow-xs">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">የተቀመጡ አንቀጾች</span>
          <span className="font-serif text-lg md:text-xl font-bold text-indigo-800">{stats.bookmarkedVersesCount}</span>
        </div>
      </section>

      {/* Navigation Cards Menu */}
      <section className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-primary border-b border-gray-100 pb-2">
          የት መሄድ ይፈልጋሉ? <span className="text-xs font-sans text-gray-400 font-normal">Select an option</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                onClick={() => {
                  if (item.isBookmarkShortcut) {
                    onNavigate('articles', { showBookmarksOnly: true });
                  } else {
                    onNavigate(item.id as any);
                  }
                }}
                className="group bg-white rounded-2xl border border-gray-200/70 hover:border-primary/20 p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Top Badge and Icon Row */}
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-md tracking-wide ${item.accentBg}`}>
                      {item.badge}
                    </span>
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-xs group-hover:scale-105 transition-transform`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1">
                    <h4 className="font-serif text-base font-bold text-primary flex items-center gap-1.5 group-hover:text-secondary-container transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] font-semibold text-gray-400">
                      {item.titleEnglish}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium pt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action bar */}
                <div className="flex items-center justify-between text-xs font-bold text-primary group-hover:text-secondary-container pt-4 border-t border-gray-50 mt-4">
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Scholarly Article Segment */}
      {articlesList.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-200/50 p-5 space-y-3.5 shadow-xs">
          <div className="flex justify-between items-center">
            <h4 className="font-serif text-sm font-bold text-primary flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              እውቅ ጥናታዊ ፅሁፍ (Featured Article)
            </h4>
            <button 
              onClick={() => onNavigate('articles')}
              className="text-xs font-bold text-[#003527] hover:underline"
            >
              ሁሉንም እይ
            </button>
          </div>

          <div 
            onClick={() => onNavigate('articles')}
            className="group p-4 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 hover:border-gray-200/80 transition-all cursor-pointer flex flex-col sm:flex-row gap-4 items-start"
          >
            {articlesList[0].image && (
              <img 
                src={articlesList[0].image} 
                alt={articlesList[0].title}
                referrerPolicy="no-referrer"
                className="w-full sm:w-24 h-24 object-cover rounded-xl border border-gray-200/60 shadow-xs"
              />
            )}
            <div className="space-y-1.5 flex-1">
              <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm">
                {articlesList[0].category}
              </span>
              <h5 className="font-serif text-xs sm:text-sm font-bold text-primary group-hover:text-[#003527] transition-colors leading-snug line-clamp-2">
                {articlesList[0].title}
              </h5>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-medium">
                {articlesList[0].description}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-gray-400 pt-1">
                <span className="font-semibold">{articlesList[0].author}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {articlesList[0].readTime || articlesList[0].read_time}
                </span>
              </div>
              {articlesList[0].tags && articlesList[0].tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {articlesList[0].tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
