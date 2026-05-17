import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 1. Check if env variables are present in Vercel
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !anonKey) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Environment Variables Missing on Vercel',
        details: {
          hasUrl: !!url,
          hasAnonKey: !!anonKey,
          hasServiceKey: !!serviceKey
        }
      }, { status: 500 })
    }

    // 2. Try to connect to Supabase
    const supabase = createServerSupabaseClient()
    
    // 3. Try to fetch 1 product to prove DB is accessible
    const { data, error } = await supabase
      .from('products')
      .select('id, name')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'DATABASE_ERROR',
        message: 'Connected to Supabase, but query failed',
        error: error
      }, { status: 500 })
    }

    // Success!
    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Supabase is perfectly connected to Vercel!',
      data_found: data?.length ?? 0,
      env_vars: {
        hasUrl: true,
        hasAnonKey: true,
        hasServiceKey: !!serviceKey
      }
    })

  } catch (err: any) {
    return NextResponse.json({
      status: 'CRASH',
      message: err.message ?? 'Unknown exception'
    }, { status: 500 })
  }
}
