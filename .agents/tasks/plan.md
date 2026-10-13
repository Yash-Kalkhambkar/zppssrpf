# Implementation Plan: Supabase Storage Image Upload + Senior-Friendly Admin Dashboard

## Project Context

- **Stack**: React 19 + TypeScript + Vite + Supabase + TailwindCSS 4 + lucide-react
- **Supabase Project**: ytmwznrhuvrjgdmcrsjc (already configured)
- **Build Command**: `npm run build`
- **Test Command**: `npm run lint` (TypeScript type checking)
- **Dev Server**: `npm run dev` (runs on port 3000)
- **Current State**: 
  - Basic admin dashboard exists with CRUD for notices/highlights/timeline
  - Image management uses URL inputs only
  - Auth is working with Supabase (admin: kalkhambkarpundalik@gmail.com)
  - DataContext manages all state with dual mode (Supabase + localStorage fallback)
  
## Design Decisions

### 1. Image Upload Strategy
**Decision**: Use Supabase Storage with a public bucket named `school-images` organized by image type folders (hero/, about/, facility/, meal/, principal/).

**Rationale**: 
- Supabase Storage provides free tier with generous limits (1GB storage, 2GB bandwidth)
- Public bucket simplifies access (no signed URLs needed for public website images)
- Folder organization keeps images categorized and easy to manage
- Direct integration with existing Supabase setup (no new services needed)

### 2. UX Simplification for Non-Technical Users
**Decision**: Replace all technical terminology with friendly language, add visual feedback at every action, implement confirmation dialogs, use emoji icons for tabs, and show image previews instead of URLs.

**Rationale**: 
- Principal is elderly and non-technical per user requirement
- Every interaction needs immediate, clear feedback (toast messages)
- Confirmations prevent accidental deletions
- Visual cues (emojis, previews) reduce cognitive load
- No technical jargon (no "URL", "insert", "delete" - use "photo link", "add", "remove")

### 3. Drag-and-Drop Upload Component
**Decision**: Build a reusable `ImageUpload` component with drag-and-drop, file validation, progress indicator, and preview.

**Rationale**: 
- Drag-and-drop is more intuitive than file pickers for non-technical users
- Single reusable component reduces code duplication
- Built-in validation prevents upload errors
- Visual progress builds confidence that action is working

### 4. File Validation Rules
**Decision**: Allow only jpg, png, webp up to 5MB. Show friendly error messages.

**Rationale**: 
- These formats cover all typical school photo needs
- 5MB limit prevents bandwidth abuse while allowing high-quality photos
- Webp provides modern compression with good browser support
- Clear error messages guide principal to fix issues

### 5. Toast Notification System
**Decision**: Implement simple toast notifications using React state (no external library).

**Rationale**: 
- No new dependencies needed (per user constraint)
- Simple implementation sufficient for the use case
- TailwindCSS provides animation utilities
- Toasts provide non-intrusive feedback

---

## Implementation Steps

- [ ] **1. Create Supabase Storage setup documentation**
  
  **What to do**: Create `STORAGE_SETUP.md` with step-by-step instructions for creating the `school-images` bucket in Supabase Dashboard and SQL commands for RLS policies.
  
  **Files to create**: 
  - `e:\Freelancing\zppssrpf\STORAGE_SETUP.md`
  
  **Content**: 
  - Dashboard instructions: Storage → New bucket → Name: `school-images` → Public: Yes
  - SQL for RLS policies on `storage.objects`:
    - Allow public SELECT where `bucket_id = 'school-images'`
    - Allow authenticated INSERT where `bucket_id = 'school-images'`
    - Allow authenticated UPDATE where `bucket_id = 'school-images'`
    - Allow authenticated DELETE where `bucket_id = 'school-images'`
  - Folder structure explanation: `/hero/`, `/about/`, `/facility/`, `/meal/`, `/principal/`
  
  **Verify**: Read the file and confirm all SQL and instructions are clear.

---

