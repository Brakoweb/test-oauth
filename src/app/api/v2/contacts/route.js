import { NextResponse } from 'next/server';
import { getSession } from '../../../../../lib/session.js';
import { GoHighLevelOAuthService } from '../../../../../services/GHL/OAuth/index.js';

export async function GET() {
  try {
    const session = await getSession();
    
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
