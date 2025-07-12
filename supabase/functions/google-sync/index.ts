
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CollegeInfo {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  location?: {
    lat: number;
    lng: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Google Maps API key from environment
    const googleApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!googleApiKey) {
      throw new Error('Google Maps API key not configured')
    }

    // Get all college names from the database
    const { data: colleges, error: collegesError } = await supabaseClient
      .from('cutoffs')
      .select('DISTINCT college_name, city')
      .not('college_name', 'is', null)

    if (collegesError) {
      throw new Error(`Failed to fetch colleges: ${collegesError.message}`)
    }

    const syncResults = []
    const batchSize = 5 // Process 5 colleges at a time to avoid rate limits

    for (let i = 0; i < colleges.length; i += batchSize) {
      const batch = colleges.slice(i, i + batchSize)
      const batchPromises = batch.map(async (college) => {
        try {
          const collegeInfo = await fetchCollegeInfoFromGoogle(
            college.college_name,
            college.city,
            googleApiKey
          )

          if (collegeInfo) {
            // Update college_details table
            const { error: updateError } = await supabaseClient
              .from('college_details')
              .upsert({
                college_name: college.college_name,
                address: collegeInfo.address,
                city: college.city,
                phone: collegeInfo.phone,
                website: collegeInfo.website,
                latitude: collegeInfo.location?.lat,
                longitude: collegeInfo.location?.lng,
                infrastructure_rating: collegeInfo.rating ? Math.min(collegeInfo.rating, 5) : undefined,
                last_google_sync: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'college_name'
              })

            if (updateError) {
              console.error(`Failed to update ${college.college_name}:`, updateError)
              return { college: college.college_name, status: 'failed', error: updateError.message }
            }

            // Log successful sync
            await supabaseClient
              .from('google_sync_log')
              .insert({
                sync_type: 'college_details',
                college_name: college.college_name,
                status: 'success',
                details: { 
                  updated_fields: Object.keys(collegeInfo).filter(key => collegeInfo[key] !== undefined),
                  google_rating: collegeInfo.rating,
                  google_reviews: collegeInfo.reviews
                }
              })

            return { college: college.college_name, status: 'success', data: collegeInfo }
          } else {
            return { college: college.college_name, status: 'no_data' }
          }
        } catch (error) {
          console.error(`Error syncing ${college.college_name}:`, error)
          
          // Log failed sync
          await supabaseClient
            .from('google_sync_log')
            .insert({
              sync_type: 'college_details',
              college_name: college.college_name,
              status: 'failed',
              details: { error: error.message }
            })

          return { college: college.college_name, status: 'failed', error: error.message }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      syncResults.push(...batchResults)

      // Add delay between batches to respect rate limits
      if (i + batchSize < colleges.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    const successCount = syncResults.filter(r => r.status === 'success').length
    const failedCount = syncResults.filter(r => r.status === 'failed').length
    const noDataCount = syncResults.filter(r => r.status === 'no_data').length

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sync completed: ${successCount} successful, ${failedCount} failed, ${noDataCount} no data`,
        results: syncResults,
        summary: {
          total: colleges.length,
          successful: successCount,
          failed: failedCount,
          no_data: noDataCount
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Google sync error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function fetchCollegeInfoFromGoogle(
  collegeName: string,
  city: string,
  apiKey: string
): Promise<CollegeInfo | null> {
  try {
    // Search for the college using Google Places API
    const searchQuery = `${collegeName} ${city} college engineering`
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`
    
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
      console.log(`No Google Places data found for ${collegeName}`)
      return null
    }

    const place = searchData.results[0]
    
    // Get detailed information using Place Details API
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,geometry&key=${apiKey}`
    
    const detailsResponse = await fetch(detailsUrl)
    const detailsData = await detailsResponse.json()

    if (detailsData.status !== 'OK' || !detailsData.result) {
      console.log(`No detailed Google Places data found for ${collegeName}`)
      return null
    }

    const details = detailsData.result

    return {
      name: details.name,
      address: details.formatted_address,
      phone: details.formatted_phone_number,
      website: details.website,
      rating: details.rating,
      reviews: details.user_ratings_total,
      location: details.geometry?.location ? {
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng
      } : undefined
    }

  } catch (error) {
    console.error(`Error fetching Google data for ${collegeName}:`, error)
    throw error
  }
}