- [ ] **2. Create image upload utility functions**
  
  **What to do**: Create `src/lib/imageUpload.ts` with TypeScript functions for uploading to Supabase Storage, deleting old images, and generating public URLs.
  
  **Files to create**: 
  - `e:\Freelancing\zppssrpf\src\lib\imageUpload.ts`
  
  **Key exports**:
  ```typescript
  export interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
  }
  
  export async function uploadImage(
    file: File, 
    folder: string
  ): Promise<UploadResult>
  // Uploads to school-images/{folder}/{timestamp}-{filename}
  // Returns { success: true, url: "https://..." } or { success: false, error: "..." }
  
  export async function deleteImageByUrl(url: string): Promise<boolean>
  // Extracts path from URL and deletes from storage
  // Returns true if successful, false if not found or error
  
  export function getPublicUrl(path: string): string
  // Constructs public URL for a storage path
  ```
  
  **Implementation details**:
  - Use `supabase.storage.from('school-images').upload(path, file)` 
  - Generate unique filenames: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  - Get public URL: `supabase.storage.from('school-images').getPublicUrl(path).data.publicUrl`
  - For delete: parse URL to extract path after `/school-images/`, then call `.remove([path])`
  - Handle `isSupabaseConfigured === false` case: return mock success with placeholder URL
  - All functions must handle errors gracefully and return user-friendly error messages
  
  **Verify**: Run `npm run lint` and confirm no TypeScript errors in this file.

---

- [ ] **3. Create toast notification hook**
  
  **What to do**: Create `src/hooks/useToast.tsx` - a custom React hook for managing toast notifications with auto-dismiss after 4 seconds.
  
  **Files to create**: 
  - `e:\Freelancing\zppssrpf\src\hooks\useToast.tsx`
  
  **Key exports**:
  ```typescript
  export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }
  
  export function useToast() {
    // Returns: { toasts: Toast[], showToast: (message: string, type: Toast['type']) => void, removeToast: (id: string) => void }
  }
  ```
  
  **Implementation details**:
  - Use `useState<Toast[]>([])` to manage active toasts
  - `showToast` creates new toast with UUID and adds to array
  - Auto-remove after 4000ms using `setTimeout`
  - Max 3 toasts visible at once (remove oldest if exceeded)
  
  **Verify**: Run `npm run lint` and confirm no TypeScript errors.

---

- [ ] **4. Create reusable ImageUpload component**
  
  **What to do**: Create `src/components/ImageUpload.tsx` - a drag-and-drop image upload component with preview, validation, progress bar, and friendly messages.
  
  **Files to create**: 
  - `e:\Freelancing\zppssrpf\src\components\ImageUpload.tsx`
  
  **Component signature**:
  ```typescript
  interface ImageUploadProps {
    label: string;              // e.g. "School Building Photo"
    folder: string;             // e.g. "hero"
    currentImageUrl?: string;   // Show preview if exists
    onUploadComplete: (url: string) => void;
    onUploadError?: (error: string) => void;
  }
  ```
  
  **UI Features**:
  - Show current image preview if `currentImageUrl` provided (max-w-xs rounded border)
  - Large drag-and-drop zone with dashed border (border-dashed border-2 border-outline)
  - Icon: `Upload` from lucide-react (w-12 h-12 text-on-surface-variant)
  - Text: "{label}" in font-headline-sm, "Drag a photo here or click to select" in font-body-sm text-on-surface-variant
  - Text: "Photos only (JPG, PNG, WEBP) • Max 5MB" in font-label-sm text-outline
  - When dragging over: highlight zone with bg-primary/5 border-primary
  - During upload: show progress bar and "Uploading..." text
  - After success: briefly show green checkmark and "Photo uploaded!" before calling `onUploadComplete`
  - On error: show red X icon and error message for 3 seconds, then call `onUploadError` if provided
  - Hidden file input with `accept="image/jpeg,image/png,image/webp"`
  - Button: "Choose Photo" (bg-surface-variant hover:bg-outline-variant py-3 px-6 rounded-lg font-label-md)
  
  **Validation**:
  - Check file.type is image/jpeg, image/png, or image/webp
  - Check file.size <= 5MB (5 * 1024 * 1024 bytes)
  - Show friendly errors: "Please choose a photo file (JPG, PNG, or WEBP)" or "Photo is too large. Please choose one under 5MB."
  
  **Mock mode handling**:
  - If `isSupabaseConfigured === false`, show info message: "Storage not configured yet. Using preview mode." and return mock URL
  
  **ARIA labels**: 
  - Drop zone: `aria-label="Upload {label}"`
  - Button: `aria-label="Choose file for {label}"`
  
  **Verify**: Run `npm run lint` and confirm no TypeScript errors.

---

