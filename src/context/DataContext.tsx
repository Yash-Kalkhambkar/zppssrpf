import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { uploadImage, deleteImage } from '../lib/imageUpload';

export interface Notice {
  id: string;
  day: string;
  month: string;
  title: string;
  desc: string;
  active: boolean;
}

export interface Highlight {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  desc: string;
  align: 'left' | 'right';
  highlight?: boolean;
}

export interface Images {
  heroBg: string;
  aboutImg: string;
  facilityMain: string;
  midDayMeal: string;
  principal: string;
}

interface DataState {
  notices: Notice[];
  highlights: Highlight[];
  timelineEvents: TimelineEvent[];
  images: Images;
}

interface DataContextType extends DataState {
  loading: boolean;
  updateNotice: (id: string, notice: Partial<Notice>) => Promise<void>;
  addNotice: (notice: Omit<Notice, 'id'>) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  
  updateHighlight: (id: string, highlight: Partial<Highlight>) => Promise<void>;
  addHighlight: (highlight: Omit<Highlight, 'id'>) => Promise<void>;
  deleteHighlight: (id: string) => Promise<void>;

  updateTimelineEvent: (id: string, event: Partial<TimelineEvent>) => Promise<void>;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => Promise<void>;
  deleteTimelineEvent: (id: string) => Promise<void>;

  updateImage: (key: keyof Images, url: string) => Promise<void>;
  uploadAndUpdateImage: (key: keyof Images, file: File) => Promise<{ success: boolean; error?: string }>;
}

