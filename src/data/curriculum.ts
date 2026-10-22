import { composeSentence } from "@/lib/sentence";
import type { LessonDay, VoiceMissionStep } from "@/lib/types";

export const curriculum: LessonDay[] = [
  {
    id: "day-1",
    day: 1,
    title_hi: "रोज़ की आदत — चाय",
    title_en: "Daily habit — tea",
    pattern_label: "रोज़ की आदत",
    pattern_emoji: "📅",
    ear: {
      prompt_hi: "सुनें और दोहराएँ — सुबह की बात",
      lines: [
        {
          en: "I make tea every morning",
          phonetic_hi: "आई मेक टी एव्री मॉर्निंग",
          hi: "मैं हर सुबह चाय बनाती हूँ",
        },
        {
          en: "She makes tea for the family",
          phonetic_hi: "शी मेक्स टी फ़ॉर द फ़ैमिली",
          hi: "वह परिवार के लिए चाय बनाती है",
        },
      ],
    },
    substitution: {
      subject: {
        id: "i",
        role: "who",
        frame_hi: "कौन",
        en: "I",
        phonetic_hi: "आई",
        hi: "मैं",
      },
      defaultActionId: "make-tea",
      choice_role: "action",
      choice_label_hi: "क्या काम? — एक चुनें",
      actions: [
        {
          id: "make-tea",
          emoji: "🍵",
          en: "make tea every day",
          phonetic_hi: "मेक टी एव्री डे",
          hi: "रोज़ चाय बनाती हूँ",
          speak_context_hi: "टीचर से कहें — मैं रोज़ चाय बनाती हूँ",
        },
        {
          id: "cook-rice",
          emoji: "🍚",
          en: "cook rice every day",
          phonetic_hi: "कुक राइस एव्री डे",
          hi: "रोज़ चावल बनाती हूँ",
          speak_context_hi: "टीचर से कहें — मैं रोज़ चावल बनाती हूँ",
        },
        {
          id: "pack-tiffin",
          emoji: "🥡",
          en: "pack tiffin every day",
          phonetic_hi: "पैक टिफ़िन एव्री डे",
          hi: "रोज़ टिफ़िन पैक करती हूँ",
          speak_context_hi: "टीचर से कहें — मैं रोज़ टिफ़िन पैक करती हूँ",
        },
      ],
    },
    voice: {
      prompt_hi: "माइक पर टैप करके बोलें",
      context_hi: "टीचर से कहें — मैं रोज़ चाय बनाती हूँ",
      target: {
        en: "I make tea every day",
        phonetic_hi: "आई मेक टी एव्री डे",
        hi: "मैं रोज़ चाय बनाती हूँ",
      },
    },
  },
  {
    id: "day-2",
    day: 2,
    title_hi: "अभी क्या हो रहा है",
    title_en: "What is happening now",
    pattern_label: "काम जारी है",
    pattern_emoji: "⏰",
    ear: {
      prompt_hi: "सुनें — आरव अभी क्या कर रहा है",
      lines: [
        {
          en: "Aarav is studying well",
          phonetic_hi: "आरव इज़ स्टडीइंग वेल",
          hi: "आरव अच्छी तरह पढ़ाई कर रहा है",
        },
        {
          en: "He is playing football",
          phonetic_hi: "हे इज़ प्लेइंग फुटबॉल",
          hi: "वह फुटबॉल खेल रहा है",
        },
      ],
    },
    substitution: {
      subject: {
        id: "aarav",
        role: "who",
        frame_hi: "कौन",
        en: "Aarav",
        phonetic_hi: "आरव",
        hi: "आरव",
      },
      defaultActionId: "studying-well",
      choice_role: "action",
      choice_label_hi: "क्या काम? — एक चुनें",
      actions: [
        {
          id: "studying-well",
          emoji: "📚",
          en: "is studying well",
          phonetic_hi: "इज़ स्टडीइंग वेल",
          hi: "अच्छी तरह पढ़ाई कर रहा है",
          speak_context_hi: "स्कूल में टीचर से कहें — आरव अच्छी तरह पढ़ाई कर रहा है",
        },
        {
          id: "playing-football",
          emoji: "⚽",
          en: "is playing football",
          phonetic_hi: "इज़ प्लेइंग फुटबॉल",
          hi: "फुटबॉल खेल रहा है",
          speak_context_hi: "स्कूल में टीचर से कहें — आरव फुटबॉल खेल रहा है",
        },
        {
          id: "eating-lunch",
          emoji: "🍱",
          en: "is eating lunch",
          phonetic_hi: "इज़ ईटिंग लंच",
          hi: "दोपहर का खाना खा रहा है",
          speak_context_hi: "स्कूल में टीचर से कहें — आरव दोपहर का खाना खा रहा है",
        },
      ],
    },
    voice: {
      prompt_hi: "माइक पर टैप करके बोलें",
      context_hi: "स्कूल में टीचर से कहें — आरव अच्छी तरह पढ़ाई कर रहा है",
      target: {
        en: "Aarav is studying well",
        phonetic_hi: "आरव इज़ स्टडीइंग वेल",
        hi: "आरव अच्छी तरह पढ़ाई कर रहा है",
      },
    },
  },
  {
    id: "day-3",
    day: 3,
    title_hi: "विनम्र अनुरोध",
    title_en: "Polite requests",
    pattern_label: "तहज़ीब और ज़रूरत",
    pattern_emoji: "🌸",
    ear: {
      prompt_hi: "सुनें — दुकान या रेस्टोरेंट में विनम्र बात",
      lines: [
        {
          en: "Please give me the bill",
          phonetic_hi: "प्लीज़ गिव मी द बिल",
          hi: "कृपया बिल दे दीजिए",
        },
        {
          en: "Could you help me, please?",
          phonetic_hi: "कुड यू हेल्प मी, प्लीज़?",
          hi: "क्या आप मेरी मदद कर सकते हैं?",
        },
      ],
    },
    substitution: {
      subject: {
        id: "please",
        role: "who",
        frame_hi: "विनम्र शब्द",
        en: "Please",
        phonetic_hi: "प्लीज़",
        hi: "कृपया",
      },
      defaultActionId: "give-bill",
      choice_role: "action",
      choice_label_hi: "क्या काम? — एक चुनें",
      actions: [
        {
          id: "give-bill",
          emoji: "🧾",
          en: "give me the bill",
          phonetic_hi: "गिव मी द बिल",
          hi: "बिल दे दीजिए",
          speak_context_hi: "रेस्टोरेंट में विनम्रता से बिल माँगें",
        },
        {
          id: "call-waiter",
          emoji: "🛎️",
          en: "call the waiter",
          phonetic_hi: "कॉल द वेटर",
          hi: "वेटर को बुला दीजिए",
          speak_context_hi: "रेस्टोरेंट में विनम्रता से वेटर को बुलाएँ",
        },
        {
          id: "pack-food",
          emoji: "🥡",
          en: "pack the food",
          phonetic_hi: "पैक द फ़ूड",
          hi: "खाना पैक कर दीजिए",
          speak_context_hi: "रेस्टोरेंट में विनम्रता से खाना पैक करवाएँ",
        },
      ],
    },
    voice: {
      prompt_hi: "माइक पर टैप करके बोलें",
      context_hi: "रेस्टोरेंट में विनम्रता से बिल माँगें",
      target: {
        en: "Please give me the bill",
        phonetic_hi: "प्लीज़ गिव मी द बिल",
        hi: "कृपया बिल दे दीजिए",
      },
    },
  },
  {
    id: "day-4",
    day: 4,
    title_hi: "स्कूल और PTM",
    title_en: "School & PTM",
    pattern_label: "स्कूल की बात",
    pattern_emoji: "🏫",
    ear: {
      prompt_hi: "सुनें — टीचर से पूछने वाले वाक्य",
      lines: [
        {
          en: "How is his handwriting?",
          phonetic_hi: "हाउ इज़ हिज़ हैंडराइटिंग?",
          hi: "उसकी लिखाई कैसी है?",
        },
        {
          en: "Is he listening in class?",
          phonetic_hi: "इज़ हे लिसनिंग इन क्लास?",
          hi: "क्या वह क्लास में ध्यान से सुनता है?",
        },
      ],
    },
    substitution: {
      subject: {
        id: "how-is",
        role: "who",
        frame_hi: "सवाल",
        en: "How is",
        phonetic_hi: "हाउ इज़",
        hi: "",
      },
      defaultActionId: "handwriting",
      choice_role: "what",
      choice_label_hi: "किस बारे में? — एक चुनें",
      actions: [
        {
          id: "handwriting",
          emoji: "✍️",
          en: "his handwriting",
          phonetic_hi: "हिज़ हैंडराइटिंग",
          hi: "उसकी लिखाई",
          hi_sentence: "उसकी लिखाई कैसी है?",
          en_end: "?",
          speak_context_hi: "PTM पर टीचर से लिखाई के बारे में पूछें",
        },
        {
          id: "homework",
          emoji: "📓",
          en: "his homework",
          phonetic_hi: "हिज़ होमवर्क",
          hi: "उसका होमवर्क",
          hi_sentence: "उसका होमवर्क कैसा है?",
          en_end: "?",
          speak_context_hi: "PTM पर टीचर से होमवर्क के बारे में पूछें",
        },
        {
          id: "behaviour",
          emoji: "🙂",
          en: "his behaviour",
          phonetic_hi: "हिज़ बिहेवियर",
          hi: "उसका व्यवहार",
          hi_sentence: "उसका व्यवहार कैसा है?",
          en_end: "?",
          speak_context_hi: "PTM पर टीचर से व्यवहार के बारे में पूछें",
        },
      ],
    },
    voice: {
      prompt_hi: "माइक पर टैप करके बोलें",
      context_hi: "PTM पर टीचर से लिखाई के बारे में पूछें",
      target: {
        en: "How is his handwriting?",
        phonetic_hi: "हाउ इज़ हिज़ हैंडराइटिंग?",
        hi: "उसकी लिखाई कैसी है?",
      },
    },
  },
  {
    id: "day-5",
    day: 5,
    title_hi: "क्लिनिक और डॉक्टर",
    title_en: "Clinic & doctor",
    pattern_label: "हाल बताना",
    pattern_emoji: "⏳",
    ear: {
      prompt_hi: "सुनें — डॉक्टर से हाल बताना",
      lines: [
        {
          en: "I have a headache. It started this morning",
          phonetic_hi: "आई हैव अ हेडेक. इट स्टार्टिड दिस मॉर्निंग",
          hi: "मुझे सुबह से सिरदर्द है",
        },
        {
          en: "He has a fever. It started yesterday",
          phonetic_hi: "हे हैज़ अ फ़ीवर. इट स्टार्टिड येस्टरडे",
          hi: "उसे कल से बुखार है",
        },
      ],
    },
    substitution: {
      subject: {
        id: "i-have",
        role: "who",
        frame_hi: "कौन",
        en: "I have",
        phonetic_hi: "आई हैव",
        hi: "मुझे",
      },
      defaultActionId: "headache",
      choice_role: "what",
      choice_label_hi: "क्या तकलीफ़? — एक चुनें",
      actions: [
        {
          id: "headache",
          emoji: "🤕",
          en: "a headache. It started this morning",
          phonetic_hi: "अ हेडेक. इट स्टार्टिड दिस मॉर्निंग",
          hi: "सुबह से सिरदर्द है",
          speak_context_hi: "डॉक्टर को बताएँ — मुझे सुबह से सिरदर्द है",
        },
        {
          id: "cold",
          emoji: "🤧",
          en: "a cold. It started yesterday",
          phonetic_hi: "अ कोल्ड. इट स्टार्टिड येस्टरडे",
          hi: "कल से सर्दी-ज़ुकाम है",
          speak_context_hi: "डॉक्टर को बताएँ — मुझे कल से सर्दी-ज़ुकाम है",
        },
        {
          id: "stomach-pain",
          emoji: "🩹",
          en: "a stomach ache. It started last night",
          phonetic_hi: "अ स्टमक एक. इट स्टार्टिड लास्ट नाइट",
          hi: "रात से पेट दर्द है",
          speak_context_hi: "डॉक्टर को बताएँ — मुझे रात से पेट दर्द है",
        },
      ],
    },
    voice: {
      prompt_hi: "माइक पर टैप करके बोलें",
      context_hi: "डॉक्टर को बताएँ — मुझे सुबह से सिरदर्द है",
      target: {
        en: "I have a headache. It started this morning",
        phonetic_hi: "आई हैव अ हेडेक. इट स्टार्टिड दिस मॉर्निंग",
        hi: "मुझे सुबह से सिरदर्द है",
      },
    },
  },
];

export function getLessonById(id: string): LessonDay | undefined {
  return curriculum.find((lesson) => lesson.id === id);
}

export function getLessonByDay(day: number): LessonDay | undefined {
  return curriculum.find((lesson) => lesson.day === day);
}

/** Speaking card follows the pill chosen on the swap step. */
export function voiceForChoice(
  lesson: LessonDay,
  actionId: string,
): VoiceMissionStep {
  const action =
    lesson.substitution.actions.find((item) => item.id === actionId) ??
    lesson.substitution.actions[0];

  return {
    prompt_hi: "माइक पर टैप करके बोलें",
    context_hi: action.speak_context_hi ?? lesson.voice.context_hi,
    target: composeSentence(lesson.substitution.subject, action),
  };
}
