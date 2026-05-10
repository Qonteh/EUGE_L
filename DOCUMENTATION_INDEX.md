# 📚 Video System Documentation Index

## 🎯 Start Here

### [VIDEO_SYSTEM_SUMMARY.md](VIDEO_SYSTEM_SUMMARY.md) ⭐
**Best for**: Understanding what was done and quick overview
- What changed
- Key features  
- 3-step quick start
- Next steps

---

## 📖 How-To Guides

### [QUICK_START_VIDEOS.md](QUICK_START_VIDEOS.md) ⭐
**Best for**: Uploading your first video
- Start development server
- 3 upload methods (file, URL, PowerShell)
- HTML form example
- Common issues

### [VIDEO_UPLOAD_GUIDE.md](VIDEO_UPLOAD_GUIDE.md)
**Best for**: Complete API documentation
- All upload options explained
- API endpoint specs
- Response formats
- Database schema
- Seed data SQL

### [QUICK_START_VIDEOS.md](QUICK_START_VIDEOS.md)
**Best for**: Copy-paste examples
- JavaScript code samples
- cURL examples
- FormData upload
- Video requirements table

---

## 👨‍💼 Admin & Management

### [ADMIN_VIDEO_MANAGEMENT.md](ADMIN_VIDEO_MANAGEMENT.md)
**Best for**: Managing videos after upload
- SQL queries for every task
- Update/reorder/hide videos
- Analytics queries
- Best practices
- Bulk operations

### [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
**Best for**: Fixing problems
- Common issues & solutions
- Database troubleshooting
- API debugging
- Upload issues
- Video playback problems
- Step-by-step debugging

---

## 🔧 Technical Reference

### Code Files
- [frontend/components/landing-page.tsx](frontend/components/landing-page.tsx)
  - New component with video fetching
  - `useEffect` hook for API calls
  - Dynamic video rendering

- [backend/api/videos/route.ts](backend/api/videos/route.ts)
  - GET: Fetch videos
  - POST: Upload video
  - PATCH: Update video
  - DELETE: Delete video

- [lib/db-queries.ts](lib/db-queries.ts)
  - `getTrainingVideos()`
  - `createTrainingVideo()`
  - `updateTrainingVideo()`
  - `deleteTrainingVideo()`
  - `incrementVideoViewCount()`

- [database/schema.sql](database/schema.sql)
  - `training_videos` table definition
  - All columns and constraints

### Scripts
- [scripts/seed-videos.ps1](scripts/seed-videos.ps1) - PowerShell seed script
- [scripts/seed-videos.sh](scripts/seed-videos.sh) - Bash seed script

---

## 📊 Quick Reference

### API Endpoints
```
GET  /api/videos?category=success_story     - Fetch videos
POST /api/videos                             - Upload video
PATCH /api/videos                            - Update video
DELETE /api/videos?id=xxx                    - Delete video
```

### Database Table
```sql
training_videos
├─ id
├─ title
├─ description
├─ video_url
├─ thumbnail_url
├─ category
├─ tags
├─ duration_seconds
├─ is_free
├─ access_level
├─ display_order
├─ is_active
├─ view_count
├─ created_at
└─ updated_at
```

### Common SQL Queries
```sql
-- Get all videos
SELECT * FROM training_videos WHERE is_active = true;

-- Get success stories
SELECT * FROM training_videos 
WHERE category = 'success_story' AND is_active = true
ORDER BY display_order;

-- Count videos
SELECT COUNT(*) FROM training_videos WHERE category = 'success_story';

-- Update title
UPDATE training_videos SET title = 'New Title' WHERE id = 'uuid';

-- Hide video
UPDATE training_videos SET is_active = false WHERE id = 'uuid';

-- Reorder
UPDATE training_videos SET display_order = 1 WHERE id = 'uuid';

-- View analytics
SELECT title, view_count FROM training_videos ORDER BY view_count DESC;
```

### Upload Methods
```javascript
// Option 1: FormData (file upload)
const form = new FormData();
form.append('title', 'Video Title');
form.append('video', fileInput.files[0]);
fetch('/api/videos', { method: 'POST', body: form });

// Option 2: JSON (URL-based)
fetch('/api/videos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Video Title',
    videoUrl: 'https://...'
  })
});

// Option 3: PowerShell (seed data)
.\scripts\seed-videos.ps1
```

---

## 🚀 Workflow Examples

