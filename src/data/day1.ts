import type { SubstitutionLesson } from "@/lib/types";

/** Day 1 seed — स्कूल में टीचर से बात करना (Aarav is …). */
export const day1Substitution: SubstitutionLesson = {
  id: "day-1-substitution",
  day: 1,
  title_hi: "स्कूल में टीचर से बात करना",
  title_en: "Talking to the teacher",
  pattern_label: "काम जारी है",
  pattern_emoji: "⏰",
  subject: {
    id: "aarav",
    role: "who",
    en: "Aarav",
    phonetic_hi: "आरव",
    hi: "आरव",
  },
  defaultActionId: "studying-well",
  actions: [
    {
      id: "studying-well",
      emoji: "📚",
      en: "is studying well",
      phonetic_hi: "इज़ स्टडीइंग वेल",
      hi: "अच्छी तरह पढ़ाई कर रहा है",
    },
    {
      id: "playing-football",
      emoji: "⚽",
      en: "is playing football",
      phonetic_hi: "इज़ प्लेइंग फुटबॉल",
      hi: "फुटबॉल खेल रहा है",
    },
    {
      id: "eating-lunch",
      emoji: "🍱",
      en: "is eating lunch",
      phonetic_hi: "इज़ ईटिंग लंच",
      hi: "दोपहर का खाना खा रहा है",
    },
  ],
};
