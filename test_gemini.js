require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY not found in .env');
  process.exit(1);
}

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'models/gemini-pro',
      'models/gemini-1.5-pro'
    ];
    
    console.log('Testing Gemini API with different model names...\n');
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ SUCCESS with ${modelName}`);
        console.log(`Response: ${text}\n`);
        break;
      } catch (error) {
        console.log(`❌ Failed with ${modelName}: ${error.message}\n`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testGemini();
