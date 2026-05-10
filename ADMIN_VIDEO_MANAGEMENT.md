# Video Management Guide for Admins

## Overview

All success stories and training videos are now stored in the database and dynamically displayed on the landing page. You have full control over what videos appear where.

---

## Managing Videos via Database (SQL)

### View All Videos
```sql
SELECT id, title, description, category, is_active, view_count, created_at 
FROM training_videos 
ORDER BY display_order, created_at DESC;
```

### View Success Story Videos Only
```sql
SELECT * FROM training_videos 
WHERE category = 'success_story' AND is_active = true 
ORDER BY display_order;
```

### Update Video Title/Description
```sql
UPDATE training_videos 
SET title = 'New Title', description = 'New description'
WHERE id = 'video-uuid-here';
```

### Hide/Show a Video
```sql
-- Hide video
UPDATE training_videos SET is_active = false WHERE id = 'video-uuid-here';

-- Show video
UPDATE training_videos SET is_active = true WHERE id = 'video-uuid-here';
```

### Change Video Display Order
```sql
UPDATE training_videos 
SET display_order = 1 
WHERE id = 'video-uuid-here';

-- Then update others accordingly
UPDATE training_videos SET display_order = 2 WHERE id = 'another-uuid';
UPDATE training_videos SET display_order = 3 WHERE id = 'third-uuid';
```

### Delete a Video (Soft Delete)
```sql
UPDATE training_videos SET is_active = false WHERE id = 'video-uuid-here';
```

### View Video Analytics
```sql
SELECT id, title, view_count, created_at, updated_at 
FROM training_videos 
WHERE category = 'success_story'
ORDER BY view_count DESC;
```

---

## API Endpoints for Admins

### Get All Videos with Filters
```bash
curl -X GET "http://localhost:3000/api/videos?category=success_story"
```

### Get Single Video Details
```bash
curl -X GET "http://localhost:3000/api/videos/[video-id]"
```

### Update Video Metadata
```bash
curl -X PATCH "http://localhost:3000/api/videos" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "video-uuid",
    "title": "New Title",
    "description": "New description",
    "order": 1,
    "isActive": true
  }'
```

### Deactivate Video
```bash
curl -X PATCH "http://localhost:3000/api/videos" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "video-uuid",
    "isActive": false
  }'
```

### Delete Video
```bash
curl -X DELETE "http://localhost:3000/api/videos?id=video-uuid"
```

---

## Video Properties Explained

| Property | Type | Example | Notes |
|----------|------|---------|-------|
| `id` | UUID | `550e8400-e29b-41d4-a716-446655440000` | Auto-generated |
| `title` | String | "Jordan - $30K Success" | 255 chars max |
| `description` | Text | "+$30,000 FTMO Payouts..." | Long form |
| `video_url` | String (URL) | "https://..." or "/uploads/..." | Required |
| `thumbnail_url` | String (URL) | "https://..." | Optional |
| `category` | String | "success_story", "training" | For filtering |
| `tags` | JSON Array | `["forex","ftmo","success"]` | For search/filter |
| `duration_seconds` | Integer | 300 | Video length in seconds |
| `is_free` | Boolean | true/false | Public or restricted |
| `access_level` | String | "public", "qualified", "enrolled", "premium" | Who can view |
| `display_order` | Integer | 1, 2, 3... | Sort order |
| `is_active` | Boolean | true/false | Show on website? |
| `view_count` | Integer | 142 | Auto-tracked |

---

## Best Practices

### 1. **Naming Convention**
```
[Student Name] - [Achievement Type]
Examples:
- Jordan - $30K FTMO Success
- Steve - First Funded Account
- Ian - $24K Monthly Payout
```

### 2. **Category Recommendations**
```
success_story     - Student success testimonials
training          - Educational content
webinar          - Live/recorded webinars
tutorial         - How-to videos
announcement     - Important updates
```

### 3. **Access Levels**
```
public           - Everyone can see (free signup page)
qualified        - After qualification form
enrolled         - Paid course members only
premium          - VIP tier only
```

