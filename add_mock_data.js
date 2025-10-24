#!/usr/bin/env node
/**
 * Script to add mock journal data for ענבל (inbald@sapir.ac.il)
 * This script adds 15 diverse journal entries with various symptoms, moods, and sleep quality.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Please check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getUserId(email) {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    
    const user = data.users.find(u => u.email === email);
    if (user) return user.id;
    
    console.log(`User ${email} not found, using mock user ID`);
    return `mock-user-${Date.now()}`;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return `mock-user-${Date.now()}`;
  }
}

async function addMockJournalData() {
  console.log('Adding mock journal data for ענבל (inbald@sapir.ac.il)...');
  
  // Get user ID
  const userId = await getUserId('inbald@sapir.ac.il');
  console.log(`Using user ID: ${userId}`);
  
  // Mock data entries
  const entries = [
    // Entry 1: Good day
    {
      user_id: userId,
      date: '2025-01-15',
      time_of_day: 'morning',
      sleep_quality: 'excellent',
      woke_up_night: false,
      night_sweats: false,
      energy_level: 'high',
      mood: 'happy',
      hot_flashes: false,
      dryness: false,
      pain: false,
      bloating: false,
      concentration_difficulty: false,
      sleep_issues: false,
      sexual_desire: true,
      daily_insight: 'הרגשתי נהדר היום! שינה טובה ואנרגיה גבוהה',
      created_at: '2025-01-15T08:00:00Z',
      updated_at: '2025-01-15T08:00:00Z'
    },
    
    // Entry 2: Evening of same day
    {
      user_id: userId,
      date: '2025-01-15',
      time_of_day: 'evening',
      sleep_quality: 'good',
      woke_up_night: false,
      night_sweats: false,
      energy_level: 'medium',
      mood: 'content',
      hot_flashes: false,
      dryness: false,
      pain: false,
      bloating: false,
      concentration_difficulty: false,
      sleep_issues: false,
      sexual_desire: true,
      daily_insight: 'יום נהדר הסתיים. הרגשתי מאוזנת ושלווה',
      created_at: '2025-01-15T20:30:00Z',
      updated_at: '2025-01-15T20:30:00Z'
    },
    
    // Entry 3: Challenging day with hot flashes
    {
      user_id: userId,
      date: '2025-01-16',
      time_of_day: 'morning',
      sleep_quality: 'poor',
      woke_up_night: true,
      night_sweats: true,
      energy_level: 'low',
      mood: 'frustrated',
      hot_flashes: true,
      dryness: false,
      pain: false,
      bloating: false,
      concentration_difficulty: true,
      sleep_issues: true,
      sexual_desire: false,
      daily_insight: 'לילה קשה עם גלי חום והזעות לילה. התקשיתי לישון',
      created_at: '2025-01-16T07:30:00Z',
      updated_at: '2025-01-16T07:30:00Z'
    },
    
    // Entry 4: Evening of challenging day
    {
      user_id: userId,
      date: '2025-01-16',
      time_of_day: 'evening',
      sleep_quality: 'poor',
      woke_up_night: false,
      night_sweats: true,
      energy_level: 'low',
      mood: 'tired',
      hot_flashes: true,
      dryness: true,
      pain: false,
      bloating: true,
      concentration_difficulty: true,
      sleep_issues: true,
      sexual_desire: false,
      daily_insight: 'יום קשה עם גלי חום רבים. הרגשתי עייפה וחסרת אנרגיה',
      created_at: '2025-01-16T19:45:00Z',
      updated_at: '2025-01-16T19:45:00Z'
    },
    
    // Entry 5: Better day with some symptoms
    {
      user_id: userId,
      date: '2025-01-17',
      time_of_day: 'morning',
      sleep_quality: 'fair',
      woke_up_night: false,
      night_sweats: false,
      energy_level: 'medium',
      mood: 'neutral',
      hot_flashes: false,
      dryness: true,
      pain: false,
      bloating: false,
      concentration_difficulty: false,
      sleep_issues: false,
      sexual_desire: true,
      daily_insight: 'שינה בסדר, אבל יש לי יובש. מצב הרוח בסדר',
      created_at: '2025-01-17T08:15:00Z',
      updated_at: '2025-01-17T08:15:00Z'
    },
    
    // Entry 6: Evening of better day
    {
      user_id: userId,
      date: '2025-01-17',
      time_of_day: 'evening',
      sleep_quality: 'good',
      woke_up_night: false,
      night_sweats: false,
      energy_level: 'medium',
      mood: 'content',
      hot_flashes: false,
      dryness: true,
      pain: false,
      bloating: false,
      concentration_difficulty: false,
      sleep_issues: false,
      sexual_desire: true,
      daily_insight: 'יום טוב יותר. עדיין יש יובש אבל הרגשה כללית טובה',
      created_at: '2025-01-17T20:00:00Z',
      updated_at: '2025-01-17T20:00:00Z'
    },
    
    // Entry 7: Day with bloating and pain
    {
      user_id: userId,
      date: '2025-01-18',
      time_of_day: 'morning',
      sleep_quality: 'fair',
      woke_up_night: false,
      night_sweats: false,
      energy_level: 'low',
      mood: 'uncomfortable',
      hot_flashes: false,
      dryness: false,
      pain: true,
      bloating: true,
      concentration_difficulty: false,
      sleep_issues: false,
      sexual_desire: false,
      daily_insight: 'הרגשתי נפוחה וכואבת. קשה לי להתרכז',
      created_at: '2025-01-18T08:30:00Z',
      updated_at: '2025-01-18T08:30:00Z'
    },
    
    // Entry 8: Evening of bloating day
    {
      user_id: userId,
      date: '2025-01-18',
      time_of_day: 'evening',
      sleep_quality: 'fair',
      woke_up_night: false,
      night_sweats: false,
      energy_level: 'low',
      mood: 'uncomfortable',
      hot_flashes: false,
      dryness: false,
      pain: true,
      bloating: true,
      concentration_difficulty: true,
      sleep_issues: false,
      sexual_desire: false,
      daily_insight: 'עדיין נפוחה וכואבת. קשה לי להתרכז בעבודה',
      created_at: '2025-01-18T19:30:00Z',
      updated_at: '2025-01-18T19:30:00Z'
    },
    
    // Entry 9: Good day with exercise
    {
      user_id: userId,
      date: '2025-01-19',
      time_of_day: 'morning',
      sleep_quality: 'excellent',
      woke_up_night: false,
      night_sweats: false,
      energy_level: 'high',
      mood: 'happy',
      hot_flashes: false,
      dryness: false,
      pain: false,
      bloating: false,
      concentration_difficulty: false,
      sleep_issues: false,
      sexual_desire: true,
      daily_insight: 'שינה מעולה אחרי אימון אתמול! הרגשה נהדרת',
      created_at: '2025-01-19T07:45:00Z',
      updated_at: '2025-01-19T07:45:00Z'
    },
    
    // Entry 10: Evening of exercise day
    {
      user_id: userId,
      date: '2025-01-19',
      time_of_day: 'evening',
      sleep_quality: 'excellent',
      woke_up_night: false,
      night_sweats: false,
      energy_level: 'high',
      mood: 'happy',
      hot_flashes: false,
      dryness: false,
      pain: false,
      bloating: false,
      concentration_difficulty: false,
      sleep_issues: false,
      sexual_desire: true,
      daily_insight: 'יום נהדר! אימון הבוקר עזר לי להרגיש אנרגטית כל היום',
      created_at: '2025-01-19T20:15:00Z',
      updated_at: '2025-01-19T20:15:00Z'
    },
    
    // Entry 11: Day with concentration issues
    {
      user_id: userId,
      date: '2025-01-20',
      time_of_day: 'morning',
      sleep_quality: 'fair',
      woke_up_night: false,
      night_sweats: false,
      energy_level: 'medium',
      mood: 'foggy',
      hot_flashes: false,
      dryness: false,
      pain: false,
      bloating: false,
      concentration_difficulty: true,
      sleep_issues: false,
      sexual_desire: false,
      daily_insight: 'קשה לי להתרכז היום. הרגשה של ערפל במוח',
      created_at: '2025-01-20T08:00:00Z',
      updated_at: '2025-01-20T08:00:00Z'
    },
    
    // Entry 12: Evening of concentration day
    {
      user_id: userId,
      date: '2025-01-20',
      time_of_day: 'evening',
      sleep_quality: 'fair',
      woke_up_night: false,
      night_sweats: false,
      energy_level: 'medium',
      mood: 'foggy',
      hot_flashes: false,
      dryness: false,
      pain: false,
      bloating: false,
      concentration_difficulty: true,
      sleep_issues: false,
      sexual_desire: false,
      daily_insight: 'עדיין קשה להתרכז. הרגשה של ערפל במוח לא עברה',
      created_at: '2025-01-20T19:45:00Z',
      updated_at: '2025-01-20T19:45:00Z'
    },
    
    // Entry 13: Mixed symptoms day
    {
      user_id: userId,
      date: '2025-01-21',
      time_of_day: 'morning',
      sleep_quality: 'poor',
      woke_up_night: true,
      night_sweats: true,
      energy_level: 'low',
      mood: 'irritable',
      hot_flashes: true,
      dryness: true,
      pain: false,
      bloating: true,
      concentration_difficulty: true,
      sleep_issues: true,
      sexual_desire: false,
      daily_insight: 'לילה קשה עם גלי חום, הזעות לילה, יובש ונפיחות. הרגשה רעה',
      created_at: '2025-01-21T07:30:00Z',
      updated_at: '2025-01-21T07:30:00Z'
    },
    
    // Entry 14: Evening of mixed symptoms day
    {
      user_id: userId,
      date: '2025-01-21',
      time_of_day: 'evening',
      sleep_quality: 'poor',
      woke_up_night: false,
      night_sweats: true,
      energy_level: 'low',
      mood: 'irritable',
      hot_flashes: true,
      dryness: true,
      pain: false,
      bloating: true,
      concentration_difficulty: true,
      sleep_issues: true,
      sexual_desire: false,
      daily_insight: 'יום קשה עם תסמינים רבים. הרגשה של חוסר שליטה',
      created_at: '2025-01-21T20:00:00Z',
      updated_at: '2025-01-21T20:00:00Z'
    },
    
    // Entry 15: Recovery day
    {
      user_id: userId,
      date: '2025-01-22',
      time_of_day: 'morning',
      sleep_quality: 'good',
      woke_up_night: false,
      night_sweats: false,
      energy_level: 'medium',
      mood: 'hopeful',
      hot_flashes: false,
      dryness: false,
      pain: false,
      bloating: false,
      concentration_difficulty: false,
      sleep_issues: false,
      sexual_desire: true,
      daily_insight: 'הרגשה טובה יותר היום. התסמינים פחתו ואני מרגישה יותר אופטימית',
      created_at: '2025-01-22T08:00:00Z',
      updated_at: '2025-01-22T08:00:00Z'
    }
  ];
  
  // Add entries to database
  try {
    for (const entry of entries) {
      const { error } = await supabase
        .from('daily_entries')
        .insert(entry);
      
      if (error) throw error;
      console.log(`✅ Added entry for ${entry.date} ${entry.time_of_day}`);
    }
    
    console.log(`\n🎉 Successfully added ${entries.length} journal entries for ענבל!`);
    console.log('The entries include:');
    console.log('- Various sleep quality levels (excellent, good, fair, poor)');
    console.log('- Different moods (happy, content, frustrated, tired, etc.)');
    console.log('- Multiple symptoms (hot flashes, night sweats, dryness, bloating, etc.)');
    console.log('- Energy levels from low to high');
    console.log('- Concentration difficulties and sleep issues');
    console.log('- Hebrew insights for each entry');
    
  } catch (error) {
    console.error('Error adding entries:', error);
  }
}

// Run the script
addMockJournalData();
