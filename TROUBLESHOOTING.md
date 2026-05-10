# 🔧 Video System - Troubleshooting Guide

## Common Issues & Solutions

---

## ❌ Videos Not Showing on Landing Page

### Cause: Database Not Connected
**Symptoms**: Blank grid, no videos visible

**Solution**:
1. Make sure PostgreSQL is running
2. Check `.env.local` has correct `DATABASE_URL`
3. Verify database exists: `psql -U postgres -c "\\l"` (look for `euge_trading`)
4. Restart server: `pnpm dev`

### Cause: No Videos in Database
**Symptoms**: Empty state shows "No success stories available"

**Solution**:
```powershell
# Add test videos
.\scripts\seed-videos.ps1

# Or check if videos exist
# In PostgreSQL:
SELECT COUNT(*) FROM training_videos WHERE category = 'success_story' AND is_active = true;
```

### Cause: Videos Set to Inactive
**Symptoms**: Videos were there but disappeared

**Solution**:
```sql
-- Check inactive videos
SELECT title, is_active FROM training_videos WHERE category = 'success_story';

-- Activate them
UPDATE training_videos SET is_active = true WHERE category = 'success_story';
```

### Cause: Wrong Category
**Symptoms**: Videos exist but don't show

**Solution**:
```sql
-- Check categories
SELECT DISTINCT category FROM training_videos;

-- Update to correct category
UPDATE training_videos 
SET category = 'success_story' 
WHERE title LIKE '%Jordan%';  -- example
```

---

## ⚠️ API Returns Error

### Error: "Failed to fetch videos"
**Browser Console Shows**: 404, 500, or network error

**Solutions**:
1. Check server is running: `pnpm dev` should show "Local: http://localhost:3000"
2. Check API directly: http://localhost:3000/api/videos
3. View server logs for specific errors
4. Check Database connection

### Error: "Missing video title"
**When**: Uploading without title

**Solution**:
```javascript
// Always include required fields:
{
  title: "Must provide",  // ✅ Required
  videoUrl: "OR file upload", // ✅ Required
  // Everything else optional
}
```

### Error: "Please upload a valid video file"
**When**: File format wrong or not video

**Solution**:
- Use: MP4, WebM, OGG, MOV
- Avoid: MKV, AVI, FLV
- Max size: 500MB (configurable)

---

## 📹 Video Won't Play

### Cause: Invalid Video URL
**Symptoms**: Player loads but video doesn't play

**Solutions**:
1. Test URL in browser (copy-paste the videoUrl)
2. Check if URL is publicly accessible
3. Check CORS headers if external URL
4. Try different video format

### Cause: iFrame Issue (YouTube/Vimeo)
**Symptoms**: External video won't embed

**Solution**:
```javascript
// YouTube - use embed URL:
"https://www.youtube.com/embed/VIDEO_ID"  // ✅ Correct
"https://youtube.com/watch?v=VIDEO_ID"    // ❌ Won't work

// Vimeo - use embed URL:
"https://vimeo.com/VIDEO_ID"  // ✅ Works for embed
```

### Cause: CORS/Security Issues
**Symptoms**: Console shows CORS error

**Solution**:
1. Use CORS-enabled CDN (AWS S3, Cloudinary, etc)
2. For local uploads: videos auto-serve from `/public/uploads/videos/`
3. Check server headers allow iframe

---

## 🚀 Upload Issues

### Upload Hangs/Timeouts
**Symptoms**: Upload never completes, spins forever

**Solutions**:
1. **Large file**: Break into smaller chunks
   - Current limit: ~500MB
   - Consider hosting on CDN for large files
   
2. **Network issue**:
   - Check internet connection
   - Try different network
   - Check server logs for errors

3. **Server crashed**:
   - Restart: `pnpm dev`
   - Check terminal for error messages

### Upload Fails Silently
**Symptoms**: No error, but video doesn't appear

**Solutions**:
```javascript
// Add error handling:
const response = await fetch('/api/videos', { body });
const data = await response.json();

// Check response
console.log('Status:', response.status);
console.log('Data:', data);
console.log('Success:', data.success);
console.log('Error:', data.error);

if (!response.ok) {
  throw new Error(data.error || 'Upload failed');
}
```

### Disk Full Error
**Symptoms**: Upload fails with disk space error

**Solutions**:
1. Clean up old uploads: `rm -r public/uploads/videos/*`
2. Host videos externally instead of locally
3. Upgrade server storage

---

## 🎨 Visual Issues

### No Thumbnail Showing
**Symptoms**: Placeholder with initials instead of image

**Solutions**:
1. Thumbnail is optional - this is normal
2. To add thumbnail:
   ```javascript
   {
     title: "Video",
     videoUrl: "https://...",
     thumbnailUrl: "https://images.example.com/thumb.jpg"  // Add this
   }
   ```
3. Check thumbnail URL is accessible

### Videos Don't Load on Mobile
**Symptoms**: Works on desktop, fails on phone

**Solutions**:
1. Check video format supports mobile (MP4 recommended)
2. Check thumbnail size (should be <200KB)
3. Test with DevTools mobile view
4. Check CORS for mobile browsers

### Loading Spinner Never Goes Away
**Symptoms**: Infinite spinner, videos never appear

**Solutions**:
1. Check API is returning data: Open DevTools Network
2. Check browser console for JavaScript errors
3. Verify videos exist in database
4. Restart server and refresh page

---

## 🔐 Permission Issues

