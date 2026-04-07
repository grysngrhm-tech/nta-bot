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

NTA Bot uses **Retrieval-Augmented Generation (RAG)** — instead of relying on what an AI memorized during training, it [searches](TECHNICAL.md#2-hybrid-search) a curated knowledge base for every question, [reranks results](TECHNICAL.md#3-llm-reranking) with a curriculum-priority boost, enforces [source diversity](TECHNICAL.md#4-diversity-enforcement) across content types, and synthesizes the top 10 matches into a clear answer. The full [technical architecture](TECHNICAL.md) covers the complete pipeline and the reasoning behind each design decision.

The [knowledge base](KNOWLEDGE-BASE.md) contains **6,387 curated entries** from 5 source categories:

```
Curriculum  ████████████████████████████░░░░░░░░░░░░░░  1,777  (28%)
Textbooks   ████████████████████████████████████████████  2,832  (44%)
Podcast     ███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░    990  (15%)
NIH ODS     ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    672  (11%)
NTA Ref     ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    116   (2%)
```

- **[Curriculum](KNOWLEDGE-BASE.md#nta-curriculum--1777-entries)** — Complete NTP, PHWC, and FOH lecture transcripts, GPT-extracted to preserve NTA's teaching voice
- **Textbooks** — Four books [assembled from free sources](KNOWLEDGE-BASE.md#the-mapping-strategy) to cover the scope of NTA's assigned textbooks, plus [Dr. Gaby's Nutritional Medicine](KNOWLEDGE-BASE.md#separate-clinical-reference--dr-gaby-1420-entries) (1,420 entries)
- **[Podcast](KNOWLEDGE-BASE.md#podcast-library--990-entries)** — 86 episodes distilled into educational reference entries
- **[NIH ODS](KNOWLEDGE-BASE.md#nih-office-of-dietary-supplements--672-entries)** — 28 peer-reviewed fact sheets on every vitamin and mineral
- **[NTA Reference](KNOWLEDGE-BASE.md#nta-reference--116-entries)** — Scope of practice, programs, philosophy, and terminology

## Features

**Answers**
- **Cited sources** — Every answer includes collapsible [source cards grouped by category](TECHNICAL.md#source-card-system) (Curriculum, Textbook, NIH, Podcast, Web) with authority badges. Expand to view the original chunk text or click through to the source.
- **Rich formatting** — Bold key terms, italics for emphasis, bullet lists for scannability. No walls of text.
- **Confidence indicators** — High, Medium, or Low confidence on each answer so you know how well the knowledge base covered your question.
- **[Curriculum priority](TECHNICAL.md#3-llm-reranking)** — When NTA's own curriculum and an external source both cover a topic, the curriculum is silently preferred. The answer reads as one coherent piece, not broken up by source.

**Interaction**
- **Voice input** — Tap the microphone to speak your question instead of typing.
- **Read aloud** — Tap the speaker icon on any answer to hear it read back via text-to-speech.
- **Conversation memory** — Follow-up questions within a session are context-aware.
- **Sample questions** — 160 curated questions across 4 categories refresh on each visit to help new users explore.

**Analytics & Monitoring**
- **[Analytics dashboard](https://grysngrhm-tech.github.io/nta-bot/dashboard.html)** — [Topic demand vs coverage](TECHNICAL.md#dashboard-metrics), trending topics, source usage rankings, session replay, and a searchable question feed.
- **[Content gap detection](TECHNICAL.md#dashboard-metrics)** — Identifies high-demand topics with low knowledge base coverage, signaling opportunities for new curriculum content or podcast episodes.

**Platform**
- **Mobile friendly** — Works on phone, tablet, and desktop. No app install needed.
- **[Offline capable](TECHNICAL.md#pwa--offline)** — Service worker caches the app for offline access.
- **No build step** — [Single HTML file](TECHNICAL.md#single-file-design), deploys instantly on push to GitHub Pages.

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
