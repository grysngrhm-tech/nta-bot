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

NTA Bot searches across **1,820 curated entries** from three source categories. None of this content is scraped or dumped in raw — each source goes through a processing pipeline that breaks it into focused, searchable chunks and tags it with metadata so the bot knows where every piece of information came from.

### NTA Curriculum & Reference — 187 entries

Content from NTA's website — scope of practice, the NTP and PHWC programs, credentials, philosophy, and terminology — manually structured into reference documents, then split at section boundaries so each chunk covers one focused topic. Each entry links back to nutritionaltherapy.com.

### Podcast Library — 990 entries from 86 episodes

Every episode of the **Nutritional Therapy and Wellness Podcast** was transcribed using OpenAI's Whisper speech-to-text model, then processed through GPT-4o to extract factual, educational content — not raw transcripts with filler and chitchat, but distilled reference entries organized by topic (digestion, blood sugar, hormones, fertility, mental health, supplements, and more). Each citation links directly to the episode on Apple Podcasts.

### Anatomy & Physiology Textbook — 643 entries from 28 chapters

Selected chapters from **OpenStax Anatomy & Physiology** (1st edition, CC BY 4.0), the same foundational science as NTA's assigned A&P text. The textbook content was sourced from an open-source markdown port, programmatically cleaned to remove review questions and pedagogical filler, then chunked at section boundaries. Key systems are indexed in depth: digestive, endocrine, immune, cardiovascular, respiratory, urinary, reproductive, plus metabolism, blood, and electrolyte balance. Every chapter has at least breadcrumb coverage so the bot can point you in the right direction. Each citation links to the exact section on openstax.org.

## How It Works

NTA Bot uses a technique called **Retrieval-Augmented Generation (RAG)** — instead of relying on what an AI model memorized during training, it *searches* a curated knowledge base for every question and builds the answer from what it finds. This means the bot only says things it can trace back to a specific source, and it can be updated with new content at any time without retraining anything.

Here's what happens when you ask a question:

### 1. You ask a question

Type it in, or tap the microphone to use voice-to-text.

### 2. Your question is converted into a vector

Before the bot can search, it needs to translate your question into something a computer can compare against its knowledge base. It does this using an **embedding model** — an AI that reads your question and converts it into a list of 3,072 numbers (called a *vector*) that represent the meaning of what you asked. Think of it like coordinates on a map: questions that mean similar things end up near each other in this mathematical space.

Every chunk in the knowledge base has already been converted into the same kind of vector when it was first loaded. So searching becomes a matter of finding which chunks are "closest" to your question in meaning-space — not just matching keywords, but understanding that "how does sugar affect the brain" is conceptually close to content about dopamine reward pathways even if those exact words never appear.

### 3. The bot searches and ranks results

The bot runs a **hybrid search** that combines vector similarity (meaning-based) with traditional keyword matching, pulling 30 candidate chunks from across all three source categories. Then a second AI model (GPT-5.4 Mini) **reranks** those 30 candidates by reading each one and scoring how well it actually answers your specific question. A diversity step ensures the final results include content from different source types (curriculum, podcast, textbook) when relevant — so you're not just getting 8 podcast results when a textbook chapter has the definitive answer.

### 4. AI writes the answer

The top 8 ranked chunks are passed to **GPT-5.4**, which reads them all and synthesizes a clear, well-formatted answer. The model is instructed to answer only from the retrieved content — never from its own training knowledge — and to write in a direct, scannable style with bold terms, lists, and short paragraphs. Every answer includes collapsible source cards you can expand to view the original text or click through to the source.

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

## Technical Architecture

NTA Bot is a single-page web app hosted on GitHub Pages. There's no backend server — just static HTML/CSS/JS that talks to two cloud services:

- **n8n** (workflow automation) — handles the RAG pipeline: receives questions, orchestrates the search and AI calls, returns structured JSON responses
- **Supabase** (PostgreSQL database) — stores all 1,820 knowledge chunks with their vector embeddings, runs the hybrid search, and logs analytics

The AI models are accessed via OpenAI's API: **GPT-5.4 Standard** for writing answers, **GPT-5.4 Mini** for reranking search results, and **text-embedding-3-large** for converting text into searchable vectors. The textbook content is from OpenStax Anatomy & Physiology, used under a CC BY 4.0 license.

Every chunk in the knowledge base has a **contextual retrieval prefix** — a short AI-generated sentence that describes what the chunk covers and where it fits in its parent document. This helps the search engine understand chunks that would be ambiguous in isolation.

Designed and built by **Grayson Graham**.
