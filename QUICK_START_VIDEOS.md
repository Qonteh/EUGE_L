# Quick Start: Upload Videos

## Step 1: Start Development Server
```bash
cd c:\EUGE_L1
pnpm dev
```

## Step 2: Upload Videos to Database

### Option A: Using PowerShell (Windows) - Easiest ⭐
```powershell
# Navigate to project and run seed script
cd c:\EUGE_L1
.\scripts\seed-videos.ps1
```

### Option B: Upload Direct File (HTML Form Example)
```html
<form id="uploadForm" enctype="multipart/form-data">
  <input type="text" id="title" placeholder="Video Title" required>
  <input type="text" id="description" placeholder="Description">
  <select id="category">
    <option value="success_story">Success Story</option>
    <option value="training">Training</option>
  </select>
  <input type="file" id="video" accept="video/*" required>
  <button type="submit">Upload</button>
</form>

<script>
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('category', document.getElementById('category').value);
  formData.append('video', document.getElementById('video').files[0]);
  
  const response = await fetch('/api/videos', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  console.log('Upload result:', result);
  alert('Video uploaded! Refresh the page to see it.');
});
</script>
```

### Option C: Upload Video by URL
```javascript
// In browser console or any JavaScript file
const response = await fetch('/api/videos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Your Video Title',
    description: 'Description here',
    videoUrl: 'https://example.com/video.mp4',
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    category: 'success_story',
    isFree: true,
    accessLevel: 'public'
  })
});

const result = await response.json();
console.log('Upload result:', result);
```

## Step 3: View Videos on Landing Page
```
Visit: http://localhost:3000
```

The landing page will automatically show:
- ✅ Hero video (first video from database)
- ✅ 5 success story cards in grid
- ✅ Dynamic count updated automatically

---

## Video Requirements

| Field | Required | Example |
|-------|----------|---------|
| title | ✅ Yes | "Jordan's $30K Success" |
| videoUrl or video file | ✅ Yes | File or "https://..." |
| description | ❌ Optional | "Plus $30k in payouts" |
| category | ❌ Optional | "success_story" |
| thumbnailUrl | ❌ Optional | "https://..." |
| tags | ❌ Optional | ["forex", "success"] |
| isFree | ❌ Optional | true (default: false) |
| accessLevel | ❌ Optional | "public" (default: "enrolled") |

---

## Common Issues & Solutions

### Videos not showing?
1. **Check database connection**: Make sure PostgreSQL is running
2. **Check API response**: Open DevTools > Network > /api/videos
3. **Check browser console**: Look for error messages

### Upload fails?
1. **File size**: Keep videos under 500MB (adjust as needed)
2. **Format**: Use MP4, WebM, or Ogg
3. **API error**: Check `/api/videos` response for details

### Videos play but no thumbnail?
- Thumbnails are optional
- If not provided, initials will show as placeholder
- Add thumbnail URL in next upload

---

## Success Story Data Format

To maintain consistency, use this format for success stories:

```javascript
{
  title: "[Name] - [Achievement]",
  description: "[Specific payout/achievement details]",
  category: "success_story",
  videoUrl: "https://your-video-url.com/video.mp4",
  thumbnailUrl: "https://your-thumbnail-url.com/thumb.jpg",
  tags: ["forex", "achievement_type"],
  isFree: true,
  accessLevel: "public"
}
```

Example:
```javascript
{
  title: "Jordan - $30K FTMO Success",
  description: "+$30,000 FTMO Payouts in Just 4 Weeks",
  category: "success_story",
  videoUrl: "https://videos.example.com/jordan.mp4",
  thumbnailUrl: "https://thumbnails.example.com/jordan.jpg",
  tags: ["forex", "ftmo", "payout"],
  isFree: true,
  accessLevel: "public"
}
```

---

## More Help

- 📖 Full guide: [VIDEO_UPLOAD_GUIDE.md](VIDEO_UPLOAD_GUIDE.md)
- 🎬 API docs: See Backend API routes in [backend/api/videos/route.ts](backend/api/videos/route.ts)
- 💾 Database schema: [database/schema.sql](database/schema.sql)
