import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {

    const form = await request.json();
    try {
    const { data, error } = await supabase
      .from('responses') // Your Supabase table name
      .insert([
        {...form}
      ]);
    if (error) {
      console.error('Error saving form to Supabase:' + error);
      return NextResponse.json({status: "failure"}, {status: 400});

    } else {
    }
  } catch (error) {
    return NextResponse.json({status: "failure"}, {status: 400});
  }

    return NextResponse.json({status: "success"}, {status: 200});
}