- [ ] **5. Add uploadAndUpdateImage function to DataContext**
  
  **What to do**: Modify `src/context/DataContext.tsx` to add `uploadAndUpdateImage` function that uploads file to Storage and then updates the database setting.
  
  **Files to modify**: 
  - `e:\Freelancing\zppssrpf\src\context\DataContext.tsx`
  
  **Changes**:
  - Import `uploadImage, deleteImageByUrl` from `../lib/imageUpload`
  - Add to `DataContextType` interface:
    ```typescript
    uploadAndUpdateImage: (key: keyof Images, file: File) => Promise<{ success: boolean; error?: string }>;
    ```
  - Implement function:
    ```typescript
    const uploadAndUpdateImage = async (key: keyof Images, file: File) => {
      // Determine folder from key: hero->hero, aboutImg->about, facilityMain->facility, midDayMeal->meal, principal->principal
      const folderMap: Record<keyof Images, string> = {
        heroBg: 'hero',
        aboutImg: 'about',
        facilityMain: 'facility',
        midDayMeal: 'meal',
        principal: 'principal'
      };
      const folder = folderMap[key];
      
      // Upload new image
      const result = await uploadImage(file, folder);
      if (!result.success) {
        return { success: false, error: result.error };
      }
      
      // Delete old image if it's from our storage (check if URL contains 'school-images')
      const oldUrl = data.images[key];
      if (oldUrl && oldUrl.includes('school-images')) {
        await deleteImageByUrl(oldUrl); // Don't block on this
      }
      
      // Update database with new URL
      await updateImage(key, result.url!);
      
      return { success: true };
    };
    ```
  - Add `uploadAndUpdateImage` to context provider value
  
  **Verify**: Run `npm run lint` and confirm no TypeScript errors. The function signature must be compatible with ImageUpload component's needs.

---

- [ ] **6. Create toast notification container component**
  
  **What to do**: Create `src/components/ToastContainer.tsx` - renders active toasts in bottom-right corner with animations.
  
  **Files to create**: 
  - `e:\Freelancing\zppssrpf\src\components\ToastContainer.tsx`
  
  **Component signature**:
  ```typescript
  interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
  }
  ```
  
  **UI**:
  - Fixed position: bottom-6 right-6 z-50
  - Stack toasts vertically with gap-3
  - Each toast: bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg p-4 min-w-[300px] max-w-md
  - Icon based on type: CheckCircle (success/green), XCircle (error/red), Info (info/blue) from lucide-react
  - Text: font-body-md text-on-surface
  - Close button: X icon (w-4 h-4 text-on-surface-variant hover:text-on-surface cursor-pointer)
  - Slide-in animation from right using TailwindCSS: `animate-in slide-in-from-right-full`
  - Fade-out animation when removed: `animate-out fade-out slide-out-to-right-full`
  
  **Verify**: Run `npm run lint` and confirm no TypeScript errors.

---

