# Gemini 2.5 Flash Pro Setup Guide

## Getting Your Gemini API Key

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Select "Create API key in new project" or choose an existing project
   - Copy the generated API key

3. **Add to .env File**
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Features Using Gemini

The following features now use Gemini 2.5 Flash Pro:

### 1. AI Chatbot (`/api/ai/chat`)
- Intelligent conversation about products
- Context-aware responses
- Product recommendations in conversation
- Handles sizing, shipping, returns questions

### 2. AI Recommendations (`/api/ai/recommendations`)
- Personalized product suggestions based on:
  - User preferences
  - Budget constraints
  - Occasion (work, party, casual, sport)
  - Style preferences
- Analyzes all products to find best matches

### 3. Style Advisor (`/api/ai/style-advisor`)
- Personalized styling tips based on:
  - Body type (petite, tall, regular)
  - Personal preferences
  - Occasion
- Product recommendations tailored to style needs

## Model Configuration

The app uses **Gemini 2.5 Flash Pro** which provides:
- Fast response times
- High-quality responses
- Context understanding
- Natural language processing

## Fallback Behavior

If Gemini API is not configured or fails:
- The app falls back to rule-based responses
- All features continue to work
- You'll see warnings in the console

## Testing

1. Add your API key to `.env`
2. Restart the server: `npm start`
3. Test the chatbot on the website
4. Try getting AI recommendations from the homepage
5. Check console for "Gemini 2.5 Flash Pro initialized successfully"

## Troubleshooting

### "GEMINI_API_KEY not found" warning
- Make sure `.env` file exists in root directory
- Verify the key is set: `GEMINI_API_KEY=your_key`
- Restart server after adding the key

### API errors
- Check your API key is valid
- Verify you have API access enabled
- Check your quota limits at Google AI Studio
- Review console logs for specific error messages

### Slow responses
- Gemini 2.5 Flash Pro is optimized for speed
- Check your internet connection
- Verify your API quota hasn't been exceeded

## API Costs

- Gemini 2.5 Flash Pro has generous free tier
- Check current pricing: https://ai.google.dev/pricing
- Monitor usage in Google Cloud Console


