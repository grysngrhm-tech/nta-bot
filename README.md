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

NTA Bot is an AI knowledge assistant built for NTA employees. It gives staff instant access to the full depth of NTA's curriculum, reference textbooks, and supplementary content — without needing to search through lecture recordings, PDF transcripts, or scattered reference materials.

The problem it solves: NTA's teaching materials span thousands of pages across multiple programs (NTP, PHWC, FOH), five assigned textbooks, 86 podcast episodes, and dozens of reference documents. Finding a specific piece of information — how the curriculum explains blood sugar regulation, what an NTP can and can't do with lab results, what Dr. Gaby recommends for a specific condition — means knowing which source to look in and where. NTA Bot makes all of that searchable from one place.

Every answer is grounded exclusively in NTA's own materials. The bot doesn't use the open internet or generate from its training data. It searches a curated knowledge base of over 6,300 entries, synthesizes what it finds into a clear response, and cites every source so the user can verify exactly where the information came from. If the knowledge base doesn't have an answer, the bot says so rather than guessing.

The bot is password-protected and intended for internal use by NTA staff.

## What Can You Ask?

- "Explain the north-to-south digestive process as taught in the NTP curriculum"
- "What's the difference in scope between an NTP and a PHWC?"
- "What are the signs and symptoms of magnesium deficiency?"
- "How does nutrition affect thyroid function?"
- "What coaching techniques does the PHWC program teach for building client trust?"
- "What does Dr. Gaby's Nutritional Medicine say about nutritional treatments for migraines?"

## Under the Hood

NTA Bot uses **Retrieval-Augmented Generation (RAG)** — instead of relying on what an AI memorized during training, it searches a curated knowledge base for every question, reranks results with a curriculum-priority boost, enforces source diversity across content types, and synthesizes the top 10 matches into a clear answer. Every answer includes collapsible source cards grouped by category (Curriculum, Textbook, NIH, Podcast) so you can verify where the information came from.

The knowledge base contains **6,387 curated entries** from 5 source categories:

```
Curriculum  ████████████████████████████░░░░░░░░░░░░░░  1,777  (28%)
Textbooks   ████████████████████████████████████████████  2,832  (44%)
Podcast     ███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░    990  (15%)
NIH ODS     ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    672  (11%)
NTA Ref     ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    116   (2%)
```

- **Curriculum** — Complete NTP, PHWC, and FOH lecture transcripts, GPT-extracted to preserve NTA's teaching voice
- **Textbooks** — Four books assembled to cover the scope of NTA's assigned textbooks, including a 1,420-entry clinical reference (Dr. Gaby)
- **Podcast** — 86 episodes distilled into educational reference entries
- **NIH ODS** — 28 peer-reviewed fact sheets on every vitamin and mineral
- **NTA Reference** — Scope of practice, programs, philosophy, and terminology

For deeper technical and content documentation:

| Document | What it covers |
|----------|----------------|
| **[TECHNICAL.md](TECHNICAL.md)** | System architecture, RAG pipeline, embedding strategy, reranking, diversity enforcement, and the reasoning behind each design decision |
| **[KNOWLEDGE-BASE.md](KNOWLEDGE-BASE.md)** | Complete content inventory — what's included, what's excluded, how free sources were mapped to NTA's copyrighted textbooks, and licensing |

## Features

| Feature | Description |
|---------|-------------|
| **Cited Sources** | Category-grouped source cards with authority badges. Expand to view source text or click through to the original. |
| **Rich Formatting** | Answers use bold, italics, and lists for easy scanning. |
| **Voice Input** | Tap the microphone to speak your question. |
| **Read Aloud** | Tap the speaker icon to hear any answer read back. |
| **Confidence Indicators** | High, Medium, or Low confidence so you know how well the knowledge base covered your question. |
| **Analytics Dashboard** | Topic demand vs coverage, trending topics, source usage, and a searchable question feed. |
| **Mobile Friendly** | Works on phone, tablet, and desktop — no install needed. |

## How to Access

| | |
|---|---|
| **URL** | [grysngrhm-tech.github.io/nta-bot/](https://grysngrhm-tech.github.io/nta-bot/) |
| **Password** | Provided by your NTA administrator |
| **Dashboard** | [grysngrhm-tech.github.io/nta-bot/dashboard.html](https://grysngrhm-tech.github.io/nta-bot/dashboard.html) |
| **Browsers** | Chrome, Safari, Edge, Firefox |

## Feedback & Contact

NTA Bot is actively maintained. The knowledge base can be expanded with new curriculum materials, podcast episodes, or reference content at any time.

For feedback, feature requests, or bug reports, contact **Grayson Graham**.

---

<p align="center"><sub>Designed and built by Grayson Graham</sub></p>
