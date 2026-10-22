# Learner test — English Sakhi

Tested on 22 October 2026 at https://english-sakhi.vercel.app/ as a Hindi-speaking learner on a phone-sized screen (390px wide, and 360px for line wrapping).

Progress was kept in this browser. All five lessons were opened from the home list, in order, and finished. A lesson opened again does not raise the streak a second time.

## What was walked

| Path | Result |
| --- | --- |
| Home, locked cards, streak, cloud banner | Opened and used |
| Day 1 listen, slow and normal audio, all three word swaps, speaking step, finish | Finished |
| Day 2 listen, football and lunch swaps, back to home, reload, speaking step, finish | Finished |
| Day 3 listen, waiter swap, speaking step, finish, then “एक बार और अभ्यास करें” | Finished |
| Day 4 listen, homework and behaviour swaps, speaking step, finish | Finished |
| Day 5 listen, headache, cold, and stomach swaps, speaking step, finish, then practice again | Finished |
| Home after all five | Five done cards, streak 5 |
| Cloud sheet | Opened from the banner and from the cloud icon. Bad email checked. |
| Unknown address `/lesson/day-9` | Opened |
| Network switched off | Home and a direct lesson address tried |
| Speaking check `/api/speak-eval` | Several real sentences sent |

## Not completed

- A sentence spoken into a working microphone. In this browser the mic starts, then shows **सुनने में समस्या हुई — एक बार फिर बोलें।**
- A real email sign-in, a second phone, and sign-out.
- The installed-app screen (home screen icon). The site does register a service worker.

## Issues

### 1. Day 5 teaches English a doctor would not accept

Opened from the home list after day 4.

Listen step:

- **I have a headache since morning** — Hindi meaning **सुबह से सिरदर्द है**
- **He has a fever since yesterday** — Hindi meaning **कल से बुखार है**

`since` needs a form like **I have had a headache since morning**, or two short sentences: **I have a headache. It started this morning.**

The meaning lines drop the person. **सुबह से सिरदर्द है** does not say “मैं”. **कल से बुखार है** does not say “वह”.

Word swap builds:

- **I have a cold since yesterday** — **मुझे है कल से सर्दी-ज़ुकाम**
- **I have stomach pain since night** — **मुझे है रात से पेट दर्द**

**stomach pain** is missing “a”. **since night** is not how one says “रात से”. The Hindi is glued in the wrong order: **मुझे है …** instead of **मुझे रात से पेट दर्द है**.

The speaking card for the same idea says **सुबह से सिरदर्द है**, while the swap card says **मुझे है सुबह से सिरदर्द**. One lesson, two Hindi versions.

### 2. The speaking check praises the wrong sentence

The live check returned **वाह! आपने बहुत अच्छा बोला।** for all of these:

| Said | Target |
| --- | --- |
| You make tea every day | I make tea every day |
| I make toast | I make tea every day |
| Give me the bill | Please give me the bill |
| How is his homework? | How is his handwriting? |
| I have a headache | I have a headache since morning |
| He has a fever since yesterday | I have a headache since morning |

**hello** was the one that was stopped, with **बहुत बढ़िया कोशिश!**

An empty check request is answered with `understood: true` and **पहले माइक से बोलें, फिर जाँच करें।**

On the speaking screen, **जाँचें** with nothing said still shows **बहुत बढ़िया कोशिश! पहले माइक दबाकर बोलें।** and the green button becomes **मिशन पूरा करें**.

### 3. Day 1 tells the learner to say “आप”, then shows “I”

Speaking step, on screen:

- Instruction: **टीचर से कहें — आप रोज़ चाय बनाती हैं**
- Sentence: **I make tea every day**
- Meaning: **मैं रोज़ चाय बनाती हूँ**

A learner who trusts the Hindi line will say **You make tea every day**. Issue 2 then praises that sentence.

### 4. Day 4 builds the question backwards, and the gender does not change

Seen on the swap step:

- Yellow block: **How is** (this is not “कौन”)
- Default: **How is his handwriting** — **कैसी है उसकी लिखाई**
- **his homework** → **How is his homework** — **कैसी है उसका होमवर्क**
- **his behaviour** → **How is his behaviour** — **कैसी है उसका व्यवहार**

The question mark from the listen step is gone. **होमवर्क** and **व्यवहार** take **कैसा**, not **कैसी**. The heading above the choices stays **क्या काम? — एक चुनें** even though these are not actions.

The speaking step throws away the choice and always asks **How is his handwriting?**

### 5. The word chosen on the swap step is forgotten when it is time to speak

Confirmed on days 1, 2, 3, and 5:

- Day 2: chose **is playing football**. Speaking step asked for **Aarav is studying well**.
- Day 3: chose **call the waiter**. Speaking step asked for **Please give me the bill**.
- Day 5: chose **stomach pain**. Speaking step asked for the headache sentence.