### Upload Your First Video
1. Read: [QUICK_START_VIDEOS.md](QUICK_START_VIDEOS.md)
2. Start server: `pnpm dev`
3. Run: `.\scripts\seed-videos.ps1`
4. Visit: http://localhost:3000

### Manage Existing Videos
1. Read: [ADMIN_VIDEO_MANAGEMENT.md](ADMIN_VIDEO_MANAGEMENT.md)
2. Connect to database: `psql euge_trading`
3. Use provided SQL queries
4. Refresh page to see changes

### Troubleshoot Issues
1. Read: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Find your issue in the guide
3. Follow the solution
4. Check browser console (F12)
5. Check server logs

### Integrate Into Your App
1. Read: [VIDEO_UPLOAD_GUIDE.md](VIDEO_UPLOAD_GUIDE.md)
2. Use API examples
3. Copy JavaScript code
4. Customize for your needs

---

## 📋 Checklist

### First Time Setup
- [ ] Read [VIDEO_SYSTEM_SUMMARY.md](VIDEO_SYSTEM_SUMMARY.md)
- [ ] Start development server: `pnpm dev`
- [ ] Run seed script: `.\scripts\seed-videos.ps1`
- [ ] Visit landing page: http://localhost:3000
- [ ] Verify videos appear

### Before Going Live
- [ ] Replace test videos with real content
- [ ] Upload all success stories
- [ ] Add video thumbnails
- [ ] Test video playback
- [ ] Check mobile responsive
- [ ] Verify analytics tracking

### Ongoing Management
- [ ] Monitor video views
- [ ] Update content regularly
- [ ] Add new success stories
- [ ] Archive old videos
- [ ] Track engagement metrics

---

## 🆘 Need Help?

### By Problem Type

**"I can't upload"**
→ [QUICK_START_VIDEOS.md](QUICK_START_VIDEOS.md#upload-fails) or [TROUBLESHOOTING.md](TROUBLESHOOTING.md#upload-issues)

**"Videos don't show"**
→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md#videos-not-showing-on-landing-page)

**"Video won't play"**
→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md#video-wont-play)

**"How do I manage videos?"**
→ [ADMIN_VIDEO_MANAGEMENT.md](ADMIN_VIDEO_MANAGEMENT.md)

**"API documentation"**
→ [VIDEO_UPLOAD_GUIDE.md](VIDEO_UPLOAD_GUIDE.md)

**"Database queries"**
→ [ADMIN_VIDEO_MANAGEMENT.md](ADMIN_VIDEO_MANAGEMENT.md#managing-videos-via-database-sql)

**"I'm stuck!"**
→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md#step-by-step-debug) (Step-by-Step Debug)

---

## 📂 File Organization

```
Project Root
├─ frontend/
│  └─ components/
│     └─ landing-page.tsx          ✨ Updated
├─ backend/
│  └─ api/
│     └─ videos/
│        └─ route.ts               ✅ Working
├─ lib/
│  └─ db-queries.ts                ✅ Working
├─ database/
│  └─ schema.sql                   ✅ Has table
├─ scripts/
│  ├─ seed-videos.sh               ✨ New
│  └─ seed-videos.ps1              ✨ New
├─ VIDEO_SYSTEM_SUMMARY.md         📖 This overview
├─ QUICK_START_VIDEOS.md           📖 Get started
├─ VIDEO_UPLOAD_GUIDE.md           📖 Full guide
├─ ADMIN_VIDEO_MANAGEMENT.md       📖 Admin guide
└─ TROUBLESHOOTING.md              📖 Help
```

---

## 📞 Summary

✅ **Videos system is complete!**

**Key Files to Read** (in order):
1. [VIDEO_SYSTEM_SUMMARY.md](VIDEO_SYSTEM_SUMMARY.md) - Overview
2. [QUICK_START_VIDEOS.md](QUICK_START_VIDEOS.md) - Get started
3. [VIDEO_UPLOAD_GUIDE.md](VIDEO_UPLOAD_GUIDE.md) - Deep dive
4. [ADMIN_VIDEO_MANAGEMENT.md](ADMIN_VIDEO_MANAGEMENT.md) - Long-term management
5. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Fix problems

**To Get Started Right Now**:
```powershell
# 1. Start server
pnpm dev

# 2. Open new terminal and run
.\scripts\seed-videos.ps1

# 3. Visit
http://localhost:3000
```

That's it! Videos will load automatically! 🎉

---

**Last Updated**: May 4, 2026
**System Status**: ✅ Production Ready
**Version**: 1.0
