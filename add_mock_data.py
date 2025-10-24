#!/usr/bin/env python3
"""
Script to add mock journal data for ענבל (inbald@sapir.ac.il)
This script adds 15 diverse journal entries with various symptoms, moods, and sleep quality.
"""

import os
import sys
from datetime import datetime, timedelta
import random

# Add the project root to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from supabase import create_client, Client
    from dotenv import load_dotenv
except ImportError:
    print("Please install required packages: pip install supabase python-dotenv")
    sys.exit(1)

# Load environment variables
load_dotenv()

# Initialize Supabase client
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Missing Supabase environment variables")
    print("Please check your .env.local file")
    sys.exit(1)

supabase: Client = create_client(url, key)

def get_user_id(email):
    """Get user ID by email"""
    try:
        response = supabase.auth.admin.list_users()
        for user in response:
            if user.email == email:
                return user.id
        print(f"User {email} not found")
        return None
    except Exception as e:
        print(f"Error getting user ID: {e}")
        return None

def add_mock_journal_data():
    """Add mock journal data for ענבל"""
    
    # Get user ID
    user_id = get_user_id('inbald@sapir.ac.il')
    if not user_id:
        print("Creating mock user...")
        # For demo purposes, we'll use a mock user ID
        user_id = 'mock-user-' + str(int(datetime.now().timestamp()))
    
    print(f"Using user ID: {user_id}")
    
    # Mock data entries
    entries = [
        # Entry 1: Good day
        {
            'user_id': user_id,
            'date': '2025-01-15',
            'time_of_day': 'morning',
            'sleep_quality': 'excellent',
            'woke_up_night': False,
            'night_sweats': False,
            'energy_level': 'high',
            'mood': 'happy',
            'hot_flashes': False,
            'dryness': False,
            'pain': False,
            'bloating': False,
            'concentration_difficulty': False,
            'sleep_issues': False,
            'sexual_desire': True,
            'daily_insight': 'הרגשתי נהדר היום! שינה טובה ואנרגיה גבוהה',
            'created_at': '2025-01-15T08:00:00Z',
            'updated_at': '2025-01-15T08:00:00Z'
        },
        
        # Entry 2: Evening of same day
        {
            'user_id': user_id,
            'date': '2025-01-15',
            'time_of_day': 'evening',
            'sleep_quality': 'good',
            'woke_up_night': False,
            'night_sweats': False,
            'energy_level': 'medium',
            'mood': 'content',
            'hot_flashes': False,
            'dryness': False,
            'pain': False,
            'bloating': False,
            'concentration_difficulty': False,
            'sleep_issues': False,
            'sexual_desire': True,
            'daily_insight': 'יום נהדר הסתיים. הרגשתי מאוזנת ושלווה',
            'created_at': '2025-01-15T20:30:00Z',
            'updated_at': '2025-01-15T20:30:00Z'
        },
        
        # Entry 3: Challenging day with hot flashes
        {
            'user_id': user_id,
            'date': '2025-01-16',
            'time_of_day': 'morning',
            'sleep_quality': 'poor',
            'woke_up_night': True,
            'night_sweats': True,
            'energy_level': 'low',
            'mood': 'frustrated',
            'hot_flashes': True,
            'dryness': False,
            'pain': False,
            'bloating': False,
            'concentration_difficulty': True,
            'sleep_issues': True,
            'sexual_desire': False,
            'daily_insight': 'לילה קשה עם גלי חום והזעות לילה. התקשיתי לישון',
            'created_at': '2025-01-16T07:30:00Z',
            'updated_at': '2025-01-16T07:30:00Z'
        },
        
        # Entry 4: Evening of challenging day
        {
            'user_id': user_id,
            'date': '2025-01-16',
            'time_of_day': 'evening',
            'sleep_quality': 'poor',
            'woke_up_night': False,
            'night_sweats': True,
            'energy_level': 'low',
            'mood': 'tired',
            'hot_flashes': True,
            'dryness': True,
            'pain': False,
            'bloating': True,
            'concentration_difficulty': True,
            'sleep_issues': True,
            'sexual_desire': False,
            'daily_insight': 'יום קשה עם גלי חום רבים. הרגשתי עייפה וחסרת אנרגיה',
            'created_at': '2025-01-16T19:45:00Z',
            'updated_at': '2025-01-16T19:45:00Z'
        },
        
        # Entry 5: Better day with some symptoms
        {
            'user_id': user_id,
            'date': '2025-01-17',
            'time_of_day': 'morning',
            'sleep_quality': 'fair',
            'woke_up_night': False,
            'night_sweats': False,
            'energy_level': 'medium',
            'mood': 'neutral',
            'hot_flashes': False,
            'dryness': True,
            'pain': False,
            'bloating': False,
            'concentration_difficulty': False,
            'sleep_issues': False,
            'sexual_desire': True,
            'daily_insight': 'שינה בסדר, אבל יש לי יובש. מצב הרוח בסדר',
            'created_at': '2025-01-17T08:15:00Z',
            'updated_at': '2025-01-17T08:15:00Z'
        },
        
        # Entry 6: Evening of better day
        {
            'user_id': user_id,
            'date': '2025-01-17',
            'time_of_day': 'evening',
            'sleep_quality': 'good',
            'woke_up_night': False,
            'night_sweats': False,
            'energy_level': 'medium',
            'mood': 'content',
            'hot_flashes': False,
            'dryness': True,
            'pain': False,
            'bloating': False,
            'concentration_difficulty': False,
            'sleep_issues': False,
            'sexual_desire': True,
            'daily_insight': 'יום טוב יותר. עדיין יש יובש אבל הרגשה כללית טובה',
            'created_at': '2025-01-17T20:00:00Z',
            'updated_at': '2025-01-17T20:00:00Z'
        },
        
        # Entry 7: Day with bloating and pain
        {
            'user_id': user_id,
            'date': '2025-01-18',
            'time_of_day': 'morning',
            'sleep_quality': 'fair',
            'woke_up_night': False,
            'night_sweats': False,
            'energy_level': 'low',
            'mood': 'uncomfortable',
            'hot_flashes': False,
            'dryness': False,
            'pain': True,
            'bloating': True,
            'concentration_difficulty': False,
            'sleep_issues': False,
            'sexual_desire': False,
            'daily_insight': 'הרגשתי נפוחה וכואבת. קשה לי להתרכז',
            'created_at': '2025-01-18T08:30:00Z',
            'updated_at': '2025-01-18T08:30:00Z'
        },
        
        # Entry 8: Evening of bloating day
        {
            'user_id': user_id,
            'date': '2025-01-18',
            'time_of_day': 'evening',
            'sleep_quality': 'fair',
            'woke_up_night': False,
            'night_sweats': False,
            'energy_level': 'low',
            'mood': 'uncomfortable',
            'hot_flashes': False,
            'dryness': False,
            'pain': True,
            'bloating': True,
            'concentration_difficulty': True,
            'sleep_issues': False,
            'sexual_desire': False,
            'daily_insight': 'עדיין נפוחה וכואבת. קשה לי להתרכז בעבודה',
            'created_at': '2025-01-18T19:30:00Z',
            'updated_at': '2025-01-18T19:30:00Z'
        },
        
        # Entry 9: Good day with exercise
        {
            'user_id': user_id,
            'date': '2025-01-19',
            'time_of_day': 'morning',
            'sleep_quality': 'excellent',
            'woke_up_night': False,
            'night_sweats': False,
            'energy_level': 'high',
            'mood': 'happy',
            'hot_flashes': False,
            'dryness': False,
            'pain': False,
            'bloating': False,
            'concentration_difficulty': False,
            'sleep_issues': False,
            'sexual_desire': True,
            'daily_insight': 'שינה מעולה אחרי אימון אתמול! הרגשה נהדרת',
            'created_at': '2025-01-19T07:45:00Z',
            'updated_at': '2025-01-19T07:45:00Z'
        },
        
        # Entry 10: Evening of exercise day
        {
            'user_id': user_id,
            'date': '2025-01-19',
            'time_of_day': 'evening',
            'sleep_quality': 'excellent',
            'woke_up_night': False,
            'night_sweats': False,
            'energy_level': 'high',
            'mood': 'happy',
            'hot_flashes': False,
            'dryness': False,
            'pain': False,
            'bloating': False,
            'concentration_difficulty': False,
            'sleep_issues': False,
            'sexual_desire': True,
            'daily_insight': 'יום נהדר! אימון הבוקר עזר לי להרגיש אנרגטית כל היום',
            'created_at': '2025-01-19T20:15:00Z',
            'updated_at': '2025-01-19T20:15:00Z'
        },
        
        # Entry 11: Day with concentration issues
        {
            'user_id': user_id,
            'date': '2025-01-20',
            'time_of_day': 'morning',
            'sleep_quality': 'fair',
            'woke_up_night': False,
            'night_sweats': False,
            'energy_level': 'medium',
            'mood': 'foggy',
            'hot_flashes': False,
            'dryness': False,
            'pain': False,
            'bloating': False,
            'concentration_difficulty': True,
            'sleep_issues': False,
            'sexual_desire': False,
            'daily_insight': 'קשה לי להתרכז היום. הרגשה של ערפל במוח',
            'created_at': '2025-01-20T08:00:00Z',
            'updated_at': '2025-01-20T08:00:00Z'
        },
        
        # Entry 12: Evening of concentration day
        {
            'user_id': user_id,
            'date': '2025-01-20',
            'time_of_day': 'evening',
            'sleep_quality': 'fair',
            'woke_up_night': False,
            'night_sweats': False,
            'energy_level': 'medium',
            'mood': 'foggy',
            'hot_flashes': False,
            'dryness': False,
            'pain': False,
            'bloating': False,
            'concentration_difficulty': True,
            'sleep_issues': False,
            'sexual_desire': False,
            'daily_insight': 'עדיין קשה להתרכז. הרגשה של ערפל במוח לא עברה',
            'created_at': '2025-01-20T19:45:00Z',
            'updated_at': '2025-01-20T19:45:00Z'
        },
        
        # Entry 13: Mixed symptoms day
        {
            'user_id': user_id,
            'date': '2025-01-21',
            'time_of_day': 'morning',
            'sleep_quality': 'poor',
            'woke_up_night': True,
            'night_sweats': True,
            'energy_level': 'low',
            'mood': 'irritable',
            'hot_flashes': True,
            'dryness': True,
            'pain': False,
            'bloating': True,
            'concentration_difficulty': True,
            'sleep_issues': True,
            'sexual_desire': False,
            'daily_insight': 'לילה קשה עם גלי חום, הזעות לילה, יובש ונפיחות. הרגשה רעה',
            'created_at': '2025-01-21T07:30:00Z',
            'updated_at': '2025-01-21T07:30:00Z'
        },
        
        # Entry 14: Evening of mixed symptoms day
        {
            'user_id': user_id,
            'date': '2025-01-21',
            'time_of_day': 'evening',
            'sleep_quality': 'poor',
            'woke_up_night': False,
            'night_sweats': True,
            'energy_level': 'low',
            'mood': 'irritable',
            'hot_flashes': True,
            'dryness': True,
            'pain': False,
            'bloating': True,
            'concentration_difficulty': True,
            'sleep_issues': True,
            'sexual_desire': False,
            'daily_insight': 'יום קשה עם תסמינים רבים. הרגשה של חוסר שליטה',
            'created_at': '2025-01-21T20:00:00Z',
            'updated_at': '2025-01-21T20:00:00Z'
        },
        
        # Entry 15: Recovery day
        {
            'user_id': user_id,
            'date': '2025-01-22',
            'time_of_day': 'morning',
            'sleep_quality': 'good',
            'woke_up_night': False,
            'night_sweats': False,
            'energy_level': 'medium',
            'mood': 'hopeful',
            'hot_flashes': False,
            'dryness': False,
            'pain': False,
            'bloating': False,
            'concentration_difficulty': False,
            'sleep_issues': False,
            'sexual_desire': True,
            'daily_insight': 'הרגשה טובה יותר היום. התסמינים פחתו ואני מרגישה יותר אופטימית',
            'created_at': '2025-01-22T08:00:00Z',
            'updated_at': '2025-01-22T08:00:00Z'
        }
    ]
    
    # Add entries to database
    try:
        for entry in entries:
            result = supabase.table('daily_entries').insert(entry).execute()
            print(f"Added entry for {entry['date']} {entry['time_of_day']}")
        
        print(f"\n✅ Successfully added {len(entries)} journal entries for ענבל!")
        print("The entries include:")
        print("- Various sleep quality levels (excellent, good, fair, poor)")
        print("- Different moods (happy, content, frustrated, tired, etc.)")
        print("- Multiple symptoms (hot flashes, night sweats, dryness, bloating, etc.)")
        print("- Energy levels from low to high")
        print("- Concentration difficulties and sleep issues")
        print("- Hebrew insights for each entry")
        
    except Exception as e:
        print(f"Error adding entries: {e}")

if __name__ == "__main__":
    print("Adding mock journal data for ענבל (inbald@sapir.ac.il)...")
    add_mock_journal_data()
