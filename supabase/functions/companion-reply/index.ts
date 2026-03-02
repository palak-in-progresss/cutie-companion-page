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
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
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

    // Get Gemini API key from environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      // Graceful fallback — return a warm static reply if no key is set
      const fallbackReplies = [
        "Thank you for sharing that with me. Your feelings are completely valid, and I'm here with you 💕",
        "I hear you. Whatever you're going through, you don't have to face it alone 🌸",
        "It means so much that you shared this. Take it one moment at a time — you're doing great 💖",
        "Your feelings matter. I'm listening, always 🌷",
        "Every day you show up for yourself is a win. I'm proud of you ✨",
      ]
      const reply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)]
      return new Response(
        JSON.stringify({ reply }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Build the prompt for Gemini
    const moodContext = mood ? `The person's current mood is ${mood}.` : ''
    const prompt = `You are a warm, gentle, and understanding journal companion. A user has shared this journal entry with you:

"${entry_text}"

${moodContext}

Write a single short, comforting reply (2-3 sentences, max 100 words) that:
- Acknowledges their feelings as valid and real
- Is empathetic, non-judgmental, and gentle
- Ends with a warm emoji (💕, 🌸, 💖, 🌷, or ✨)
- Does NOT give advice unless they asked for it
- Does NOT minimize their feelings

Write ONLY the reply text. Nothing else.`

    // Call Gemini 1.5 Flash (free tier)
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 150,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          ],
        }),
      }
    )

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!reply) {
      throw new Error('Empty response from Gemini')
    }

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error in companion-reply:', error)
    // Return a graceful fallback instead of a 500 so the UI doesn't break
    return new Response(
      JSON.stringify({
        reply: "I'm here with you, always 💕",
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  }
})