### 4. **Optimal Video Metadata**
- **Title**: Clear, benefit-focused (50-100 chars)
- **Description**: Specific results/achievements (50-200 chars)
- **Thumbnail**: 1280x720px, clear face/chart
- **Tags**: 3-5 relevant terms
- **Duration**: Keep under 5 minutes for landing page

---

## Common Admin Tasks

### Add New Success Story
```sql
INSERT INTO training_videos (
  title, description, video_url, thumbnail_url, category, 
  tags, is_free, access_level, display_order, is_active
) VALUES (
  'New Student - Achievement',
  'Specific result here',
  'https://videos.example.com/new.mp4',
  'https://thumbs.example.com/new.jpg',
  'success_story',
  '["achievement", "type"]'::jsonb,
  true,
  'public',
  (SELECT COALESCE(MAX(display_order), 0) + 1 FROM training_videos),
  true
);
```

### Reorder Videos
```sql
-- Move video to position 1
UPDATE training_videos SET display_order = 1 WHERE id = 'target-id';

-- Shift others down
UPDATE training_videos SET display_order = display_order + 1 
WHERE id != 'target-id' AND display_order >= 1;
```

### Pause/Resume All
```sql
-- Hide all
UPDATE training_videos SET is_active = false WHERE category = 'success_story';

-- Show all
UPDATE training_videos SET is_active = true WHERE category = 'success_story';
```

### Change Access Level
```sql
-- Make all success stories publicly visible
UPDATE training_videos 
SET access_level = 'public' 
WHERE category = 'success_story';
```

---

## Monitoring & Analytics

### Track Video Engagement
```sql
SELECT 
  title, 
  view_count,
  (view_count::float / EXTRACT(DAY FROM (now() - created_at)) + 1)::int AS views_per_day,
  created_at
FROM training_videos 
WHERE category = 'success_story'
ORDER BY view_count DESC;
```

### Recent Activity
```sql
SELECT id, title, view_count, updated_at 
FROM training_videos 
WHERE category = 'success_story'
ORDER BY updated_at DESC 
LIMIT 10;
```

### Performance by Category
```sql
SELECT 
  category, 
  COUNT(*) as count, 
  AVG(view_count) as avg_views,
  MAX(view_count) as max_views
FROM training_videos 
WHERE is_active = true
GROUP BY category;
```

---

## Video Storage Locations

### Local Uploads
```
/public/uploads/videos/
```
Files are stored with random UUID names:
- `/public/uploads/videos/550e8400-e29b-41d4-a716-446655440000.mp4`

### External URLs (Recommended for Most)
- **YouTube**: `https://youtube.com/embed/VIDEO_ID`
- **Vimeo**: `https://vimeo.com/VIDEO_ID`
- **AWS S3**: `https://bucket.s3.amazonaws.com/video.mp4`
- **Cloudinary**: `https://res.cloudinary.com/...`
- **Custom CDN**: Your CDN URL

---

## Troubleshooting

### Videos Not Showing on Landing Page?

1. **Check if videos exist**:
   ```sql
   SELECT COUNT(*) FROM training_videos WHERE is_active = true;
   ```

2. **Check if category is correct**:
   ```sql
   SELECT category FROM training_videos WHERE id = 'video-id';
   ```

3. **Check if access level allows viewing**:
   ```sql
   SELECT access_level FROM training_videos WHERE id = 'video-id';
   ```

4. **Verify API endpoint works**:
   ```bash
   curl "http://localhost:3000/api/videos?category=success_story"
   ```

### Upload Fails?

- File too large? (Keep under 500MB)
- Wrong format? (Use MP4, WebM, OGG)
- Network issue? (Check server logs)
- Database down? (Check PostgreSQL)

### Video Plays But No Thumbnail?

- Thumbnail URL may be broken
- Just update the video with valid thumbnail URL
- Or use external image hosting (Imgur, CloudinaryR, S3)

---

## Admin Panel Integration (Future)

Once admin panel is built, you'll be able to:
- ✅ Upload videos via UI form
- ✅ Edit video metadata
- ✅ Reorder videos via drag-drop
- ✅ View analytics dashboard
- ✅ Toggle visibility
- ✅ Bulk actions

For now, use SQL or API endpoints directly.
