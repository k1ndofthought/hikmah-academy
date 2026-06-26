/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = 3000;

// Lazy initialize Gemini client to avoid crashing if API key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI Chat will fall back to smart simulated responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Chat endpoint
  app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Fallback if API key is not present (to prevent crashing and provide a high-quality experience)
    if (!apiKey) {
      // Return a rich, relevant simulated response based on keywords
      const msgLower = message.toLowerCase();
      let reply = "";
      let ref = undefined;

      if (msgLower.includes("tawhid") || msgLower.includes("unity")) {
        reply = "In the article 'Unity in Diversity', Tawhid (the absolute oneness of God) is discussed not merely as a numerical concept, but as the foundational metaphysical principle of the cosmos. It implies that because the Creator is One, all of creation is interconnected and exists in a state of harmonious unity, reflecting the singular Divine Essence.";
        ref = {
          surahName: "Surah Al-Ikhlas",
          surahNumber: 112,
          verseNumber: 1,
          text: "قُلْ هُوَ اللَّه أَحَدٌ",
          translation: "Say, He is Allah, [who is] One."
        };
      } else if (msgLower.includes("fitra") || msgLower.includes("primal")) {
        reply = "Fitra represents the natural, innate state of spiritual wholeness with which every human being is born. It is an internal compass oriented toward monotheism, compassion, and ultimate truth, which is hardwired into the human soul before social and environmental conditions influence it.";
        ref = {
          surahName: "Surah Al-Fatiha",
          surahNumber: 1,
          verseNumber: 5,
          text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
          translation: "Guide us to the straight path"
        };
      } else if (msgLower.includes("fatiha") || msgLower.includes("opening")) {
        reply = "Surah Al-Fatiha, often called the 'Mother of the Book' (Umm al-Kitab), is the essential opening of the Quran. It summarizes the entire metaphysical framework of Islam: praising the Creator, acknowledging His mercy and sovereignty, pledging exclusive worship and seeking of aid, and praying for guidance on the straight, favor-filled path.";
        ref = {
          surahName: "Surah Al-Fatiha",
          surahNumber: 1,
          verseNumber: 1,
          text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
          translation: "All praise is due to Allah, Lord of the worlds."
        };
      } else {
        reply = "Wa Alaikum Assalam. That is a profound question. Grounded in our classical text, the ultimate objective of scholarly inquiry is to understand the correlation between divine revelation ('Aql) and cosmological order. Let us reflect deeply on this wisdom together.";
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.json({ text: reply, reference: ref });
    }

    try {
      const client = getGeminiClient();
      
      const systemInstruction = `You are "Hikmah Scholar", a wise, highly respected scholarly academic assistant at Hikmah Academy.
Your role is to help students, researchers, and seekers explore sacred Islamic knowledge, comparative religion, Islamic history, philosophy, and Quranic studies with academic rigor and absolute professional composure.

Core rules:
1. Speak with wisdom, humility, intellectual clarity, and deep respect. Do not use informal jargon or sales-pitch language.
2. Provide authentic citations and deep references. Ground your answers in classical commentaries (Tafsir of Ibn Kathir, Al-Qurtubi, etc.), authentic Hadith compilations (Sahih Bukhari, Sahih Muslim, etc.), and classical Islamic philosophers (Ibn Sina, Al-Ghazali, Ibn Rushd, etc.).
3. When referencing Quranic verses, ALWAYS output them in their beautiful original Arabic text, followed by an elegant English and/or Amharic translation if appropriate.
4. Format your responses with structured markdown. Use bolding, clean lists, and headers to make your scholarly insights beautiful and readable.
5. In your response, if you reference a specific Quranic verse, you can ALSO include a structured tag at the very end of your response for our UI parser like this:
[VERSE_REF] Surah 112:1 | قُلْ هُوَ اللَّهُ أَحَدٌ | "Say, He is Allah, [who is] One."
We will parse this block on the frontend to render a gorgeous interactive Quranic card! So please format any primary verse citation exactly as:
[VERSE_REF] Surah <number>:<verse> | <Arabic text> | "<Translation>"
Only output at most ONE [VERSE_REF] tag per response, and place it at the very end on its own line if relevant.
6. Always end with a scholarly thought or an invitation for further theological inquiry. Let your tone be peaceful and inspiring.`;

      // Reconstruct chat history in the new @google/genai format
      const formattedContents = [];
      
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          formattedContents.push({
            role: turn.role === 'bot' ? 'model' : 'user',
            parts: [{ text: turn.text }]
          });
        }
      }
      
      // Append the new message
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || "I apologize, I was unable to compile an answer at this moment.";
      
      // Parse out the optional [VERSE_REF] tag if it exists at the end
      let cleanText = responseText;
      let reference = undefined;
      
      const verseRefRegex = /\[VERSE_REF\]\s*Surah\s+(\d+):(\d+)\s*\|\s*([^|]+)\s*\|\s*"([^"]+)"/i;
      const match = responseText.match(verseRefRegex);
      
      if (match) {
        // Strip the [VERSE_REF] line from the main response text
        cleanText = responseText.replace(/\[VERSE_REF\].*$/, '').trim();
        const surahNumber = parseInt(match[1]);
        const verseNumber = parseInt(match[2]);
        const text = match[3].trim();
        const translation = match[4].trim();
        
        reference = {
          surahName: `Surah ${surahNumber}`,
          surahNumber,
          verseNumber,
          text,
          translation
        };
      }

      res.json({ text: cleanText, reference });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ 
        error: 'Failed to communicate with the scholarly engine', 
        details: error.message 
      });
    }
  });

  // Vite development vs production static assets
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
