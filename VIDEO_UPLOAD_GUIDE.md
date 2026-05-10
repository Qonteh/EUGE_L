# Video Upload Guide

## How Videos Work Now

All videos on the landing page are now fetched from the **database** instead of being hardcoded. This means:

✅ You can upload videos directly through the API
✅ Videos are stored in the database (`training_videos` table)
✅ Videos are automatically displayed on the landing page
✅ You can manage videos from the admin panel (future feature)

---

## How to Upload Videos

### Option 1: Upload via API (JavaScript/Fetch)

```javascript
// Create a FormData object
const formData = new FormData();
formData.append("title", "Jordan's $30K FTMO Success Story");
formData.append("description", "+$30,000 FTMO Payouts in Just 4 Weeks");
formData.append("category", "success_story");
formData.append("video", videoFile); // File from input

// Upload the video
const response = await fetch("/api/videos", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log("Video uploaded:", data);
```

### Option 2: Upload via cURL (from Terminal)

```bash
curl -X POST http://localhost:3000/api/videos \
  -F "title=Jordan's Success Story" \
  -F "description=+\$30,000 FTMO Payouts" \
  -F "category=success_story" \
  -F "video=@/path/to/video.mp4"
```

### Option 3: Upload via URL (Link)

```javascript
// Upload video by URL
const response = await fetch("/api/videos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Jordan's $30K FTMO Success Story",
    description: "+$30,000 FTMO Payouts in Just 4 Weeks",
    videoUrl: "https://example.com/videos/jordan.mp4",
    thumbnailUrl: "https://example.com/thumbnails/jordan.jpg",
    category: "success_story",
    isFree: true,
    accessLevel: "public",
  }),
});
```

---

## Video Upload Endpoint

### POST `/api/videos`

**For File Upload (multipart/form-data):**

```
Headers:
  Content-Type: multipart/form-data

Body (FormData):
  - title (string, required): Video title
  - description (string, optional): Video description
  - category (string, optional): Video category (e.g., "success_story")
  - video (file, required): Video file to upload
```

**For URL-based Upload (JSON):**

```json
{
  "title": "Video Title",
  "description": "Video description",
  "videoUrl": "https://example.com/video.mp4",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "category": "success_story",
  "tags": ["forex", "success"],
  "duration": 120,
  "isFree": true,
  "accessLevel": "public"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "video-uuid",
    "videoUrl": "/uploads/videos/video-uuid.mp4"
  },
  "message": "Video uploaded successfully"
}
```

---

## Get All Videos

### GET `/api/videos`

**Query Parameters:**
- `category` (optional): Filter by category (e.g., "success_story")

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Video Title",
      "description": "Description",
      "videoUrl": "https://...",
      "thumbnailUrl": "https://...",
      "category": "success_story",
      "tags": ["forex"],
      "duration": 120,
      "isFree": true,
      "accessLevel": "public",
      "order": 1,
      "isActive": true,
      "viewCount": 42
    }
  ]
}
```

---

## Database Schema

Videos are stored in the `training_videos` table:

```sql
CREATE TABLE training_videos (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    category VARCHAR(100),
    tags JSONB,
    duration_seconds INTEGER,
    is_free BOOLEAN DEFAULT false,
    access_level VARCHAR(50),
    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## Add Test Videos to Database

Run this SQL in your PostgreSQL database:

```sql
INSERT INTO training_videos (
  title, description, video_url, thumbnail_url, category, 
  tags, is_free, access_level, display_order, is_active
) VALUES (
  'Jordan - $30K FTMO Success',
  '+$30,000 FTMO Payouts in Just 4 Weeks',
  'https://example.com/jordan.mp4',
  'https://example.com/jordan-thumb.jpg',
  'success_story',
  '["forex", "ftmo", "success"]'::jsonb,
  true,
  'public',
  1,
  true
);

INSERT INTO training_videos (
  title, description, video_url, thumbnail_url, category, 
  tags, is_free, access_level, display_order, is_active
) VALUES (
  'Steve - Funded & $9K Payouts',
  'Funded and $9,000+ in Payouts',
  'https://example.com/steve.mp4',
  'https://example.com/steve-thumb.jpg',
  'success_story',
  '["forex", "funded"]'::jsonb,
  true,
  'public',
  2,
  true
);

-- Add more as needed...
```

---

## How It Works on Landing Page

1. **Page Loads**: Landing page fetches all videos from `/api/videos?category=success_story`
2. **Render Videos**: Each video is displayed as a card with play button
3. **Click Play**: User can click to play the video
4. **Track Views**: Each view is recorded in the database

---

## File Upload Storage

Uploaded videos are saved to:
```
/public/uploads/videos/
```

You can also use external URLs (YouTube, Vimeo, S3, Cloudinary, etc.)

---

## Next Steps

1. **Upload success story videos** using the API
2. **Add video thumbnails** for better visual appearance
3. **Set video categories** (success_story, training, etc.)
4. **Manage videos from admin panel** (future feature)
5. **Add video analytics** to track engagement
