require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyBJ1b9q2_F6hMlJUFAsVxD59gXMcWemF8o';

async function testGemini() {
  try {
    console.log('Testing Gemini 2.5 Flash with SDK...\n');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent('Say hello and introduce yourself as a fashion assistant in one sentence.');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS!');
    console.log(`Response: ${text}\n`);
    
    // Test chat
    console.log('Testing chat functionality...\n');
    const chat = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    const chatResult = await chat.sendMessage('What can you help me with?');
    const chatResponse = await chatResult.response;
    const chatText = chatResponse.text();
    
    console.log('✅ Chat works!');
    console.log(`Response: ${chatText}\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGemini();
