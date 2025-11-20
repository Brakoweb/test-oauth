import { NextResponse } from 'next/server';
import { getTokens } from '../../../../lib/database.js';
import { GoHighLevelOAuthService } from '../../../../services/GHL/OAuth/index.js';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const locationId = searchParams.get('locationId');
        const userId = searchParams.get('userId');

        const baseUrl = process.env.HOST || 'http://localhost:3000';

        // Validate required parameters
        if (!locationId || !userId) {
            return NextResponse.redirect(
                `${baseUrl}/dashboard?error=missing_params`
            );
        }

        // Get stored tokens for this location
        const tokens = getTokens(locationId);
        
        if (!tokens) {
            return NextResponse.redirect(
                `${baseUrl}/dashboard?error=no_tokens&locationId=${locationId}`
            );
        }

        // Fetch user information from GHL
        let userInfo = await GoHighLevelOAuthService.getUserInfo({
            accessToken: tokens.accessToken,
            userId: userId
        });

        // If userInfo fetch fails, user might be from agency level
        // Agency users have access to all locations but their userId is not location-specific
        let isAgencyUser = false;
        let isAdmin = false;

        if (!userInfo) {
            console.log('[SSO] User not found in location, assuming agency-level user');
            // Create minimal user info for agency users
            userInfo = {
                id: userId,
                name: 'Agency User',
                email: 'agency@user',
                roles: {
                    type: 'agency',
                    role: 'admin'
                }
            };
            isAgencyUser = true;
            isAdmin = true; // Agency users have admin privileges
        } else {
            // Determine if user is admin based on their role in GHL
            isAdmin = userInfo.roles?.role === 'admin';
        }

        console.log('[SSO] Creating session for user:', userInfo.email || userInfo.id, 
                    '(isAdmin:', isAdmin, ', isAgency:', isAgencyUser, ')');
        
        // Create JWT token manually
        const { SignJWT } = await import('jose');
        const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
        
        const sessionData = {
            accessToken: tokens.accessToken,
            locationId: locationId,
            userId: userId,
            userInfo: userInfo,
            isAdmin: isAdmin,
            isAgencyUser: isAgencyUser
        };

        const token = await new SignJWT(sessionData)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(secret);

        console.log('[SSO] Token created, length:', token.length);
        console.log('[SSO] Session data:', { userId: sessionData.userId, isAdmin: sessionData.isAdmin, email: sessionData.userInfo.email });
        
        const isSecure = process.env.HOST?.startsWith('https://') || process.env.NODE_ENV === 'production';
        
        // Return HTML with embedded cookie script
        // This is the ONLY way that works reliably with Next.js + ngrok
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Authenticating...</title>
                <script>
                    // Store token in localStorage as fallback
                    localStorage.setItem('ghl_session_token', '${token}');
                </script>
            </head>
            <body>
                <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui, -apple-system, sans-serif;">
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
                        <h2>Iniciando sesión...</h2>
                        <p style="color: #666;">Redirigiendo al dashboard</p>
                    </div>
                </div>
                <script>
                    setTimeout(() => {
                        window.location.href = '${baseUrl}/dashboard-client';
                    }, 500);
                </script>
            </body>
            </html>
        `;

        const response = new NextResponse(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
        });
        
        // Try to set cookie anyway
        response.cookies.set('ghl_session', token, {
            httpOnly: true,
            secure: isSecure,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });
        
        console.log('[SSO] Returning HTML with localStorage fallback');
        
        return response;
        
    } catch (error) {
        console.error('[SSO] Error:', error);
        const baseUrl = process.env.HOST || 'http://localhost:3000';
        return NextResponse.redirect(
            `${baseUrl}/dashboard?error=server_error&message=${encodeURIComponent(error.message)}`
        );
    }
}
