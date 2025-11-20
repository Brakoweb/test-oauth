import { NextResponse } from 'next/server';
import { clearSession } from '../../../../lib/session.js';

export async function GET(request) {
    try {
        await clearSession();
        console.log('[Logout] Session cleared');
        
        const baseUrl = process.env.HOST || 'http://localhost:3000';
        return NextResponse.redirect(`${baseUrl}/`);
    } catch (error) {
        console.error('[Logout] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
