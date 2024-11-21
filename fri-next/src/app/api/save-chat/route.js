import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {

    const response_data = await request.json();

    try {
    const { data, error } = await supabase
      .from('conversations') // Your Supabase table name
      .insert([
        { 
          prompt_id: response_data.prompt_id,
          conversation: response_data.conversation,
          created_at: new Date()
        }
      ]);

    if (error) {
      console.error('Error saving conversation to Supabase:', error);
      return NextResponse.json({status: "failure"}, {status: 400});

    } else {
    }
  } catch (error) {
    return NextResponse.json({status: "failure"}, {status: 400});
  }

    return NextResponse.json({status: "success"}, {status: 200});
}