- [ ] **7. Completely rewrite Admin.tsx with simplified UX**
  
  **What to do**: Rewrite `src/pages/Admin.tsx` to be extremely user-friendly for elderly, non-technical principal. Replace ALL technical language, add confirmations, use ImageUpload components, add toast notifications, and use friendly tab emojis.
  
  **Files to modify**: 
  - `e:\Freelancing\zppssrpf\src\pages\Admin.tsx`
  
  **Major changes**:
  
  **A. Import additions**:
  ```typescript
  import { ImageUpload } from '../components/ImageUpload';
  import { ToastContainer } from '../components/ToastContainer';
  import { useToast } from '../hooks/useToast';
  import { CheckCircle, XCircle, Info } from 'lucide-react'; // For feedback icons
  ```
  
  **B. Tab labels update** (in both desktop and mobile menus):
  - `notices` → "📢 Notices"
  - `highlights` → "⭐ Highlights"
  - `timeline` → "📅 History"
  - `images` → "🖼️ Photos"
  - `admissions` → "📋 Admissions"
  - `inquiries` → "✉️ Messages"
  
  **C. Add tab descriptions** - Each tab section should start with a friendly description:
  - Notices: "Share important announcements with parents and visitors. Active notices appear highlighted on the homepage."
  - Highlights: "Showcase what makes our school special. These appear on the homepage with icons."
  - History: "Our school's journey through the years. Events appear on the About Us page."
  - Photos: "Update the main photos shown across the website. Upload a photo to replace the current one."
  - Admissions: "View admission applications submitted by parents through the website."
  - Messages: "Read messages from visitors who contacted us through the website."
  
  **D. Update NoticesManager**:
  - Change form header: "Add New Notice" → "Share a Notice"
  - Input labels: use placeholders like "e.g. 15" for day, "e.g. Dec" for month, "e.g. Parent-Teacher Meeting" for title
  - Status dropdown: "Active (Show on homepage)" and "Inactive (Hide from homepage)"
  - Add confirmation dialog before delete: `if (window.confirm("Are you sure you want to remove this notice? It will no longer appear on the website.")) { deleteNotice(id); }`
  - Show toast after add: `showToast("Notice added! It will show on the homepage now.", "success")`
  - Show toast after delete: `showToast("Notice removed.", "info")`
  - Large buttons: py-3 px-6 instead of py-2 px-4
  - Submit button text: "Add Notice" → "Share This Notice"
  
  **E. Update HighlightsManager**:
  - Form header: "Add Highlight" → "Add School Feature"
  - Icon input label: "Icon Name" → "Icon (e.g. Star, Heart, Book)" with help text: "Choose from: Monitor, Utensils, Goal, Book, Heart, Star, Award, Users"
  - Description label: "Description" → "Why this is special"
  - Add confirmation before delete: `if (window.confirm("Remove this feature from the homepage?")) { deleteHighlight(id); }`
  - Toast on add: `showToast("Feature added to homepage!", "success")`
  - Toast on delete: `showToast("Feature removed.", "info")`
  - Submit button: "Add Feature"
  
  **F. Update TimelineManager**:
  - Form header: "Add Timeline Event" → "Add Historical Moment"
  - Year label: "Year" with placeholder "e.g. 2010"
  - Title label: "What happened"
  - Description label: "Details"
  - Highlight dropdown: "Normal Event" and "Special Achievement (highlighted in gold)"
  - Confirmation before delete: `if (window.confirm("Remove this event from our history timeline?")) { deleteTimelineEvent(id); }`
  - Toast on add: `showToast("Historical moment added!", "success")`
  - Toast on delete: `showToast("Event removed.", "info")`
  - Submit button: "Add to Timeline"
  
  **G. Completely rewrite ImageSettings**:
  - Remove URL input forms entirely
  - Use ImageUpload component for each image type
  - Map image keys to friendly labels:
    - `heroBg` → "Main Homepage Photo"
    - `aboutImg` → "About Us Page Photo"
    - `facilityMain` → "Facilities Section Photo"
    - `midDayMeal` → "Mid-Day Meal Photo"
    - `principal` → "Principal's Photo"
  - For each image:
    ```tsx
    <div className="border-b border-outline-variant pb-8 last:border-0 last:pb-0">
      <h3 className="font-headline-sm text-primary mb-4">Main Homepage Photo</h3>
      <p className="font-body-sm text-on-surface-variant mb-4">
        This photo appears at the top of the homepage. Choose a beautiful photo of the school.
      </p>
      <ImageUpload
        label="Homepage Photo"
        folder="hero"
        currentImageUrl={images.heroBg}
        onUploadComplete={(url) => {
          handleImageUpload('heroBg', url);
        }}
        onUploadError={(error) => {
          showToast(error, 'error');
        }}
      />
    </div>
    ```
  - Add `handleImageUpload` function:
    ```typescript
    const { uploadAndUpdateImage } = useData();
    const handleImageUpload = async (key: keyof Images, url: string) => {
      showToast("Photo updated! It will appear on the website now.", "success");
    };
    ```
  - Actually, we need to modify this - ImageUpload should accept file and call uploadAndUpdateImage directly:
    ```tsx
    <ImageUpload
      label="Homepage Photo"
      folder="hero"
      currentImageUrl={images.heroBg}
      onFileSelected={async (file) => {
        const result = await uploadAndUpdateImage('heroBg', file);
        if (result.success) {
          showToast("Photo updated successfully!", "success");
        } else {
          showToast(result.error || "Failed to upload photo", "error");
        }
      }}
    />
    ```
  - Note: This requires changing ImageUpload to accept `onFileSelected` instead of managing upload itself. Alternatively, pass `uploadAndUpdateImage` as prop. Let's keep ImageUpload self-contained - it should call uploadImage internally and just notify parent of new URL.
  
  **H. Update AdmissionsManager and InquiriesManager**:
  - Keep view-only (no changes to functionality)
  - Update section headers to use friendly descriptions from above
  - No technical jargon - just clear, simple display of information
  
  **I. Add ToastContainer at bottom of Admin component**:
  ```tsx
  const { toasts, showToast, removeToast } = useToast();
  // ... rest of component
  return (
    <div className="pt-20 flex-grow bg-background flex flex-col">
      {/* existing content */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
  ```
  
  **J. Header updates**:
  - Change "Principal Dashboard" to "School Website Manager"
  - Preview Mode badge remains the same
  
  **Verify**: Run `npm run lint` to check for TypeScript errors. Then run `npm run dev` and manually test:
  1. All tabs load without errors
  2. Tab descriptions are visible
  3. Forms have friendly labels and placeholders
  4. Delete confirmations appear
  5. Toast notifications work (though image upload won't work until bucket is created)

---

- [ ] **8. Update ImageUpload component interface based on integration needs**
  
  **What to do**: After reviewing the Admin.tsx integration, adjust ImageUpload component to work seamlessly with DataContext.
  
  **Files to modify**: 
  - `e:\Freelancing\zppssrpf\src\components\ImageUpload.tsx`
  
  **Updated component signature**:
  ```typescript
  interface ImageUploadProps {
    label: string;
    folder: string;
    currentImageUrl?: string;
    onFileSelected: (file: File) => Promise<void>;
  }
  ```
  
  **Changes**:
  - Component handles UI, validation, and drag-and-drop only
  - Parent (Admin.tsx) handles actual upload via `uploadAndUpdateImage`
  - Show loading state while `onFileSelected` promise is pending
  - Simplified flow: validate → call onFileSelected → parent shows toast
  - Remove internal upload logic, progress bar (parent manages this with toast)
  - Keep validation, drag-and-drop, file input, and preview
  
  **Verify**: Run `npm run lint` and check no TypeScript errors. Test that component interface matches usage in Admin.tsx.

---

- [ ] **9. Final integration testing and refinements**
  
  **What to do**: Run the dev server, test all functionality with mock data (before bucket creation), ensure UX is smooth for non-technical users.
  
  **Files**: All modified files
  
  **Test checklist**:
  - [ ] `npm run lint` passes with no errors
  - [ ] `npm run dev` starts successfully
  - [ ] Login page works (both with and without Supabase)
  - [ ] All 6 tabs load and display correctly
  - [ ] Tab descriptions are visible and helpful
  - [ ] Emoji icons show correctly in tabs
  - [ ] Forms have large, friendly buttons (py-3 px-6)
  - [ ] Delete confirmations appear with friendly text
  - [ ] Notice CRUD: add notice → shows success toast, delete notice → shows confirmation then info toast
  - [ ] Highlight CRUD: same as notices
  - [ ] Timeline CRUD: same as notices
  - [ ] Photos tab: Shows ImageUpload component for each image type
  - [ ] ImageUpload: Shows current image preview if URL exists
  - [ ] ImageUpload: Drag-and-drop zone renders correctly
  - [ ] ImageUpload: File picker opens on button click
  - [ ] ImageUpload: Shows validation error for invalid file types (try .pdf)
  - [ ] ImageUpload: Shows validation error for files over 5MB
  - [ ] ImageUpload: In mock mode, shows "Storage not configured" message
  - [ ] Toast notifications: appear in bottom-right, auto-dismiss after 4s, max 3 visible
  - [ ] Mobile responsive: all tabs and forms work on mobile viewport (test at 375px width)
  - [ ] Accessibility: All buttons and inputs have proper labels, keyboard navigation works
  
  **Verify**: Document any issues found and fix them. Once all tests pass, implementation is complete.

---

- [ ] **10. Create storage bucket and test real uploads**
  
  **What to do**: Follow STORAGE_SETUP.md to create the Supabase Storage bucket, then test actual file uploads.
  
  **Manual steps** (not code):
  1. Open Supabase Dashboard: https://supabase.com/dashboard/project/ytmwznrhuvrjgdmcrsjc
  2. Navigate to Storage → Create new bucket
  3. Name: `school-images`, Public: Yes, Create bucket
  4. Go to SQL Editor, run RLS policy SQL from STORAGE_SETUP.md
  5. Back in app: `npm run dev` and login as admin
  6. Navigate to 🖼️ Photos tab
  7. Upload a real photo for "Main Homepage Photo"
  8. Verify: toast shows success, page refreshes/rerenders with new photo preview
  9. Navigate to homepage, confirm new photo appears
  10. Try uploading to other photo slots
  11. Verify old photos are deleted from storage (check Storage dashboard)
  
  **Files to check**: None (manual verification)
  
  **Verify**: All photos upload successfully, display correctly on website, and old photos are cleaned up from storage.

---

## Post-Implementation Notes

### TypeScript Interfaces Summary

```typescript
// src/lib/imageUpload.ts
export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// src/hooks/useToast.tsx
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// src/components/ImageUpload.tsx
interface ImageUploadProps {
  label: string;
  folder: string;
  currentImageUrl?: string;
  onFileSelected: (file: File) => Promise<void>;
}

// src/context/DataContext.tsx (addition to existing interface)
interface DataContextType {
  // ... existing properties
  uploadAndUpdateImage: (key: keyof Images, file: File) => Promise<{ success: boolean; error?: string }>;
}
```

### Supabase Storage RLS Policies

```sql
-- Run in Supabase SQL Editor after creating bucket
CREATE POLICY "Public can view school images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'school-images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'school-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'school-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'school-images' AND auth.role() = 'authenticated');
```

### Folder Structure in Storage

```
school-images/
├── hero/          # Homepage hero background images
├── about/         # About Us page images
├── facility/      # Facilities section images
├── meal/          # Mid-day meal program images
└── principal/     # Principal's profile photos
```

### File Naming Convention

Format: `{timestamp}-{sanitized-filename}`

Example: `1710234567890-school-building.jpg`

### Friendly Language Mapping

| Technical Term | User-Friendly Term |
|----------------|-------------------|
| Insert/Create | Add / Share |
| Delete | Remove |
| Update | Change / Edit |
| URL | Photo link |
| Upload | Add photo / Choose photo |
| Active/Inactive | Show on homepage / Hide from homepage |
| Database/Storage | (never mentioned to user) |
| Error | Something went wrong |
| Success | Done! / Added! / Updated! |

### Error Messages (User-Friendly)

- ❌ Technical: "Invalid MIME type"
  - ✅ Friendly: "Please choose a photo file (JPG, PNG, or WEBP)"

- ❌ Technical: "File size exceeds limit"
  - ✅ Friendly: "Photo is too large. Please choose one under 5MB."

- ❌ Technical: "Upload failed: 500"
  - ✅ Friendly: "Couldn't upload the photo. Please try again or choose a different one."

- ❌ Technical: "Authentication required"
  - ✅ Friendly: "Please log in again to continue."

### Success Messages

- "Photo updated! It will appear on the website now."
- "Notice added! It will show on the homepage now."
- "Feature added to homepage!"
- "Historical moment added!"
- "Notice removed."
- "Feature removed."
- "Event removed."

### Accessibility Requirements

- All ImageUpload drop zones: `aria-label="Upload {label}"`
- All file input buttons: `aria-label="Choose file for {label}"`
- All form inputs: associated `<label>` elements with meaningful text
- All buttons: clear, descriptive text (no icon-only buttons without labels)
- Keyboard navigation: tab through forms, enter to submit, escape to cancel drag
- Focus indicators: maintain TailwindCSS default focus:ring styles
- Toast notifications: use `role="status"` for success/info, `role="alert"` for errors

### Implementation Order Rationale

1. **Storage setup docs first**: Clear reference before coding
2. **Utility functions next**: Foundation for upload logic
3. **Toast hook before components**: Components depend on it
4. **ImageUpload component**: Reusable UI before integration
5. **DataContext update**: Connect upload to state management
6. **Toast container**: Complete notification system
7. **Admin rewrite**: Integrate all pieces together
8. **Interface adjustments**: Fine-tune based on integration learnings
9. **Testing**: Validate everything works together
10. **Live storage setup**: Final step requires manual dashboard work

This order minimizes rework and ensures each layer is stable before building on it.

---

## Verification Commands

- **Type check**: `npm run lint` (must pass with 0 errors)
- **Dev server**: `npm run dev` (must start on port 3000)
- **Build check**: `npm run build` (must complete successfully)

## Success Criteria

✅ Principal can upload photos by dragging files or clicking a button
✅ No technical jargon visible anywhere in admin interface
✅ Every action shows immediate, friendly feedback (toasts)
✅ Delete operations require confirmation with clear explanation
✅ Tab labels use emojis and friendly names
✅ All forms have large buttons and clear placeholders
✅ Image uploads validate file type and size with friendly errors
✅ Old photos are automatically deleted when new ones are uploaded
✅ Works in both Supabase mode and mock/preview mode
✅ Fully accessible with keyboard navigation and screen readers
✅ Mobile responsive on all screen sizes
✅ TypeScript compiles with no errors
