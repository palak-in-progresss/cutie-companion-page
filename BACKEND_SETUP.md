# Backend Setup Guide for Companion Journal

## 🚀 Quick Start

### 1. Database Setup (Supabase)

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to SQL Editor**
3. **Run the migration file**: Copy and paste the contents of `supabase/migrations/001_initial_schema.sql` into the SQL editor and execute it.

This will create:
- ✅ `profiles` table (user profiles)
- ✅ `journal_entries` table (journal entries with AI replies)
- ✅ `mood_history` table (mood tracking)
- ✅ `tasks` table (daily tasks)
- ✅ `habits` table (habit tracking)
- ✅ Row Level Security (RLS) policies
- ✅ Automatic profile creation on signup

### 2. Edge Function Setup (AI Companion Replies)

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref feoebdljsqxvcqtyxlur
   ```

4. **Deploy the Edge Function**:
   ```bash
   supabase functions deploy companion-reply
   ```

5. **Set OpenAI API Key**:
   - Go to Supabase Dashboard → Project Settings → Edge Functions → Secrets
   - Add a new secret: `OPENAI_API_KEY` with your OpenAI API key
   - You can get an API key from: https://platform.openai.com/api-keys

### 3. Environment Variables

The frontend is already configured with your Supabase URL and anon key in:
- `src/integrations/supabase/client.ts`

**No additional environment variables needed for the frontend!**

### 4. Generate TypeScript Types (Optional but Recommended)

After setting up the database, generate TypeScript types:

1. **Install Supabase CLI** (if not installed):
   ```bash
   npm install -g supabase
   ```

2. **Generate types**:
   ```bash
   supabase gen types typescript --project-id feoebdljsqxvcqtyxlur > src/integrations/supabase/types.ts
   ```

   Or use the Supabase Dashboard:
   - Go to Settings → API
   - Scroll to "TypeScript types"
   - Copy the generated types and replace `src/integrations/supabase/types.ts`

## 📋 Database Schema Overview

### Tables Created:

1. **profiles**
   - Extends Supabase auth.users
   - Stores user name and email
   - Auto-created on signup

2. **journal_entries**
   - Stores journal entries
   - Includes AI companion replies
   - Tracks sentiment analysis

3. **mood_history**
   - Daily mood check-ins
   - Optional notes

4. **tasks**
   - Daily tasks
   - Completion status

5. **habits**
   - Daily habits
   - Completion tracking

## 🔐 Security

All tables have Row Level Security (RLS) enabled:
- Users can only see/modify their own data
- Policies are automatically enforced by Supabase

## 🤖 AI Companion Replies

The Edge Function (`companion-reply`) follows this flow:

1. **Sentiment Analysis**: Analyzes emotional tone (-1 to 1 scale)
2. **Understanding**: Extracts themes and support needs
3. **Reply Generation**: Creates comforting, empathetic response

**API Endpoint**: `supabase.functions.invoke('companion-reply')`

**Request Body**:
```json
{
  "entry_text": "Today was really tough...",
  "mood": "😞"
}
```

**Response**:
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

## 🧪 Testing

1. **Test Authentication**:
   - Sign up with a new account
   - Check Supabase Dashboard → Authentication → Users

2. **Test Journal Entry**:
   - Create a journal entry
   - Check if AI reply is generated
   - Verify data in `journal_entries` table

3. **Test Mood Tracking**:
   - Select a mood
   - Check `mood_history` table

## 🐛 Troubleshooting

### Edge Function not working?
- Check OpenAI API key is set correctly
- Check function logs in Supabase Dashboard → Edge Functions → Logs
- Verify the function is deployed: `supabase functions list`

### Authentication not working?
- Check Supabase project URL and anon key in `client.ts`
- Verify RLS policies are enabled
- Check browser console for errors

### Database errors?
- Verify migration ran successfully
- Check RLS policies in Supabase Dashboard → Authentication → Policies
- Ensure user is authenticated before making queries

## 📚 Next Steps

1. ✅ Run database migration
2. ✅ Deploy Edge Function
3. ✅ Set OpenAI API key
4. ✅ Test the application
5. ✅ (Optional) Generate TypeScript types

## 💡 Tips

- Use Supabase Dashboard to monitor database activity
- Check Edge Function logs for AI reply debugging
- Use Supabase Studio to view/edit data directly
- Enable email confirmation in Supabase Dashboard → Authentication → Settings (optional)

---

**Need help?** Check Supabase documentation: https://supabase.com/docs

