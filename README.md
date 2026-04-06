<p align="center">
  <img src="assets/icons/nta-logo.svg" alt="Nutritional Therapy Association" width="280">
</p>

<h1 align="center">NTA Bot</h1>

<p align="center">
  AI-powered knowledge assistant for NTA employees<br>
  <a href="https://grysngrhm-tech.github.io/nta-bot/">Open NTA Bot</a>
</p>

---

## What is NTA Bot?

NTA Bot is an AI assistant built for NTA employees. Ask it anything about NTA curriculum, programs, scope of practice, health topics, or anatomy & physiology — it searches across 1,820 pieces of curated content and gives you a clear answer with clickable source citations.

Unlike general AI tools, NTA Bot doesn't use the open internet or make things up. Every answer is grounded in NTA's own materials and a licensed college A&P textbook, and every claim is traceable to a specific source you can click to verify.

The bot is password-protected and intended for internal use by NTA staff.

## What Can You Ask?

**Curriculum & Programs**
- "What are the Five Foundations of Health?"
- "What does the PHWC curriculum cover in Month 4?"
- "What's the difference between an NTP and an FNTP?"

**Scope of Practice**
- "Can an NTP diagnose or treat disease?"
- "Why can a PHWC not make food recommendations?"
- "What can an FNTP do that an NTP cannot?"

**Health & Wellness Topics**
- "Why do people feel shaky when they skip meals?"
- "How does chronic inflammation start, and can diet reduce it?"
- "What nutrients does your body need to make healthy red blood cells?"

**Anatomy & Physiology**
- "How does the liver produce bile?"
- "How do the kidneys filter blood and reabsorb nutrients?"
- "What happens to blood sugar at a cellular level when someone skips meals?"

## Knowledge Base

NTA Bot searches across **1,820 curated entries** from three source categories:

### NTA Curriculum & Reference — 187 entries

Content from NTA's website covering scope of practice, the NTP and PHWC programs, credentials (NTP, FNTP, PHWC, FCA, Foundations of Healing, Career Compass), NTA philosophy, and a complete terminology glossary. Each entry links back to nutritionaltherapy.com.

### Podcast Library — 990 entries from 86 episodes

Every episode of the **Nutritional Therapy and Wellness Podcast**, transcribed and processed to extract factual, educational content organized by topic — digestion, blood sugar, hormones, fertility, mental health, food quality, supplements, practitioner development, and more. Each citation links directly to the episode on Apple Podcasts.

### Anatomy & Physiology Textbook — 643 entries from 28 chapters

Selected chapters from **OpenStax Anatomy & Physiology** (1st edition, CC BY 4.0), covering the same foundational science as NTA's assigned A&P text. Key systems indexed in depth: digestive, endocrine, immune, cardiovascular, respiratory, urinary, reproductive, plus metabolism, blood, and electrolyte balance. Every chapter has at least breadcrumb coverage. Each citation links to the exact section on openstax.org.

## How It Works

1. **You ask a question** — type or tap the microphone to use voice-to-text.

2. **The bot searches its knowledge base** — it uses AI-powered semantic search to find the most relevant content across all three source categories. It understands the *meaning* of your question, not just keywords — so "how does sugar affect the brain" finds content about dopamine pathways even if those exact words weren't used. A reranking step then scores results for relevance and ensures source diversity.

3. **AI writes the answer** — OpenAI's GPT-5.4 synthesizes a clear, well-formatted answer using only the retrieved content. Answers include bold terms, bulleted lists, and short paragraphs for easy scanning. Every answer includes collapsible source cards you can expand to view the original text and click through to the source.

## Features

| Feature | Description |
|---------|-------------|
| **Cited Sources** | Every answer includes collapsible source cards grouped by document. Expand to see individual sections, view source text, or click through to NTA's website, Apple Podcasts, or OpenStax. |
| **Rich Formatting** | Answers use bold, italics, and lists for easy scanning — not walls of text. |
| **Voice Input** | Tap the microphone to speak your question instead of typing. |
| **Read Aloud** | Tap the speaker icon on any answer to hear it read back to you. |
| **Confidence Indicators** | Each answer shows High, Medium, or Low confidence so you know how well the knowledge base covered your question. |
| **Mobile Friendly** | Works on phone, tablet, and desktop — no app install needed. |

## Analytics Dashboard

NTA Bot includes an analytics dashboard for the content team to spot opportunities for new episodes and curriculum development.

**Access it** via the bar chart icon in the top-right corner, or go directly to the [dashboard URL](https://grysngrhm-tech.github.io/nta-bot/dashboard.html).

The dashboard shows:

- **Topic Demand vs Coverage** — what are people asking about, and how well is it covered?
- **Trending Topics** — what's new this week?
- **Source Usage** — which documents, episodes, and textbook chapters are cited most?
- **Session Replay** — multi-question research journeys with device info and topic progression
- **Searchable Question Table** — every question asked, sortable by time, topic, confidence, and location

The dashboard doesn't require a password — it only shows question analytics, not curriculum content.

## How to Access

| | |
|---|---|
| **URL** | [grysngrhm-tech.github.io/nta-bot/](https://grysngrhm-tech.github.io/nta-bot/) |
| **Password** | Provided by your NTA administrator |
| **Dashboard** | [grysngrhm-tech.github.io/nta-bot/dashboard.html](https://grysngrhm-tech.github.io/nta-bot/dashboard.html) |
| **Browsers** | Chrome, Safari, Edge, Firefox |
| **Devices** | Phone, tablet, desktop — no app install required |

## Feedback & Contact

NTA Bot is actively maintained. The knowledge base can be expanded with new curriculum materials, podcast episodes, or textbook chapters at any time.

For feedback, feature requests, or bug reports, contact **Grayson Graham**.

## How It's Built

NTA Bot is a Retrieval-Augmented Generation (RAG) application. Content from NTA's curriculum, podcast, and OpenStax A&P textbook (CC BY 4.0) is stored as 3072-dimensional AI embeddings with contextual retrieval prefixes. Each question triggers a hybrid vector + full-text search, followed by GPT-5.4 Mini relevance reranking and source diversity enforcement. The top results are passed to GPT-5.4 Standard, which synthesizes a formatted, source-grounded answer.

Designed and built by **Grayson Graham**.
