import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        
        // Delete all possible cookies
        const cookieNames = ['ghl_session', 'ghl_oauth_session'];
        
        for (const name of cookieNames) {
            try {
                cookieStore.delete(name);
                console.log(`[Clear Cookies] Deleted: ${name}`);
            } catch (e) {
                console.log(`[Clear Cookies] Could not delete ${name}:`, e.message);
            }
        }
        
        const baseUrl = process.env.HOST || 'http://localhost:3000';
        return NextResponse.redirect(`${baseUrl}/?cleared=true`);
    } catch (error) {
        console.error('[Clear Cookies] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
