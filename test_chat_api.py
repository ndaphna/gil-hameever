#!/usr/bin/env python3
"""
Test script for the chat API
This script tests the chat API endpoint to diagnose issues
"""

import json
import os
import urllib.request
import urllib.parse
import urllib.error
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_chat_api():
    """Test the chat API endpoint"""
    
    print("🧪 Testing Chat API...")
    print("=" * 50)
    
    # Test data
    test_data = {
        "message": "שלום עליזה",
        "userId": "test-user-123",
        "conversationId": None
    }
    
    # API endpoint
    api_url = "http://localhost:3000/api/chat"
    
    print(f"📡 Testing API: {api_url}")
    print(f"📝 Test message: {test_data['message']}")
    print()
    
    try:
        # Make request using urllib
        data = json.dumps(test_data).encode('utf-8')
        req = urllib.request.Request(
            api_url,
            data=data,
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            response_text = response.read().decode('utf-8')
            response_json = json.loads(response_text)
        
        print(f"📊 Response Status: {response.status}")
        print()
        
        # Check if response is JSON
        print("✅ Response is valid JSON")
        print(f"📄 Response content: {json.dumps(response_json, indent=2, ensure_ascii=False)}")
        
        # Check for errors
        if 'error' in response_json:
            print(f"❌ API Error: {response_json['error']}")
        else:
            print("✅ API call successful")
            
    except urllib.error.URLError as e:
        if "Connection refused" in str(e):
            print("❌ Connection Error: Cannot connect to server")
            print("💡 Make sure the server is running on localhost:3000")
            print("   Run: npm run dev")
        else:
            print(f"❌ URL Error: {e}")
            
    except json.JSONDecodeError as e:
        print(f"❌ Response is not JSON: {e}")
        print("💡 This usually means:")
        print("   - Server is not running")
        print("   - API route is not found")
        print("   - Environment variables are missing")
        print("   - There's a server error")
        
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
    
    print()
    print("🔧 Troubleshooting Steps:")
    print("1. Check if server is running: npm run dev")
    print("2. Check .env.local file exists")
    print("3. Check OpenAI API key is set")
    print("4. Check Supabase configuration")
    print("5. Check console logs for errors")

def check_environment():
    """Check environment variables"""
    
    print("🔍 Checking Environment Variables...")
    print("=" * 50)
    
    # Check required variables
    required_vars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'OPENAI_API_KEY'
    ]
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"✅ {var}: {'*' * min(len(value), 10)}...")
        else:
            print(f"❌ {var}: Not set")
    
    print()
    
    # Check .env.local file
    if os.path.exists('.env.local'):
        print("✅ .env.local file exists")
    else:
        print("❌ .env.local file not found")
        print("💡 Create .env.local with required variables")

def main():
    """Main function"""
    print("🌸 Chat API Diagnostic Tool")
    print("=" * 50)
    print()
    
    # Check environment
    check_environment()
    print()
    
    # Test API
    test_chat_api()
    
    print()
    print("🎯 Next Steps:")
    print("1. Fix any missing environment variables")
    print("2. Restart the server: npm run dev")
    print("3. Test the chat functionality")
    print("4. Check console logs for errors")

if __name__ == "__main__":
    main()
