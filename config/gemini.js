const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY not found. AI features will use fallback responses.');
}

let genAI = null;
let model = null;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    // Using Gemini 2.5 Flash Pro model
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-pro' });
    console.log('Gemini 2.5 Flash Pro initialized successfully');
  } catch (error) {
    console.error('Error initializing Gemini:', error);
  }
}

// Helper function to get product context for AI
const getProductContext = async (supabase) => {
  try {
    if (!supabase) return '';
    
    const { data: products } = await supabase
      .from('products')
      .select('name, category, price, description, style')
      .limit(20);
    
    if (!products || products.length === 0) return '';
    
    return products.map(p => 
      `- ${p.name} (${p.category}, ${p.style}): $${p.price} - ${p.description}`
    ).join('\n');
  } catch (error) {
    return '';
  }
};

// Chat with Gemini
const chatWithGemini = async (message, conversationHistory = [], productContext = '') => {
  if (!model) {
    return null; // Fallback to rule-based responses
  }

  try {
    const systemPrompt = `You are a helpful AI fashion assistant for ZAR clothing store. You help customers with:
- Product recommendations based on preferences, budget, and occasions
- Size and fit advice
- Styling tips
- Information about returns and shipping
- General fashion advice

Available products context:
${productContext}

Be friendly, helpful, and concise. If asked about specific products, refer to the product context provided.`;

    // Build conversation history
    const history = conversationHistory.slice(-5).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const fullMessage = systemPrompt ? `${systemPrompt}\n\nUser: ${message}` : message;
    const result = await chat.sendMessage(fullMessage);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
};

// Get AI recommendations
const getAIRecommendations = async (preferences, budget, occasion, style, products) => {
  if (!model || !products || products.length === 0) {
    return null;
  }

  try {
    const productList = products.slice(0, 20).map(p => 
      `- ${p.name} (ID: ${p.id}, ${p.category}, ${p.style}): $${p.price} - ${p.description}`
    ).join('\n');

    const prompt = `You are a fashion recommendation assistant. Based on the following criteria, recommend the best products:

Preferences: ${preferences?.join(', ') || 'None specified'}
Budget: ${budget ? `$${budget}` : 'No limit'}
Occasion: ${occasion || 'General'}
Style: ${style || 'Any'}

Available products:
${productList}

Provide a JSON array of product IDs (max 6) that best match the criteria. Return ONLY a JSON array like: [1, 3, 5]
Focus on relevance, quality, and matching the user's needs.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\d,\s]+\]/);
    if (jsonMatch) {
      const recommendedIds = JSON.parse(jsonMatch[0]);
      return products.filter(p => recommendedIds.includes(p.id)).slice(0, 6);
    }

    return null;
  } catch (error) {
    console.error('Gemini recommendations error:', error);
    return null;
  }
};

// Get style advice from Gemini
const getStyleAdvice = async (bodyType, preferences, occasion, products) => {
  if (!model) {
    return null;
  }

  try {
    const productList = products.slice(0, 10).map(p => 
      `- ${p.name} (${p.category}, ${p.style}): $${p.price}`
    ).join('\n');

    const prompt = `You are a professional fashion stylist. Provide personalized style advice:

Body Type: ${bodyType || 'regular'}
Preferences: ${preferences?.join(', ') || 'None'}
Occasion: ${occasion || 'General'}

Available products:
${productList}

Provide:
1. 2-3 styling tips tailored to the body type and occasion
2. Recommendations for 3 products from the list that would work well

Format your response as JSON:
{
  "tips": ["tip1", "tip2", "tip3"],
  "recommendedProductIds": [1, 2, 3]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const advice = JSON.parse(jsonMatch[0]);
      const recommendedProducts = products.filter(p => 
        advice.recommendedProductIds?.includes(p.id)
      ).slice(0, 3);

      return {
        bodyType: bodyType || "regular",
        recommendations: recommendedProducts,
        tips: advice.tips || []
      };
    }

    return null;
  } catch (error) {
    console.error('Gemini style advice error:', error);
    return null;
  }
};

module.exports = {
  chatWithGemini,
  getAIRecommendations,
  getStyleAdvice,
  getProductContext,
  model
};

