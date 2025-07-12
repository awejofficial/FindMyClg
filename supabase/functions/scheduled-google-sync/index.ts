
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  try {
    // This function will be called by a cron job
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !anonKey) {
      throw new Error('Supabase configuration not found')
    }

    // Call the google-sync function
    const syncResponse = await fetch(`${supabaseUrl}/functions/v1/google-sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    })

    const syncResult = await syncResponse.json()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Scheduled Google sync completed',
        timestamp: new Date().toISOString(),
        sync_result: syncResult
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Scheduled sync error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
