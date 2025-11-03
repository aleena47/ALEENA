require('dotenv').config();
const fetch = require('node-fetch');

const apiKey = 'AIzaSyBJ1b9q2_F6hMlJUFAsVxD59gXMcWemF8o';

async function testGeminiDirect() {
  console.log('Testing Gemini API directly with fetch...\n');
  
  // Test different API versions and models
  const tests = [
    {
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      model: 'gemini-pro (v1)'
    },
    {
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      model: 'gemini-pro (v1beta)'
    },
    {
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      model: 'gemini-1.5-flash (v1)'
    },
    {
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      model: 'gemini-1.5-flash (v1beta)'
    }
  ];
  
  const body = JSON.stringify({
    contents: [{
      parts: [{
        text: 'Say hello in one sentence'
      }]
    }]
  });
  
  for (const test of tests) {
    try {
      console.log(`Testing: ${test.model}`);
      const response = await fetch(test.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ SUCCESS with ${test.model}`);
        console.log(`Response: ${data.candidates[0].content.parts[0].text}\n`);
        break;
      } else {
        console.log(`❌ Failed: ${response.status} ${response.statusText}`);
        console.log(`Error: ${JSON.stringify(data, null, 2)}\n`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }
  
  // Also test listing available models
  console.log('\nTesting model list endpoint...');
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const response = await fetch(listUrl);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Available models:');
      data.models?.forEach(model => {
        console.log(`  - ${model.name}`);
      });
    } else {
      console.log('❌ Failed to list models:', data);
    }
  } catch (error) {
    console.log('❌ Error listing models:', error.message);
  }
}

testGeminiDirect();
