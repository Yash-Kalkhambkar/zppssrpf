import React, { useState } from 'react';
import { useData, Notice, Highlight, TimelineEvent } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Save, Plus, Trash2, Edit2, Image as ImageIcon, CheckCircle, Clock, LogOut } from 'lucide-react';

interface AdminProps {
  navigate: (route: string) => void;
}

export function Admin({ navigate }: AdminProps) {
  const [activeTab, setActiveTab] = useState<'notices' | 'highlights' | 'timeline' | 'images' | 'admissions' | 'inquiries'>('notices');
  const data = useData();
  const { user, isMock, signOut } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  const tabs = ['notices', 'highlights', 'timeline', 'images', 'admissions', 'inquiries'] as const;

  return (
    <div className="pt-20 flex-grow bg-background flex flex-col">
      <div className="w-full bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <h1 className="font-headline-lg text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">admin_panel_settings</span>
            Principal Dashboard {isMock && <span className="text-sm bg-error-container text-on-error-container px-2 py-1 rounded-full font-label-sm ml-2">Preview Mode</span>}
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-surface-container-highest rounded-lg p-1">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md font-label-md capitalize transition-colors cursor-pointer ${
                    activeTab === tab 
                      ? 'bg-surface-container-lowest text-primary shadow-sm' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button 
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 bg-surface-variant hover:bg-outline-variant transition-colors rounded-lg font-label-md text-on-surface-variant cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
        {/* Mobile Tabs */}
        <div className="md:hidden flex overflow-x-auto bg-surface-container-highest p-1 mx-6 mb-4 rounded-lg snap-x">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-label-md capitalize transition-colors whitespace-nowrap snap-start cursor-pointer ${
                activeTab === tab 
                  ? 'bg-surface-container-lowest text-primary shadow-sm' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-8">
        {activeTab === 'images' && <ImageSettings />}
        {activeTab === 'notices' && <NoticesManager />}
        {activeTab === 'highlights' && <HighlightsManager />}
        {activeTab === 'timeline' && <TimelineManager />}
        {activeTab === 'admissions' && <AdmissionsManager />}
        {activeTab === 'inquiries' && <InquiriesManager />}
      </main>
    </div>
  );
}

function LoginForm() {
  const { mockLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // For this example, we use mockLogin if Supabase is not configured
    // In production, this would call supabase.auth.signInWithPassword()
    try {
      mockLogin();
    } catch (err) {
      setError('Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="pt-20 flex-grow bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
          </div>
          <h2 className="font-headline-lg text-primary">Staff Login</h2>
          <p className="font-body-md text-on-surface-variant mt-2">Sign in to manage school content.</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded mb-6 font-body-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-label-md mb-1">Email</label>
            <input 
              type="email" 
              required 
              defaultValue="principal@school.com"
              className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
            />
          </div>
          <div>
            <label className="block font-label-md mb-1">Password</label>
            <input 
              type="password" 
              required 
              defaultValue="password123"
              className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-label-md py-3 rounded-lg hover:opacity-90 transition-opacity mt-4 flex items-center justify-center"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function ImageSettings() {
  const { images, updateImage } = useData();

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, key: keyof typeof images) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    if (url) {
      updateImage(key, url);
      alert('Image updated successfully! (In a real app this would upload to Supabase Storage)');
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
      <h2 className="font-headline-md text-primary mb-6 flex items-center gap-2">
        <ImageIcon className="w-6 h-6" />
        Manage Website Images
      </h2>
      <p className="font-body-md text-on-surface-variant mb-6">
        Paste a new image URL below to update the corresponding section on the website. In the final version, this will integrate directly with Supabase Buckets.
      </p>

      <div className="space-y-6">
        {(Object.entries(images) as [keyof typeof images, string][]).map(([key, url]) => (
          <form key={key} onSubmit={(e) => handleUpdate(e, key)} className="flex flex-col md:flex-row gap-4 items-end border-b border-outline-variant pb-6 last:border-0 last:pb-0">
            <div className="flex-grow w-full">
              <label className="block font-label-md text-on-surface capitalize mb-2">{(key as string).replace(/([A-Z])/g, ' $1').trim()}</label>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 border border-outline-variant">
                  <img src={url} alt={key} className="w-full h-full object-cover" />
                </div>
                <input 
                  type="url" 
                  name="url" 
                  defaultValue={url} 
                  className="flex-grow border border-outline-variant rounded px-3 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright h-fit self-center"
                />
              </div>
            </div>
            <button type="submit" className="bg-secondary-container text-white px-4 py-2 rounded font-label-md flex items-center gap-2 h-fit shrink-0">
              <Save className="w-4 h-4" /> Save
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}

function NoticesManager() {
  const { notices, addNotice, deleteNotice, updateNotice } = useData();
  
  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addNotice({
      day: formData.get('day') as string,
      month: formData.get('month') as string,
      title: formData.get('title') as string,
      desc: formData.get('desc') as string,
      active: formData.get('active') === 'true'
    });
    e.currentTarget.reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
        <h2 className="font-headline-md text-primary mb-6">Current Notices</h2>
        <div className="space-y-4">
          {notices.map(notice => (
            <div key={notice.id} className="border border-outline-variant rounded p-4 flex flex-col md:flex-row gap-4 justify-between items-start">
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 flex-shrink-0 flex flex-col items-center justify-center rounded ${notice.active ? 'bg-secondary-container text-white' : 'bg-surface-variant text-on-surface-variant'}`}>
                  <span className="font-bold">{notice.day}</span>
                  <span className="text-xs uppercase">{notice.month}</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-sm">{notice.title}</h4>
                  <p className="font-body-md text-sm text-on-surface-variant">{notice.desc}</p>
                  <p className="text-xs mt-1 text-outline">{notice.active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
              <button onClick={() => deleteNotice(notice.id)} className="text-error hover:bg-error-container p-2 rounded transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm h-fit">
        <h2 className="font-headline-md text-primary mb-6 flex items-center gap-2"><Plus className="w-5 h-5"/> Add New Notice</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md mb-1">Day (e.g. 15)</label>
              <input name="day" required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-label-md mb-1">Month (e.g. Aug)</label>
              <input name="month" required className="w-full border rounded p-2" />
            </div>
          </div>
          <div>
            <label className="block font-label-md mb-1">Title</label>
            <input name="title" required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-label-md mb-1">Description</label>
            <textarea name="desc" required className="w-full border rounded p-2" rows={3} />
          </div>
          <div>
            <label className="block font-label-md mb-1">Status</label>
            <select name="active" className="w-full border rounded p-2">
              <option value="true">Active (Highlight)</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded font-label-md">Add Notice</button>
        </form>
      </div>
    </div>
  );
}

function HighlightsManager() {
  const { highlights, addHighlight, deleteHighlight } = useData();

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addHighlight({
      icon: formData.get('icon') as string,
      title: formData.get('title') as string,
      desc: formData.get('desc') as string
    });
    e.currentTarget.reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
        <h2 className="font-headline-md text-primary mb-6">Campus Highlights</h2>
        <div className="space-y-4">
          {highlights.map(h => (
            <div key={h.id} className="border border-outline-variant rounded p-4 flex justify-between items-start gap-4">
              <div>
                <p className="text-xs text-secondary-container mb-1">Icon: {h.icon}</p>
                <h4 className="font-headline-md text-sm">{h.title}</h4>
                <p className="font-body-md text-sm text-on-surface-variant">{h.desc}</p>
              </div>
              <button onClick={() => deleteHighlight(h.id)} className="text-error hover:bg-error-container p-2 rounded transition-colors shrink-0">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm h-fit">
        <h2 className="font-headline-md text-primary mb-6 flex items-center gap-2"><Plus className="w-5 h-5"/> Add Highlight</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block font-label-md mb-1">Icon Name (Lucide React)</label>
            <input name="icon" defaultValue="Star" required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-label-md mb-1">Title</label>
            <input name="title" required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-label-md mb-1">Description</label>
            <textarea name="desc" required className="w-full border rounded p-2" rows={3} />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded font-label-md">Add Highlight</button>
        </form>
      </div>
    </div>
  );
}

function TimelineManager() {
  const { timelineEvents, addTimelineEvent, deleteTimelineEvent } = useData();

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addTimelineEvent({
      year: formData.get('year') as string,
      title: formData.get('title') as string,
      desc: formData.get('desc') as string,
      align: formData.get('align') as 'left' | 'right',
      highlight: formData.get('highlight') === 'true'
    });
    e.currentTarget.reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
        <h2 className="font-headline-md text-primary mb-6">Timeline Events</h2>
        <div className="space-y-4">
          {timelineEvents.map(e => (
            <div key={e.id} className={`border ${e.highlight ? 'border-secondary bg-surface-bright' : 'border-outline-variant'} rounded p-4 flex justify-between items-start gap-4`}>
              <div>
                <span className="bg-primary text-white px-2 py-0.5 rounded text-xs">{e.year}</span>
                <h4 className="font-headline-md text-sm mt-2">{e.title}</h4>
                <p className="font-body-md text-sm text-on-surface-variant">{e.desc}</p>
                <p className="text-xs text-outline mt-2">Alignment: {e.align}</p>
              </div>
              <button onClick={() => deleteTimelineEvent(e.id)} className="text-error hover:bg-error-container p-2 rounded transition-colors shrink-0">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm h-fit">
        <h2 className="font-headline-md text-primary mb-6 flex items-center gap-2"><Plus className="w-5 h-5"/> Add Timeline Event</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md mb-1">Year</label>
              <input name="year" required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-label-md mb-1">Alignment</label>
              <select name="align" className="w-full border rounded p-2">
                <option value="right">Right</option>
                <option value="left">Left</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-label-md mb-1">Title</label>
            <input name="title" required className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-label-md mb-1">Description</label>
            <textarea name="desc" required className="w-full border rounded p-2" rows={3} />
          </div>
          <div>
            <label className="block font-label-md mb-1">Highlight</label>
            <select name="highlight" className="w-full border rounded p-2">
              <option value="false">Normal</option>
              <option value="true">Highlighted (Award)</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded font-label-md">Add Event</button>
        </form>
      </div>
    </div>
  );
}

function AdmissionsManager() {
  const [admissions, setAdmissions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { isMock } = useAuth();

  React.useEffect(() => {
    async function fetchAdmissions() {
      if (isMock) {
        setAdmissions([
          {
            id: 'mock-1',
            student_first_name: 'John',
            student_last_name: 'Doe',
            grade_applying: '1',
            parent_name: 'Jane Doe',
            contact_number: '1234567890',
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);
        setLoading(false);
        return;
      }
      
      const { supabase, isSupabaseConfigured } = await import('../lib/supabase');
      if (isSupabaseConfigured) {
        const { data } = await supabase.from('admissions').select('*').order('created_at', { ascending: false });
        if (data) setAdmissions(data);
      }
      setLoading(false);
    }
    fetchAdmissions();
  }, [isMock]);

  return (
    <div className="space-y-6">
      <h2 className="font-headline-md text-primary">Admission Applications</h2>
      {loading ? (
        <p className="text-on-surface-variant">Loading...</p>
      ) : admissions.length === 0 ? (
        <p className="text-on-surface-variant">No admission applications found.</p>
      ) : (
        <div className="grid gap-4">
          {admissions.map(app => (
            <div key={app.id} className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div>
                <h3 className="font-title-md text-primary">{app.student_first_name} {app.student_last_name}</h3>
                <p className="font-body-sm text-on-surface-variant">Grade Applying: {app.grade_applying}</p>
                <p className="font-body-sm text-on-surface-variant">Parent: {app.parent_name} ({app.contact_number})</p>
                <p className="font-label-sm text-outline mt-1">Submitted: {new Date(app.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-label-md capitalize ${app.status === 'pending' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InquiriesManager() {
  const [inquiries, setInquiries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { isMock } = useAuth();

  React.useEffect(() => {
    async function fetchInquiries() {
      if (isMock) {
        setInquiries([
          {
            id: 'mock-1',
            name: 'Alice Smith',
            email: 'alice@example.com',
            subject: 'Admission inquiry',
            message: 'When does the admission process start?',
            created_at: new Date().toISOString()
          }
        ]);
        setLoading(false);
        return;
      }
      
      const { supabase, isSupabaseConfigured } = await import('../lib/supabase');
      if (isSupabaseConfigured) {
        const { data } = await supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false });
        if (data) setInquiries(data);
      }
      setLoading(false);
    }
    fetchInquiries();
  }, [isMock]);

  return (
    <div className="space-y-6">
      <h2 className="font-headline-md text-primary">Contact Inquiries</h2>
      {loading ? (
        <p className="text-on-surface-variant">Loading...</p>
      ) : inquiries.length === 0 ? (
        <p className="text-on-surface-variant">No inquiries found.</p>
      ) : (
        <div className="grid gap-4">
          {inquiries.map(inq => (
            <div key={inq.id} className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-title-md text-primary">{inq.subject}</h3>
                  <p className="font-body-sm text-on-surface">From: {inq.name} ({inq.email})</p>
                </div>
                <p className="font-label-sm text-outline whitespace-nowrap">{new Date(inq.created_at).toLocaleDateString()}</p>
              </div>
              <p className="font-body-md text-on-surface-variant bg-surface-bright p-3 rounded mt-2 border border-outline-variant/50">
                {inq.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
