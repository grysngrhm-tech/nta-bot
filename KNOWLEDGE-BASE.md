# NTA Bot — Knowledge Base

> Detailed inventory of all content sources, what was included, what was excluded, and why.
> For how the knowledge base is searched and used, see [TECHNICAL.md](TECHNICAL.md). For a general overview, see [README.md](README.md).

## Overview

NTA Bot's knowledge base contains **6,387 curated entries** across 5 content types, sourced from NTA's own curriculum, four reference textbooks, government health references, 86 podcast episodes, and NTA's website.

| Content Type | Entries | Sources |
|-------------|---------|---------|
| [Curriculum](#nta-curriculum--1777-entries) | 1,777 | NTP, PHWC, FOH lecture transcripts |
| [Textbooks](#textbooks--2832-entries) | 2,832 | 4 books (3 open-licensed + 1 proprietary) |
| [NIH Reference](#nih-office-of-dietary-supplements--672-entries) | 672 | 28 Health Professional fact sheets |
| [Podcast](#podcast-library--990-entries) | 990 | 86 episodes |
| [NTA Reference](#nta-reference--116-entries) | 116 | Website content, scope docs, guides |

### Content Distribution

```
Curriculum  ████████████████████████████░░░░░░░░░░░░░░  1,777  (28%)
Textbooks   ████████████████████████████████████████████  2,832  (44%)
Podcast     ███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░    990  (15%)
NIH ODS     ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    672  (11%)
NTA Ref     ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    116   (2%)
```

### Quality Metrics

- **100%** of chunks have contextual retrieval prefixes (AI-generated structural context)
- **Chunk size:** Median **267 tokens**, mean **659 tokens**. The gap reflects intentional design — curriculum and podcast entries are GPT-extracted into focused ~200-token reference entries, while textbook chunks retain longer ~1,200-token sections for biochemical depth.
- **Embedding model:** text-embedding-3-large at native 3,072 dimensions (no truncation)
- **Source URL coverage:** All textbook, NIH, and podcast chunks link to their original source. Curriculum chunks have no external URL (proprietary content).

---

## NTA Curriculum — 1,777 entries

The core of the knowledge base. These are NTA's own words — complete lecture transcripts from all three programs, processed through GPT-4o-mini to extract educational content while preserving NTA's teaching voice, terminology, and direct quotes.

### Extraction Method

Lecture transcript PDFs are too conversational for direct chunking (full of "welcome back," "let's look at the next slide," and repeated explanations). Instead, each transcript is:

1. Extracted from PDF via PyPDF2
2. Split into segments of ~50K characters at video boundaries
3. Sent to GPT-4o-mini with an extraction prompt that instructs it to produce standalone reference entries preserving NTA's exact phrasing
4. Each entry becomes one chunk with title, week/video reference, and 3-8 sentences of educational content

### NTP Program — 1,005 entries from 16 modules

| Module | Chunks | Topics Covered |
|--------|--------|----------------|
| Digestion | 245 | North-to-south process, HCl, bile, enzymes, gut health, microbiome, leaky gut |
| Blood Sugar Regulation | 136 | Insulin, glucagon, cortisol, carbohydrate metabolism, diabetes, hypoglycemia |
| Bioindividual Nutrition | 92 | Bio-individuality, metabolic typing, traditional diets, Weston Price foundations |
| Supplements | 92 | Supplement quality, whole-food supplements, targeted supplementation, dosing |
| Nutrient-Dense Diet | 80 | Food quality, sourcing, preparation, fats, proteins, carbohydrates |
| Stress Management | 60 | HPA axis, cortisol, adrenal function, nervous system, lifestyle strategies |
| Case Study Intensive | 55 | Client scenarios, NACA application, clinical reasoning |
| NACA Unit 10 | 48 | Thyroid case study, Hashimoto's, full clinical application |
| Foundations Review & Practicum | 46 | Integration of all five foundations, practicum preparation |
| Anatomy & Physiology | 44 | Body systems overview, cellular biology, homeostasis |
| Sleep | 37 | Circadian rhythm, melatonin, sleep hygiene, physiological recovery |
| Lab Interpretation | 31 | Functional lab ranges, blood chemistry, metabolic markers |
| NACA Units 6-9 | 39 | Progressive clinical application across multiple case types |

### PHWC Program — 531 entries from 81 video transcripts

Covers Weeks 1-29 of the coaching program: client-centered relationships, trust and rapport, motivational interviewing, coaching skills, behavior change frameworks, scope of practice, ethics, powerful questions, goal setting, wellness wheel, and practicum.

**Note:** 4 video transcripts (W10V1, W11V1, W3V2, W9V1) failed text extraction — these are scanned image PDFs that require OCR tooling not currently available.

### FOH Program — 207 entries from 31 transcripts

Foundations of Healing (consumer-facing program) covering the Five Foundations at an accessible level:

| Module | Chunks |
|--------|--------|
| Nutrient-Dense Diet | 59 |
| Stress Management | 39 |
| Digestion | 33 |
| Blood Sugar Regulation | 33 |
| Sleep | 31 |
| Connecting the Foundations | 12 |

### What Was Excluded from Curriculum

- Pure navigational filler ("welcome back," "let's move on," "in our next video")
- Repeated content that adds nothing beyond what's already captured
- "Take a moment to reflect" prompts without educational substance
- Copyright notices and slide numbers

---

## Textbooks — 2,832 entries

### The Mapping Strategy

NTA's curriculum assigns two core science textbooks that are commercially copyrighted:

1. **Introduction to the Human Body** by Tortora & Derrickson (11th ed) — Anatomy & Physiology
2. **Advanced Human Nutrition** by Medeiros & Wildman (4th ed) — Nutritional biochemistry

Neither can be directly included in a RAG database. The knowledge base assembles equivalent coverage from free and licensed sources:

### Replacing Tortora — OpenStax A&P (643 entries)

**OpenStax Anatomy & Physiology, 1st edition** (CC BY 4.0). A standard college A&P textbook covering the same science as Tortora. The 1st edition was chosen because its content is identical to the 2nd in all areas relevant to NTA's curriculum — the 2e revisions were equity and inclusion language updates, not science changes.

**Content sourced from:** philschatz/anatomy-book GitHub repo (markdown port)
**Source URLs point to:** openstax.org chapter pages

**Coverage tiers:**
| Tier | Chapters | Depth |
|------|----------|-------|
| 1 (full) | 15 (ANS), 17 (Endocrine), 18 (Blood), 21 (Immune), 23 (Digestive), 24 (Metabolism), 26 (Fluid/Electrolyte) | Complete section-by-section indexing |
| 2 (selective) | 2, 3, 12, 19, 20, 22, 25, 27, 28 | Key sections selected |
| 3 (very selective) | 1, 4, 5, 10 | 1-2 core sections |
| 4 (breadcrumb) | 6, 7, 8, 9, 11, 13, 14, 16 | Minimal coverage for directional answers |

**What was excluded:** Learning objectives, review questions, glossary terms, exercise blocks, figure captions without educational content.

### Replacing Medeiros & Wildman — Three Complementary Sources

No single free textbook matches *Advanced Human Nutrition* at its depth level. Coverage was assembled from three sources:

#### Georgia Highlands College "Principles of Nutrition" (379 entries)

**3rd edition** by Jellum, Hitzeman et al. (CC BY-SA 4.0). All 20 chapters covering:

- Macronutrient structures and chemistry (carbohydrates, lipids, proteins)
- Macronutrient digestion, absorption, and transport
- Common digestive problems
- Macronutrient and alcohol metabolism (glycolysis, beta-oxidation, TCA cycle, gluconeogenesis, ketogenesis)
- Metabolic integration
- Micronutrients organized by metabolic function (antioxidant, energy metabolism, one-carbon metabolism, blood/bones/teeth, electrolyte)
- Lifespan nutrition (pregnancy, infancy, childhood, adolescence, aging)
- Nutrition and fitness
- Diet and chronic disease prevention
- Nutrition and society

**Content sourced from:** Individual chapter PDFs from GALILEO Open Learning repository
**Source URLs point to:** med.libretexts.org (web-hosted Zimmerman/Snow source textbook)
**What was excluded:** Learning objectives, review questions, figure captions

#### NIH Office of Dietary Supplements (672 entries)

Covers the vitamin and mineral chapters in more clinical detail than Medeiros & Wildman itself. See [NIH section below](#nih-office-of-dietary-supplements--672-entries).

#### OpenStax Nutrition for Nurses (405 entries)

Fills a gap neither NTA textbook covers deeply: **clinical nutrition organized by body system**.

**1st edition** (CC BY 4.0, published March 2024). All 20 chapters covering how nutrition impacts: neurological, endocrine, hematologic, cardiovascular, pulmonary, renal, gastrointestinal, and musculoskeletal systems. Each body system pair includes nutrition impact assessment, nutritional strategies, lifespan considerations, chronic illness connections, and nutrient-drug interactions.

**Content sourced from:** Scraped directly from openstax.org HTML pages
**Source URLs point to:** openstax.org section pages

**What was excluded:** Nursing-specific clinical procedures — care planning, compliance evaluation, nursing assessment frameworks, NCSBN Clinical Judgment Model. Only nutritional science content was retained.

### Separate Clinical Reference — Dr. Gaby (1,420 entries)

**Nutritional Medicine, 2nd Edition** by Alan R. Gaby, M.D. This is NOT a replacement for either core textbook — it's a separate clinical reference that NTA assigns for evidence-based nutritional treatment protocols.

Covers 300+ medical conditions organized across 28 parts by body system, from Fundamentals and Vitamins/Minerals through Cardiovascular Disease, Gastroenterology, Neurology, Psychiatry, Endocrine Disorders, and Drug-Nutrient Interactions.

**Commercially published and proprietary.** Source material is never included in the public repository.
**Source URL:** https://doctorgaby.com/the-book/

### Other NTA-Assigned Textbooks (Not Ingested)

NTA's curriculum assigns three additional textbooks that are NOT represented as separate textbook content in the knowledge base:

- **Signs and Symptoms Analysis from a Functional Perspective** (Dicken Weatherby) — Proprietary functional assessment methodology. Covered through NTP curriculum transcripts.
- **Motivational Interviewing in Nutrition and Fitness** — Coaching methodology. Covered through PHWC curriculum transcripts.
- **The PEACE Process** — NTA's proprietary coaching framework. Covered through PHWC curriculum transcripts.

---

## NIH Office of Dietary Supplements — 672 entries

Peer-reviewed Health Professional fact sheets from the NIH Office of Dietary Supplements — the U.S. government's authoritative source on dietary supplement science. These provide deeper coverage of individual nutrient biochemistry than any single textbook, with evidence-based data on functions, deficiency, toxicity, and drug interactions.

In addition to standing on their own as a reference source, these fact sheets also serve as part of the [textbook replacement strategy](#replacing-medeiros--wildman--three-complementary-sources) for the vitamin and mineral chapters of NTA's assigned *Advanced Human Nutrition* textbook.

**License:** Public domain (U.S. federal government publication — no restrictions).

### Nutrients Covered

**Vitamins (13):** Vitamin A, Thiamin (B1), Riboflavin (B2), Niacin (B3), Pantothenic Acid (B5), Vitamin B6, Biotin (B7), Folate (B9), Vitamin B12, Vitamin C, Vitamin D, Vitamin E, Vitamin K

**Minerals (13):** Calcium, Chromium, Copper, Iodine, Iron, Magnesium, Manganese, Molybdenum, Phosphorus, Potassium, Selenium, Zinc, Boron

**Other (2):** Choline, Omega-3 Fatty Acids

### What's Included Per Nutrient

Each fact sheet is chunked at the H2/H3 section level, preserving all substantive content:

- Introduction and biochemical function
- Assessing status (biomarkers)
- Recommended intakes (RDA/AI tables converted to prose)
- Food sources (with amounts and bioavailability notes)
- Supplement forms
- Population intake and status data
- Deficiency signs, symptoms, and causes
- Groups at risk of inadequacy
- Health condition connections (each disease/condition as its own chunk)
- Toxicity and upper limits
- Drug interactions
- Healthful diets context

**What was excluded:** References/bibliography, disclaimer boilerplate, navigation elements.

---

## Podcast Library — 990 entries

All 86 episodes of the NTA **Nutritional Therapy and Wellness Podcast**, from Ep. 000 (Introduction) through Ep. 085 (Sugar, Sugar).

### Processing Pipeline

1. MP3s downloaded from RSS feed (Libsyn-hosted)
2. Compressed to mono 16kHz
3. Transcribed via OpenAI Whisper API
4. Processed through GPT-4o to extract factual, educational content

Each extraction produces a self-contained reference entry with topic category and timestamp — not a raw transcript with filler, banter, and sponsor reads.

### Topic Categories

Digestion, Blood Sugar Regulation, Sleep, Stress Management, Nutrient-Dense Diet, Bio-Individuality, Supplements & Nutrients, Gut Health & Microbiome, Hormones & Endocrine, Mental Health & Brain, Fertility & Reproductive Health, Food Quality & Sourcing, Traditional Food Preparation, Inflammation, Immune Function, Hydration, Practitioner Development, NTA Philosophy & Mission, Client Work & Assessment, Scope of Practice, General Wellness, and others.

**What was excluded:** Intros/outros, sponsor reads, self-promotion, personal anecdotes without transferable content, jokes, banter, repetition, vague motivational statements.

---

## NTA Reference — 116 entries

Website content manually structured into reference documents:

| Document | Entries |
|----------|---------|
| Scope of Practice Reference — NTP, FNTP & PHWC | 24 |
| NTP Curriculum Deep Dive — Five Foundations & Clinical Application | 45 |
| NTA Programs and Credentials Guide | 36 |
| PHWC Curriculum Deep Dive — Coaching Foundations & Behavior Change | 34 |
| NTA Philosophy and Terminology Reference | 48 |
| Free Consumer Guides (Healthy Fats, Digestion, Herbal Recipes) | 8 |

---

## Supplement Product Catalog — 664 entries

Separate from the RAG knowledge base, NTA Bot maintains a product catalog used for [Fullscript protocol cards](TECHNICAL.md#supplement-protocol-cards-fullscript-integration). When the bot's answer mentions supplements, each is matched against this catalog to provide clickable product links and expandable product details.

| Brand | Products | Notes |
|-------|----------|-------|
| Standard Process | 249 | Whole-food supplements, glandulars, PMGs |
| Biotics Research | 224 | Clinical formulas, emulsified nutrients |
| Gaia Herbs | 48 | Herbal extracts, adaptogens |
| Nordic Naturals | 42 | Omega-3 specialist |
| Integrative Therapeutics | 42 | GI support, specialty formulas |
| Thorne | 38 | Methylated B vitamins, foundational |
| Vital Proteins | 16 | Collagen peptides |
| Manual essentials | 15 | Top supplements with curated aliases |

Each entry includes product name, brand, Fullscript URL, description, supplement facts, suggested use, ingredients, allergen info, and warnings — all scraped from Fullscript's public catalog. This data is NOT part of the RAG retrieval pipeline — it is only used for post-answer product matching.

---

## Licensing Summary

| Source | License | Restrictions |
|--------|---------|-------------|
| NTA Curriculum | Proprietary | Source PDFs gitignored. Extracted chunks in Supabase only. |
| OpenStax A&P | CC BY 4.0 | Attribution required. |
| GHC Principles of Nutrition | CC BY-SA 4.0 | Attribution + ShareAlike required. |
| OpenStax Nutrition for Nurses | CC BY 4.0 | Attribution required. |
| Dr. Gaby Nutritional Medicine | Proprietary | Source PDF gitignored. Never in public repo. |
| NIH ODS | Public Domain | No restrictions. U.S. federal government publication. |
| NTA Podcast | NTA copyright | Extracted educational content, not full transcripts. |
| NTA Website | NTA copyright | Structured reference docs, not wholesale scraping. |

---

*For how this content is searched and ranked, see [TECHNICAL.md](TECHNICAL.md).*
*For general overview, see [README.md](README.md).*
