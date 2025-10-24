#!/usr/bin/env python3
"""
Simple script to add mock journal data for ענבל (inbald@sapir.ac.il)
This script adds 15 diverse journal entries with various symptoms, moods, and sleep quality.
"""

import json
import os
import sys
from datetime import datetime

# Add the project root to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def load_mock_data():
    """Load mock data from JSON file"""
    try:
        with open('mock_journal_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        print("Error: mock_journal_data.json not found")
        return None
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None

def print_data_summary(data):
    """Print a summary of the mock data"""
    if not data:
        return
    
    print("📊 Mock Journal Data Summary:")
    print(f"   User: {data['user_email']}")
    print(f"   Entries: {data['entries_count']}")
    print(f"   Date Range: {data['date_range']}")
    print()
    
    print("🌙 Sleep Quality Distribution:")
    for quality, count in data['summary']['sleep_quality_distribution'].items():
        print(f"   {quality}: {count} entries")
    print()
    
    print("😊 Mood Distribution:")
    for mood, count in data['summary']['mood_distribution'].items():
        print(f"   {mood}: {count} entries")
    print()
    
    print("🔥 Symptoms Frequency:")
    for symptom, count in data['summary']['symptoms_frequency'].items():
        print(f"   {symptom}: {count} entries")
    print()
    
    print("⚡ Energy Levels:")
    for level, count in data['summary']['energy_levels'].items():
        print(f"   {level}: {count} entries")
    print()
    
    print("🎯 Interesting Patterns:")
    for pattern in data['summary']['interesting_patterns']:
        print(f"   • {pattern}")
    print()

def show_sample_entries(data, count=3):
    """Show sample entries"""
    if not data or not data.get('entries'):
        return
    
    print(f"📝 Sample Entries (first {count}):")
    for i, entry in enumerate(data['entries'][:count]):
        print(f"\n   Entry {i+1}: {entry['date']} {entry['time_of_day']}")
        print(f"   Sleep: {entry['sleep_quality']} | Mood: {entry['mood']} | Energy: {entry['energy_level']}")
        print(f"   Symptoms: ", end="")
        symptoms = []
        if entry['hot_flashes']: symptoms.append("hot flashes")
        if entry['night_sweats']: symptoms.append("night sweats")
        if entry['dryness']: symptoms.append("dryness")
        if entry['pain']: symptoms.append("pain")
        if entry['bloating']: symptoms.append("bloating")
        if entry['concentration_difficulty']: symptoms.append("concentration issues")
        if entry['sleep_issues']: symptoms.append("sleep issues")
        print(", ".join(symptoms) if symptoms else "none")
        print(f"   Insight: {entry['daily_insight']}")

def main():
    """Main function"""
    print("🌸 Mock Journal Data for ענבל (inbald@sapir.ac.il)")
    print("=" * 60)
    
    # Load mock data
    data = load_mock_data()
    if not data:
        print("❌ Failed to load mock data")
        return
    
    # Print summary
    print_data_summary(data)
    
    # Show sample entries
    show_sample_entries(data, 3)
    
    print("\n" + "=" * 60)
    print("📋 Next Steps:")
    print("1. Use the SQL file: mock_journal_data.sql")
    print("2. Use the Python script: add_mock_data.py")
    print("3. Use the JavaScript script: add_mock_data.js")
    print("4. Import the CSV file: mock_journal_data.csv")
    print("5. Use the JSON file: mock_journal_data.json")
    print("\n🎯 All files contain the same 15 diverse journal entries!")
    print("   Choose the method that works best for your setup.")

if __name__ == "__main__":
    main()
