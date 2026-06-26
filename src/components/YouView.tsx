import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Globe, 
  Palette, 
  Download, 
  Bot, 
  ArrowLeft, 
  Mail, 
  Database, 
  Check, 
  Trash2,
  Sparkles,
  Info,
  Server,
  RefreshCw,
  HelpCircle,
  Terminal,
  Activity,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import ChatView from './ChatView';

interface YouViewProps {
  language: 'en' | 'am';
  setLanguage: (lang: 'en' | 'am') => void;
  colorTheme: 'emerald' | 'saffron' | 'blue' | 'dark';
  setColorTheme: (theme: 'emerald' | 'saffron' | 'blue' | 'dark') => void;
  onReciteRefVerse: (surahNumber: number, verseNumber: number) => void;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  apiStatus: 'idle' | 'loading' | 'connected' | 'error';
  onRefreshArticles: () => Promise<boolean>;
}

export default function YouView({
  language,
  setLanguage,
  colorTheme,
  setColorTheme,
  onReciteRefVerse,
  apiUrl,
  setApiUrl,
  apiStatus,
  onRefreshArticles
}: YouViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'account' | 'chat'>('account');
  const [cacheSize, setCacheSize] = useState<string>('12.4 MB');
  const [downloadCount, setDownloadCount] = useState<number>(3);
  const [localUrlInput, setLocalUrlInput] = useState<string>(apiUrl);
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  const [testingConnection, setTestingConnection] = useState<boolean>(false);

  // Synchronize local input state if parent state changes
  useEffect(() => {
    setLocalUrlInput(apiUrl);
  }, [apiUrl]);
  useEffect(() => {
    // Generate a pleasant offline stat
    const cachedNotes = localStorage.getItem('hikmah_study_notes');
    const notesCount = cachedNotes ? JSON.parse(cachedNotes).length : 1;
    const artBookmarks = localStorage.getItem('hikmah_bookmarked_articles');
    const artsCount = artBookmarks ? JSON.parse(artBookmarks).length : 0;
    const verBookmarks = localStorage.getItem('hikmah_bookmarked_verses');
    const versCount = verBookmarks ? JSON.parse(verBookmarks).length : 0;
    
    const calculatedSize = (notesCount * 12 + artsCount * 45 + versCount * 8 + 12000) / 1000;
    setCacheSize(`${calculatedSize.toFixed(2)} MB`);
    setDownloadCount(notesCount + artsCount + versCount);
  }, [activeSubTab]);

  const clearOfflineData = () => {
    if (confirm(language === 'en' ? 'Are you sure you want to clear cached theology studies and offline downloads?' : 'ሁሉንም የተቀመጡ ጥናቶችና ከመስመር ውጭ ፋይሎች ማጽዳት እርግጠኛ ነዎት?')) {
      localStorage.removeItem('hikmah_study_notes');
      localStorage.removeItem('hikmah_bookmarked_articles');
      localStorage.removeItem('hikmah_bookmarked_verses');
      alert(language === 'en' ? 'Offline study data cleared successfully!' : 'የተቀመጡ ጥናቶች በተሳካ ሁኔታ ተደምስሰዋል!');
      window.location.reload();
    }
  };

  if (activeSubTab === 'chat') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActiveSubTab('account')}
          className="flex items-center gap-1.5 bg-primary/5 text-primary hover:bg-primary/10 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{language === 'en' ? '← Back to Settings & Profile' : '← ወደ መገለጫና ቅንብሮች ይመለሱ'}</span>
        </button>
        <ChatView onReciteRefVerse={onReciteRefVerse} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Account Profile card header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col sm:flex-row gap-5 items-center shadow-xs">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl relative overflow-hidden">
          <User className="h-8 w-8" />
        </div>
        <div className="text-center sm:text-left space-y-1">
          <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {language === 'en' ? 'Premium Academic Account' : 'ፕሪሚየም አካዳሚክ መለያ'}
          </span>
          <h2 className="font-serif text-lg font-bold text-gray-900">salihyasins27@gmail.com</h2>
          <p className="text-xs text-gray-500 font-medium">
            {language === 'en' ? 'Joined June 2026 · Theological Researcher' : 'ከተቀላቀሉ፡ ሰኔ 2026 · የስነ-መለኮት ተመራማሪ'}
          </p>
        </div>
      </div>

      {/* Prominent Hikam Scholar AI Launcher */}
      <div className="bg-gradient-to-r from-primary to-primary/85 text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="space-y-2 text-center md:text-left max-w-md">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-semibold bg-white/10 text-amber-200 px-3 py-1.5 rounded-full w-max mx-auto md:mx-0">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Hikam Scholar AI</span>
          </div>
          <h3 className="font-serif text-base font-bold text-white">
            {language === 'en' ? 'Theology Analysis & Study Guidance' : 'የስነ-መለኮት ትንተና እና የጥናት መመሪያ'}
          </h3>
          <p className="text-xs text-gray-100/90 leading-relaxed font-medium">
            {language === 'en' ? 'Ask our highly trained AI assistant about scriptures, cross-references, historic context, and compare opinions side-by-side.' : 'ስለ መጻሕፍት፣ ማጣቀሻዎች፣ ታሪካዊ ሁኔታዎች እና የአስተያየት ንፅፅሮችን ረዳት AIያችንን ይጠይቁ።'}
          </p>
        </div>
        <button
          onClick={() => setActiveSubTab('chat')}
          className="bg-white text-primary hover:bg-gray-50 active:scale-95 transition-all text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
        >
          <Bot className="h-4.5 w-4.5 text-secondary" />
          <span>{language === 'en' ? 'Ask Hikam AI' : 'ሂካም AIን ጠይቅ'}</span>
        </button>
      </div>

      {/* Two column grid for Language and Theme Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Language Selection Card */}
        <section className="bg-white rounded-3xl border border-gray-200 p-5 space-y-4 shadow-xs">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Globe className="h-4 w-4 text-primary" />
            {language === 'en' ? 'Interface Language' : 'የአፕሊኬሽን ቋንቋ'}
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {/* English Choice */}
            <button
              onClick={() => setLanguage('en')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex justify-between items-center ${
                language === 'en'
                  ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              <div>
                <span className="font-semibold text-xs sm:text-sm block">Full English</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Use English for all options & menus</span>
              </div>
              {language === 'en' && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>

            {/* Amharic Choice */}
            <button
              onClick={() => setLanguage('am')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex justify-between items-center ${
                language === 'am'
                  ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              <div>
                <span className="font-semibold text-xs sm:text-sm block">ሙሉ አማርኛ (Full Amharic)</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">አማርኛን ለሁሉም አማራጮችና ምናሌዎች ይጠቀሙ</span>
              </div>
              {language === 'am' && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>
          </div>
        </section>

        {/* Color Scheme Picker */}
        <section className="bg-white rounded-3xl border border-gray-200 p-5 space-y-4 shadow-xs">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Palette className="h-4 w-4 text-primary" />
            {language === 'en' ? 'Color Scheme' : 'የቀለም ገጽታ'}
          </h4>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Theme 1: Emerald (Default) */}
            <button
              onClick={() => setColorTheme('emerald')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                colorTheme === 'emerald'
                  ? 'border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-600'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div className="flex gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[#003527]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#fe932c]" />
              </div>
              <span className="text-[10px] font-bold text-gray-800 truncate">Emerald Heritage</span>
            </button>

            {/* Theme 2: Saffron */}
            <button
              onClick={() => setColorTheme('saffron')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                colorTheme === 'saffron'
                  ? 'border-amber-700 bg-amber-50/20 ring-1 ring-amber-700'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div className="flex gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[#7c2d12]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ea580c]" />
              </div>
              <span className="text-[10px] font-bold text-gray-800 truncate">Abyssinian Saffron</span>
            </button>

            {/* Theme 3: Blue */}
            <button
              onClick={() => setColorTheme('blue')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                colorTheme === 'blue'
                  ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div className="flex gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1e3a8a]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#eab308]" />
              </div>
              <span className="text-[10px] font-bold text-gray-800 truncate">Royal Ge'ez</span>
            </button>

            {/* Theme 4: Dark */}
            <button
              onClick={() => setColorTheme('dark')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                colorTheme === 'dark'
                  ? 'border-emerald-400 bg-gray-800 ring-1 ring-emerald-400'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div className="flex gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#fb923c]" />
              </div>
              <span className="text-[10px] font-bold text-gray-800 truncate">Cosmic Charcoal (Dark)</span>
            </button>
          </div>
        </section>

      </div>

      {/* Database & FastAPI Backend Connection */}
      <section className="bg-white rounded-3xl border border-gray-200 p-5 space-y-4 shadow-xs">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
          <Server className="h-4 w-4 text-primary" />
          {language === 'en' ? 'Database & FastAPI Backend Connection' : 'የመረጃ ቋት እና የFastAPI ግንኙነት'}
        </h4>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {apiStatus === 'connected' && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </>
                )}
                {apiStatus === 'loading' && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </>
                )}
                {apiStatus === 'error' && (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                )}
                {apiStatus === 'idle' && (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-400"></span>
                )}
              </span>
              <span className="text-xs font-bold text-gray-800">
                {apiStatus === 'connected' && (language === 'en' ? 'Connected (PostgreSQL Live)' : 'የተገናኘ (በቀጥታ መረጃ ቋት)')}
                {apiStatus === 'loading' && (language === 'en' ? 'Connecting to backend...' : 'በማገናኘት ላይ...')}
                {apiStatus === 'error' && (language === 'en' ? 'Offline (Local Cache Fallback)' : 'ከመስመር ውጭ (የተቀመጠው ፋይል)')}
                {apiStatus === 'idle' && (language === 'en' ? 'Not tested yet' : 'ገና አልተሞከረም')}
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {apiUrl}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              {language === 'en' ? 'FastAPI Server Base URL' : 'የFastAPI አገልጋይ አድራሻ (URL)'}
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={localUrlInput}
                onChange={(e) => setLocalUrlInput(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
              />
              <button 
                onClick={() => {
                  setApiUrl(localUrlInput);
                  setTestResult(null);
                }}
                className="bg-primary text-white hover:bg-primary/95 text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-all cursor-pointer"
              >
                {language === 'en' ? 'Save & Connect' : 'አስቀምጥና አገናኝ'}
              </button>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
              {language === 'en' ? 'Quick IP Presets:' : 'ፈጣን የአይፒ አድራሻዎች (Presets):'}
            </span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { setLocalUrlInput('http://localhost:8000'); setApiUrl('http://localhost:8000'); }}
                className="px-2.5 py-1.5 rounded-lg border border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-600 hover:border-gray-200 active:scale-95 transition-all cursor-pointer"
              >
                localhost:8000 (Web browser)
              </button>
              <button 
                onClick={() => { setLocalUrlInput('http://10.0.2.2:8000'); setApiUrl('http://10.0.2.2:8000'); }}
                className="px-2.5 py-1.5 rounded-lg border border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-600 hover:border-gray-200 active:scale-95 transition-all cursor-pointer"
              >
                10.0.2.2:8000 (Android Emulator)
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3.5 pt-2">
            <button
              onClick={async () => {
                setTestingConnection(true);
                setTestResult(null);
                try {
                  const cleanUrl = localUrlInput.replace(/\/$/, "");
                  const res = await fetch(`${cleanUrl}/`, { method: 'GET' });
                  if (res.ok) {
                    const data = await res.json();
                    setTestResult({
                      success: true,
                      message: `FastAPI online! Status: ${data.status || 'Success'} · Architecture: ${data.architecture || 'JSON Aligned'}`
                    });
                  } else {
                    setTestResult({
                      success: false,
                      message: `Returned error code ${res.status} from server.`
                    });
                  }
                } catch (e) {
                  setTestResult({
                    success: false,
                    message: "Cannot connect! Ensure your FastAPI server is running with 'uvicorn main:app --host 0.0.0.0 --port 8000' and your computer is reachable."
                  });
                } finally {
                  setTestingConnection(false);
                }
              }}
              disabled={testingConnection}
              className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold py-2.5 px-4 rounded-xl active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Activity className="h-3.5 w-3.5 text-secondary" />
              <span>{testingConnection ? (language === 'en' ? 'Testing...' : 'በመሞከር ላይ...') : (language === 'en' ? 'Test Connection' : 'ግንኙነቱን ሞክር')}</span>
            </button>

            <button
              onClick={async () => {
                const success = await onRefreshArticles();
                if (success) {
                  alert(language === 'en' ? 'Synced successfully! Your custom articles are now live.' : 'በተሳካ ሁኔታ ተመሳስሏል! አዳዲስ ፅሁፎች በቀጥታ ገብተዋል።');
                } else {
                  alert(language === 'en' ? 'Failed to fetch articles. Is your FastAPI server running at the saved URL?' : 'ፅሁፎችን ማመሳሰል አልተቻለም። የFastAPI አገልጋይ መስራቱን ያረጋግጡ።');
                }
              }}
              className="flex items-center justify-center gap-1.5 bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90 text-xs font-bold py-2.5 px-4 rounded-xl active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${apiStatus === 'loading' ? 'animate-spin' : ''}`} />
              <span>{language === 'en' ? 'Sync Articles' : 'ፅሁፎችን አመሳስል'}</span>
            </button>
          </div>

          {/* Test connection result display */}
          {testResult && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed border ${
              testResult.success 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                : 'bg-red-50 border-red-100 text-red-800'
            }`}>
              <div className="flex gap-2 items-start">
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                )}
                <span>{testResult.message}</span>
              </div>
            </div>
          )}

          {/* Desktop Setup Instructions Drawer Accordion */}
          <div className="pt-2">
            <button
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="w-full py-3 px-4 rounded-xl border border-gray-100 hover:border-gray-200/80 bg-gray-50/30 flex justify-between items-center text-xs font-bold text-gray-700 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'Desktop FastAPI & PostgreSQL Setup Guide' : 'የFastAPI እና ፖስትግሬስ አጫጫን መመሪያ'}</span>
              </div>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </button>

            {showSetupGuide && (
              <div className="p-4 border-x border-b border-gray-100 bg-gray-50/10 rounded-b-xl space-y-4 text-xs text-gray-600 leading-relaxed max-h-96 overflow-y-auto no-scrollbar">
                <div>
                  <h5 className="font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Step 1: Run your PostgreSQL Database
                  </h5>
                  <p className="pl-3 text-[11px] text-gray-500 font-medium mt-1">
                    Make sure your local PostgreSQL database is running on port <span className="font-bold text-gray-700">5432</span>. Create a database named <span className="font-bold text-gray-700">hikmah_db</span>.
                  </p>
                  <pre className="mt-1.5 bg-gray-800 text-amber-200 p-2.5 rounded-lg font-mono text-[10px] overflow-x-auto">
                    psql -U postgres<br />
                    CREATE DATABASE hikmah_db;
                  </pre>
                </div>

                <div>
                  <h5 className="font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Step 2: Install Python Dependencies
                  </h5>
                  <p className="pl-3 text-[11px] text-gray-500 font-medium mt-1">
                    Install all required Python packages inside your terminal on your desktop:
                  </p>
                  <pre className="mt-1.5 bg-gray-800 text-amber-200 p-2.5 rounded-lg font-mono text-[10px] overflow-x-auto">
                    pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic requests
                  </pre>
                </div>

                <div>
                  <h5 className="font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Step 3: Save Your Files & Launch Server
                  </h5>
                  <p className="pl-3 text-[11px] text-gray-500 font-medium mt-1">
                    Place <span className="font-bold text-gray-700">database.py</span>, <span className="font-bold text-gray-700">models.py</span>, and <span className="font-bold text-gray-700">main.py</span> in your desktop project folder. Launch the server making it reachable externally:
                  </p>
                  <pre className="mt-1.5 bg-gray-800 text-amber-200 p-2.5 rounded-lg font-mono text-[10px] overflow-x-auto">
                    uvicorn main:app --reload --host 0.0.0.0 --port 8000
                  </pre>
                </div>

                <div>
                  <h5 className="font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Step 4: Connect & Upload Your Articles
                  </h5>
                  <p className="pl-3 text-[11px] text-gray-500 font-medium mt-1">
                    1. Set the URL above to match your computer's local network IP (e.g. <span className="font-bold text-gray-700">http://192.168.1.50:8000</span> or <span className="font-bold text-gray-700">http://10.0.2.2:8000</span> in emulator) and hit <span className="font-bold text-gray-700">Save & Connect</span>.<br />
                    2. Run your desktop test python script <span className="font-bold text-gray-700">upload.py</span> to seed your database with your customized <span className="font-bold text-gray-700">articles.json</span> layout!<br />
                    3. Click <span className="font-bold text-gray-700">Sync Articles</span> above to fetch and see your PostgreSQL articles render live!
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Downloads / Offline Sync Management */}
      <section className="bg-white rounded-3xl border border-gray-200 p-5 space-y-4 shadow-xs">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
          <Download className="h-4 w-4 text-primary" />
          {language === 'en' ? 'Offline Downloads & Storage' : 'ከመስመር ውጭ ውርዶችና ማከማቻ'}
        </h4>

        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-800 block">
              {language === 'en' ? 'Offline Caching Engine' : 'ከመስመር ውጭ ጥናት ማከማቻ'}
            </span>
            <p className="text-[11px] text-gray-400 max-w-md font-medium leading-relaxed">
              {language === 'en' 
                ? 'All books, scripture verses, academic notes, and profiles are automatically downloaded for complete offline access.' 
                : 'ሁሉም መጻሕፍት፣ ጥቅሶች፣ የጥናት ማስታወሻዎች እና ምሁራን መግለጫዎች ከመስመር ውጭ እንዲሰሩ በራስ-ሰር ተቀምጠዋል።'}
            </p>
          </div>
          <span className="text-xs bg-[#fe932c]/10 text-amber-950 font-bold px-3 py-1.5 rounded-lg border border-[#fe932c]/20 flex items-center gap-1 shrink-0">
            <Database className="h-3.5 w-3.5 text-[#fe932c]" />
            {cacheSize}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-2xl bg-white border border-gray-100 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-gray-800 block">
                {language === 'en' ? 'Scripture Databases' : 'የቅዱሳት መጻሕፍት የመረጃ ቋት'}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Quran [Amharic/Arabic] & Bible</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">100% Offline</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-gray-100 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-gray-800 block">
                {language === 'en' ? 'Theology Study Cache' : 'የጥናት ማስታወሻዎች መሸጎጫ'}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">{downloadCount} custom references</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">Synced</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 bg-white">
          <div className="flex items-start gap-2.5 text-xs text-gray-400 font-medium leading-relaxed">
            <Info className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <p>
              {language === 'en' 
                ? 'Audio recitations require internet connection or can be dynamically streamed.' 
                : 'የድምፅ ንባቦች የበይነመረብ ግንኙነት ይፈልጋሉ ወይም በቀጥታ መደመጥ ይችላሉ።'}
            </p>
          </div>
          <button
            onClick={clearOfflineData}
            className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {language === 'en' ? 'Clear Storage' : 'ማከማቻን አጽዳ'}
          </button>
        </div>

      </section>

    </div>
  );
}
