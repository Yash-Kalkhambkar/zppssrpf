import React, { useState } from 'react';
import { useData, Notice, Highlight, TimelineEvent, Images } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Save, Plus, Trash2, Edit2, Image as ImageIcon, CheckCircle, Clock, LogOut, ShieldCheck } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { ToastContainer } from '../components/ToastContainer';
import { useToast } from '../hooks/useToast';
import { isSupabaseConfigured } from '../lib/supabase';

interface AdminProps {
  navigate: (route: string) => void;
}

export function Admin({ navigate }: AdminProps) {
  const [activeTab, setActiveTab] = useState<'notices' | 'highlights' | 'timeline' | 'images' | 'admissions' | 'inquiries'>('notices');
  const data = useData();
  const { user, isMock, signOut } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  if (!user) {
    return <LoginForm />;
  }

  const tabs = [
    { id: 'notices', label: '📢 Notices' },
    { id: 'highlights', label: '⭐ Highlights' },
    { id: 'timeline', label: '📅 History' },
    { id: 'images', label: '🖼️ Photos' },
    { id: 'admissions', label: '📋 Admissions' },
    { id: 'inquiries', label: '✉️ Messages' }
  ] as const;

  return (
    <div className="pt-20 flex-grow bg-background flex flex-col">
      <div className="w-full bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <h1 className="font-headline-lg text-primary flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            School Website Manager {isMock && <span className="text-sm bg-error-container text-on-error-container px-2 py-1 rounded-full font-label-sm ml-2">Preview Mode</span>}
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-surface-container-highest rounded-lg p-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-md font-label-md transition-colors cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-surface-container-lowest text-primary shadow-sm' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab.label}
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
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md font-label-md transition-colors whitespace-nowrap snap-start cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-surface-container-lowest text-primary shadow-sm' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-8">
        {activeTab === 'images' && <ImageSettings showToast={showToast} />}
        {activeTab === 'notices' && <NoticesManager showToast={showToast} />}
        {activeTab === 'highlights' && <HighlightsManager showToast={showToast} />}
        {activeTab === 'timeline' && <TimelineManager showToast={showToast} />}
        {activeTab === 'admissions' && <AdmissionsManager />}
        {activeTab === 'inquiries' && <InquiriesManager />}
      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      const { supabase, isSupabaseConfigured } = await import('../lib/supabase');
      
      if (!isSupabaseConfigured) {
        setError('Supabase not configured. Check your .env file.');
        setLoading(false);
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        throw signInError;
      }

      if (!data.user) {
        throw new Error('No user returned from login');
      }

      // Login successful - AuthContext will handle the state update
      console.log('Login successful:', data.user.email);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 flex-grow bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
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
              name="email"
              required 
              placeholder="your-email@gmail.com"
              className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
            />
          </div>
          <div>
            <label className="block font-label-md mb-1">Password</label>
            <input 
              type="password"
              name="password"
              required 
              placeholder="Enter your password"
              className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-label-md py-3 rounded-lg hover:opacity-90 transition-opacity mt-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}

interface ImageSettingsProps {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

function ImageSettings({ showToast }: ImageSettingsProps) {
  const { images, uploadAndUpdateImage } = useData();

  const imageConfigs: Array<{
    key: keyof Images;
    label: string;
    description: string;
  }> = [
    {
      key: 'heroBg',
      label: 'School Building (Main Photo)',
      description: 'This photo appears at the top of the homepage. Choose a beautiful photo of the school building or campus.'
    },
    {
      key: 'aboutImg',
      label: 'About Section Photo',
      description: 'This appears on the About Us page. A group photo or classroom scene works well here.'
    },
    {
      key: 'facilityMain',
      label: 'Facilities Photo',
      description: 'Shows our school facilities like classrooms, labs, or playground.'
    },
    {
      key: 'midDayMeal',
      label: 'Mid-Day Meal Photo',
      description: 'A photo of students enjoying their nutritious meal.'
    },
    {
      key: 'principal',
      label: "Principal's Photo",
      description: 'A professional photo of the school principal.'
    }
  ];

  const handleImageUpload = async (key: keyof Images, file: File) => {
    const result = await uploadAndUpdateImage(key, file);
    if (result.success) {
      showToast('Photo updated! It will appear on the website now.', 'success');
    } else {
      showToast(result.error || 'Failed to upload photo', 'error');
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="font-headline-md text-primary mb-2 flex items-center gap-2">
          <ImageIcon className="w-6 h-6" />
          📸 School Photos
        </h2>
        <p className="font-body-md text-on-surface-variant">
          Click on any photo below to change it. You can drag a photo from your computer onto the box, or click to browse your files.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-secondary-container/20 border border-secondary-container text-on-surface p-4 rounded-lg mb-6 font-body-sm">
          ⚠️ Photo uploads require a live database connection. Currently in preview mode.
        </div>
      )}

      <div className="space-y-8">
        {imageConfigs.map((config) => (
          <div key={config.key} className="border-b border-outline-variant pb-8 last:border-0 last:pb-0">
            <h3 className="font-headline-sm text-primary mb-2">{config.label}</h3>
            <p className="font-body-sm text-on-surface-variant mb-4">
              {config.description}
            </p>
            <ImageUpload
              label={config.label}
              folder={config.key}
              currentImageUrl={images[config.key]}
              onFileSelected={(file) => handleImageUpload(config.key, file)}
              disabled={!isSupabaseConfigured}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface ManagerProps {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

function NoticesManager({ showToast }: ManagerProps) {
  const { notices, addNotice, deleteNotice } = useData();
  
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
    showToast('✅ Notice added! It will appear on the website now.', 'success');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this notice? It will be taken off the website.')) {
      deleteNotice(id);
      showToast('Notice removed from the website.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="font-headline-md text-primary mb-2">📢 Notices</h2>
        <p className="font-body-md text-on-surface-variant">
          Share important announcements with parents and visitors. Active notices appear highlighted on the homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
          <h3 className="font-headline-sm text-primary mb-6">Current Notices</h3>
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
                    <p className="text-xs mt-1 text-outline">{notice.active ? '✓ Showing on homepage' : 'Hidden from homepage'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(notice.id)} 
                  className="text-error hover:bg-error-container p-2 rounded transition-colors"
                  aria-label="Remove notice"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm h-fit">
          <h3 className="font-headline-sm text-primary mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5"/> Share a Notice
          </h3>
          <form onSubmit={handleAdd} className="space-y-4" aria-label="Add new notice form">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="notice-day" className="block font-label-md mb-1">Day</label>
                <input 
                  id="notice-day"
                  name="day" 
                  required 
                  placeholder="e.g. 15"
                  className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="notice-month" className="block font-label-md mb-1">Month</label>
                <input 
                  id="notice-month"
                  name="month" 
                  required 
                  placeholder="e.g. Apr"
                  className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
                  aria-required="true"
                />
              </div>
            </div>
            <div>
              <label htmlFor="notice-title" className="block font-label-md mb-1">Notice Title</label>
              <input 
                id="notice-title"
                name="title" 
                required 
                placeholder="e.g. Parent-Teacher Meeting"
                className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="notice-desc" className="block font-label-md mb-1">Details</label>
              <textarea 
                id="notice-desc"
                name="desc" 
                required 
                rows={3}
                placeholder="Describe what this notice is about..."
                className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="notice-active" className="block font-label-md mb-1">Show on website?</label>
              <select 
                id="notice-active"
                name="active" 
                className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
              >
                <option value="true">Active (Show on homepage)</option>
                <option value="false">Inactive (Hide from homepage)</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-label-md transition-colors"
            >
              Add This Notice
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function HighlightsManager({ showToast }: ManagerProps) {
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
    showToast('Feature added to homepage!', 'success');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this feature from the homepage?')) {
      deleteHighlight(id);
      showToast('Feature removed.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="font-headline-md text-primary mb-2">⭐ Highlights</h2>
        <p className="font-body-md text-on-surface-variant">
          Showcase what makes our school special. These appear on the homepage with icons.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
          <h3 className="font-headline-sm text-primary mb-6">Campus Highlights</h3>
          <div className="space-y-4">
            {highlights.map(h => (
              <div key={h.id} className="border border-outline-variant rounded p-4 flex justify-between items-start gap-4">
                <div>
                  <p className="text-xs text-secondary-container mb-1">Icon: {h.icon}</p>
                  <h4 className="font-headline-md text-sm">{h.title}</h4>
                  <p className="font-body-md text-sm text-on-surface-variant">{h.desc}</p>
                </div>
                <button 
                  onClick={() => handleDelete(h.id)} 
                  className="text-error hover:bg-error-container p-2 rounded transition-colors shrink-0"
                  aria-label="Remove highlight"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm h-fit">
          <h3 className="font-headline-sm text-primary mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5"/> Add School Feature
          </h3>
          <form onSubmit={handleAdd} className="space-y-4" aria-label="Add new highlight form">
            <div>
              <label htmlFor="highlight-icon" className="block font-label-md mb-1">Icon</label>
              <input 
                id="highlight-icon"
                name="icon" 
                defaultValue="Star" 
                required 
                placeholder="e.g. Monitor, Book, Star, Users"
                className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
              <p className="text-xs text-on-surface-variant mt-1">
                Use a Lucide icon name, e.g. Monitor, Book, Star, Users
              </p>
            </div>
            <div>
              <label htmlFor="highlight-title" className="block font-label-md mb-1">Title</label>
              <input 
                id="highlight-title"
                name="title" 
                required 
                placeholder="What makes this special?"
                className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="highlight-desc" className="block font-label-md mb-1">Why this is special</label>
              <textarea 
                id="highlight-desc"
                name="desc" 
                required 
                rows={3}
                placeholder="Explain what makes this feature important..."
                className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-label-md transition-colors"
            >
              Add This Highlight
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function TimelineManager({ showToast }: ManagerProps) {
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
    showToast('Historical moment added!', 'success');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this event from our history timeline?')) {
      deleteTimelineEvent(id);
      showToast('Event removed.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="font-headline-md text-primary mb-2">📅 History</h2>
        <p className="font-body-md text-on-surface-variant">
          Our school's journey through the years. Events appear on the About Us page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
          <h3 className="font-headline-sm text-primary mb-6">Timeline Events</h3>
          <div className="space-y-4">
            {timelineEvents.map(e => (
              <div key={e.id} className={`border ${e.highlight ? 'border-secondary bg-surface-bright' : 'border-outline-variant'} rounded p-4 flex justify-between items-start gap-4`}>
                <div>
                  <span className="bg-primary text-white px-2 py-0.5 rounded text-xs">{e.year}</span>
                  <h4 className="font-headline-md text-sm mt-2">{e.title}</h4>
                  <p className="font-body-md text-sm text-on-surface-variant">{e.desc}</p>
                  <p className="text-xs text-outline mt-2">Position: {e.align === 'left' ? 'Left side' : 'Right side'}</p>
                </div>
                <button 
                  onClick={() => handleDelete(e.id)} 
                  className="text-error hover:bg-error-container p-2 rounded transition-colors shrink-0"
                  aria-label="Remove timeline event"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm h-fit">
          <h3 className="font-headline-sm text-primary mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5"/> Add Historical Moment
          </h3>
          <form onSubmit={handleAdd} className="space-y-4" aria-label="Add new timeline event form">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="timeline-year" className="block font-label-md mb-1">Year</label>
                <input 
                  id="timeline-year"
                  name="year" 
                  required 
                  placeholder="e.g. 2010"
                  className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="timeline-align" className="block font-label-md mb-1">Position</label>
                <select 
                  id="timeline-align"
                  name="align" 
                  className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
                >
                  <option value="right">Right side</option>
                  <option value="left">Left side</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="timeline-title" className="block font-label-md mb-1">What happened</label>
              <input 
                id="timeline-title"
                name="title" 
                required 
                placeholder="e.g. School Foundation"
                className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="timeline-desc" className="block font-label-md mb-1">Details</label>
              <textarea 
                id="timeline-desc"
                name="desc" 
                required 
                rows={3}
                placeholder="Describe this important moment..."
                className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="timeline-highlight" className="block font-label-md mb-1">Highlight</label>
              <select 
                id="timeline-highlight"
                name="highlight" 
                className="w-full border border-outline-variant rounded-lg px-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary bg-surface-bright"
              >
                <option value="false">Normal Event</option>
                <option value="true">Special Achievement (highlighted in gold)</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-label-md transition-colors"
            >
              Add This Event
            </button>
          </form>
        </div>
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

  const count = admissions.length;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="font-headline-md text-primary mb-2 flex items-center gap-2">
          📋 Student Admission Requests
          <span className="text-sm bg-secondary-container text-white px-3 py-1 rounded-full">{count} {count === 1 ? 'application' : 'applications'}</span>
        </h2>
        <p className="font-body-md text-on-surface-variant">
          View admission applications submitted by parents through the website.
        </p>
      </div>

      {loading ? (
        <p className="text-on-surface-variant">Loading...</p>
      ) : admissions.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-12 text-center">
          <p className="text-on-surface-variant font-body-lg">🎉 No admission applications yet!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {admissions.map(app => (
            <div key={app.id} className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg flex flex-col md:flex-row gap-4 justify-between items-start md:items-center shadow-sm">
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

  const count = inquiries.length;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="font-headline-md text-primary mb-2 flex items-center gap-2">
          ✉️ Contact Messages from Parents
          <span className="text-sm bg-secondary-container text-white px-3 py-1 rounded-full">{count} {count === 1 ? 'message' : 'messages'}</span>
        </h2>
        <p className="font-body-md text-on-surface-variant">
          Read messages from visitors who contacted us through the website.
        </p>
      </div>

      {loading ? (
        <p className="text-on-surface-variant">Loading...</p>
      ) : inquiries.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-12 text-center">
          <p className="text-on-surface-variant font-body-lg">📬 No messages yet!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {inquiries.map(inq => (
            <div key={inq.id} className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg flex flex-col gap-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-title-md text-primary">{inq.subject}</h3>
                  <p className="font-body-sm text-on-surface">From: {inq.name} ({inq.email})</p>
                </div>
                <p className="font-label-sm text-outline whitespace-nowrap">{new Date(inq.created_at).toLocaleDateString()}</p>
              </div>
              <p className="font-body-md text-on-surface-variant bg-surface-bright p-4 rounded border border-outline-variant/50">
                {inq.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