### 6. A lesson can be finished without speaking, and the streak counts lessons as days

**बाद में पूरा करें** is on the speaking step before any speech. It marks the lesson done.

All five lessons were finished on the same evening. The flame then showed **5**. Repeating day 5 left the streak at 5, so a repeat is safe. Five new lessons in one sitting still display as five days.

Each finish screen says **कल फिर मिलते हैं** while the next lesson is already open on home.

### 7. Every new step flashes “this phone has no voice”

On days 1, 2, 3, and 4, arriving at the next step showed **इस फ़ोन पर आवाज़ उपलब्ध नहीं है — वाक्य पढ़कर दोहराएँ।** and the listen buttons were disabled. A moment later the message was gone and the buttons worked.

Audio that did play used Indian English, normal speed 0.85 and slow speed 0.7, in a man’s voice (Ravi). A woman’s Indian voice (Heera) was on the same phone. The “I” sentences are **बनाती हूँ**.

### 8. The mic words describe a press-and-hold

On the speaking step:

- **माइक दबाकर बोलें**
- While listening: **सुन रहे हैं… बोलकर छोड़ें**

The button is a tap to start and a second tap to stop. Letting go does not stop it.

### 9. Long English lines break beside the speaker buttons

On a 360px-wide screen the English of **I have a headache since morning** was given 180px of width, so the sentence sat on two lines. On day 1, **morning** and **family** fell alone onto the next line. The speaker and the slow button are 48px and sit in the same row as the English.

### 10. A missing page is an English 404 in white on cream

`/lesson/day-9` shows the browser title **404: This page could not be found.**

The words **404** and **This page could not be found.** are white (`rgb(255, 255, 255)`) on the cream page (`rgb(250, 248, 245)`). There is no Hindi, and no link back home.

### 11. Offline lessons are not reliable

A service worker is registered (`english-sakhi-v2`). With the network off:

- Opening `/lesson/day-1` directly showed the browser’s “site can’t be reached” page.
- Opening `/` showed the home screen.
- Pages already opened in the session could be read back from the cache.

Speaking check needs the server. It was not available offline.

### 12. Cloud save asks for an English email, and only the X closes it

The sheet says there is no password and a sign-in link will be emailed. The field placeholder is `aapka@email.com`. Typing `maa` showed **कृपया सही ईमेल लिखें।**

Tapping the dimmed area outside the sheet does not close it. The Escape key does not close it.

**बंद करें** did close the sheet on a clean retry, within about a second. In an earlier session the sheet faded and then stayed as an invisible layer over the whole page, so the day 2 card could not be tapped until the address was opened directly.

Sign-in with a real inbox, and progress on a second phone, were not completed.

### 13. Leaving a lesson drops the place

Back to home and opening the same lesson again kept the step, but the word that had been chosen was reset.

Reloading the lesson address starts again at the listen step. A five-minute lesson interrupted by a phone call starts over.

### 14. After all five lessons, home has nowhere new to go

Streak **5**. All five cards show a check. There is no line that the course is finished, and no next step. The cloud banner is still the only prompt.

### 15. Smaller gaps seen while using the app

- Phone home does not show **रोज़ थोड़ी देर — सुनो, बोलो, आगे बढ़ो।** That line is only on a wide screen.
- Locked cards do nothing when tapped. The reason is already written on the card: **पहले वाला मिशन पूरा करें**.
- A lesson address can be opened before the previous lesson is done. The home lock does not apply to the address itself. The ordered path from home did work.
- **He** is written **ही** (**ही इज़ प्लेइंग फुटबॉल**, **इज़ ही लिसनिंग इन क्लास**). In Hindi, **ही** is a different word.
- Day 2’s speaking line says **आरव अच्छी पढ़ाई कर रहा है**. The sentence meaning says **आरव अच्छी तरह पढ़ाई कर रहा है**.
- Days 2 and 3 listen sentences, and the lunch and tiffin swaps, matched their Hindi.

## Sentences that read cleanly

These were on screen and the English, the sound line, and the Hindi agreed:

- **I make tea every morning** / **आई मेक टी एव्री मॉर्निंग** / **मैं हर सुबह चाय बनाती हूँ**
- **She makes tea for the family** / **शी मेक्स टी फ़ॉर द फ़ैमिली** / **वह परिवार के लिए चाय बनाती है**
- **I pack tiffin every day** / **मैं रोज़ टिफ़िन पैक करती हूँ**
- **Aarav is playing football** / **आरव फुटबॉल खेल रहा है**
- **Aarav is eating lunch** / **आरव दोपहर का खाना खा रहा है**
- **Please give me the bill** / **कृपया बिल दे दीजिए**
- **Could you help me, please?** / **क्या आप मेरी मदद कर सकते हैं?**
- **Please call the waiter** / **कृपया वेटर को बुला दीजिए**
