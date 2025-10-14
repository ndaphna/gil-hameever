import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { JournalEntry, JournalFormData } from '@/types/journal';
import { EMOTIONS, PASTEL_COLORS } from '@/constants/journal';
import { validateJournalEntry } from '@/utils/validation';
import { handleApiCall, showErrorAlert } from '@/utils/api';
import { getTodayDateString } from '@/utils/date';

export function useJournal() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<JournalFormData>({
    selectedEmotion: EMOTIONS[2], // Default: רגועה
    selectedColor: PASTEL_COLORS[0],
    notes: '',
  });

  const loadEntries = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('emotion_entry')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  async function handleSaveEntry() {
    const validation = validateJournalEntry(formData.notes);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setSaving(true);
    
    const result = await handleApiCall(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      if (editingEntry) {
        // עריכה - עדכון רשומה קיימת
        const { error } = await supabase
          .from('emotion_entry')
          .update({
            emotion: formData.selectedEmotion.value,
            intensity: formData.selectedEmotion.intensity,
            notes: formData.notes,
            color: formData.selectedColor.value,
          })
          .eq('id', editingEntry.id);

        if (error) throw error;
      } else {
        // הוספה - יצירת רשומה חדשה
        const { error } = await supabase
          .from('emotion_entry')
          .insert({
            user_id: user.id,
            date: getTodayDateString(),
            emotion: formData.selectedEmotion.value,
            intensity: formData.selectedEmotion.intensity,
            notes: formData.notes,
            color: formData.selectedColor.value,
          });

        if (error) throw error;
      }
    });

    if (result.success) {
      // Reset form
      setFormData({
        selectedEmotion: EMOTIONS[2],
        selectedColor: PASTEL_COLORS[0],
        notes: '',
      });
      setEditingEntry(null);
      setShowModal(false);
      
      // Reload entries
      loadEntries();
    } else {
      showErrorAlert(result.error, 'שגיאה בשמירת הרשומה');
    }
    
    setSaving(false);
  }

  async function handleDeleteEntry(id: string) {
    if (!confirm('את בטוחה שברצונך למחוק רשומה זו?')) return;

    const result = await handleApiCall(async () => {
      const { error } = await supabase
        .from('emotion_entry')
        .delete()
        .eq('id', id);

      if (error) throw error;
    });

    if (result.success) {
      loadEntries();
    } else {
      showErrorAlert(result.error, 'שגיאה במחיקת הרשומה');
    }
  }

  function handleEditEntry(entry: JournalEntry) {
    // מצא את הרגש המתאים
    const emotion = EMOTIONS.find(e => e.value === entry.emotion) || EMOTIONS[2];
    const color = PASTEL_COLORS.find(c => c.value === entry.color) || PASTEL_COLORS[0];
    
    // הגדר את הטופס עם הנתונים הקיימים
    setFormData({
      selectedEmotion: emotion,
      selectedColor: color,
      notes: entry.notes,
    });
    setEditingEntry(entry);
    setShowModal(true);
  }

  return {
    entries,
    loading,
    showModal,
    saving,
    formData,
    setFormData,
    setShowModal,
    handleSaveEntry,
    handleDeleteEntry,
    handleEditEntry,
    editingEntry,
  };
}
