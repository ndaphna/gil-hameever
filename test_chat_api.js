#!/usr/bin/env node
/**
 * Test script for the chat API
 * This script tests the chat API endpoint to diagnose issues
 */

// Use built-in fetch (Node.js 18+)
require('dotenv').config();

async function testChatAPI() {
  console.log('🧪 Testing Chat API...');
  console.log('='.repeat(50));
  
  // Test data
  const testData = {
    message: 'שלום עליזה',
    userId: 'test-user-123',
    conversationId: null
  };
  
  // API endpoint
  const apiUrl = 'http://localhost:3000/api/chat';
  
  console.log(`📡 Testing API: ${apiUrl}`);
  console.log(`📝 Test message: ${testData.message}`);
  console.log();
  
  try {
    // Make request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📊 Response Headers:`, Object.fromEntries(response.headers.entries()));
    console.log();
    
    // Check if response is JSON
    try {
      const responseText = await response.text();
      
      // Try to parse as JSON
      try {
        const responseJson = JSON.parse(responseText);
        console.log('✅ Response is valid JSON');
        console.log(`📄 Response content:`, JSON.stringify(responseJson, null, 2));
        
        // Check for errors
        if (responseJson.error) {
          console.log(`❌ API Error: ${responseJson.error}`);
        } else {
          console.log('✅ API call successful');
        }
        
      } catch (jsonError) {
        console.log(`❌ Response is not JSON: ${jsonError.message}`);
        console.log(`📄 Raw response: ${responseText.substring(0, 500)}...`);
        
        // Check if it's HTML
        if (responseText.trim().startsWith('<!DOCTYPE')) {
          console.log('🔍 Response is HTML (likely an error page)');
          console.log('💡 This usually means:');
          console.log('   - Server is not running');
          console.log('   - API route is not found');
          console.log('   - Environment variables are missing');
          console.log('   - There\'s a server error');
        }
      }
      
    } catch (error) {
      console.log(`❌ Error reading response: ${error.message}`);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection Error: Cannot connect to server');
      console.log('💡 Make sure the server is running on localhost:3000');
      console.log('   Run: npm run dev');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('❌ Timeout Error: Request took too long');
      console.log('💡 This might indicate a server issue');
    } else {
      console.log(`❌ Unexpected Error: ${error.message}`);
    }
  }
  
  console.log();
  console.log('🔧 Troubleshooting Steps:');
  console.log('1. Check if server is running: npm run dev');
  console.log('2. Check .env.local file exists');
  console.log('3. Check OpenAI API key is set');
  console.log('4. Check Supabase configuration');
  console.log('5. Check console logs for errors');
}

function checkEnvironment() {
  console.log('🔍 Checking Environment Variables...');
  console.log('='.repeat(50));
  
  // Check required variables
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY'
  ];
  
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${'*'.repeat(Math.min(value.length, 10))}...`);
    } else {
      console.log(`❌ ${varName}: Not set`);
    }
  }
  
  console.log();
  
  // Check .env.local file
  const fs = require('fs');
  if (fs.existsSync('.env.local')) {
    console.log('✅ .env.local file exists');
  } else {
    console.log('❌ .env.local file not found');
    console.log('💡 Create .env.local with required variables');
  }
}

async function main() {
  console.log('🌸 Chat API Diagnostic Tool');
  console.log('='.repeat(50));
  console.log();
  
  // Check environment
  checkEnvironment();
  console.log();
  
  // Test API
  await testChatAPI();
  
  console.log();
  console.log('🎯 Next Steps:');
  console.log('1. Fix any missing environment variables');
  console.log('2. Restart the server: npm run dev');
  console.log('3. Test the chat functionality');
  console.log('4. Check console logs for errors');
}

// Run the test
main().catch(console.error);
