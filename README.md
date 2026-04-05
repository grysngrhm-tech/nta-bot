<p align="center">
  <img src="assets/icons/nta-logo.svg" alt="Nutritional Therapy Association" width="280">
</p>

<h1 align="center">NTA Bot</h1>

<p align="center">
  Your AI-powered curriculum reference tool<br>
  <a href="https://grysngrhm-tech.github.io/nta-bot/">Open NTA Bot</a>
</p>

---

## What is NTA Bot?

NTA Bot is an AI assistant built exclusively for NTA employees. It answers questions about NTA curriculum, programs, scope of practice, clinical tools, and more — drawing only from NTA's own published content.

Unlike general AI tools like ChatGPT, NTA Bot doesn't use the open internet or make things up. Every answer is grounded in NTA's actual materials, and every response includes clickable source citations so you can verify where the information came from.

The bot is password-protected and intended for internal use by NTA staff.

## What Can You Ask?

NTA Bot handles a wide range of questions about NTA's curriculum and programs. Here are some examples:

**Curriculum & Foundations**
- "What are the Five Foundations of Health?"
- "How does the north-to-south digestive process work?"
- "What does the PHWC curriculum cover in Month 4?"

**Programs & Credentials**
- "What's the difference between an NTP and a PHWC?"
- "What is Lingual-Neural Testing and who can perform it?"
- "What are the requirements for NBHWC board certification?"

**Scope of Practice**
- "Can an NTP diagnose or treat disease?"
- "Why can a PHWC not make food recommendations?"
- "What can an FNTP do that an NTP cannot?"

**Clinical Tools**
- "What is the NACA process?"
- "How does the Symptom Burden Graph help identify client priorities?"
- "What functional lab tests are covered in the NTP curriculum?"

**Health & Wellness Topics (from the podcast)**
- "How does blood sugar regulation affect sleep?"
- "What is SIBO and what are its root causes?"
- "How do seed oils contribute to sunburn susceptibility?"

## Knowledge Base

NTA Bot's answers come from two categories of NTA-owned content:

### Website Reference Content — 187 entries

Comprehensive reference material created from NTA's public website, covering:

- **Scope of Practice** — detailed boundaries for NTP, FNTP, and PHWC practitioners, including what each credential holder can and cannot do
- **NTP Curriculum** — all 15 modules, the Five Foundations of Health, clinical tools (NAQ, NACA process, Nutri-Q, functional labs), and program structure
- **PHWC Curriculum** — the five coaching foundations, month-by-month curriculum breakdown, motivational interviewing, behavior change psychology, and the Health and Wellness Wheel
- **Programs & Credentials** — all NTA programs compared side-by-side (NTP, PHWC, FCA, Foundations of Healing, Career Compass, NTA Health), including costs, duration, prerequisites, and the Graham Grant
- **NTA Philosophy & Terminology** — bio-individuality, innate intelligence, food-first approach, root-cause thinking, NTA history, accreditation, leadership, and a complete terminology glossary

### Podcast Content — 990 entries from 86 episodes

All 86 episodes of the **Nutritional Therapy and Wellness Podcast** have been transcribed and processed to extract factual, educational content organized by topic:

- Digestion & Gut Health
- Blood Sugar & Metabolism
- Sleep & Stress Management
- Hormones & Endocrine Health
- Mental Health & Brain Function
- Fertility & Reproductive Health
- Food Quality, Sourcing & Traditional Preparation
- Supplements & Nutrients
- Practitioner Development
- NTA Philosophy & Mission
- And more

When the bot cites a podcast episode, it includes a **"Listen on Apple Podcasts"** link that takes you directly to that specific episode.

## How It Works

1. **You ask a question** — type it in, or tap the microphone icon to speak your question using voice-to-text.

2. **The bot searches its knowledge base** — it finds the most relevant content from NTA's curriculum materials and podcast episodes using AI-powered semantic search. This means it understands the *meaning* of your question, not just the keywords — so asking "how does sugar affect the brain" will find content about dopamine reward pathways even if those exact words weren't used.

3. **AI writes the answer** — using only the retrieved NTA content, the bot synthesizes a clear, comprehensive answer. It never makes things up. Every answer includes source citations you can click to verify or read more.

The bot uses the same AI technology behind ChatGPT (OpenAI's GPT-4o), but it's constrained to answer only from NTA's own materials.

## Features

| Feature | Description |
|---------|-------------|
| **Cited Sources** | Every answer shows which documents or episodes it drew from. Web sources link to nutritionaltherapy.com. Podcast sources link to Apple Podcasts. |
| **Voice Input** | Tap the microphone icon to speak your question instead of typing. |
| **Read Aloud** | Tap the speaker icon on any answer to hear it read back to you. |
| **New Conversation** | Tap the pencil icon in the input bar to start a fresh conversation. |
| **Mobile Friendly** | Works on phone, tablet, and desktop — no app install needed. |
| **Confidence Indicators** | Each answer shows a confidence level (High, Medium, or Low) so you know how well the knowledge base covered your question. |

## Analytics Dashboard

NTA Bot includes an analytics dashboard designed to help the content team — especially Jamie and the podcast team — spot opportunities for new episodes and curriculum development.

**Access it** by tapping the small bar chart icon in the top-right corner of the main page, or go directly to the dashboard URL.

The dashboard shows:

- **Topic Demand vs Coverage** — which topics are people asking about, and how well does our content cover them?
- **Trending Topics** — what's being asked about this week that wasn't asked about last week?
- **Source Usage** — which documents and podcast episodes are cited most? Which are never cited?
- **Session Replay** — see multi-question research journeys, including user device info and topic progression
- **Searchable Question Table** — every question asked, sortable by time, topic, confidence, and location

The dashboard doesn't require a password — it only displays question analytics, not curriculum content.

## How to Access

| | |
|---|---|
| **URL** | [grysngrhm-tech.github.io/nta-bot/](https://grysngrhm-tech.github.io/nta-bot/) |
| **Password** | `Graham` (case-sensitive) |
| **Dashboard** | [grysngrhm-tech.github.io/nta-bot/dashboard.html](https://grysngrhm-tech.github.io/nta-bot/dashboard.html) |
| **Browsers** | Chrome, Safari, Edge, Firefox |
| **Devices** | Phone, tablet, desktop — no app install required |

## Feedback & Contact

NTA Bot is actively maintained and the knowledge base can be expanded at any time with additional curriculum materials, new podcast episodes, or other NTA content.

For feedback, feature requests, bug reports, or content suggestions, contact **Grayson Graham**.

## How It's Built

NTA Bot is a Retrieval-Augmented Generation (RAG) application. It stores NTA content as searchable AI embeddings, retrieves the most relevant pieces for each question, and uses OpenAI's GPT-4o to synthesize answers from those specific sources — ensuring every response is grounded in NTA's own materials rather than general internet knowledge.

Designed and built by **Grayson Graham**.
