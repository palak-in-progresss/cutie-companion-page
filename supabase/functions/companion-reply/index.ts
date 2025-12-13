import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { entry_text, mood } = await req.json()

    if (!entry_text) {
      return new Response(
        JSON.stringify({ error: 'Missing entry_text' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // STEP 1: Sentiment Analysis
    const sentimentPrompt = `Analyze the sentiment of this journal entry. Return ONLY a JSON object with:
{
  "sentiment_score": <number between -1 and 1, where -1 is very negative, 0 is neutral, 1 is very positive>,
  "sentiment_label": "<one of: positive, negative, neutral>",
  "emotions": ["<emotion1>", "<emotion2>", ...]
}

Journal entry: "${entry_text}"
Mood: ${mood || 'not specified'}`

    const sentimentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis tool. Return ONLY valid JSON, no other text.',
          },
          {
            role: 'user',
            content: sentimentPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    })

    const sentimentData = await sentimentResponse.json()
    const sentimentResult = JSON.parse(sentimentData.choices[0].message.content)
    const { sentiment_score, sentiment_label, emotions } = sentimentResult

    // STEP 2: Understanding the Text
    const understandingPrompt = `Analyze and understand this journal entry deeply. Provide a brief summary (2-3 sentences) of:
1. What the person is experiencing
2. The underlying feelings or concerns
3. What they might need support with

Journal entry: "${entry_text}"
Mood: ${mood || 'not specified'}
Sentiment: ${sentiment_label} (score: ${sentiment_score})
Emotions detected: ${emotions.join(', ')}

Return ONLY a JSON object:
{
  "summary": "<brief understanding>",
  "key_themes": ["<theme1>", "<theme2>", ...],
  "support_needs": ["<need1>", "<need2>", ...]
}`

    const understandingResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate therapist analyzing journal entries. Return ONLY valid JSON, no other text.',
          },
          {
            role: 'user',
            content: understandingPrompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 300,
      }),
    })

    const understandingData = await understandingResponse.json()
    const understandingResult = JSON.parse(understandingData.choices[0].message.content)
    const { summary, key_themes, support_needs } = understandingResult

    // STEP 3: Generate Comforting and Understanding Reply
    const replyPrompt = `You are a warm, gentle, and understanding companion. Write a comforting reply to this journal entry.

Context:
- Journal entry: "${entry_text}"
- Mood: ${mood || 'not specified'}
- Sentiment: ${sentiment_label}
- Understanding: ${summary}
- Key themes: ${key_themes.join(', ')}
- Support needs: ${support_needs.join(', ')}

Guidelines:
- Be gentle, empathetic, and non-judgmental
- Acknowledge their feelings as valid
- Offer comfort and understanding
- Keep it brief (2-3 sentences, max 150 words)
- Use a warm, caring tone
- Include a supportive emoji at the end (💕, 🌸, 💖, 🌷, ✨, etc.)
- Don't give advice unless asked
- Don't minimize their feelings
- Be genuine and heartfelt

Write ONLY the reply text, nothing else.`

    const replyResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate companion who provides gentle, understanding responses to journal entries. Be warm, empathetic, and supportive.',
          },
          {
            role: 'user',
            content: replyPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })

    const replyData = await replyResponse.json()
    const companionReply = replyData.choices[0].message.content.trim()

    // Return the complete response
    return new Response(
      JSON.stringify({
        reply: companionReply,
        sentiment: {
          score: sentiment_score,
          label: sentiment_label,
          emotions: emotions,
        },
        understanding: {
          summary: summary,
          themes: key_themes,
          support_needs: support_needs,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

