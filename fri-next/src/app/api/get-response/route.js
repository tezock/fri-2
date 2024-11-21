import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {

    const data = await request.json();

    try {

        // make api call to chatgpt
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
            "Authorization": "Bearer " + process.env.NEXT_PUBLIC_GPT_KEY,
            "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
    
        if (!response.ok) {
          console.error('Error getting GPT response:', await response.json());
          return NextResponse.json({status: "failure"}, {status: 400});
    
        } else {
          return NextResponse.json(await response.json(), {status: 200});
        }
      } catch (error) {
        return NextResponse.json({status: "failure"}, {status: 400});
      }
}