# NTA Bot — Document Ingestion Process

This is not a script. It's a procedure for Claude Code to follow when ingesting
a reference document into the NTA Bot knowledge base.

## Prerequisites
- Supabase MCP connected (project `wdouifomlipmlsksczsv`)
- OpenAI API key available (for embedding generation via curl)
- Document in structured markdown format (see below)

## Document Format

Reference documents live in `docs/` and use this structure:

```markdown
---
document_name: Human-readable document title
document_type: ntp_curriculum | phwc_curriculum | scope_of_practice | reference
version: "1.0"
---

## Major Section Name
<!-- source_url: https://www.nutritionaltherapy.com/relevant-page -->

### Subsection Title

Body text here. Each H3 subsection becomes one chunk.
Keep subsections between 200-600 tokens for optimal retrieval.

### Another Subsection

More content. The source_url comment above applies to all
subsections under its H2 parent until a new source_url appears.
```

### Format Rules
- **H2** (`##`) = major section → stored in `section_hierarchy[]`
- **H3** (`###`) = subsection → stored as `section_title`
- **`<!-- source_url: ... -->`** = URL for the NTA webpage this content was sourced from
- Source URL comments inherit downward: set once per H2, applies to all H3s beneath it
- Each H3 subsection is one chunk. If a subsection exceeds ~600 tokens, Claude should split it at a paragraph boundary during ingestion.
- Frontmatter fields map directly to `nta_documents` columns

## Ingestion Steps (for Claude to execute)

### 1. Create document record
```
Use Supabase MCP execute_sql:
INSERT INTO nta_documents (name, document_type, version)
VALUES ('Document Name', 'document_type', '1.0')
RETURNING id;
```
Save the returned `id` as DOCUMENT_ID.

### 2. Parse the markdown
Read the document file. For each H3 subsection:
- `content` = the body text under the H3
- `section_hierarchy` = `[H2 heading]`
- `section_title` = H3 heading text
- `source_url` = nearest `<!-- source_url: ... -->` comment above
- `document_name` = from frontmatter
- `document_type` = from frontmatter
- `chunk_index` = sequential counter starting at 0

### 3. Generate embedding for each chunk
```bash
curl -s "https://api.openai.com/v1/embeddings" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "text-embedding-3-large", "input": "chunk content here"}'
```
Extract the `data[0].embedding` array (1536 floats).

### 4. Insert chunk into Supabase
```
Use Supabase MCP execute_sql:
INSERT INTO nta_knowledge_chunks
  (content, content_hash, embedding, document_id, document_name,
   document_type, section_hierarchy, section_title, source_url,
   chunk_index, token_count)
VALUES
  ('content', 'sha256hash', '[embedding vector]', 'doc-uuid',
   'Document Name', 'type', ARRAY['H2 Section'], 'H3 Title',
   'https://...', 0, 350);
```

### 5. Update document chunk count
```
Use Supabase MCP execute_sql:
UPDATE nta_documents SET total_chunks = N WHERE id = 'DOCUMENT_ID';
```

## Content Hash
Generate with: `echo -n "chunk content" | sha256sum | cut -d' ' -f1`
Or compute in any equivalent way. Used for deduplication on re-ingestion.

## Token Count
Estimate at ~4 characters per token. Exact count not critical — it's for
monitoring, not retrieval.

## Re-ingestion
To re-ingest a document:
1. Delete existing chunks: `DELETE FROM nta_knowledge_chunks WHERE document_id = 'ID';`
2. Update or recreate the document record
3. Follow steps 2-5 above
