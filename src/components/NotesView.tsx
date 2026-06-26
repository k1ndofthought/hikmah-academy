import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  FileText, 
  BookOpen, 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  Search, 
  Book, 
  Eye, 
  Check, 
  Printer,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  File,
  X,
  Sparkles,
  Info,
  Quote,
  Layers,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Palette,
  Upload,
  Share2
} from 'lucide-react';
import { StudyNote, NoteBlock, NoteBlockType, Surah, Verse, QuranReference } from '../types';
import { quranData } from '../data/quran';
import { bibleData } from '../data/bible';

interface NotesViewProps {
  onJumpToQuran: (surahId: number, verseNumber: number) => void;
  onJumpToBible: (bookId: number, chapterNumber: number, verseNumber: number) => void;
}

export default function NotesView({ onJumpToQuran, onJumpToBible }: NotesViewProps) {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Note Form Fields
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<NoteBlock[]>([]);
  const [attachedDocId, setAttachedDocId] = useState<string>('');

  // Quran Reference Selector / Modal States
  const [isVersePickerOpen, setIsVersePickerOpen] = useState(false);
  const [verseInsertIndex, setVerseInsertIndex] = useState<number | null>(null);
  const [refSurahId, setRefSurahId] = useState<number>(1);
  const [refVerseNum, setRefVerseNum] = useState<number>(1);
  const [isRangeSelection, setIsRangeSelection] = useState<boolean>(false);
  const [refEndVerseNum, setRefEndVerseNum] = useState<number>(1);

  // Scripture Tab inside Picker Modal: 'quran' | 'bible'
  const [scripturePickerTab, setScripturePickerTab] = useState<'quran' | 'bible'>('quran');

  // Quran translation selection checkboxes
  const [quranShowArabic, setQuranShowArabic] = useState<boolean>(true);
  const [quranShowAmharic, setQuranShowAmharic] = useState<boolean>(true);
  const [quranShowEnglish, setQuranShowEnglish] = useState<boolean>(true);

  // Bible Picker States
  const [refBibleBookId, setRefBibleBookId] = useState<number>(1);
  const [refBibleChapter, setRefBibleChapter] = useState<number>(1);
  const [refBibleVerseNum, setRefBibleVerseNum] = useState<number>(1);
  const [isBibleRangeSelection, setIsBibleRangeSelection] = useState<boolean>(false);
  const [refBibleEndVerseNum, setRefBibleEndVerseNum] = useState<number>(1);

  // Bible translation selection checkboxes
  const [bibleShowOriginal, setBibleShowOriginal] = useState<boolean>(true);
  const [bibleShowAmharic, setBibleShowAmharic] = useState<boolean>(true);
  const [bibleShowEnglish, setBibleShowEnglish] = useState<boolean>(true);

  // Image and Canvas Picker / Upload States
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imageInsertIndex, setImageInsertIndex] = useState<number | null>(null);
  const [imageInputUrl, setImageInputUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Migration helper: Converts standard plain-text notes to block list
  const migrateNoteToBlocks = (note: StudyNote): NoteBlock[] => {
    if (note.blocks && note.blocks.length > 0) {
      return note.blocks;
    }
    
    const convertedBlocks: NoteBlock[] = [];
    
    if (note.content && note.content.trim()) {
      convertedBlocks.push({
        id: 'b_mig_txt_' + note.id,
        type: 'text',
        content: note.content
      });
    }
    
    if (note.references && note.references.length > 0) {
      note.references.forEach((ref, idx) => {
        convertedBlocks.push({
          id: `b_mig_ref_${note.id}_${idx}`,
          type: 'verse',
          content: '',
          surahId: ref.surahId,
          verseNumber: ref.verseNumber
        });
      });
    }
    
    if (convertedBlocks.length === 0) {
      convertedBlocks.push({
        id: 'b_init_' + Date.now(),
        type: 'text',
        content: ''
      });
    }
    
    return convertedBlocks;
  };

  // Save/Load Local Storage
  useEffect(() => {
    try {
      const cached = localStorage.getItem('hikmah_study_notes');
      if (cached) {
        const parsedNotes: StudyNote[] = JSON.parse(cached);
        // Ensure all notes are fully migrated to block structures
        const migrated = parsedNotes.map(note => ({
          ...note,
          blocks: migrateNoteToBlocks(note)
        }));
        setNotes(migrated);
      } else {
        // Seed default initial note
        const seedNote: StudyNote = {
          id: 'note_default_1',
          title: 'Primordial Nature (Fitrah) and Al-Fatiha Reflection',
          content: 'The concept of Fitrah represents the natural baseline of human alignment with the Divine. When we read Surah Al-Fatiha, we speak directly to this pristine internal nature.',
          createdAt: new Date('2026-06-20').toLocaleDateString(),
          updatedAt: new Date('2026-06-20').toLocaleDateString(),
          references: [
            { surahId: 1, verseNumber: 1 },
            { surahId: 1, verseNumber: 4 }
          ]
        };
        
        const migratedSeed: StudyNote = {
          ...seedNote,
          blocks: [
            {
              id: 'b_seed_1',
              type: 'text',
              content: 'The concept of Fitrah represents the natural baseline of human alignment with the Divine. When we read Surah Al-Fatiha, we speak directly to this pristine internal nature. The verses serve as an active reminder and polishing of the Hege-Libona (ሕገ-ልቦና - the Law of the Conscience).'
            },
            {
              id: 'b_seed_2',
              type: 'verse',
              content: '',
              surahId: 1,
              verseNumber: 1
            },
            {
              id: 'b_seed_3',
              type: 'text',
              content: 'By reciting the praise, we align our internal law of conscience (Hege-Libona) directly with written revelation:'
            },
            {
              id: 'b_seed_5',
              type: 'verse',
              content: '',
              surahId: 1,
              verseNumber: 4
            }
          ]
        };

        const initialNotes = [migratedSeed];
        setNotes(initialNotes);
        localStorage.setItem('hikmah_study_notes', JSON.stringify(initialNotes));
      }
    } catch (e) {
      console.error("Failed to load notes", e);
    }
  }, []);

  const saveToLocalStorage = (updatedNotes: StudyNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('hikmah_study_notes', JSON.stringify(updatedNotes));
  };

  // Create Note trigger
  const handleCreateNewNote = () => {
    setTitle('');
    setBlocks([{ id: 'b_new_' + Date.now(), type: 'text', content: '' }]);
    setAttachedDocId('');
    setIsEditing(true);
    setSelectedNote(null);
  };

  // Save Note handler
  const handleSaveNote = () => {
    if (!title.trim()) {
      alert("Please provide a title for your note.");
      return;
    }

    const nowString = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Compile backup plain fallback content and extract summary references for backward-compatibility
    const plainContent = blocks
      .map(b => {
        if (b.type === 'text') return b.content;
        if (b.type === 'verse') return `[Quran Reference: Surah ${b.surahId}, Verse ${b.verseNumber}]`;
        if (b.type === 'doc_quote') return `[Quote: "${b.content}"]`;
        return '';
      })
      .filter(Boolean)
      .join('\n\n');

    const summaryReferences: QuranReference[] = blocks
      .filter(b => b.type === 'verse' && b.surahId && b.verseNumber)
      .map(b => ({ surahId: b.surahId!, verseNumber: b.verseNumber! }));

    if (selectedNote) {
      // Editing existing note
      const updated: StudyNote = {
        ...selectedNote,
        title,
        content: plainContent,
        references: summaryReferences,
        attachedDocId,
        blocks,
        updatedAt: nowString
      };
      const list = notes.map(n => n.id === selectedNote.id ? updated : n);
      saveToLocalStorage(list);
      setSelectedNote(updated);
    } else {
      // Creating new note
      const created: StudyNote = {
        id: 'note_' + Date.now(),
        title,
        content: plainContent,
        references: summaryReferences,
        attachedDocId,
        blocks,
        createdAt: nowString,
        updatedAt: nowString
      };
      const list = [created, ...notes];
      saveToLocalStorage(list);
      setSelectedNote(created);
    }
    setIsEditing(false);
  };

  // Delete Note handler
  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this study note?")) {
      const list = notes.filter(n => n.id !== id);
      saveToLocalStorage(list);
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  // Select Note to view
  const handleSelectNote = (note: StudyNote) => {
    const activeBlocks = migrateNoteToBlocks(note);
    setSelectedNote({
      ...note,
      blocks: activeBlocks
    });
    setTitle(note.title);
    setBlocks(activeBlocks);
    setAttachedDocId(note.attachedDocId || '');
    setIsEditing(false);
  };

  // Edit Note mode trigger
  const handleStartEdit = () => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      const activeBlocks = migrateNoteToBlocks(selectedNote);
      setBlocks(activeBlocks);
      setAttachedDocId(selectedNote.attachedDocId || '');
      setIsEditing(true);
    }
  };

  // Block flow management helpers
  const updateBlockContent = (id: string, text: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content: text } : b));
  };

  const updateBlockProperty = (id: string, key: string, value: any) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, [key]: value } : b));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const next = [...blocks];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setBlocks(next);
  };

  const deleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      setBlocks([{ id: 'b_init_res_' + Date.now(), type: 'text', content: '' }]);
      return;
    }
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  // Triggers the modal to choose Quran/Bible reference and insert at index
  const triggerAddVerseBlock = (index: number) => {
    setVerseInsertIndex(index);
    // Quran defaults
    setRefSurahId(1);
    setRefVerseNum(1);
    setIsRangeSelection(false);
    setRefEndVerseNum(1);
    // Bible defaults
    setRefBibleBookId(1);
    setRefBibleChapter(1);
    setRefBibleVerseNum(1);
    setIsBibleRangeSelection(false);
    setRefBibleEndVerseNum(1);
    
    setIsVersePickerOpen(true);
  };

  // Saves and inserts the verse block at selected index
  const handleInsertVerseBlock = () => {
    if (verseInsertIndex === null) return;

    let newBlock: NoteBlock;

    if (scripturePickerTab === 'quran') {
      newBlock = {
        id: 'block_v_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        type: 'verse',
        content: '',
        surahId: refSurahId,
        verseNumber: refVerseNum,
        endVerseNumber: isRangeSelection ? Math.max(refVerseNum, refEndVerseNum) : undefined,
        showArabic: quranShowArabic,
        showAmharic: quranShowAmharic,
        showEnglish: quranShowEnglish,
      };
    } else {
      newBlock = {
        id: 'block_bv_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        type: 'verse',
        content: '',
        bibleBookId: refBibleBookId,
        bibleChapter: refBibleChapter,
        bibleVerseNumber: refBibleVerseNum,
        bibleEndVerseNumber: isBibleRangeSelection ? Math.max(refBibleVerseNum, refBibleEndVerseNum) : undefined,
        showOriginal: bibleShowOriginal,
        showAmharic: bibleShowAmharic,
        showEnglish: bibleShowEnglish,
      };
    }

    const next = [...blocks];
    next.splice(verseInsertIndex, 0, newBlock);
    setBlocks(next);
    setIsVersePickerOpen(false);
    setVerseInsertIndex(null);
  };

  // Triggers the image upload/url modal
  const triggerAddImageBlock = (index: number) => {
    setImageInsertIndex(index);
    setImageInputUrl('');
    setImageCaption('');
    setIsImagePickerOpen(true);
  };

  const handleInsertImageBlock = () => {
    if (imageInsertIndex === null) return;
    const newBlock: NoteBlock = {
      id: 'block_img_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      type: 'image',
      content: imageCaption || 'Attached Image',
      imageUrl: imageInputUrl.trim() || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800'
    };
    const next = [...blocks];
    next.splice(imageInsertIndex, 0, newBlock);
    setBlocks(next);
    setIsImagePickerOpen(false);
    setImageInsertIndex(null);
  };

  const handleAddTextParagraph = (index: number) => {
    const newBlock: NoteBlock = {
      id: 'block_t_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      type: 'text',
      content: ''
    };
    const next = [...blocks];
    next.splice(index, 0, newBlock);
    setBlocks(next);
  };

  // Helper to resolve Quran data
  const selectedSurahData = quranData.find(s => s.id === refSurahId) || quranData[0];
  const activeVersePreview = selectedSurahData.verses.find(v => v.number === refVerseNum) || selectedSurahData.verses[0];

  // Helper to resolve Bible data
  const selectedBibleBookData = bibleData.find(bk => bk.id === refBibleBookId) || bibleData[0];
  const activeBibleChapterVerses = selectedBibleBookData.chapters[refBibleChapter] || [];

  // Export Canva study notes to beautiful print / PDF flow
  const handlePrintExport = () => {
    if (!selectedNote) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Pop-up blocked! Please enable pop-ups to export note as PDF.");
      return;
    }

    // Process blocks in chronological Canva flow to print
    const blocksHTML = (selectedNote.blocks || []).map(b => {
      if (b.type === 'text') {
        return `<p style="font-size: 15px; color: #222; line-height: 1.7; margin-bottom: 25px; font-family: 'Arial', sans-serif;">${b.content.replace(/\n/g, '<br>')}</p>`;
      }
      
      if (b.type === 'verse') {
        const isBible = !!b.bibleBookId;
        
        if (isBible) {
          const book = bibleData.find(bk => bk.id === b.bibleBookId);
          if (!book) return '';
          const chapterNum = b.bibleChapter || 1;
          const start = b.bibleVerseNumber || 1;
          const end = b.bibleEndVerseNumber || start;
          const versesList = book.chapters[chapterNum] || [];
          const verses = versesList.filter(v => v.number >= start && v.number <= end);
          if (verses.length === 0) return '';

          const showOrig = b.showOriginal !== false;
          const showAmh = b.showAmharic !== false;
          const showEng = b.showEnglish !== false;

          const originalHTML = showOrig ? verses.map(v => `
            <span style="font-size: 18px; text-align: right; font-family: 'Times New Roman', serif; line-height: 1.6; display: inline-block; margin-left: 10px;" dir="rtl">
              ${v.text} <span style="font-size: 12px; color: #7f1d1d;">﴿${v.number}﴾</span>
            </span>
          `).join(' ') : '';

          const amharicHTML = showAmh ? verses.map(v => `
            <p style="margin: 6px 0 0 0; font-size: 14px; line-height: 1.5; color: #111; font-family: 'Arial', sans-serif;">
              <strong style="color:#7f1d1d;">[${v.number}] አማርኛ፦</strong> ${v.translationAmharic}
            </p>
          `).join('') : '';

          const englishHTML = showEng ? verses.map(v => `
            <p style="margin: 4px 0 0 0; font-size: 13px; line-height: 1.5; color: #444;">
              <strong style="color:#777;">[${v.number}] English:</strong> ${v.translationEnglish}
            </p>
          `).join('') : '';

          return `
            <div style="margin: 30px 0; padding: 20px; border-left: 5px solid #7f1d1d; background-color: #fdf2f2; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #fee2e2; padding-bottom: 6px;">
                <strong style="color: #7f1d1d; font-family: 'Georgia', serif; font-size: 15px;">✞ ${book.name} [${chapterNum}:${start}${end !== start ? `-${end}` : ''}]</strong>
                <span style="font-size: 13px; font-weight: bold; color: #555;">${book.nameEnglish}</span>
              </div>
              ${originalHTML ? `<div style="text-align: right; margin: 15px 0;">${originalHTML}</div>` : ''}
              ${amharicHTML ? `<div style="border-top: 1px solid #fee2e2; padding-top: 10px; margin-top: 10px;">${amharicHTML}</div>` : ''}
              ${englishHTML ? `<div style="border-top: 1px dashed #fee2e2; padding-top: 8px; margin-top: 8px;">${englishHTML}</div>` : ''}
            </div>
          `;
        } else {
          // Quran
          const surah = quranData.find(s => s.id === b.surahId);
          if (!surah) return '';
          const start = b.verseNumber || 1;
          const end = b.endVerseNumber || start;
          const verses = surah.verses.filter(v => v.number >= start && v.number <= end);
          if (verses.length === 0) return '';

          const showArab = b.showArabic !== false;
          const showAmh = b.showAmharic !== false;
          const showEng = b.showEnglish !== false;

          const arabicHTML = showArab ? verses.map(v => `
            <span style="font-size: 20px; text-align: right; font-family: 'Times New Roman', serif; line-height: 1.6; display: inline-block; margin-left: 10px;" dir="rtl">
              ${v.text} <span style="font-size: 13px; color: #003527;">﴿${v.number}﴾</span>
            </span>
          `).join(' ') : '';

          const amharicHTML = showAmh ? verses.map(v => `
            <p style="margin: 6px 0 0 0; font-size: 14px; line-height: 1.5; color: #111; font-family: 'Arial', sans-serif;">
              <strong style="color:#003527;">[${v.number}] አማርኛ፦</strong> ${v.translationAmharic}
            </p>
          `).join('') : '';

          const englishHTML = showEng ? verses.map(v => `
            <p style="margin: 4px 0 0 0; font-size: 13px; line-height: 1.5; color: #444;">
              <strong style="color:#777;">[${v.number}] English:</strong> ${v.translationEnglish}
            </p>
          `).join('') : '';

          return `
            <div style="margin: 30px 0; padding: 20px; border-left: 5px solid #003527; background-color: #f6f8f7; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #e1e8e5; padding-bottom: 6px;">
                <strong style="color: #003527; font-family: 'Georgia', serif; font-size: 15px;">✦ ${surah.name} [${surah.id}:${start}${end !== start ? `-${end}` : ''}]</strong>
                <span style="font-size: 13px; font-weight: bold; color: #555;">${surah.nameEnglish}</span>
              </div>
              ${arabicHTML ? `<div style="text-align: right; margin: 15px 0;">${arabicHTML}</div>` : ''}
              ${amharicHTML ? `<div style="border-top: 1px solid #e1e8e5; padding-top: 10px; margin-top: 10px;">${amharicHTML}</div>` : ''}
              ${englishHTML ? `<div style="border-top: 1px dashed #e1e8e5; padding-top: 8px; margin-top: 8px;">${englishHTML}</div>` : ''}
            </div>
          `;
        }
      }

      if (b.type === 'image') {
        return `
          <div style="text-align: center; margin: 25px 0;">
            <img src="${b.imageUrl}" style="max-width: 100%; max-height: 400px; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
            <p style="font-size: 13px; color: #666; margin-top: 8px; font-style: italic; font-family: sans-serif;">${b.content}</p>
          </div>
        `;
      }

      if (b.type === 'canvas') {
        return `
          <div style="text-align: center; margin: 25px 0;">
            <img src="${b.canvasData}" style="max-width: 100%; max-height: 400px; border: 1px solid #ccc; border-radius: 8px; background-color: #fafafa;" />
            <p style="font-size: 13px; color: #666; margin-top: 8px; font-style: italic; font-family: sans-serif;">${b.content}</p>
          </div>
        `;
      }

      if (b.type === 'doc_quote') {
        return `
          <div style="margin: 25px 0; padding: 18px; border-left: 4px solid #b45309; background-color: #fffbeb; border-radius: 6px; font-style: italic;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #78350f; line-height: 1.6; font-family: 'Georgia', serif;">
              "${b.content}"
            </p>
          </div>
        `;
      }

      return '';
    }).join('');

    const attachedDocName = 'None';

    const rawHTML = `
      <html>
        <head>
          <title>${selectedNote.title} - Hikmah Canva Note Flow</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              color: #333;
              line-height: 1.6;
              padding: 40px;
              max-width: 820px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header {
              border-bottom: 2px solid #003527;
              padding-bottom: 15px;
              margin-bottom: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              color: #003527;
              font-family: 'Georgia', serif;
              font-size: 28px;
              letter-spacing: 1px;
            }
            .header p {
              margin: 5px 0 0 0;
              font-size: 11px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .title {
              font-family: 'Georgia', serif;
              font-size: 25px;
              color: #111;
              margin-bottom: 12px;
              line-height: 1.3;
            }
            .meta {
              font-size: 12px;
              color: #777;
              margin-bottom: 35px;
              background: #f9f9f9;
              padding: 10px 14px;
              border-radius: 6px;
              display: flex;
              justify-content: space-between;
              border: 1px solid #eee;
            }
            .canvas-flow {
              margin-bottom: 40px;
            }
            .footer {
              margin-top: 60px;
              border-top: 1px solid #eee;
              padding-top: 15px;
              text-align: center;
              font-size: 11px;
              color: #888;
            }
            @media print {
              body { padding: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HIKMAH STUDY COMPASS</h1>
            <p>Integrated Comparative Scripture & Reflection Journal</p>
          </div>
          
          <h2 class="title">${selectedNote.title}</h2>
          
          <div class="meta">
            <span><strong>Created:</strong> ${selectedNote.createdAt}</span>
            <span><strong>Last Updated:</strong> ${selectedNote.updatedAt}</span>
            <span><strong>Core Document:</strong> ${attachedDocName}</span>
          </div>

          <div class="canvas-flow">
            ${blocksHTML}
          </div>

          <div class="footer">
            <p>© 2026 Hikmah Academy Academic Press. Compiled & Exported from Canva Note Flow.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(rawHTML);
    printWindow.document.close();
  };

  // Filter Notes based on search
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* 2. CANVA SCRIPTURE VERSE PICKER DIALOG MODAL (QURAN & BIBLE) */}
      <AnimatePresence>
        {isVersePickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsVersePickerOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-50 space-y-4 text-gray-900 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-serif text-base font-bold text-[#003527] flex items-center gap-2">
                  <Book className="h-5 w-5 text-secondary" />
                  ቅዱሳት መጻሕፍትን አስገባ (Insert Scripture Verse)
                </h3>
                <button 
                  onClick={() => setIsVersePickerOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Tabs for Quran vs Bible */}
              <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setScripturePickerTab('quran')}
                  className={`flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    scripturePickerTab === 'quran'
                      ? 'bg-[#003527] text-white shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  ቁርኣን (Quran)
                </button>
                <button
                  type="button"
                  onClick={() => setScripturePickerTab('bible')}
                  className={`flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    scripturePickerTab === 'bible'
                      ? 'bg-red-800 text-white shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  መጽሐፍ ቅዱስ (Bible)
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-1">
                {scripturePickerTab === 'quran' ? (
                  /* QURAN SELECTORS */
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">ሱራ ምረጥ (Surah)</label>
                        <select
                          value={refSurahId}
                          onChange={(e) => {
                            setRefSurahId(Number(e.target.value));
                            setRefVerseNum(1);
                            setRefEndVerseNum(1);
                          }}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:border-[#003527]"
                        >
                          {quranData.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.id}. {s.name} ({s.nameEnglish})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          {isRangeSelection ? "የመጀመሪያ አንቀጽ (Start)" : "አንቀጽ ምረጥ (Verse)"}
                        </label>
                        <select
                          value={refVerseNum}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setRefVerseNum(val);
                            if (refEndVerseNum < val) {
                              setRefEndVerseNum(val);
                            }
                          }}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none"
                        >
                          {Array.from({ length: selectedSurahData.totalVerses }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>
                              Verse {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Checkbox toggle for multiple verses / range */}
                    <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <input
                        type="checkbox"
                        id="range_select"
                        checked={isRangeSelection}
                        onChange={(e) => {
                          setIsRangeSelection(e.target.checked);
                          if (e.target.checked) {
                            setRefEndVerseNum(refVerseNum);
                          }
                        }}
                        className="rounded text-[#003527] focus:ring-[#003527] h-4 w-4 cursor-pointer"
                      />
                      <label htmlFor="range_select" className="text-[11px] font-bold text-gray-600 cursor-pointer select-none">
                        በርካታ አንቀጾችን በአንድ ላይ ምረጥ (Select Range / Multiple Verses)
                      </label>
                    </div>

                    {isRangeSelection && (
                      <div className="space-y-1 animate-fadeIn">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">የመጨረሻ አንቀጽ (End Verse)</label>
                        <select
                          value={refEndVerseNum}
                          onChange={(e) => setRefEndVerseNum(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-emerald-200 bg-emerald-50/20 text-[#003527] outline-none"
                        >
                          {Array.from({ length: selectedSurahData.totalVerses }, (_, i) => i + 1)
                            .filter(num => num >= refVerseNum)
                            .map(num => (
                              <option key={num} value={num}>
                                Verse {num} (End)
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    {/* Quran translation selection customization */}
                    <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-500/10 space-y-2">
                      <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block border-b border-emerald-500/10 pb-1">
                        የሚገቡ ጽሑፎች/ትርጉሞች (Include in Import Notes)
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs">
                        <label className="flex items-center gap-1.5 font-bold text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={quranShowArabic}
                            onChange={(e) => setQuranShowArabic(e.target.checked)}
                            className="rounded text-[#003527] focus:ring-[#003527] h-3.5 w-3.5"
                          />
                          አረብኛ (Arabic text)
                        </label>
                        <label className="flex items-center gap-1.5 font-bold text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={quranShowAmharic}
                            onChange={(e) => setQuranShowAmharic(e.target.checked)}
                            className="rounded text-[#003527] focus:ring-[#003527] h-3.5 w-3.5"
                          />
                          አማርኛ ትርጉም (Amharic)
                        </label>
                        <label className="flex items-center gap-1.5 font-bold text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={quranShowEnglish}
                            onChange={(e) => setQuranShowEnglish(e.target.checked)}
                            className="rounded text-[#003527] focus:ring-[#003527] h-3.5 w-3.5"
                          />
                          እንግሊዝኛ (English)
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* BIBLE SELECTORS */
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">መጽሐፍ ምረጥ (Bible Book)</label>
                      <select
                        value={refBibleBookId}
                        onChange={(e) => {
                          const bookId = Number(e.target.value);
                          setRefBibleBookId(bookId);
                          setRefBibleChapter(1);
                          setRefBibleVerseNum(1);
                          setRefBibleEndVerseNum(1);
                        }}
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:border-red-800"
                      >
                        {bibleData.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.nameEnglish}) · {b.testament}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">ምዕራፍ (Chapter)</label>
                        <select
                          value={refBibleChapter}
                          onChange={(e) => {
                            setRefBibleChapter(Number(e.target.value));
                            setRefBibleVerseNum(1);
                            setRefBibleEndVerseNum(1);
                          }}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none"
                        >
                          {Array.from({ length: selectedBibleBookData.totalChapters }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>
                              Chapter {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          {isBibleRangeSelection ? "የመጀመሪያ ቁጥር (Start)" : "ቁጥር ምረጥ (Verse)"}
                        </label>
                        <select
                          value={refBibleVerseNum}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setRefBibleVerseNum(val);
                            if (refBibleEndVerseNum < val) {
                              setRefBibleEndVerseNum(val);
                            }
                          }}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none"
                        >
                          {activeBibleChapterVerses.map(v => (
                            <option key={v.number} value={v.number}>
                              Verse {v.number}
                            </option>
                          ))}
                          {activeBibleChapterVerses.length === 0 && (
                            <option value={1}>Verse 1</option>
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Checkbox toggle for multiple bible verses */}
                    <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <input
                        type="checkbox"
                        id="bible_range_select"
                        checked={isBibleRangeSelection}
                        onChange={(e) => {
                          setIsBibleRangeSelection(e.target.checked);
                          if (e.target.checked) {
                            setRefBibleEndVerseNum(refBibleVerseNum);
                          }
                        }}
                        className="rounded text-red-800 focus:ring-red-800 h-4 w-4 cursor-pointer"
                      />
                      <label htmlFor="bible_range_select" className="text-[11px] font-bold text-gray-600 cursor-pointer select-none">
                        በርካታ ቁጥሮችን በአንድ ላይ ምረጥ (Select Range / Multiple Verses)
                      </label>
                    </div>

                    {isBibleRangeSelection && (
                      <div className="space-y-1 animate-fadeIn">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">የመጨረሻ ቁጥር (End Verse)</label>
                        <select
                          value={refBibleEndVerseNum}
                          onChange={(e) => setRefBibleEndVerseNum(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-red-200 bg-red-50/20 text-red-800 outline-none"
                        >
                          {activeBibleChapterVerses
                            .filter(v => v.number >= refBibleVerseNum)
                            .map(v => (
                              <option key={v.number} value={v.number}>
                                Verse {v.number} (End)
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    {/* Bible Translation Selection customization */}
                    <div className="bg-red-50/40 p-3 rounded-xl border border-red-500/10 space-y-2">
                      <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider block border-b border-red-500/10 pb-1">
                        የሚገቡ ጽሑፎች/ትርጉሞች (Include in Import Notes)
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs">
                        <label className="flex items-center gap-1.5 font-bold text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bibleShowOriginal}
                            onChange={(e) => setBibleShowOriginal(e.target.checked)}
                            className="rounded text-red-800 focus:ring-red-800 h-3.5 w-3.5"
                          />
                          የመጀመሪያው ኮዴክስ (Original Hebrew/Greek)
                        </label>
                        <label className="flex items-center gap-1.5 font-bold text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bibleShowAmharic}
                            onChange={(e) => setBibleShowAmharic(e.target.checked)}
                            className="rounded text-red-800 focus:ring-red-800 h-3.5 w-3.5"
                          />
                          አማርኛ ትርጉም (Amharic)
                        </label>
                        <label className="flex items-center gap-1.5 font-bold text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bibleShowEnglish}
                            onChange={(e) => setBibleShowEnglish(e.target.checked)}
                            className="rounded text-red-800 focus:ring-red-800 h-3.5 w-3.5"
                          />
                          እንግሊዝኛ (English)
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Preview Container inside selector */}
                <div className={`border p-4 rounded-2xl space-y-3.5 text-left max-h-[180px] overflow-y-auto ${
                  scripturePickerTab === 'quran' 
                    ? 'bg-emerald-50/50 border-emerald-100' 
                    : 'bg-rose-50/50 border-rose-100'
                }`}>
                  <span className={`text-[9px] font-bold uppercase tracking-widest font-mono block border-b pb-1 ${
                    scripturePickerTab === 'quran' ? 'text-[#003527]/70 border-emerald-100/60' : 'text-red-900/70 border-rose-100/60'
                  }`}>
                    የምርጫ ቅድመ-እይታ ({
                      scripturePickerTab === 'quran'
                        ? (isRangeSelection ? `Quran Surah ${refSurahId} Verses ${refVerseNum} - ${refEndVerseNum}` : `Quran Surah ${refSurahId} Verse ${refVerseNum}`)
                        : (isBibleRangeSelection ? `Bible ${selectedBibleBookData.nameEnglish} ${refBibleChapter}:${refBibleVerseNum} - ${refBibleEndVerseNum}` : `Bible ${selectedBibleBookData.nameEnglish} ${refBibleChapter}:${refBibleVerseNum}`)
                    })
                  </span>
                  
                  {scripturePickerTab === 'quran' ? (
                    (() => {
                      const endVal = isRangeSelection ? Math.max(refVerseNum, refEndVerseNum) : refVerseNum;
                      const selectedVerses = selectedSurahData.verses.filter(v => v.number >= refVerseNum && v.number <= endVal);
                      
                      return selectedVerses.map(v => (
                        <div key={v.number} className="space-y-1 border-b border-emerald-100/30 pb-2 last:border-b-0">
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Verse {v.number}</span>
                          {quranShowArabic && (
                            <p className="font-serif text-base text-[#003527] text-right font-medium leading-relaxed" dir="rtl">
                              {v.text}
                            </p>
                          )}
                          {quranShowAmharic && (
                            <p className="font-serif text-[11px] text-gray-800 font-bold leading-relaxed">
                              አማርኛ፦ "{v.translationAmharic}"
                            </p>
                          )}
                          {quranShowEnglish && (
                            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                              English: "{v.translationEnglish}"
                            </p>
                          )}
                        </div>
                      ));
                    })()
                  ) : (
                    (() => {
                      const endVal = isBibleRangeSelection ? Math.max(refBibleVerseNum, refBibleEndVerseNum) : refBibleVerseNum;
                      const selectedVerses = activeBibleChapterVerses.filter(v => v.number >= refBibleVerseNum && v.number <= endVal);
                      
                      return selectedVerses.map(v => (
                        <div key={v.number} className="space-y-1 border-b border-rose-100/30 pb-2 last:border-b-0">
                          <span className="text-[9px] font-bold text-red-700 bg-rose-100 px-1.5 py-0.5 rounded">Verse {v.number}</span>
                          {bibleShowOriginal && (
                            <p className="font-serif text-base text-right text-red-950 font-medium leading-relaxed" dir="rtl">
                              {v.text}
                            </p>
                          )}
                          {bibleShowAmharic && (
                            <p className="font-serif text-[11px] text-gray-800 font-bold leading-relaxed">
                              አማርኛ፦ "{v.translationAmharic}"
                            </p>
                          )}
                          {bibleShowEnglish && (
                            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                              English: "{v.translationEnglish}"
                            </p>
                          )}
                        </div>
                      ));
                    })()
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setIsVersePickerOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInsertVerseBlock}
                  className={`px-5 py-2 text-xs font-bold rounded-xl text-white transition-all cursor-pointer ${
                    scripturePickerTab === 'quran'
                      ? 'bg-[#003527] hover:bg-[#00251c]'
                      : 'bg-red-800 hover:bg-red-900'
                  }`}
                >
                  Insert In-line Flow
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* 4. IMAGE PICKER DIALOG MODAL */}
      <AnimatePresence>
        {isImagePickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsImagePickerOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-50 space-y-4 text-gray-900"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-serif text-base font-bold text-blue-900 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  ምስል አስገባ (Insert Study Image Card)
                </h3>
                <button 
                  onClick={() => setIsImagePickerOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Paste Image URL Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">የምስል አድራሻ (Image URL)</label>
                <input
                  type="text"
                  value={imageInputUrl}
                  onChange={(e) => setImageInputUrl(e.target.value)}
                  placeholder="https://example.com/theology-image.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>

              {/* Preset theology background images */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">ወይም ከነባር ምስሎች ምረጥ (Or Select a Theology Preset)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setImageInputUrl('https://images.unsplash.com/photo-1609599006353-e629f1d40e39?auto=format&fit=crop&q=80&w=600')}
                    className="p-1 border border-gray-200 hover:border-blue-500 rounded-lg overflow-hidden group text-left cursor-pointer transition-all"
                  >
                    <img src="https://images.unsplash.com/photo-1609599006353-e629f1d40e39?auto=format&fit=crop&q=80&w=200" alt="Quran preset" className="w-full h-12 object-cover rounded-md group-hover:scale-105 transition-transform" />
                    <span className="text-[8px] font-bold text-gray-600 block mt-1 text-center truncate">Quran Codex</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600')}
                    className="p-1 border border-gray-200 hover:border-blue-500 rounded-lg overflow-hidden group text-left cursor-pointer transition-all"
                  >
                    <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200" alt="Bible preset" className="w-full h-12 object-cover rounded-md group-hover:scale-105 transition-transform" />
                    <span className="text-[8px] font-bold text-gray-600 block mt-1 text-center truncate">Bible Codex</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputUrl('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600')}
                    className="p-1 border border-gray-200 hover:border-blue-500 rounded-lg overflow-hidden group text-left cursor-pointer transition-all"
                  >
                    <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=200" alt="Library preset" className="w-full h-12 object-cover rounded-md group-hover:scale-105 transition-transform" />
                    <span className="text-[8px] font-bold text-gray-600 block mt-1 text-center truncate">Theology Library</span>
                  </button>
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">የምስል ማብራሪያ (Image Caption)</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="e.g., Comparative analysis chart of ancient transcripts"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setIsImagePickerOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInsertImageBlock}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-800 text-white hover:bg-blue-900 transition-all cursor-pointer"
                >
                  Insert Image Block
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: Notes List and Search */}
        {!selectedNote && !isEditing && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header block */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
                  <FileText className="h-6 w-6 text-secondary" />
                  የጥናት ማስታወሻዎች
                </h2>
                <p className="text-xs text-gray-400 font-medium">
                  Canva-style rich study notes with interactive inline Quran verses & PDF citations
                </p>
              </div>
              
              <button
                onClick={handleCreateNewNote}
                className="bg-[#003527] hover:bg-[#00251c] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="h-4.5 w-4.5" />
                አዲስ ማስታወሻ ጻፍ
              </button>
            </div>



            {/* Search filter */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ማስታወሻዎችን ፈልግ... (Search study notes)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-xs sm:text-sm font-semibold transition-all shadow-xs"
              />
            </div>

            {/* Notes collection list */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200/80 p-8 space-y-3">
                <FileText className="h-10 w-10 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-400 font-semibold italic">ምንም የተፃፈ ማስታወሻ አልተገኘም!</p>
                <p className="text-[10px] text-gray-400">Click "አዲስ ማስታወሻ ጻፍ" to compose your very first Quranic research note.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredNotes.map((note) => {
                  const activeBlocks = note.blocks || [];
                  const verseCount = activeBlocks.filter(b => b.type === 'verse').length;
                  
                  return (
                    <div
                      key={note.id}
                      onClick={() => handleSelectNote(note)}
                      className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-[#003527]/20 hover:shadow-md transition-all cursor-pointer flex justify-between items-start"
                    >
                      <div className="space-y-2 flex-1 pr-4">
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-serif text-sm sm:text-base font-bold text-primary group-hover:text-[#003527] transition-colors">
                            {note.title}
                          </h3>
                        </div>
                        
                        <p className="text-xs text-gray-600 line-clamp-2 font-medium leading-relaxed">
                          {note.content}
                        </p>

                        <div className="flex flex-wrap items-center gap-3.5 pt-1.5 text-[10px] text-gray-400 font-bold">
                          <span>Updated: {note.updatedAt}</span>
                          {verseCount > 0 && (
                            <span className="bg-[#003527]/5 text-[#003527] px-2 py-0.5 rounded">
                              {verseCount} Inline Verses
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#003527] transition-all transform group-hover:translate-x-0.5" />
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW 2: Create / Edit Note (Interactive block designer - Canva layout) */}
        {isEditing && (
          <motion.div
            key="edit"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            {/* Header buttons */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <button
                onClick={() => {
                  if (selectedNote) {
                    setIsEditing(false);
                  } else {
                    setSelectedNote(null);
                    setIsEditing(false);
                  }
                }}
                className="text-xs font-bold text-gray-500 hover:text-primary flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </button>

              <button
                onClick={handleSaveNote}
                className="bg-[#003527] hover:bg-[#002219] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Save Canva Note
              </button>
            </div>

            {/* Note Canvas Meta fields */}
            <div className="bg-white rounded-3xl border border-gray-300 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-700 uppercase tracking-wider block">
                  ማስታወሻ ርዕስ (Note Title)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ርዕስ እዚህ ይጻፉ... (e.g., On the primordial nature of covenant)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#003527] focus:ring-1 focus:ring-[#003527] outline-none text-sm sm:text-base font-bold text-gray-900 placeholder-gray-500 bg-white transition-all"
                />
              </div>

            </div>

            {/* THE CANVA INTERACTIVE BLOCK FLOW CANVAS */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest flex items-center gap-1">
                  <Layers className="h-4 w-4 text-secondary" />
                  Note Blocks Flow (Interactive Canvas)
                </h3>
                <span className="text-[10px] text-gray-700 font-extrabold bg-gray-200 px-2 py-0.5 rounded-full">
                  {blocks.length} Blocks
                </span>
              </div>

              {/* Sequential elements list */}
              <div className="space-y-4">
                {blocks.map((block, idx) => {
                  return (
                    <div key={block.id} className="relative group">
                      
                      {/* Top insert control spacer bar */}
                      <div className="absolute -top-3 left-0 right-0 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="bg-white border border-gray-300 rounded-full px-3 py-0.5 shadow-sm flex items-center gap-2 text-[9px] font-bold text-gray-700">
                          <span>Insert Here:</span>
                          <button
                            type="button"
                            onClick={() => handleAddTextParagraph(idx)}
                            className="hover:text-primary transition-colors cursor-pointer"
                          >
                            + Paragraph
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            type="button"
                            onClick={() => triggerAddVerseBlock(idx)}
                            className="text-[#003527] hover:underline transition-all cursor-pointer"
                          >
                            + Scripture Verse
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            type="button"
                            onClick={() => triggerAddImageBlock(idx)}
                            className="text-blue-900 hover:underline transition-all cursor-pointer"
                          >
                            + Image
                          </button>
                        </div>
                      </div>

                      {/* Actual Block Card frame */}
                      <div className={`rounded-2xl border transition-all p-4 ${
                        block.type === 'text' 
                          ? 'bg-white border-gray-300 focus-within:border-[#003527] focus-within:ring-1 focus-within:ring-[#003527]'
                          : block.type === 'verse' && block.bibleBookId
                          ? 'bg-rose-50/70 border-rose-300 shadow-xs'
                          : block.type === 'verse'
                          ? 'bg-emerald-50/70 border-emerald-400 shadow-xs'
                          : block.type === 'image'
                          ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                          : block.type === 'canvas'
                          ? 'bg-sky-50/70 border-sky-300 shadow-xs'
                          : 'bg-amber-50/70 border-amber-400 shadow-xs'
                      }`}>
                        
                        {/* Block metadata header & actions */}
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-full bg-gray-200 font-mono text-gray-700">
                              Block {idx + 1} · {block.type}
                            </span>
                            
                            {block.type === 'verse' && block.surahId && (
                              <>
                                <span className="text-[10px] font-bold text-[#003527] font-serif">
                                  Surah {quranData.find(s => s.id === block.surahId)?.name} [{block.surahId}:{block.verseNumber}{block.endVerseNumber && block.endVerseNumber !== block.verseNumber ? `-${block.endVerseNumber}` : ''}]
                                </span>
                                <div className="flex items-center gap-1 ml-2 border-l border-gray-300 pl-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextStyle = block.layoutStyle === 'parallel' ? 'stacked' : 'parallel';
                                      updateBlockProperty(block.id, 'layoutStyle', nextStyle);
                                    }}
                                    className={`px-1.5 py-0.5 rounded-[6px] text-[9px] font-bold border transition-all cursor-pointer ${
                                      block.layoutStyle === 'parallel'
                                        ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                    title="Toggle Comparison Layout (Side-by-side columns)"
                                  >
                                    {block.layoutStyle === 'parallel' ? 'Side-by-Side ✦' : 'Stacked List'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateBlockProperty(block.id, 'hideNumbers', !block.hideNumbers);
                                    }}
                                    className={`px-1.5 py-0.5 rounded-[6px] text-[9px] font-bold border transition-all cursor-pointer ${
                                      block.hideNumbers
                                        ? 'bg-purple-700 text-white border-purple-700 font-bold'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                    title="Hide numbers for book-like flow"
                                  >
                                    {block.hideNumbers ? 'Smooth Reader' : 'With Numbers'}
                                  </button>
                                </div>
                              </>
                            )}

                            {block.type === 'verse' && block.bibleBookId && (
                              <>
                                <span className="text-[10px] font-bold text-red-900 font-serif">
                                  Bible: {bibleData.find(bk => bk.id === block.bibleBookId)?.name} [{block.bibleChapter}:{block.bibleVerseNumber}{block.bibleEndVerseNumber && block.bibleEndVerseNumber !== block.bibleVerseNumber ? `-${block.bibleEndVerseNumber}` : ''}]
                                </span>
                                <div className="flex items-center gap-1 ml-2 border-l border-gray-300 pl-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextStyle = block.layoutStyle === 'parallel' ? 'stacked' : 'parallel';
                                      updateBlockProperty(block.id, 'layoutStyle', nextStyle);
                                    }}
                                    className={`px-1.5 py-0.5 rounded-[6px] text-[9px] font-bold border transition-all cursor-pointer ${
                                      block.layoutStyle === 'parallel'
                                        ? 'bg-red-700 text-white border-red-700 font-bold'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                    title="Toggle Comparison Layout (Side-by-side columns)"
                                  >
                                    {block.layoutStyle === 'parallel' ? 'Side-by-Side ✦' : 'Stacked List'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateBlockProperty(block.id, 'hideNumbers', !block.hideNumbers);
                                    }}
                                    className={`px-1.5 py-0.5 rounded-[6px] text-[9px] font-bold border transition-all cursor-pointer ${
                                      block.hideNumbers
                                        ? 'bg-purple-700 text-white border-purple-700 font-bold'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                    title="Hide numbers for book-like flow"
                                  >
                                    {block.hideNumbers ? 'Smooth Reader' : 'With Numbers'}
                                  </button>
                                </div>
                              </>
                            )}

                            {block.type === 'image' && (
                              <span className="text-[10px] font-bold text-blue-900 font-serif">
                                Image Study Block
                              </span>
                            )}

                            {block.type === 'canvas' && (
                              <span className="text-[10px] font-bold text-sky-900 font-serif">
                                Interactive Sketch Canvas
                              </span>
                            )}

                            {block.type === 'doc_quote' && (
                              <span className="text-[10px] font-bold text-amber-950 font-serif">
                                Citation Quote
                              </span>
                            )}
                          </div>

                          {/* Reordering and deleting buttons */}
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveBlock(idx, 'up')}
                              className="text-gray-500 hover:text-primary disabled:opacity-30 p-1 rounded hover:bg-gray-100 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === blocks.length - 1}
                              onClick={() => moveBlock(idx, 'down')}
                              className="text-gray-500 hover:text-primary disabled:opacity-30 p-1 rounded hover:bg-gray-100 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteBlock(block.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                              title="Delete Block"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Block body editors */}
                        {block.type === 'text' && (
                          <textarea
                            rows={3}
                            value={block.content}
                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                            placeholder="Type reflections, arguments, translations, or comparative notes here..."
                            className="w-full px-1 py-1 text-xs sm:text-sm font-semibold leading-relaxed text-gray-900 bg-transparent placeholder-gray-500 outline-none resize-y min-h-[70px]"
                          />
                        )}

                         {block.type === 'verse' && (
                          (() => {
                            const isBible = !!block.bibleBookId;
                            if (isBible) {
                              const book = bibleData.find(bk => bk.id === block.bibleBookId);
                              if (!book) return <p className="text-xs text-red-500">Invalid Bible selection.</p>;
                              const chapterNum = block.bibleChapter || 1;
                              const start = block.bibleVerseNumber || 1;
                              const end = block.bibleEndVerseNumber || start;
                              const versesList = book.chapters[chapterNum] || [];
                              const verses = versesList.filter(v => v.number >= start && v.number <= end);
                              if (verses.length === 0) return <p className="text-xs text-red-500">No verses found.</p>;

                              const showOrig = block.showOriginal !== false;
                              const showAmh = block.showAmharic !== false;
                              const showEng = block.showEnglish !== false;

                              // Define active columns for side-by-side comparison
                              const cols = [];
                              if (showOrig) cols.push({ id: 'orig', name: 'Original Text (Greek/Hebrew)', key: 'text', style: 'font-serif text-sm text-right text-red-950 font-medium leading-relaxed', dir: 'rtl', labelColor: 'text-red-900' });
                              if (showAmh) cols.push({ id: 'amh', name: 'አማርኛ (Amharic)', key: 'translationAmharic', style: 'font-serif text-xs text-gray-800 leading-relaxed font-bold', dir: 'ltr', labelColor: 'text-red-900' });
                              if (showEng) cols.push({ id: 'eng', name: 'English Translation', key: 'translationEnglish', style: 'font-sans text-[11px] text-gray-600 leading-relaxed font-medium', dir: 'ltr', labelColor: 'text-gray-400' });

                              if (block.layoutStyle === 'parallel') {
                                return (
                                  <div className="bg-rose-500/[0.03] p-3 rounded-xl border border-rose-500/10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {cols.map(col => (
                                        <div key={col.id} className="p-3 bg-white/70 rounded-xl border border-rose-200/40 flex flex-col shadow-2xs">
                                          <span className="text-[9px] font-bold text-red-900/60 uppercase tracking-wider mb-2 block border-b border-rose-100 pb-1">
                                            {col.name}
                                          </span>
                                          {block.hideNumbers ? (
                                            <p className={`${col.style} flex-1`} style={{ direction: col.dir }}>
                                              {verses.map(v => v[col.key as keyof typeof v]).join(' ')}
                                            </p>
                                          ) : (
                                            <div className="space-y-2 flex-1">
                                              {verses.map(v => (
                                                <div key={v.number} className="flex gap-1.5 items-start border-b border-rose-500/[0.03] pb-1.5 last:border-0 last:pb-0">
                                                  <span className="text-[8px] font-mono font-bold text-red-900/50 bg-rose-50 px-1 rounded">
                                                    {v.number}
                                                  </span>
                                                  <p className={`${col.style} flex-1`} style={{ direction: col.dir }}>
                                                    {v[col.key as keyof typeof v]}
                                                  </p>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              } else {
                                // Stacked Layout
                                return (
                                  <div className="space-y-3.5 text-left bg-rose-500/[0.03] p-3 rounded-xl border border-rose-500/10">
                                    {showOrig && (
                                      <div className="space-y-2">
                                        <span className="text-[9px] font-bold text-red-900/40 uppercase tracking-wider block border-b border-rose-100 pb-1">Original Scripture Text</span>
                                        {block.hideNumbers ? (
                                          <p className="font-serif text-sm text-right text-red-950 font-medium leading-relaxed" style={{ direction: 'rtl' }}>
                                            {verses.map(v => v.text).join(' ')}
                                          </p>
                                        ) : (
                                          <div className="space-y-1">
                                            {verses.map(v => (
                                              <div key={v.number} className="flex justify-between items-start gap-4 border-b border-rose-500/5 pb-2 last:border-b-0 last:pb-0">
                                                <span className="text-[10px] font-bold text-red-900/40 font-mono self-center">[{v.number}]</span>
                                                <p className="font-serif text-base text-right text-red-950 font-medium leading-relaxed flex-1" style={{ direction: 'rtl' }}>
                                                  {v.text}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {showAmh && (
                                      <div className="space-y-2 border-t border-gray-200/50 pt-2.5">
                                        <span className="text-[9px] font-bold text-red-900/40 uppercase tracking-wider block border-b border-rose-100 pb-1">አማርኛ ትርጉም (Amharic)</span>
                                        {block.hideNumbers ? (
                                          <p className="font-serif text-xs text-gray-800 leading-relaxed font-bold">
                                            {verses.map(v => v.translationAmharic).join(' ')}
                                          </p>
                                        ) : (
                                          <div className="space-y-1.5 font-serif">
                                            {verses.map(v => (
                                              <p key={v.number} className="text-xs text-gray-800 leading-relaxed font-bold">
                                                <span className="text-red-900 font-sans text-[10px] font-bold mr-1">[{v.number}]</span>
                                                አማርኛ፦ "{v.translationAmharic}"
                                              </p>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {showEng && (
                                      <div className="space-y-2 border-t border-gray-100 pt-2">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 pb-1">English Translation</span>
                                        {block.hideNumbers ? (
                                          <p className="text-[11px] leading-relaxed font-medium text-gray-600 font-sans">
                                            {verses.map(v => v.translationEnglish).join(' ')}
                                          </p>
                                        ) : (
                                          <div className="space-y-1.5 text-gray-600 font-sans">
                                            {verses.map(v => (
                                              <p key={v.number} className="text-[11px] leading-relaxed font-medium">
                                                <span className="text-gray-400 font-sans text-[10px] font-bold mr-1">[{v.number}]</span>
                                                English: "{v.translationEnglish}"
                                              </p>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            } else {
                              const surah = quranData.find(s => s.id === block.surahId);
                              if (!surah) return <p className="text-xs text-red-500">Invalid Quran selection.</p>;
                              const start = block.verseNumber || 1;
                              const end = block.endVerseNumber || start;
                              const verses = surah.verses.filter(v => v.number >= start && v.number <= end);
                              if (verses.length === 0) return <p className="text-xs text-red-500">No verses found.</p>;

                              const showArab = block.showArabic !== false;
                              const showAmh = block.showAmharic !== false;
                              const showEng = block.showEnglish !== false;

                              // Define active columns for side-by-side comparison
                              const cols = [];
                              if (showArab) cols.push({ id: 'orig', name: 'العربية (Arabic)', key: 'text', style: 'font-serif text-lg text-right text-primary font-semibold leading-relaxed', dir: 'rtl', labelColor: 'text-[#003527]' });
                              if (showAmh) cols.push({ id: 'amh', name: 'አማርኛ (Amharic)', key: 'translationAmharic', style: 'font-serif text-xs text-gray-800 leading-relaxed font-bold', dir: 'ltr', labelColor: 'text-primary' });
                              if (showEng) cols.push({ id: 'eng', name: 'English Translation', key: 'translationEnglish', style: 'font-sans text-[11px] text-gray-600 leading-relaxed font-medium', dir: 'ltr', labelColor: 'text-gray-400' });

                              if (block.layoutStyle === 'parallel') {
                                return (
                                  <div className="bg-emerald-500/[0.03] p-3 rounded-xl border border-emerald-500/10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {cols.map(col => (
                                        <div key={col.id} className="p-3 bg-white/70 rounded-xl border border-emerald-200/40 flex flex-col shadow-2xs">
                                          <span className="text-[9px] font-bold text-emerald-900/60 uppercase tracking-wider mb-2 block border-b border-emerald-100 pb-1">
                                            {col.name}
                                          </span>
                                          {block.hideNumbers ? (
                                            <p className={`${col.style} flex-1`} style={{ direction: col.dir }}>
                                              {verses.map(v => v[col.key as keyof typeof v]).join(' ')}
                                            </p>
                                          ) : (
                                            <div className="space-y-2 flex-1">
                                              {verses.map(v => (
                                                <div key={v.number} className="flex gap-1.5 items-start border-b border-emerald-500/[0.03] pb-1.5 last:border-0 last:pb-0">
                                                  <span className="text-[8px] font-mono font-bold text-emerald-900/50 bg-emerald-50 px-1 rounded">
                                                    {v.number}
                                                  </span>
                                                  <p className={`${col.style} flex-1`} style={{ direction: col.dir }}>
                                                    {v[col.key as keyof typeof v]}
                                                  </p>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              } else {
                                // Stacked Layout
                                return (
                                  <div className="space-y-3.5 text-left bg-emerald-500/[0.03] p-3 rounded-xl border border-emerald-500/10">
                                    {showArab && (
                                      <div className="space-y-2">
                                        <span className="text-[9px] font-bold text-[#003527]/40 uppercase tracking-wider block border-b border-emerald-100 pb-1">Original Arabic Scripture</span>
                                        {block.hideNumbers ? (
                                          <p className="font-serif text-lg text-right text-primary font-semibold leading-relaxed" style={{ direction: 'rtl' }}>
                                            {verses.map(v => v.text).join(' ')}
                                          </p>
                                        ) : (
                                          <div className="space-y-1">
                                            {verses.map(v => (
                                              <div key={v.number} className="flex justify-between items-start gap-4 border-b border-emerald-500/5 pb-2 last:border-b-0 last:pb-0">
                                                <span className="text-[10px] font-bold text-[#003527]/40 font-mono self-center">[{v.number}]</span>
                                                <p className="font-serif text-base text-right text-primary font-medium leading-relaxed flex-1" style={{ direction: 'rtl' }}>
                                                  {v.text}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {showAmh && (
                                      <div className="space-y-2 border-t border-gray-200/50 pt-2.5">
                                        <span className="text-[9px] font-bold text-[#003527]/40 uppercase tracking-wider block border-b border-emerald-100 pb-1">አማርኛ ትርጉም (Amharic)</span>
                                        {block.hideNumbers ? (
                                          <p className="font-serif text-xs text-gray-800 leading-relaxed font-bold">
                                            {verses.map(v => v.translationAmharic).join(' ')}
                                          </p>
                                        ) : (
                                          <div className="space-y-1.5 font-serif">
                                            {verses.map(v => (
                                              <p key={v.number} className="text-xs text-gray-800 leading-relaxed font-bold">
                                                <span className="text-primary font-sans text-[10px] font-bold mr-1">[{v.number}]</span>
                                                አማርኛ፦ "{v.translationAmharic}"
                                              </p>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {showEng && (
                                      <div className="space-y-2 border-t border-gray-100 pt-2">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 pb-1">English Translation</span>
                                        {block.hideNumbers ? (
                                          <p className="text-[11px] leading-relaxed font-medium text-gray-600 font-sans">
                                            {verses.map(v => v.translationEnglish).join(' ')}
                                          </p>
                                        ) : (
                                          <div className="space-y-1.5 text-gray-600 font-sans">
                                            {verses.map(v => (
                                              <p key={v.number} className="text-[11px] leading-relaxed font-medium">
                                                <span className="text-gray-400 font-sans text-[10px] font-bold mr-1">[{v.number}]</span>
                                                English: "{v.translationEnglish}"
                                              </p>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            }
                          })()
                        )}

                        {block.type === 'doc_quote' && (
                          <div className="space-y-1 text-left bg-amber-500/5 p-2 rounded-xl border border-amber-500/10">
                            <p className="text-xs text-amber-900 leading-relaxed font-serif italic">
                              "{block.content}"
                            </p>
                            <span className="text-[9px] text-amber-800 font-bold block uppercase tracking-wider">
                              — Citation Quote
                            </span>
                          </div>
                        )}

                        {block.type === 'image' && (
                          <div className="space-y-2 text-left bg-blue-500/[0.02] p-3 rounded-xl border border-blue-500/10">
                            {block.imageUrl ? (
                              <img src={block.imageUrl} alt={block.content} className="max-w-full max-h-80 object-contain rounded-lg mx-auto border referrerPolicy='no-referrer'" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="p-8 text-center bg-gray-100 rounded-lg text-xs font-mono text-gray-400">Empty Image Block</div>
                            )}
                            <p className="text-xs text-blue-900 font-bold text-center italic mt-1">{block.content}</p>
                          </div>
                        )}

                        {block.type === 'canvas' && (
                          <div className="space-y-2 text-left bg-sky-500/[0.02] p-3 rounded-xl border border-sky-500/10">
                            {block.canvasData ? (
                              <img src={block.canvasData} alt={block.content} className="max-w-full max-h-80 object-contain rounded-lg mx-auto border bg-white" />
                            ) : (
                              <div className="p-8 text-center bg-gray-100 rounded-lg text-xs font-mono text-gray-400">Empty Sketch Canvas Block</div>
                            )}
                            <p className="text-xs text-sky-900 font-bold text-center italic mt-1">{block.content}</p>
                          </div>
                        )}

                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Bottom Canvas Append Action Bar */}
              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 text-center bg-gray-50/50 space-y-3.5">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Add Elements to the Bottom of Note Flow</p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddTextParagraph(blocks.length)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 shadow-xs cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <Plus className="h-4 w-4 text-gray-400" />
                    + Reflection Paragraph
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerAddVerseBlock(blocks.length)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/50 hover:bg-emerald-100 shadow-xs cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <Book className="h-4 w-4 text-emerald-600" />
                    + Insert Scripture Card
                  </button>



                  <button
                    type="button"
                    onClick={() => triggerAddImageBlock(blocks.length)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-50 text-blue-800 border border-blue-200/50 hover:bg-blue-100 shadow-xs cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                    + Insert Image Card
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 3: Detailed Note Viewer (Canva sequence display + Export) */}
        {selectedNote && !isEditing && (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Action headers */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <button
                onClick={() => setSelectedNote(null)}
                className="text-xs font-bold text-gray-500 hover:text-primary flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Notes
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintExport}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Generate beautiful PDF / Print"
                >
                  <Printer className="h-4 w-4" />
                  Export to PDF
                </button>

                <button
                  onClick={handleStartEdit}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Flow
                </button>

                <button
                  onClick={() => handleDeleteNote(selectedNote.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                  title="Delete Note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Main Note Canvas Body */}
            <article className="bg-[#fcfdfc] rounded-3xl border border-gray-200/60 shadow-sm p-6 sm:p-10 space-y-6">
              
              <div className="space-y-2 border-b border-gray-100 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary tracking-tight">
                  {selectedNote.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 font-bold">
                  <span>Created: {selectedNote.createdAt}</span>
                  <span>Updated: {selectedNote.updatedAt}</span>
                </div>
              </div>

              {/* RENDER IN-LINE BLOCKS SEQUENTIALLY EXACTLY AS COMPOSED */}
              <div className="space-y-6">
                {(selectedNote.blocks || []).map((block, idx) => {
                  if (block.type === 'text') {
                    return (
                      <p 
                        key={block.id} 
                        className="text-gray-800 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap font-sans font-medium"
                      >
                        {block.content}
                      </p>
                    );
                  }

                  if (block.type === 'verse') {
                    const isBible = !!block.bibleBookId;
                    if (isBible) {
                      const book = bibleData.find(bk => bk.id === block.bibleBookId);
                      if (!book) return null;
                      const chapterNum = block.bibleChapter || 1;
                      const start = block.bibleVerseNumber || 1;
                      const end = block.bibleEndVerseNumber || start;
                      const versesList = book.chapters[chapterNum] || [];
                      const verses = versesList.filter(v => v.number >= start && v.number <= end);
                      if (verses.length === 0) return null;

                      const showOrig = block.showOriginal !== false;
                      const showAmh = block.showAmharic !== false;
                      const showEng = block.showEnglish !== false;

                      // Define active columns for side-by-side comparison
                      const cols = [];
                      if (showOrig) cols.push({ id: 'orig', name: 'Original Text (Greek/Hebrew)', key: 'text', style: 'font-serif text-sm text-right text-red-950 font-medium leading-relaxed', dir: 'rtl', labelColor: 'text-red-900' });
                      if (showAmh) cols.push({ id: 'amh', name: 'አማርኛ (Amharic)', key: 'translationAmharic', style: 'font-serif text-xs text-gray-800 leading-relaxed font-bold', dir: 'ltr', labelColor: 'text-red-900' });
                      if (showEng) cols.push({ id: 'eng', name: 'English Translation', key: 'translationEnglish', style: 'font-sans text-[11px] text-gray-600 leading-relaxed font-medium', dir: 'ltr', labelColor: 'text-gray-400' });

                      return (
                        <div 
                          key={block.id}
                          onClick={() => onJumpToBible(block.bibleBookId!, chapterNum, start)}
                          className="group relative p-5 bg-gradient-to-br from-rose-500/5 to-rose-500/[0.02] border border-rose-500/10 hover:border-rose-500/30 hover:shadow-md transition-all rounded-2xl cursor-pointer text-left space-y-4"
                        >
                          <div className="flex justify-between items-center border-b border-rose-500/5 pb-2">
                            <span className="text-xs font-bold text-red-900 font-serif flex items-center gap-1">
                              ✦ Bible: {book.name} [{chapterNum}:{start}{end !== start ? `-${end}` : ''}]
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 font-sans group-hover:text-red-700 transition-colors flex items-center gap-1">
                              Open Reader <ChevronRight className="h-3 w-3" />
                            </span>
                          </div>

                          {block.layoutStyle === 'parallel' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {cols.map(col => (
                                <div key={col.id} className="p-3 bg-white/70 rounded-xl border border-rose-200/40 flex flex-col shadow-2xs">
                                  <span className="text-[9px] font-bold text-red-900/60 uppercase tracking-wider mb-2 block border-b border-rose-100 pb-1">
                                    {col.name}
                                  </span>
                                  {block.hideNumbers ? (
                                    <p className={`${col.style} flex-1`} style={{ direction: col.dir }}>
                                      {verses.map(v => v[col.key as keyof typeof v]).join(' ')}
                                    </p>
                                  ) : (
                                    <div className="space-y-2 flex-1">
                                      {verses.map(v => (
                                        <div key={v.number} className="flex gap-1.5 items-start border-b border-rose-500/[0.03] pb-1.5 last:border-0 last:pb-0">
                                          <span className="text-[8px] font-mono font-bold text-red-900/50 bg-rose-50 px-1 rounded">
                                            {v.number}
                                          </span>
                                          <p className={`${col.style} flex-1`} style={{ direction: col.dir }}>
                                            {v[col.key as keyof typeof v]}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-3.5 text-left">
                              {showOrig && (
                                <div className="space-y-2">
                                  <span className="text-[9px] font-bold text-red-900/40 uppercase tracking-wider block border-b border-rose-100 pb-1">Original Scripture Text</span>
                                  {block.hideNumbers ? (
                                    <p className="font-serif text-sm text-right text-red-950 font-medium leading-relaxed" style={{ direction: 'rtl' }}>
                                      {verses.map(v => v.text).join(' ')}
                                    </p>
                                  ) : (
                                    <div className="space-y-1">
                                      {verses.map(v => (
                                        <div key={v.number} className="flex justify-between items-start gap-4 border-b border-rose-500/5 pb-2 last:border-b-0 last:pb-0">
                                          <span className="text-[10px] font-bold text-red-900/40 font-mono self-center">[{v.number}]</span>
                                          <p className="font-serif text-base text-right text-red-950 font-medium leading-relaxed flex-1" style={{ direction: 'rtl' }}>
                                            {v.text}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {showAmh && (
                                <div className="space-y-2 border-t border-gray-200/50 pt-2.5">
                                  <span className="text-[9px] font-bold text-red-900/40 uppercase tracking-wider block border-b border-rose-100 pb-1">አማርኛ ትርጉም (Amharic)</span>
                                  {block.hideNumbers ? (
                                    <p className="font-serif text-xs text-gray-800 leading-relaxed font-bold">
                                      {verses.map(v => v.translationAmharic).join(' ')}
                                    </p>
                                  ) : (
                                    <div className="space-y-1.5 font-serif">
                                      {verses.map(v => (
                                        <p key={v.number} className="text-xs text-gray-800 leading-relaxed font-bold">
                                          <span className="text-red-900 font-sans text-[10px] font-bold mr-1">[{v.number}]</span>
                                          አማርኛ፦ "{v.translationAmharic}"
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {showEng && (
                                <div className="space-y-2 border-t border-gray-100 pt-2">
                                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 pb-1">English Translation</span>
                                  {block.hideNumbers ? (
                                    <p className="text-[11px] leading-relaxed font-medium text-gray-600 font-sans">
                                      {verses.map(v => v.translationEnglish).join(' ')}
                                    </p>
                                  ) : (
                                    <div className="space-y-1.5 text-gray-600 font-sans">
                                      {verses.map(v => (
                                        <p key={v.number} className="text-[11px] leading-relaxed font-medium">
                                          <span className="text-gray-400 font-sans text-[10px] font-bold mr-1">[{v.number}]</span>
                                          English: "{v.translationEnglish}"
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      const surah = quranData.find(s => s.id === block.surahId);
                      if (!surah) return null;
                      const start = block.verseNumber || 1;
                      const end = block.endVerseNumber || start;
                      const verses = surah.verses.filter(v => v.number >= start && v.number <= end);
                      if (verses.length === 0) return null;

                      const showArab = block.showArabic !== false;
                      const showAmh = block.showAmharic !== false;
                      const showEng = block.showEnglish !== false;

                      // Define active columns for side-by-side comparison
                      const cols = [];
                      if (showArab) cols.push({ id: 'orig', name: 'العربية (Arabic)', key: 'text', style: 'font-serif text-[#003527] text-lg text-right font-semibold leading-relaxed', dir: 'rtl', labelColor: 'text-[#003527]' });
                      if (showAmh) cols.push({ id: 'amh', name: 'አማርኛ (Amharic)', key: 'translationAmharic', style: 'font-serif text-xs text-gray-800 leading-relaxed font-bold', dir: 'ltr', labelColor: 'text-primary' });
                      if (showEng) cols.push({ id: 'eng', name: 'English Translation', key: 'translationEnglish', style: 'font-sans text-[11px] text-gray-600 leading-relaxed font-medium', dir: 'ltr', labelColor: 'text-gray-400' });

                      return (
                        <div 
                          key={block.id}
                          onClick={() => onJumpToQuran(block.surahId!, start)}
                          className="group relative p-5 bg-gradient-to-br from-[#003527]/5 to-[#003527]/[0.02] border border-[#003527]/10 hover:border-[#003527]/30 hover:shadow-md transition-all rounded-2xl cursor-pointer text-left space-y-4"
                        >
                          <div className="flex justify-between items-center border-b border-[#003527]/5 pb-2">
                            <span className="text-xs font-bold text-primary font-serif flex items-center gap-1">
                              ✦ {surah.name} [{surah.id}:{start}{end !== start ? `-${end}` : ''}]
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 font-sans group-hover:text-secondary transition-colors flex items-center gap-1">
                              Open Reader <ChevronRight className="h-3 w-3" />
                            </span>
                          </div>

                          {block.layoutStyle === 'parallel' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {cols.map(col => (
                                <div key={col.id} className="p-3 bg-white/70 rounded-xl border border-emerald-200/40 flex flex-col shadow-2xs">
                                  <span className="text-[9px] font-bold text-emerald-900/60 uppercase tracking-wider mb-2 block border-b border-emerald-100 pb-1">
                                    {col.name}
                                  </span>
                                  {block.hideNumbers ? (
                                    <p className={`${col.style} flex-1`} style={{ direction: col.dir }}>
                                      {verses.map(v => v[col.key as keyof typeof v]).join(' ')}
                                    </p>
                                  ) : (
                                    <div className="space-y-2 flex-1">
                                      {verses.map(v => (
                                        <div key={v.number} className="flex gap-1.5 items-start border-b border-emerald-500/[0.03] pb-1.5 last:border-0 last:pb-0">
                                          <span className="text-[8px] font-mono font-bold text-emerald-900/50 bg-emerald-50 px-1 rounded">
                                            {v.number}
                                          </span>
                                          <p className={`${col.style} flex-1`} style={{ direction: col.dir }}>
                                            {v[col.key as keyof typeof v]}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-3.5 text-left">
                              {showArab && (
                                <div className="space-y-2">
                                  <span className="text-[9px] font-bold text-[#003527]/40 uppercase tracking-wider block border-b border-emerald-100 pb-1">Original Arabic Scripture</span>
                                  {block.hideNumbers ? (
                                    <p className="font-serif text-lg text-right text-primary font-semibold leading-relaxed" style={{ direction: 'rtl' }}>
                                      {verses.map(v => v.text).join(' ')}
                                    </p>
                                  ) : (
                                    <div className="space-y-1">
                                      {verses.map(v => (
                                        <div key={v.number} className="flex justify-between items-start gap-4 border-b border-emerald-500/5 pb-2 last:border-b-0 last:pb-0">
                                          <span className="text-[10px] font-bold text-[#003527]/40 font-mono self-center">[{v.number}]</span>
                                          <p className="font-serif text-base text-right text-primary font-medium leading-relaxed flex-1" style={{ direction: 'rtl' }}>
                                            {v.text}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {showAmh && (
                                <div className="space-y-2 border-t border-gray-200/50 pt-2.5">
                                  <span className="text-[9px] font-bold text-[#003527]/40 uppercase tracking-wider block border-b border-emerald-100 pb-1">አማርኛ ትርጉም (Amharic)</span>
                                  {block.hideNumbers ? (
                                    <p className="font-serif text-xs text-gray-800 leading-relaxed font-bold">
                                      {verses.map(v => v.translationAmharic).join(' ')}
                                    </p>
                                  ) : (
                                    <div className="space-y-1.5 font-serif">
                                      {verses.map(v => (
                                        <p key={v.number} className="text-xs text-gray-800 leading-relaxed font-bold">
                                          <span className="text-primary font-sans text-[10px] font-bold mr-1">[{v.number}]</span>
                                          አማርኛ፦ "{v.translationAmharic}"
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {showEng && (
                                <div className="space-y-2 border-t border-gray-100 pt-2">
                                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 pb-1">English Translation</span>
                                  {block.hideNumbers ? (
                                    <p className="text-[11px] leading-relaxed font-medium text-gray-600 font-sans">
                                      {verses.map(v => v.translationEnglish).join(' ')}
                                    </p>
                                  ) : (
                                    <div className="space-y-1.5 text-gray-600 font-sans">
                                      {verses.map(v => (
                                        <p key={v.number} className="text-[11px] leading-relaxed font-medium">
                                          <span className="text-gray-400 font-sans text-[10px] font-bold mr-1">[{v.number}]</span>
                                          English: "{v.translationEnglish}"
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }
                  }

                  if (block.type === 'doc_quote') {
                    return (
                      <div 
                        key={block.id}
                        className="p-4 bg-amber-500/[0.03] border-l-4 border-amber-600/70 rounded-r-2xl text-left space-y-2 hover:bg-amber-500/[0.06] transition-all"
                      >
                        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-serif italic">
                          "{block.content}"
                        </p>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

            </article>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
