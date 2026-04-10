# NTA Bot — User Guide

> Practical guidance for getting the best answers from NTA Bot.
> For a general overview, see [README.md](README.md). For knowledge base details, see [KNOWLEDGE-BASE.md](KNOWLEDGE-BASE.md).

## Getting Started

| | |
|---|---|
| **URL** | [grysngrhm-tech.github.io/nta-bot/](https://grysngrhm-tech.github.io/nta-bot/) |
| **Password** | Provided by your NTA administrator (case-sensitive) |
| **Browsers** | Chrome, Safari, Edge, Firefox — desktop or mobile |
| **Install as app** | On mobile, tap "Add to Home Screen" to install NTA Bot as an app. It works offline for previously loaded content. |

The password is checked once per browser session. You won't need to re-enter it unless you close the browser.

## What NTA Bot Knows

NTA Bot searches a curated knowledge base of **6,387 entries** across five categories. Understanding what's in each category helps you ask better questions:

- **Curriculum (1,777 entries)** — Complete lecture transcripts from the NTP, PHWC, and FOH programs. Best for: "How does the NTP curriculum explain...," scope-of-practice questions, Five Foundations, NACA process, coaching frameworks.
- **Textbooks (2,832 entries)** — Four reference textbooks covering anatomy & physiology, nutrition biochemistry, clinical nutrition by body system, and Dr. Gaby's nutritional treatment protocols. Best for: biochemistry mechanisms, nutrient metabolism, condition-specific protocols, body system deep dives.
- **Podcast (990 entries)** — 86 episodes of the NTA Nutritional Therapy and Wellness Podcast, extracted into educational reference entries. Best for: practitioner perspectives, real-world applications, emerging topics, NTA philosophy.
- **NIH ODS (672 entries)** — Government fact sheets on 28 vitamins, minerals, and nutrients. Best for: recommended intakes, deficiency signs, drug interactions, food sources, toxicity limits.
- **NTA Reference (116 entries)** — Scope of practice, program descriptions, credentials, philosophy, and terminology. Best for: "What is an NTP?," "What's the difference between NTP and PHWC?," NTA's mission and values.

The bot does **not** use the open internet. It cannot answer questions about current events, specific client cases, or topics not covered in the knowledge base. If it doesn't have enough information to answer confidently, it will say so.

## Asking Better Questions

The quality of the answer depends heavily on how you ask. A few adjustments can make a big difference:

**Be specific rather than broad.**

| Instead of... | Try... |
|---------------|--------|
| "Tell me about digestion" | "Explain the role of HCl in the stomach phase of the north-to-south digestive process" |
| "What about magnesium?" | "What are the signs and symptoms of magnesium deficiency, and which forms are best absorbed?" |
| "How do I help a client with stress?" | "What does the NTP curriculum recommend for supporting a client with HPA axis dysfunction?" |

**Use NTA terminology when you can.** The knowledge base is built around NTA's language — terms like "Five Foundations," "north-to-south," "bio-individuality," "NAQ," "NACA," "NTP," "PHWC," and "FNTP" will get you more precise results than generic phrasing.

**Ask follow-ups.** The bot remembers your conversation within a session. If the first answer gives you a starting point, ask a more targeted follow-up — "What specific supplements does Dr. Gaby recommend for that?" or "How would you assess that in a client?"

**Ask about scope distinctions directly.** Questions like "Can an NTP recommend supplements?" or "What's the difference between NTP and PHWC scope?" pull from the most authoritative source material on those topics.

## Understanding Answers

### Confidence Badges

Every answer includes a confidence indicator:

- **High** — The knowledge base has strong, relevant coverage. The answer is well-supported by multiple sources.
- **Medium** — The knowledge base has partial coverage. The answer is grounded in what's available, but the topic may not be fully covered. Consider verifying key details.
- **Low** — Limited coverage in the knowledge base. The answer reflects what was found, but you should consult primary sources before relying on it.

Confidence reflects how well the **knowledge base** covers the topic, not the accuracy of the underlying science.

### Source Cards

Every answer includes collapsible source cards below the response, grouped by category:

- **Curriculum** (warm earth badge) — NTA lecture content
- **Textbook** (green badge) — Reference textbook content
- **NIH** (teal badge) — Government nutrient fact sheets
- **Podcast** (amber badge) — Podcast episode content
- **Web** (blue badge) — NTA website and reference docs

Each category card shows how many documents and sections were cited. Expand a card to see the specific documents, section titles, and — for textbooks, NIH, and podcasts — links to the original source. You can click "View source text" on any section to read the exact passage the bot used.

Sources come directly from the retrieval system, not from the AI model. The model writes the answer; the sources are attached from the actual search results. This means the citations are always real — they can't be hallucinated.

## Follow-Up Chips

After each answer, 4 follow-up options appear as clickable chips. Each triggers a focused follow-up using the same knowledge base:

| Chip | What It Does | When to Use It |
|------|-------------|----------------|
| **Deep Dive** | Explores the mechanism, science, or a related topic in depth | You want to understand the *why* behind the answer |
| **Protocol** | Builds a supplement and lifestyle protocol with specific products, doses, and timing | You want actionable clinical recommendations |
| **Assessment Guide** | Creates a practitioner workflow — intake questions, assessment steps, labs, referral criteria | You're preparing for a client session or developing an assessment plan |
| **Wildcard** | Takes a creative angle — client scenario, comparison, meal plan, devil's advocate perspective | You want a different lens on the topic |

Chips are context-aware — they're generated based on your specific answer, not generic suggestions. Each chip carries a hidden set of clinical instructions that guide the follow-up response.

## Supplement Protocol Cards

When the bot's answer mentions supplements, a collapsible **Supplement Protocol** section appears below the source cards. Each supplement shows as a compact row with:

- **Priority dot** — green (primary), amber (supportive), or gray (consider)
- **Product name** — matched from an [832-product catalog](KNOWLEDGE-BASE.md#supplement-product-catalog--832-products) across 12 professional-grade brands
- **Dose and timing** — extracted from the answer
- **Fullscript link** — direct link to the product page on Fullscript

Click any row to expand and see the full product description, supplement facts, suggested use, and ingredients. Use the **Copy** button to copy the entire protocol formatted for pasting into emails or client notes.

Protocol cards are not always present — they only appear when the answer mentions specific supplements.

## Other Features

- **Voice input** — Tap the microphone icon to speak your question. Speech is transcribed directly into the text field.
- **Read aloud** — Tap the speaker icon on any answer to hear it read back via text-to-speech.
- **Conversation memory** — The bot remembers your questions and answers within a session. Close the browser or tap the new-chat button (pencil icon) to start fresh.
- **Sample questions** — The welcome screen shows 4 curated questions from different categories, refreshed on each visit. Use these to explore what the bot can do.
- **New chat** — Tap the pencil icon in the input bar to clear the conversation and return to the welcome screen.

## Tips & Limitations

**What works well:**
- Questions about NTA curriculum content, scope of practice, and program-specific topics
- Nutrient-specific questions (deficiency, food sources, supplement forms, interactions)
- Clinical protocol questions (Dr. Gaby's recommendations, supplement dosing, assessment workflows)
- Comparing how different sources cover a topic (e.g., curriculum vs. textbook vs. NIH)

**What the bot can't do:**
- Access the internet or any information outside the knowledge base
- Answer questions about specific clients or real-time data
- Replace professional judgment — the bot synthesizes what's in its sources, not clinical advice for a specific situation
- Cover topics not represented in its knowledge base (check the [full inventory](KNOWLEDGE-BASE.md) if you're unsure what's included)

**When to double-check:**
- Low-confidence answers — the bot is telling you it's working with limited material
- Dosing and supplement recommendations — always verify against current clinical guidance and the specific product label
- Scope-of-practice questions with legal implications — the bot reflects NTA's published scope documents, but regulatory requirements vary by state

---

*For a detailed breakdown of every source in the knowledge base, see [KNOWLEDGE-BASE.md](KNOWLEDGE-BASE.md).*
*For general overview, see [README.md](README.md).*
