import { NextResponse } from "next/server"
import {
  createSuccessStory,
  createTrainingVideo,
  createApplication,
  updateSetting,
} from "@/lib/db-queries"

export async function POST() {
  try {
    // Seed some videos
    const videos = [
      {
        title: "Main Hero Video - Introduction",
        description: "The main introduction video that plays on the landing page hero section",
        video_url: "https://youtube.com/watch?v=example1",
        category: "fundamentals",
        is_free: true,
        access_level: "public",
        display_order: 1,
      },
      {
        title: "Traders Accelerator Method Training",
        description: "The main training video shown on the confirmation page",
        video_url: "https://youtube.com/watch?v=example4",
        category: "training",
        is_free: false,
        access_level: "enrolled",
        display_order: 2,
      },
    ]

    for (const v of videos) {
      await createTrainingVideo(v)
    }

    // Seed success stories
    const stories = [
      {
        student_name: 'Michael R.',
        student_location: 'New York, USA',
        profit_amount: 15000.0,
        profit_percentage: 45.0,
        timeframe: '3 months',
        headline: 'From Losing Trader to Consistent Profits',
        short_quote: 'The strategies I learned completely transformed my trading.',
        is_featured: true,
        display_order: 1,
      },
      {
        student_name: 'Sarah K.',
        student_location: 'London, UK',
        profit_amount: 8500.0,
        profit_percentage: 32.0,
        timeframe: '2 months',
        headline: 'Finally Found a System That Works',
        short_quote: 'After trying countless courses, this mentorship finally gave me a proven system I can rely on.',
        is_featured: true,
        display_order: 2,
      },
    ]

    for (const s of stories) {
      await createSuccessStory(s)
    }

    // Seed a couple of sample applications (demo only)
    const apps = [
      {
        full_name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 555-0123',
        country: 'US',
        timezone: 'EST',
        trading_experience: 'Intermediate - Trade regularly',
        trading_capital: '$3,500-$4,999',
        hours_per_week: 10,
        why_join: 'Replace my 9-5 job income with trading',
        biggest_challenge: 'Consistency',
        form_responses: { demo: true },
        is_qualified: true,
      },
    ]

    for (const a of apps) {
      await createApplication(a)
    }

    // Basic settings
    await updateSetting('site_name', 'EUGE Trading Academy')
    await updateSetting('site_tagline', 'Master the Markets with Proven Strategies')
    await updateSetting('contact_email', 'contact@example.com')

    return NextResponse.json({ success: true, message: 'Seed completed' })
  } catch (error) {
    console.error('[seed] Error seeding database:', error)
    return NextResponse.json({ success: false, error: 'Seed failed' }, { status: 500 })
  }
}
