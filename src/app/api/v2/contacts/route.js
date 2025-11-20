import { NextResponse } from 'next/server';
import { getSession } from '../../../../../lib/session.js';
import { GoHighLevelOAuthService } from '../../../../../services/GHL/OAuth/index.js';
import { jwtVerify } from 'jose';

export async function GET(request) {
  try {
    let session = await getSession();
    
    // If no session from cookie, try Authorization header
    if (!session || !session.accessToken) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
          const { payload } = await jwtVerify(token, secret);
          session = payload;
        } catch (e) {
          console.error('[API Contacts] Invalid token:', e.message);
        }
      }
    }
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contacts = await GoHighLevelOAuthService.getContacts({
      accessToken: session.accessToken,
      locationId: session.locationId
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