### Video Says "Access Denied"
**Symptoms**: Video won't play with permission error

**Solution**:
```sql
-- Check access level
SELECT id, title, access_level FROM training_videos;

-- Change to public
UPDATE training_videos SET access_level = 'public' WHERE id = 'video-uuid';

-- Or set appropriate level:
-- 'public' - anyone can see
-- 'qualified' - after form submission
-- 'enrolled' - paid members
-- 'premium' - VIP only
```

---

## 📊 Data Issues

### Duplicate Videos Showing
**Symptoms**: Same video appears twice

**Solution**:
```sql
-- Find duplicates
SELECT title, COUNT(*) as count FROM training_videos 
GROUP BY title HAVING COUNT(*) > 1;

-- Delete duplicates (keep one)
DELETE FROM training_videos 
WHERE id NOT IN (
  SELECT DISTINCT ON (title) id FROM training_videos 
  ORDER BY title, created_at DESC
);
```

### Wrong Video Order
**Symptoms**: Videos showing in wrong sequence

**Solution**:
```sql
-- Check current order
SELECT display_order, title FROM training_videos ORDER BY display_order;

-- Update order
UPDATE training_videos SET display_order = 1 WHERE title = 'Jordan Success';
UPDATE training_videos SET display_order = 2 WHERE title = 'Steve Success';
-- etc...

-- Or reset all
UPDATE training_videos 
SET display_order = ROW_NUMBER() OVER (ORDER BY created_at DESC)
WHERE category = 'success_story';
```

### Video Metadata Wrong
**Symptoms**: Title, description not updating

**Solution**:
```sql
-- Update via SQL
UPDATE training_videos 
SET title = 'New Title', 
    description = 'New description'
WHERE id = 'video-uuid';

-- Or use API PATCH
await fetch('/api/videos', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'video-uuid',
    title: 'New Title',
    description: 'New description'
  })
});
```

---

## 💾 Database Issues

### "Database Connection Failed"
**Symptoms**: Server won't start, DB error in logs

**Solutions**:
1. Start PostgreSQL:
   ```bash
   # Windows - check Services or:
   pg_ctl -D "C:\Program Files\PostgreSQL\data" start
   ```

2. Check connection string in `.env.local`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/euge_trading
   ```

3. Test connection:
   ```bash
   psql postgresql://user:password@localhost:5432/euge_trading
   ```

### "Table Does Not Exist"
**Symptoms**: "relation 'training_videos' does not exist"

**Solution**:
```bash
# Run migrations/schema
psql -U postgres -f database/schema.sql
```

### Data Lost After Restart
**Symptoms**: Videos were there, now gone

**Cause**: Using in-memory storage instead of database

**Solution**:
- Ensure you're using PostgreSQL
- Check `DATABASE_URL` environment variable
- Verify data persists to database, not just memory

---

## 🧪 Testing & Debugging

### Check if Videos in Database
```bash
# Connect to database
psql -U postgres euge_trading

# Run query
SELECT id, title, category, is_active FROM training_videos;
```

### Check API Response
```bash
# In browser DevTools Console:
fetch('/api/videos?category=success_story')
  .then(r => r.json())
  .then(d => console.log(d))

# Or in terminal:
curl "http://localhost:3000/api/videos?category=success_story"
```

### Check Browser Console
```javascript
// Open DevTools (F12) → Console

// Try fetching manually:
fetch('/api/videos').then(r => r.json()).then(console.log)

// Check for errors:
// Look for red messages in console
```

### Server Logs
```bash
# Terminal running "pnpm dev" shows:
# [db] Connection errors
# [v0] Fetch errors
# API responses

# Scroll up to see what went wrong
```

---

## 🆘 Still Not Working?

### Step-by-Step Debug

1. **Is server running?**
   ```bash
   ps aux | grep node  # Mac/Linux
   tasklist | find "node"  # Windows
   ```

2. **Is database running?**
   ```bash
   psql -U postgres -c "\l"  # Should list databases
   ```

3. **Do videos exist in DB?**
   ```bash
   psql -U postgres euge_trading -c "SELECT COUNT(*) FROM training_videos;"
   ```

4. **Is API responding?**
   - Open: http://localhost:3000/api/videos
   - Should show JSON array

5. **Check browser console**
   - Open DevTools (F12)
   - Look for errors
   - Check Network tab

6. **Check server logs**
   - Terminal running "pnpm dev"
   - Look for [db] or [v0] errors

### Restart Everything
```bash
# Stop server: Ctrl+C
# Stop database: depends on your setup

# Restart:
pnpm dev

# Try again: http://localhost:3000
```

---

## 📞 Getting Help

If you're stuck:

1. **Check the docs**:
   - [VIDEO_UPLOAD_GUIDE.md](VIDEO_UPLOAD_GUIDE.md)
   - [QUICK_START_VIDEOS.md](QUICK_START_VIDEOS.md)
   - [ADMIN_VIDEO_MANAGEMENT.md](ADMIN_VIDEO_MANAGEMENT.md)

2. **Run test script**:
   ```powershell
   .\scripts\seed-videos.ps1
   ```

3. **Check logs**:
   - Browser DevTools (F12)
   - Server terminal
   - Database logs

4. **Verify setup**:
   - PostgreSQL running?
   - Environment variables set?
   - All dependencies installed?

5. **Reset and try again**:
   ```bash
   # Reinstall
   pnpm install
   
   # Rebuild
   pnpm build
   
   # Run
   pnpm dev
   ```

Good luck! 🚀
