#!/bin/bash

# Script to seed test videos to the database
# Usage: bash scripts/seed-videos.sh

API_URL="http://localhost:3000"

echo "🎥 Seeding test success story videos..."

# Video 1: Jordan's Success
curl -X POST "$API_URL/api/videos" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Jordan - $30K FTMO Success",
    "description": "+$30,000 FTMO Payouts in Just 4 Weeks",
    "videoUrl": "https://example.com/videos/jordan.mp4",
    "thumbnailUrl": "https://example.com/thumbnails/jordan.jpg",
    "category": "success_story",
    "tags": ["forex", "ftmo", "success"],
    "duration": 300,
    "isFree": true,
    "accessLevel": "public"
  }'
echo ""

# Video 2: Steve's Success
curl -X POST "$API_URL/api/videos" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Steve - Funded & $9K Payouts",
    "description": "Funded and $9,000+ in Payouts",
    "videoUrl": "https://example.com/videos/steve.mp4",
    "thumbnailUrl": "https://example.com/thumbnails/steve.jpg",
    "category": "success_story",
    "tags": ["forex", "funded"],
    "duration": 280,
    "isFree": true,
    "accessLevel": "public"
  }'
echo ""

# Video 3: Ian's Success
curl -X POST "$API_URL/api/videos" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ian - Leaderboard & $24K Payouts",
    "description": "Prop Firm Leaderboard and $24k in Payouts",
    "videoUrl": "https://example.com/videos/ian.mp4",
    "thumbnailUrl": "https://example.com/thumbnails/ian.jpg",
    "category": "success_story",
    "tags": ["forex", "leaderboard"],
    "duration": 320,
    "isFree": true,
    "accessLevel": "public"
  }'
echo ""

# Video 4: Elijah's Success
curl -X POST "$API_URL/api/videos" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Elijah - Recovered & $7.8K Withdrawn",
    "description": "Almost Lost His Funded Account Then Withdrew $7,857",
    "videoUrl": "https://example.com/videos/elijah.mp4",
    "thumbnailUrl": "https://example.com/thumbnails/elijah.jpg",
    "category": "success_story",
    "tags": ["recovery", "funded"],
    "duration": 350,
    "isFree": true,
    "accessLevel": "public"
  }'
echo ""

# Video 5: George's Success
curl -X POST "$API_URL/api/videos" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "George - FTMO Prime Funded Trader",
    "description": "Now FTMO Prime Funded Trader!",
    "videoUrl": "https://example.com/videos/george.mp4",
    "thumbnailUrl": "https://example.com/thumbnails/george.jpg",
    "category": "success_story",
    "tags": ["ftmo", "prime", "funded"],
    "duration": 290,
    "isFree": true,
    "accessLevel": "public"
  }'
echo ""

echo "✅ Test videos seeded successfully!"
echo "📺 Visit http://localhost:3000 to see the videos on the landing page"
