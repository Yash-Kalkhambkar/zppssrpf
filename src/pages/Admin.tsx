import React, { useState } from 'react';
import { useData, Notice, Highlight, TimelineEvent, Images } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Save, Plus, Trash2, Edit2, Image as ImageIcon, CheckCircle, Clock, LogOut, ShieldCheck, Menu, X } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { ToastContainer } from '../components/ToastContainer';
import { useToast } from '../hooks/useToast';
import { isSupabaseConfigured } from '../lib/supabase';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';

interface AdminProps {
  navigate: (route: string) => void;
}

export function Admin({ navigate }: AdminProps) {
  const [activeTab, setActiveTab] = useState<'notices' | 'highlights' | 'timeline' | 'images' | 'admissions' | 'inquiries'>('notices');
  const [menuOpen, setMenuOpen] = useState(false);
  const data = useData();
  const { user, isMock, signOut } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  if (!user) {
    return <LoginForm />;
  }

  const tabs = [
    { id: 'notices', label: 'Notices', emoji: '📢', description: 'Share important announcements' },
    { id: 'highlights', label: 'Highlights', emoji: '⭐', description: 'Showcase school features' },
    { id: 'timeline', label: 'History', emoji: '📅', description: 'School journey timeline' },
    { id: 'images', label: 'Photos', emoji: '🖼️', description: 'Upload school pictures' },
    { id: 'admissions', label: 'Admissions', emoji: '📋', description: 'View admission requests' },
    { id: 'inquiries', label: 'Messages', emoji: '✉️', description: 'Read parent messages' }
  ] as const;

  const handleTabSelect = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setMenuOpen(false);
  };

  return (
    <div className="pt-20 pb-20 md:pb-0 flex-grow bg-background flex flex-col">
      <div className="w-full bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <h1 className="font-headline-lg text-primary flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            School Website Manager {isMock && <span className="text-sm bg-error-container text-on-error-container px-2 py-1 rounded-full font-label-sm ml-2">Preview Mode</span>}
          </h1>
          <div className="flex items-center gap-4">
            {/* Desktop Tabs */}
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
                  {tab.emoji} {tab.label}
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
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-8">
        {/* Current Tab Header for Mobile */}
        <div className="md:hidden mb-6">
          <h2 className="text-2xl md:text-3xl font-headline-lg text-primary flex items-center gap-3">
            <span className="text-4xl">{tabs.find(t => t.id === activeTab)?.emoji}</span>
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
        </div>

        {activeTab === 'images' && <ImageSettings showToast={showToast} />}
        {activeTab === 'notices' && <NoticesManager showToast={showToast} />}
        {activeTab === 'highlights' && <HighlightsManager showToast={showToast} />}
        {activeTab === 'timeline' && <TimelineManager showToast={showToast} />}
        {activeTab === 'admissions' && <AdmissionsManager />}
        {activeTab === 'inquiries' && <InquiriesManager />}
      </main>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden fixed bottom-4 right-4 z-40 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Bottom Sheet Menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Choose Section</SheetTitle>
          </SheetHeader>
          <div className="space-y-2 mt-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab.id as any)}
                className={`w-full text-left p-4 rounded-lg transition-colors cursor-pointer flex items-start gap-4 min-h-[44px] ${
                  activeTab === tab.id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-surface-container-highest hover:bg-surface-variant border-2 border-transparent'
                }`}
              >
                <span className="text-3xl flex-shrink-0">{tab.emoji}</span>
                <div>
                  <div className="font-headline-sm text-on-surface">{tab.label}</div>
                  <div className="font-body-sm text-on-surface-variant mt-1">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

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
        <h2 className="text-2xl md:text-3xl font-headline-lg text-primary mb-2 flex items-center gap-2">
          <ImageIcon className="w-6 h-6" />
          📸 School Photos
        </h2>
        <p className="text-lg font-body-md text-on-surface-variant">
          Click on any photo below to change it. You can drag a photo from your computer onto the box, or click to browse your files.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-secondary-container/20 border border-secondary-container text-on-surface p-4 rounded-lg mb-6 text-lg font-body-md">
          ⚠️ Photo uploads require a live database connection. Currently in preview mode.
        </div>
      )}

      <div className="space-y-10">
        {imageConfigs.map((config, index) => (
          <div key={config.key} className="border-b border-outline-variant pb-10 last:border-0 last:pb-0">
            <h3 className="text-xl md:text-2xl font-headline-md text-primary mb-3">{config.label}</h3>
            <p className="text-base font-body-md text-on-surface-variant mb-6">
              {config.description}
            </p>
            
            {/* Step-by-step instructions */}
            <div className="bg-surface-bright border border-outline-variant rounded-lg p-4 mb-6">
              <p className="text-lg font-headline-sm text-primary mb-3">How to upload:</p>
              <ol className="space-y-2 text-base font-body-md text-on-surface">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <span className="pt-1">Click on the box below or drag a photo onto it</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <span className="pt-1">Choose a photo from your computer</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <span className="pt-1">Wait for upload to complete (you'll see a checkmark)</span>
                </li>
              </ol>
            </div>

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  
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

  const handleDeleteClick = (notice: Notice) => {
    setNoticeToDelete(notice);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (noticeToDelete) {
      deleteNotice(noticeToDelete.id);
      showToast('Notice removed from the website.', 'info');
      setDeleteDialogOpen(false);
      setNoticeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-headline-lg text-primary mb-2">📢 Notices</h2>
        <p className="text-lg font-body-md text-on-surface-variant">
          Share important announcements with parents and visitors. Active notices appear highlighted on the homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-headline-md text-primary mb-6">Current Notices</h3>
          <div className="space-y-4">
            {notices.map(notice => (
              <div key={notice.id} className="border border-outline-variant rounded-lg p-4 flex flex-col gap-4">
                <div className="flex gap-4 items-start">
                  <div className={`w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center rounded ${notice.active ? 'bg-secondary-container text-white' : 'bg-surface-variant text-on-surface-variant'}`}>
                    <span className="text-xl font-bold">{notice.day}</span>
                    <span className="text-xs uppercase">{notice.month}</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-headline-md">{notice.title}</h4>
                    <p className="text-base font-body-md text-on-surface-variant mt-1">{notice.desc}</p>
                    <p className="text-sm mt-2 text-outline">{notice.active ? '✓ Showing on homepage' : 'Hidden from homepage'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteClick(notice)} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg font-label-md transition-colors flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                  aria-label="Remove notice"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete This Notice
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm h-fit">
          <h3 className="text-xl font-headline-md text-primary mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5"/> Share a Notice
          </h3>
          <form onSubmit={handleAdd} className="space-y-6" aria-label="Add new notice form">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="notice-day" className="block text-lg font-label-md mb-2">Day</label>
                <input 
                  id="notice-day"
                  name="day" 
                  required 
                  placeholder="15"
                  className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
                  aria-required="true"
                />
                <p className="text-sm text-on-surface-variant mt-2">Example: 15</p>
              </div>
              <div>
                <label htmlFor="notice-month" className="block text-lg font-label-md mb-2">Month</label>
                <input 
                  id="notice-month"
                  name="month" 
                  required 
                  placeholder="Apr"
                  className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
                  aria-required="true"
                />
                <p className="text-sm text-on-surface-variant mt-2">Example: Apr or Dec</p>
              </div>
            </div>
            <div>
              <label htmlFor="notice-title" className="block text-lg font-label-md mb-2">Notice Title</label>
              <input 
                id="notice-title"
                name="title" 
                required 
                placeholder="Parent-Teacher Meeting"
                className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
              <p className="text-sm text-on-surface-variant mt-2">Example: Parent-Teacher Meeting</p>
            </div>
            <div>
              <label htmlFor="notice-desc" className="block text-lg font-label-md mb-2">Details</label>
              <textarea 
                id="notice-desc"
                name="desc" 
                required 
                rows={4}
                placeholder="Describe what this notice is about..."
                className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
              <p className="text-sm text-on-surface-variant mt-2">Write what parents need to know</p>
            </div>
            <div>
              <label htmlFor="notice-active" className="block text-lg font-label-md mb-2">Show on website?</label>
              <select 
                id="notice-active"
                name="active" 
                className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
              >
                <option value="true">Active (Show on homepage)</option>
                <option value="false">Inactive (Hide from homepage)</option>
              </select>
              <p className="text-sm text-on-surface-variant mt-2">Choose 'Active' to show it immediately</p>
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-8 text-lg rounded-lg font-label-md transition-colors min-h-[44px] cursor-pointer"
            >
              Add This Notice
            </button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this notice?</DialogTitle>
            <DialogDescription>
              This will remove the notice from the website. Parents will no longer see it.
            </DialogDescription>
          </DialogHeader>
          
          {noticeToDelete && (
            <div className="bg-surface-bright border border-outline-variant rounded-lg p-4 my-4">
              <div className="flex gap-4 items-center mb-3">
                <div className={`w-14 h-14 flex-shrink-0 flex flex-col items-center justify-center rounded ${noticeToDelete.active ? 'bg-secondary-container text-white' : 'bg-surface-variant text-on-surface-variant'}`}>
                  <span className="text-lg font-bold">{noticeToDelete.day}</span>
                  <span className="text-xs uppercase">{noticeToDelete.month}</span>
                </div>
                <div>
                  <h4 className="text-lg font-headline-md">{noticeToDelete.title}</h4>
                  <p className="text-base font-body-md text-on-surface-variant">{noticeToDelete.desc}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto px-6 py-3 border-2 border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-variant transition-colors min-h-[44px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-label-md transition-colors min-h-[44px] cursor-pointer"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HighlightsManager({ showToast }: ManagerProps) {
  const { highlights, addHighlight, deleteHighlight } = useData();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [highlightToDelete, setHighlightToDelete] = useState<Highlight | null>(null);

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

  const handleDeleteClick = (highlight: Highlight) => {
    setHighlightToDelete(highlight);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (highlightToDelete) {
      deleteHighlight(highlightToDelete.id);
      showToast('Feature removed.', 'info');
      setDeleteDialogOpen(false);
      setHighlightToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-headline-lg text-primary mb-2">⭐ Highlights</h2>
        <p className="text-lg font-body-md text-on-surface-variant">
          Showcase what makes our school special. These appear on the homepage with icons.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-headline-md text-primary mb-6">Campus Highlights</h3>
          <div className="space-y-4">
            {highlights.map(h => (
              <div key={h.id} className="border border-outline-variant rounded-lg p-4 flex flex-col gap-4">
                <div>
                  <p className="text-sm text-secondary-container mb-2">Icon: {h.icon}</p>
                  <h4 className="text-lg font-headline-md">{h.title}</h4>
                  <p className="text-base font-body-md text-on-surface-variant mt-1">{h.desc}</p>
                </div>
                <button 
                  onClick={() => handleDeleteClick(h)} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg font-label-md transition-colors flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                  aria-label="Remove highlight"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete This Feature
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm h-fit">
          <h3 className="text-xl font-headline-md text-primary mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5"/> Add School Feature
          </h3>
          <form onSubmit={handleAdd} className="space-y-6" aria-label="Add new highlight form">
            <div>
              <label htmlFor="highlight-icon" className="block text-lg font-label-md mb-2">Icon</label>
              <input 
                id="highlight-icon"
                name="icon" 
                defaultValue="Star" 
                required 
                placeholder="Monitor, Book, Star, Users"
                className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
              <p className="text-sm text-on-surface-variant mt-2">
                Examples: Monitor (computer), Book (library), Star (excellence), Users (students)
              </p>
            </div>
            <div>
              <label htmlFor="highlight-title" className="block text-lg font-label-md mb-2">Title</label>
              <input 
                id="highlight-title"
                name="title" 
                required 
                placeholder="Computer Lab"
                className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
              <p className="text-sm text-on-surface-variant mt-2">Example: Computer Lab, Smart Classroom, Library</p>
            </div>
            <div>
              <label htmlFor="highlight-desc" className="block text-lg font-label-md mb-2">Why this is special</label>
              <textarea 
                id="highlight-desc"
                name="desc" 
                required 
                rows={4}
                placeholder="Explain what makes this feature important..."
                className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
              <p className="text-sm text-on-surface-variant mt-2">Write why parents and students should know about this</p>
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-8 text-lg rounded-lg font-label-md transition-colors min-h-[44px] cursor-pointer"
            >
              Add This Highlight
            </button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this feature?</DialogTitle>
            <DialogDescription>
              This will remove the feature from the homepage. Visitors will no longer see it.
            </DialogDescription>
          </DialogHeader>
          
          {highlightToDelete && (
            <div className="bg-surface-bright border border-outline-variant rounded-lg p-4 my-4">
              <p className="text-sm text-secondary-container mb-2">Icon: {highlightToDelete.icon}</p>
              <h4 className="text-lg font-headline-md">{highlightToDelete.title}</h4>
              <p className="text-base font-body-md text-on-surface-variant mt-2">{highlightToDelete.desc}</p>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto px-6 py-3 border-2 border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-variant transition-colors min-h-[44px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-label-md transition-colors min-h-[44px] cursor-pointer"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TimelineManager({ showToast }: ManagerProps) {
  const { timelineEvents, addTimelineEvent, deleteTimelineEvent } = useData();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<TimelineEvent | null>(null);

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

  const handleDeleteClick = (event: TimelineEvent) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteTimelineEvent(eventToDelete.id);
      showToast('Event removed.', 'info');
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-headline-lg text-primary mb-2">📅 History</h2>
        <p className="text-lg font-body-md text-on-surface-variant">
          Our school's journey through the years. Events appear on the About Us page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-headline-md text-primary mb-6">Timeline Events</h3>
          <div className="space-y-4">
            {timelineEvents.map(e => (
              <div key={e.id} className={`border ${e.highlight ? 'border-secondary bg-surface-bright' : 'border-outline-variant'} rounded-lg p-4 flex flex-col gap-4`}>
                <div>
                  <span className="bg-primary text-white px-3 py-1 rounded text-base font-bold">{e.year}</span>
                  <h4 className="text-lg font-headline-md mt-3">{e.title}</h4>
                  <p className="text-base font-body-md text-on-surface-variant mt-1">{e.desc}</p>
                  <p className="text-sm text-outline mt-2">Position: {e.align === 'left' ? 'Left side' : 'Right side'}</p>
                </div>
                <button 
                  onClick={() => handleDeleteClick(e)} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg font-label-md transition-colors flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                  aria-label="Remove timeline event"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete This Event
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm h-fit">
          <h3 className="text-xl font-headline-md text-primary mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5"/> Add Historical Moment
          </h3>
          <form onSubmit={handleAdd} className="space-y-6" aria-label="Add new timeline event form">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="timeline-year" className="block text-lg font-label-md mb-2">Year</label>
                <input 
                  id="timeline-year"
                  name="year" 
                  required 
                  placeholder="2010"
                  className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
                  aria-required="true"
                />
                <p className="text-sm text-on-surface-variant mt-2">Example: 2010</p>
              </div>
              <div>
                <label htmlFor="timeline-align" className="block text-lg font-label-md mb-2">Position</label>
                <select 
                  id="timeline-align"
                  name="align" 
                  className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
                >
                  <option value="right">Right side</option>
                  <option value="left">Left side</option>
                </select>
                <p className="text-sm text-on-surface-variant mt-2">Choose where it appears</p>
              </div>
            </div>
            <div>
              <label htmlFor="timeline-title" className="block text-lg font-label-md mb-2">What happened</label>
              <input 
                id="timeline-title"
                name="title" 
                required 
                placeholder="School Foundation"
                className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
              <p className="text-sm text-on-surface-variant mt-2">Example: School Foundation, New Building</p>
            </div>
            <div>
              <label htmlFor="timeline-desc" className="block text-lg font-label-md mb-2">Details</label>
              <textarea 
                id="timeline-desc"
                name="desc" 
                required 
                rows={4}
                placeholder="Describe this important moment..."
                className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
                aria-required="true"
              />
              <p className="text-sm text-on-surface-variant mt-2">Write what happened in this year</p>
            </div>
            <div>
              <label htmlFor="timeline-highlight" className="block text-lg font-label-md mb-2">Highlight</label>
              <select 
                id="timeline-highlight"
                name="highlight" 
                className="w-full border-2 border-outline-variant rounded-lg px-4 py-4 text-lg font-body-md focus:border-primary focus:ring-2 focus:ring-primary bg-surface-bright"
              >
                <option value="false">Normal Event</option>
                <option value="true">Special Achievement (highlighted in gold)</option>
              </select>
              <p className="text-sm text-on-surface-variant mt-2">Choose 'Special' for important achievements</p>
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-8 text-lg rounded-lg font-label-md transition-colors min-h-[44px] cursor-pointer"
            >
              Add This Event
            </button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this event?</DialogTitle>
            <DialogDescription>
              This will remove the event from the school history timeline on the About Us page.
            </DialogDescription>
          </DialogHeader>
          
          {eventToDelete && (
            <div className="bg-surface-bright border border-outline-variant rounded-lg p-4 my-4">
              <span className="bg-primary text-white px-3 py-1 rounded text-base font-bold">{eventToDelete.year}</span>
              <h4 className="text-lg font-headline-md mt-3">{eventToDelete.title}</h4>
              <p className="text-base font-body-md text-on-surface-variant mt-2">{eventToDelete.desc}</p>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto px-6 py-3 border-2 border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-variant transition-colors min-h-[44px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-label-md transition-colors min-h-[44px] cursor-pointer"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
