/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BibleVerse {
  number: number;
  text: string;
  translationAmharic: string;
  translationEnglish: string;
}

export interface BibleBook {
  id: number;
  name: string;
  nameEnglish: string;
  testament: 'Old' | 'New';
  totalChapters: number;
  chapters: Record<number, BibleVerse[]>;
}

export const bibleData: BibleBook[] = [
  {
    id: 1,
    name: "ኦሪት ዘፍጥረት",
    nameEnglish: "Genesis",
    testament: "Old",
    totalChapters: 1,
    chapters: {
      1: [
        {
          number: 1,
          text: "בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖yim וְאֵ֥ת הָאָֽרֶץ׃",
          translationAmharic: "በመጀመሪያ እግዚአብሔር ሰማይንና ምድርን ፈጠረ።",
          translationEnglish: "In the beginning God created the heaven and the earth."
        },
        {
          number: 2,
          text: "וְהָאָ֗רֶץ הָיְתָ֥ה תֹ֨הוּ֙ וָבֹ֔הוּ וְחֹ֖שֶׁךְ עַל־פְּנֵ֣י תְה֑וֹם וְר֣וּחַ אֱלֹהִ֔ים מְרַחֶ֖פֶת עַל־pə·nê הַמָּֽyim׃",
          translationAmharic: "ምድርም ባዶ ነበረች፥ አንዳችም አልነበረባትም፤ ጨለማም በጥልቁ ላይ ነበረ፥ የእግዚአብሔርም መንፈስ በውኃ ላይ ይሰፍፍ ነበር።",
          translationEnglish: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters."
        },
        {
          number: 3,
          text: "וַיֹּ֥אמֶר אֱלֹהִ֖ים יְהִ֣י א֑וֹר וַֽיְהִי־אֽוֹר׃",
          translationAmharic: "እግዚአብሔርም፦ ብርሃን ይሁን አለ፤ ብርሃንም ሆነ።",
          translationEnglish: "And God said, Let there be light: and there was light."
        },
        {
          number: 4,
          text: "וַיַּ֧רְא אֱלֹהִ֛ים אֶת־הָא֖וֹר כִּי־ט֑וֹב וַיַּבְדֵּ֣ל אֱלֹהִ֔ים בֵּ֥ין הָא֖וֹר וּבֵ֥ין הַחֹֽשֶׁךְ׃",
          translationAmharic: "እግዚአብሔርም ብርሃኑ መልካም እንደ ሆነ አየ፥ እግዚአብሔርም ብርሃኑንና ጨለማውን ለየ።",
          translationEnglish: "And God saw the light, that it was good: and God divided the light from the darkness."
        },
        {
          number: 5,
          text: "וַיִּקְרָ֨א אֱלֹהִ֤ים ׀ לָאוֹר֙ י֔וֹם וְלַחֹ֖שֶׁךְ קָ֣ራ לָ֑יְלָה וַֽbackground־عֶ֥רֶב וַֽbackground־بֹּ֖קֶר י֥וֹם אֶחָֽד׃",
          translationAmharic: "እግዚአብሔርም ብርሃኑን ቀን ብሎ ጠራው፥ ጨለማውንም ሌሊት አለው። ማታም ሆነ ጥዋትም ሆነ፥ አንደኛ ቀን።",
          translationEnglish: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day."
        }
      ]
    }
  },
  {
    id: 2,
    name: "የዮሐንስ ወንጌል",
    nameEnglish: "Gospel of John",
    testament: "New",
    totalChapters: 1,
    chapters: {
      1: [
        {
          number: 1,
          text: "Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.",
          translationAmharic: "በመጀመሪያ ቃል ነበረ፥ ቃልም በእግዚአብሔር ዘንድ ነበረ፥ ቃልም እግዚአብሔር ነበረ።",
          translationEnglish: "In the beginning was the Word, and the Word was with God, and the Word was God."
        },
        {
          number: 2,
          text: "οὗτος ἦν ἐν ἀρχῇ πρὸς τὸν θεόν.",
          translationAmharic: "ይህ በመጀመሪያ በእግዚአብሔር ዘንድ ነበረ።",
          translationEnglish: "The same was in the beginning with God."
        },
        {
          number: 3,
          text: "πάντα δι’ αὐτοῦ ἐγένετο, καὶ χωρὶς αὐτοῦ ἐγένετο οὐδὲ ἕν ὃ γέγονεν.",
          translationAmharic: "ሁሉ በእርሱ ሆነ፥ ከሆነውም አንዳች ስንኳ ያለ እርሱ አልሆነም።",
          translationEnglish: "All things were made by him; and without him was not any thing made that was made."
        },
        {
          number: 4,
          text: "ἐν αὐτῷ ζωὴ ἦν, καὶ ἡ ζωὴ ἦν τὸ φῶς τῶν ἀνθρώπων·",
          translationAmharic: "በእርሱ ሕይወት ነበረች፥ ሕይወትም የሰው ብርሃን ነበረች።",
          translationEnglish: "In him was life; and the life was the light of men."
        },
        {
          number: 5,
          text: "καὶ τὸ φῶς ἐν τῇ σκοτίᾳ φαίνει, καὶ ἡ σκοτία αὐτὸ οὐ κατέλαβεν.",
          translationAmharic: "ብርሃንም በጨለማ ይበራል፥ ጨለማውም አላሸነፈውም።",
          translationEnglish: "And the light shineth in darkness; and the darkness comprehended it not."
        },
        {
          number: 14,
          text: "Καὶ ὁ λόγος σὰρξ ἐγένετο καὶ ἐσκήνωσεν ἐν ἡμῖν...",
          translationAmharic: "ቃልም ሥጋ ሆነ፤ ጸጋንና እውነትንም ተሞልቶ በእኛ አደረ፥ አንድ ልጅም ከአባቱ ዘንድ እንዳለው ክብር የሆነውን ክብሩን አየን።",
          translationEnglish: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth."
        }
      ]
    }
  },
  {
    id: 3,
    name: "የማቴዎስ ወንጌል",
    nameEnglish: "Gospel of Matthew",
    testament: "New",
    totalChapters: 1,
    chapters: {
      1: [
        {
          number: 1,
          text: "Βίβλος γενέσεως Ἰησοῦ Χριστοῦ υἱοῦ Δαυὶδ υἱοῦ Ἀβραάμ.",
          translationAmharic: "የዳዊት ልጅ የአብርሃም ልጅ የኢየሱስ ክርስቶስ ትውልድ መጽሐፍ።",
          translationEnglish: "The book of the generation of Jesus Christ, the son of David, the son of Abraham."
        },
        {
          number: 16,
          text: "Ἰακὼβ δὲ ἐγέννησεν τὸν Ἰωσὴφ τὸν ἄνδρα Μαρίας, ἐξ ἧς ἐγεννήθη Ἰησοῦς ὁ λεγόμενος Χριστός.",
          translationAmharic: "ያዕቆብም ክርስቶስ የተባለውን ኢየሱስን የወለደችውን የማርያምን እጮኛ ዮሴፍን ወለደ።",
          translationEnglish: "And Jacob begat Joseph the husband of Mary, of whom was born Jesus, who is called Christ."
        },
        {
          number: 21,
          text: "τέξεται δὲ υἱὸν καὶ καλέσεις τὸ ὄνομα αὐτοῦ Ἰησοῦν· αὐτὸς γὰρ σώσει τὸν λαὸν αὐτοῦ ἀπὸ τῶν ἁμαρτιῶν αὐτῶν.",
          translationAmharic: "ልጅም ትወልዳለች፤ እርሱ ሕዝቡን ከኃጢአታቸው ያድናቸዋልና ስሙን ኢየሱስ ትለዋለህ።",
          translationEnglish: "And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins."
        }
      ]
    }
  }
];