const defaultData: DataState = {
  notices: [
    { id: '1', day: '05', month: 'Apr', title: 'Academic Session Starts', desc: 'New academic year 2024-25 commences.', active: true },
    { id: '2', day: '12', month: 'Apr', title: 'PTA Meeting Schedule', desc: 'Mandatory meeting for Grades 1-4 parents.', active: true },
    { id: '3', day: '28', month: 'Mar', title: 'Final Result Declaration', desc: 'Results for previous academic year.', active: false },
  ],
  highlights: [
    { id: '1', icon: 'Monitor', title: 'Functional Computer Lab', desc: 'Equipped with modern PCs to ensure digital literacy from an early age, preparing students for a technology-driven future.' },
    { id: '2', icon: 'Utensils', title: 'Mid-Day Meal Program', desc: 'Nutritious, hygienically prepared meals served daily to ensure optimal health and focus during study hours.' },
    { id: '3', icon: 'Goal', title: 'Spacious Playground', desc: 'A secure, open outdoor space dedicated to physical education, sports, and recreational activities.' },
  ],
  timelineEvents: [
    { id: '1', year: '1992', title: 'Foundation', desc: 'Establishment of ZPPS SRP CAMP in Solapur North, laying the cornerstone for accessible education in the region.', align: 'right' },
    { id: '2', year: '2005', title: 'Expansion', desc: 'Expansion to 9 functional classrooms to accommodate our steadily growing student body and expanding academic programs.', align: 'left' },
    { id: '3', year: '2012', title: 'Nutrition Program', desc: 'Implementation of the Mid-Day Meal program with dedicated on-site preparation, ensuring holistic student well-being.', align: 'right' },
    { id: '4', year: '2018', title: 'Digital Era', desc: 'Modernization of the Computer Lab, providing functional PCs and essential digital literacy skills for student use.', align: 'left' },
    { id: '5', year: '2023', title: 'Academic Excellence', desc: 'Formal recognition for excellence in Marathi-medium education across the Solapur Urban block.', align: 'right', highlight: true }
  ],
  images: {
    heroBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALygm1ErXoKnsLyG_zwcD-S_Vh1pRBYp_CphjwpUxqB1aYWVQYOmpE1rxafjcUIHvOrlAOjONnZVck8iBVIr7YT3z8KQa5Q2tkHOpSgzbAXkmG6bAoj5rQ13F_BYPBQuSOQCThptM7ScJOBccxftHk-HEVktCPDEIiXX5xpuiGXsaZEb-H0UKDolmjgPdIavhroQBDCVFCWDiRt6JAmOO6xb4c9ujMUQXBWH86BUy9Hm80Z_ij21de',
    aboutImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbwQH9-H6PaF_W8BJf-u1tG8oWAR2DyTQNz2vSJwfC1GVIOJL03QA-ni4zsmxG_929E4TY0-saIovOLoealgLtPj4n6Wjf4X5BeVEXutXse-COKQr2yE0BfiSumGr5DXMc-u-rgozGrV6tdOyV9EUO2RLg_WQsY3KFAAFx8mqaHV6UwIEMdlmSYmGVAa6ZpHknScw4jPJn0F0v-zwvYa308NJpb7j0fft5KkNl6Pj30OILQoST1ymB',
    facilityMain: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXZfJI1KZp6RuJKfeGVz7harQINhxl7dC-WM8HVClKONGDcVYrr0UwRx3WCh5OQIGGuAVS3qqwEXTs0GCakH9_3tZWiyIaFbroeBcYsvIIilMW4hswldvUKyoZb06mmqKXmxoWdLMqsbfp0eOyMpJ6OdPQ5MwB4eglL_1fjqshAPNosbrieAEXem7MfLI09NifW-Jmujm9eJUiFRbiE4A768-OYXrzBc_2X4CD8IZKdhQ5TxwvYfK2',
    midDayMeal: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChEv3ie2C1rLaVcJd1E5X7jAusSOOE0wPvQns-TH7RSnT0ocpoMORdx7OscLnPTeZbCrsPWHHVqBB89atUAJ8bHirApbqRQHDTFNEut3-mRDZIKkpacAPpezwanfdf7KP6pI6_HeKi4lgLJG78Yv7l8ygwh_IRlKJAT1G3fiGSBsNVXg4MGOAtCtkSRgGRHIY0xvbkpoORbez5-knCXsERZpiG-QX3uHGC6NpLDQQFxb11nkCW_7yi',
    principal: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo2THd2lEOArqx4V_hMzm1348G79t7nCPqgGCE0flRJsiH-qNoUyu_WIZOcIsJ5QAkz3-xPs3NNXbFABYQrsDdfU5D-8rnhC72O8XhpNVlbPJJZdhB2y05w2T_mGzIjvi1inbhWgkMRfxpUWDjSAy5TcXch8-zkLlQ6oIMgHpx12Puggat1L_1rLoYNbx7YSCYJyuNfe21S4OWKA6YEMidR9gmWhVA48weLS_-p1fEH0OfgE2trU0v'
  }
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DataState>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseConfigured) {
        // Fallback to local storage
        const saved = localStorage.getItem('schoolData');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setData({
              ...defaultData,
              ...parsed,
              images: { ...defaultData.images, ...(parsed.images || {}) }
            });
          } catch (e) {
            // ignore
          }
        }
        setLoading(false);
        return;
      }

      try {
        const [noticesRes, highlightsRes, timelineRes, settingsRes] = await Promise.all([
          supabase.from('notices').select('*').order('created_at', { ascending: false }),
          supabase.from('highlights').select('*').order('created_at', { ascending: false }),
          supabase.from('timeline_events').select('*').order('year', { ascending: true }),
          supabase.from('app_settings').select('*')
        ]);

        const dbImages = { ...defaultData.images };
        if (settingsRes.data) {
          settingsRes.data.forEach(s => {
            if (s.key_name in dbImages) {
              (dbImages as any)[s.key_name] = s.image_url;
            }
          });
        }

        setData({
          notices: noticesRes.data?.length ? noticesRes.data.map(n => ({
            id: n.id,
            day: n.day,
            month: n.month,
            title: n.title,
            desc: n.description,
            active: n.is_active
          })) : defaultData.notices,
          highlights: highlightsRes.data?.length ? highlightsRes.data.map(h => ({
            id: h.id,
            icon: h.icon,
            title: h.title,
            desc: h.description
          })) : defaultData.highlights,
          timelineEvents: timelineRes.data?.length ? timelineRes.data.map(t => ({
            id: t.id,
            year: t.year,
            title: t.title,
            desc: t.description,
            align: t.alignment,
            highlight: t.is_highlighted
          })) : defaultData.timelineEvents,
          images: dbImages
        });
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured && !loading) {
      localStorage.setItem('schoolData', JSON.stringify(data));
    }
  }, [data, loading]);

  const updateNotice = async (id: string, noticeUpdate: Partial<Notice>) => {
    if (isSupabaseConfigured) {
      const updatePayload: any = {};
      if (noticeUpdate.day !== undefined) updatePayload.day = noticeUpdate.day;
      if (noticeUpdate.month !== undefined) updatePayload.month = noticeUpdate.month;
      if (noticeUpdate.title !== undefined) updatePayload.title = noticeUpdate.title;
      if (noticeUpdate.desc !== undefined) updatePayload.description = noticeUpdate.desc;
      if (noticeUpdate.active !== undefined) updatePayload.is_active = noticeUpdate.active;
      
      await supabase.from('notices').update(updatePayload).eq('id', id);
    }
    setData(prev => ({
      ...prev,
      notices: prev.notices.map(n => n.id === id ? { ...n, ...noticeUpdate } : n)
    }));
  };

  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    let newNotice = { ...notice, id: Date.now().toString() };
    if (isSupabaseConfigured) {
      const { data: inserted, error } = await supabase.from('notices').insert([{
        day: notice.day,
        month: notice.month,
        title: notice.title,
        description: notice.desc,
        is_active: notice.active
      }]).select().single();
      
      if (inserted && !error) {
        newNotice = {
          id: inserted.id,
          day: inserted.day,
          month: inserted.month,
          title: inserted.title,
          desc: inserted.description,
          active: inserted.is_active
        };
      }
    }
    setData(prev => ({ ...prev, notices: [...prev.notices, newNotice] }));
  };

  const deleteNotice = async (id: string) => {
    if (isSupabaseConfigured) {
      await supabase.from('notices').delete().eq('id', id);
    }
    setData(prev => ({ ...prev, notices: prev.notices.filter(n => n.id !== id) }));
  };

  const updateHighlight = async (id: string, highlightUpdate: Partial<Highlight>) => {
    if (isSupabaseConfigured) {
      const updatePayload: any = {};
      if (highlightUpdate.icon !== undefined) updatePayload.icon = highlightUpdate.icon;
      if (highlightUpdate.title !== undefined) updatePayload.title = highlightUpdate.title;
      if (highlightUpdate.desc !== undefined) updatePayload.description = highlightUpdate.desc;
      await supabase.from('highlights').update(updatePayload).eq('id', id);
    }
    setData(prev => ({
      ...prev,
      highlights: prev.highlights.map(h => h.id === id ? { ...h, ...highlightUpdate } : h)
    }));
  };

  const addHighlight = async (highlight: Omit<Highlight, 'id'>) => {
    let newHighlight = { ...highlight, id: Date.now().toString() };
    if (isSupabaseConfigured) {
      const { data: inserted, error } = await supabase.from('highlights').insert([{
        icon: highlight.icon,
        title: highlight.title,
        description: highlight.desc
      }]).select().single();
      
      if (inserted && !error) {
        newHighlight = {
          id: inserted.id,
          icon: inserted.icon,
          title: inserted.title,
          desc: inserted.description
        };
      }
    }
    setData(prev => ({ ...prev, highlights: [...prev.highlights, newHighlight] }));
  };

  const deleteHighlight = async (id: string) => {
    if (isSupabaseConfigured) {
      await supabase.from('highlights').delete().eq('id', id);
    }
    setData(prev => ({ ...prev, highlights: prev.highlights.filter(h => h.id !== id) }));
  };

  const updateTimelineEvent = async (id: string, eventUpdate: Partial<TimelineEvent>) => {
    if (isSupabaseConfigured) {
      const updatePayload: any = {};
      if (eventUpdate.year !== undefined) updatePayload.year = eventUpdate.year;
      if (eventUpdate.title !== undefined) updatePayload.title = eventUpdate.title;
      if (eventUpdate.desc !== undefined) updatePayload.description = eventUpdate.desc;
      if (eventUpdate.align !== undefined) updatePayload.alignment = eventUpdate.align;
      if (eventUpdate.highlight !== undefined) updatePayload.is_highlighted = eventUpdate.highlight;
      await supabase.from('timeline_events').update(updatePayload).eq('id', id);
    }
    setData(prev => ({
      ...prev,
      timelineEvents: prev.timelineEvents.map(e => e.id === id ? { ...e, ...eventUpdate } : e)
    }));
  };

  const addTimelineEvent = async (event: Omit<TimelineEvent, 'id'>) => {
    let newEvent = { ...event, id: Date.now().toString() };
    if (isSupabaseConfigured) {
      const { data: inserted, error } = await supabase.from('timeline_events').insert([{
        year: event.year,
        title: event.title,
        description: event.desc,
        alignment: event.align,
        is_highlighted: event.highlight || false
      }]).select().single();
      
      if (inserted && !error) {
        newEvent = {
          id: inserted.id,
          year: inserted.year,
          title: inserted.title,
          desc: inserted.description,
          align: inserted.alignment as 'left' | 'right',
          highlight: inserted.is_highlighted
        };
      }
    }
    setData(prev => ({ ...prev, timelineEvents: [...prev.timelineEvents, newEvent] }));
  };

  const deleteTimelineEvent = async (id: string) => {
    if (isSupabaseConfigured) {
      await supabase.from('timeline_events').delete().eq('id', id);
    }
    setData(prev => ({ ...prev, timelineEvents: prev.timelineEvents.filter(e => e.id !== id) }));
  };

  const updateImage = async (key: keyof Images, url: string) => {
    if (isSupabaseConfigured) {
      const { data: existing } = await supabase.from('app_settings').select('id').eq('key_name', key).single();
      if (existing) {
        await supabase.from('app_settings').update({ image_url: url }).eq('key_name', key);
      } else {
        await supabase.from('app_settings').insert([{ key_name: key, image_url: url }]);
      }
    }
    setData(prev => ({
      ...prev,
      images: { ...prev.images, [key]: url }
    }));
  };

  const uploadAndUpdateImage = async (key: keyof Images, file: File): Promise<{ success: boolean; error?: string }> => {
    // Map image keys to folder names
    const folderMap: Record<keyof Images, string> = {
      heroBg: 'heroBg',
      aboutImg: 'aboutImg',
      facilityMain: 'facilityMain',
      midDayMeal: 'midDayMeal',
      principal: 'principal'
    };
    const folder = folderMap[key];

    try {
      // Upload new image
      const result = await uploadImage(file, folder);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Delete old image if it's from our storage
      const oldUrl = data.images[key];
      if (oldUrl && oldUrl.includes('school-images')) {
        try {
          await deleteImage(oldUrl);
        } catch (err) {
          // Don't fail if delete fails - just log it
          console.warn('Failed to delete old image:', err);
        }
      }

      // Update database with new URL
      await updateImage(key, result.url!);

      return { success: true };
    } catch (err: any) {
      console.error('Upload and update error:', err);
      return {
        success: false,
        error: err.message || 'Failed to upload photo. Please try again.'
      };
    }
  };

  return (
    <DataContext.Provider value={{
      ...data,
      loading,
      updateNotice, addNotice, deleteNotice,
      updateHighlight, addHighlight, deleteHighlight,
      updateTimelineEvent, addTimelineEvent, deleteTimelineEvent,
      updateImage,
      uploadAndUpdateImage
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}