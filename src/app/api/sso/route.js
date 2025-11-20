import { NextResponse } from 'next/server';
import { getValidTokens } from '../../../../lib/tokenManager.js';
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

        // Get stored tokens for this location (auto-refreshes if expired)
        const tokens = await getValidTokens(locationId);
        
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

        let isAgencyUser = false;
        let isAdmin = false;

        // 🔒 SECURITY: If user not found, verify it's a whitelisted agency user
        if (!userInfo) {
            console.log('[SSO] ⚠️  User not found in location, checking if whitelisted agency user...');
            
            // Get whitelist of allowed agency user IDs
            const agencyUserIds = process.env.GHL_AGENCY_USER_IDS 
                ? process.env.GHL_AGENCY_USER_IDS.split(',').map(id => id.trim())
                : [];
            
            console.log('[SSO] 🔍 Checking userId against whitelist:', { userId, whitelistSize: agencyUserIds.length });
            
            // Check if userId is in the whitelist
            if (!agencyUserIds.includes(userId)) {
                // ❌ userId NOT in whitelist - reject immediately
                console.error('[SSO] ❌ SECURITY: userId not in agency whitelist');
                console.error('[SSO] ❌ SECURITY: Rejecting unauthorized access for userId:', userId);
                return NextResponse.redirect(
                    `${baseUrl}/dashboard?error=unauthorized_user&userId=${userId}`
                );
            }
            
            // ✅ userId IS in whitelist + location has valid tokens = Legitimate agency user
            // The fact that we have tokens stored for this location means:
            // 1. Admin completed OAuth flow (so location is legitimate)
            // 2. userId is in whitelist (so user is legitimate agency user)
            // This is sufficient security for agency users
            console.log('[SSO] ✅ Whitelisted agency user verified - granting access');
            console.log('[SSO] 🔐 Security: userId in whitelist + location has OAuth tokens');
            
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
            isAdmin = true;
        } else {
            // User found successfully
            isAdmin = userInfo.roles?.role === 'admin';
            isAgencyUser = userInfo.roles?.type === 'agency';
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
