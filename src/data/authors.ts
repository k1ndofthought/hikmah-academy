/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScholarBook {
  title: string;
  description: string;
  pdfUrl: string;
  pagesCount: number;
  content: string; // Allows reading inside our built-in PDF Reader
}

export interface ScholarAuthor {
  name: string;
  title: string;
  bio: string;
  image: string;
  socials: {
    youtube?: string;
    telegram?: string;
    website?: string;
    facebook?: string;
  };
  books: ScholarBook[];
}

export const authorsData: Record<string, ScholarAuthor> = {
  "Dr. Ismail Al-Faruqi": {
    name: "Dr. Ismail Al-Faruqi",
    title: "Professor of Religion & Comparative Theology",
    bio: "A world-renowned Palestinian-American philosopher and authority on Islamic theology and comparative religion. He was a professor of religion at Temple University, where he founded and chaired the Islamic Studies program. He dedicated his life to creating rigorous frameworks for interfaith dialogue and classical metaphysical study.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    socials: {
      youtube: "https://www.youtube.com/results?search_query=Dr+Ismail+Al-Faruqi+lectures",
      telegram: "https://t.me/AlFaruqiLibrary",
      website: "https://iiit.org"
    },
    books: [
      {
        title: "Al-Tawhid: Its Implications for Thought and Life",
        description: "The foundational text analyzing monotheism across ethical, sociological, and aesthetic dimensions, exploring how the unity of God demands a unified ethical worldview.",
        pdfUrl: "https://www.iiit.org/altawhid.pdf",
        pagesCount: 2,
        content: `PAGE 1: AL-TAWHID OVERVIEW
Monotheism is the defining core of Islamic civilization. It is the principle that integrates all human activities under a singular ethical imperative. It provides the metaphysical structure that makes science, morality, and art cohesive parts of the human experience.

PAGE 2: EPISTEMOLOGICAL IMPLICATIONS
Tawhid establishes the unity of truth, meaning that natural science, human reason, and divine revelation must ultimately harmonize rather than conflict. True research in nature is a form of reading the Creator's signs.`
      }
    ]
  },
  "Dr. Tarik Ramadan": {
    name: "Dr. Tarik Ramadan",
    title: "Professor of Contemporary Islamic Studies",
    bio: "Swiss academic, philosopher, and writer. He is a professor of Contemporary Islamic Studies at Oxford University, specializing in Islamic theology, ethics, and contemporary reform. He is known for his work in bridging classical Islamic principles with modern Western life.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop",
    socials: {
      youtube: "https://www.youtube.com/results?search_query=Tarik+Ramadan+lectures",
      telegram: "https://t.me/TarikRamadanOfficial",
      website: "https://www.tarikramadan.com"
    },
    books: [
      {
        title: "In the Footsteps of the Prophet",
        description: "Lessons from the life of Muhammad (PBUH) highlighting moral clarity, spiritual depth, and active engagement with society, written for modern readers seeking ethical benchmarks.",
        pdfUrl: "https://www.academicpress.com/footsteps.pdf",
        pagesCount: 2,
        content: `PAGE 1: THE CRADLE OF REVELATION
The life of the Prophet in Mecca was a training ground of patient resistance, focus on inner purification, and rebuilding human dignity. Faith was presented not as an intellectual dogma but as an active liberation of the soul.

PAGE 2: THE COVENANT OF MEDINA
The first written constitution of pluralism in history, establishing co-existence, joint citizenship, and mutual defense between Jewish and Muslim communities. It shows that diversity is legally and spiritually supported in Islamic statecraft.`
      }
    ]
  },
  "Prof. Maria Rosa Menocal": {
    name: "Prof. Maria Rosa Menocal",
    title: "Sterling Professor of Humanities, Yale University",
    bio: "Acclaimed medievalist and Sterling Professor of Humanities at Yale University. She specialized in medieval Iberian literature and history, famously authoring 'The Ornament of the World', which brought the unique pluralism and scientific synthesis of Al-Andalus to a global audience.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
    socials: {
      website: "https://www.yale.edu/medieval-studies"
    },
    books: [
      {
        title: "The Ornament of the World",
        description: "An inquiry into the historical socio-political conditions of Al-Andalus, tracing how Muslims, Jews, and Christians created a highly collaborative and advanced intellectual culture in Medieval Spain.",
        pdfUrl: "https://yale.edu/menocal-ornament.pdf",
        pagesCount: 2,
        content: `PAGE 1: THE GATES OF CORDOVA
Cordova was the jewel of medieval Europe, featuring paved, lighted streets, public baths, and libraries holding hundreds of thousands of scientific manuscripts, at a time when other European capitals had none.

PAGE 2: TRANSLATION AND REBIRTH
How Jewish scholars translated Arabic commentaries of Aristotle into Hebrew, which were subsequently translated into Latin for Christian monarchs. This transmission of philosophy and science ignited the European Renaissance.`
      }
    ]
  },
  "Shaykh Yusuf Qaradawi": {
    name: "Shaykh Yusuf Qaradawi",
    title: "Prominent Theologian & Jurisprudent",
    bio: "A prominent Egyptian Islamic scholar, jurist, and theologian. He authored over 120 books on Islamic jurisprudence, comparative religion, and contemporary social rulings. He was highly regarded for his balanced focus on facilitating ease and addressing contemporary concerns through classical legal principles.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    socials: {
      youtube: "https://www.youtube.com/results?search_query=Shaykh+Yusuf+Qaradawi",
      telegram: "https://t.me/QaradawiLibrary"
    },
    books: [
      {
        title: "The Lawful and the Prohibited in Islam",
        description: "A comprehensive guide analyzing daily ethics, dietary rules, finance, and social relationships under Islamic law, highlighting the universal principles of mercy and benefit.",
        pdfUrl: "https://qaradawi.org/lawful-prohibited.pdf",
        pagesCount: 2,
        content: `PAGE 1: CONSTITUTION OF MORALITY
Islamic law is built on facilitating ease and avoiding hardship. Whatever leads to benefit is lawful, and whatever causes harm is prohibited. The baseline of all things in the world is permissibility until clear prohibition is proven.

PAGE 2: DIETARY AND WORKPLACE STANDARDS
Sincerity, cleanliness, and fair wages form the cornerstone of ethical commerce. Exploitation, cheating, and usury are strictly prohibited to protect the vulnerable in society.`
      }
    ]
  },
  "Dr. Seyyed Hossein Nasr": {
    name: "Dr. Seyyed Hossein Nasr",
    title: "Professor of Islamic Studies, George Washington University",
    bio: "Distinguished Iranian philosopher and Professor of Islamic Studies at George Washington University. A major voice in traditionalist philosophy, metaphysics, and the history of Islamic science, he has written extensively on the spiritual and ecological crises of the modern world.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
    socials: {
      youtube: "https://www.youtube.com/results?search_query=Dr+Seyyed+Hossein+Nasr",
      website: "https://www.seyyedhosseinnasr.com"
    },
    books: [
      {
        title: "Science and Civilization in Islam",
        description: "Exploring the metaphysical framework that allowed empirical sciences to thrive in Islamic civilizations, showing how cosmological research was integrated into a unified vision of nature.",
        pdfUrl: "https://gwu.edu/nasr-science.pdf",
        pagesCount: 2,
        content: `PAGE 1: METAPHYSICAL FOUNDATIONS OF SCIENCE
For Islamic scientists, studying the stars, medicine, or mathematics was a form of worship. The universe itself is seen as a book of divine signs (ayat) reflecting the unity of the Creator.

PAGE 2: INSTITUTIONS OF LEARNING
The development of Madrasas, public hospitals, and astronomical observatories as state-supported, highly organized research centers where empirical methods were combined with spiritual ethics.`
      }
    ]
  },
  "Dr. Jonathan Brown": {
    name: "Dr. Jonathan Brown",
    title: "Alwaleed Chair of Islamic Civilization, Georgetown University",
    bio: "American scholar of Islamic studies and professor at Georgetown University's School of Foreign Service. He is the author of 'Hadith: Muhammad's Legacy' and numerous publications on historical methodology, Islamic law, and biographical evaluation systems.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    socials: {
      youtube: "https://www.youtube.com/results?search_query=Dr+Jonathan+Brown+hadith",
      telegram: "https://t.me/JonathanBrownLectures",
      website: "https://www.drjonathanbrown.com"
    },
    books: [
      {
        title: "Hadith: Muhammad's Legacy",
        description: "The complete history of how oral reports were cataloged, authenticated, and debated across history, showcasing the meticulous 'Ilm al-Rijal (Science of Biography) evaluation system.",
        pdfUrl: "https://georgetown.edu/brown-hadith.pdf",
        pagesCount: 2,
        content: `PAGE 1: TRANSMISSION AND REVOLUTION
The transition from oral reports to systematic, biographical encyclopedia catalogs in the early Islamic centuries represents a monumental leap in empirical history.

PAGE 2: EVALUATION AND AUTHENTICATION
How traditionalists assessed the psychological reliability, memories, and physical historical contact of tens of thousands of narrators to separate authentic historical facts from fabrication.`
      }
    ]
  },
  "Prof. George Saliba": {
    name: "Prof. George Saliba",
    title: "Professor of Arabic and Islamic Science, Columbia University",
    bio: "Lebanese-American professor of Arabic and Islamic Science at Columbia University. He is a leading world authority on the history of astronomical developments and scientific revolutions in the Islamic world, demonstrating the direct dependencies of early modern European astronomy on Arabic works.",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop",
    socials: {
      youtube: "https://www.youtube.com/results?search_query=George+Saliba+Islamic+science",
      website: "https://www.columbia.edu/~gas1/"
    },
    books: [
      {
        title: "Islamic Science and the Making of the European Renaissance",
        description: "A revolutionary study revealing the deep scientific, mathematical, and astronomical dependencies of Copernicus and early European scientists on classical Arabic texts.",
        pdfUrl: "https://columbia.edu/saliba-renaissance.pdf",
        pagesCount: 2,
        content: `PAGE 1: MARAGHA OBSERVATORY
How Nasir al-Din al-Tusi designed non-Ptolemaic astronomical models that Copernicus later utilized word-for-word in De revolutionibus, including using the exact same alphabetical labels.

PAGE 2: MEDICAL MANUSCRIPT IMPORTS
How Renaissance scientists imported Arabic clinical trial texts and anatomy manuals to reform medical teaching, relying on the work of Ibn al-Nafis and Ibn Sina.`
      }
    ]
  },
  "Ustaz Wahid (Al-Hikmah / Wahidcom Apologetics Channel)": {
    name: "Ustaz Wahid (Al-Hikmah / Wahidcom Apologetics Channel)",
    title: "Ethio-Semitic Comparative Theologian & Apologist",
    bio: "A prominent contemporary Ethio-Semitic comparative theologian, apologist, and educator. He is the founder of the Al-Hikmah Academy and host of the highly popular Wahidcom channel, known for in-depth comparative scripture research in Amharic, Ge'ez, Arabic, and Hebrew. His work focuses on clarifying monotheistic translations and establishing intellectual bridges across languages.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop",
    socials: {
      youtube: "https://www.youtube.com/@wahidcom",
      telegram: "https://t.me/Wahidcomparative"
    },
    books: [
      {
        title: "The Angel of YHWH: Comprehensive Biblical and Quranic Critique",
        description: "An extended academic text analyzing the 'Malakh YHWH' motif in Hebrew scriptures, proving proxy agency rather than deity, written for comparative study circles.",
        pdfUrl: "https://wahidcom.org/angel-yhwh.pdf",
        pagesCount: 2,
        content: `PAGE 1: EXEGESIS OF THE ANGEL OF YHWH
The Hebrew term Malakh (messenger) is the key. An envoy possesses representative authority ('Shaliach' principle), but is never of the same nature as the sender. The envoy speaks in the name of the king but is not the king.

PAGE 2: GE'EZ COMPARATIVE TERM ANALYSIS
Analyzing 'Endrase' (እንደራሴ - proxy agent) and 'Kidan' (covenant) in Ethio-Semitic theology, clarifying complex monotheistic translations and correcting theological translation errors.`
      }
    ]
  }
};
