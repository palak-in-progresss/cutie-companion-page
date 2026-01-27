# Companion Reply Edge Function

This Supabase Edge Function generates AI-powered companion replies for journal entries.

## Flow

1. **Sentiment Analysis**: Analyzes the emotional tone of the journal entry
2. **Understanding**: Deeply understands the context, themes, and support needs
3. **Reply Generation**: Creates a comforting, understanding response

## Setup

1. Set your OpenAI API key in Supabase Dashboard:
   - Go to Project Settings > Edge Functions > Secrets
   - Add `OPENAI_API_KEY` with your OpenAI API key

## Usage

```typescript
const { data, error } = await supabase.functions.invoke('companion-reply', {
  body: {
    entry_text: "Today was really tough...",
    mood: "😞"
  }
})
```

## Response Format

```json
{
  "reply": "I hear you. That must've been really difficult... 💕",
  "sentiment": {
    "score": -0.6,
    "label": "negative",
    "emotions": ["sadness", "frustration"]
  },
  "understanding": {
    "summary": "The person experienced a challenging day...",
    "themes": ["work stress", "emotional exhaustion"],
    "support_needs": ["validation", "comfort"]
  }
}
```


