import { NextResponse } from "next/server";
import { GoHighLevelOAuthService } from "../../../../../services/GHL/OAuth/index.js";
import { setSession } from '../../../../../lib/session.js';

export async function GET(request, context) {
    try{
        const { action } = await context.params;
        switch(action){
            case 'authorize':
                return NextResponse.redirect(GoHighLevelOAuthService.authorize());
            case 'redirect':
                                const { code } = Object.fromEntries(request.nextUrl.searchParams);
                if(!code){
                    return NextResponse.redirect(process.env.GHL_OAUTH_FAIL);
                }

                const tokenData = await GoHighLevelOAuthService.redirect({code});
                console.log('Token data received:', tokenData);
                
                if (!tokenData || !tokenData.access_token) {
                    console.log('No token data, redirecting to fail');
                    return NextResponse.redirect(process.env.GHL_OAUTH_FAIL);
                }

                console.log('Saving session with:', {
                    accessToken: tokenData.access_token ? 'present' : 'missing',
                    locationId: tokenData.locationId
                });

                const token = await setSession({
                    accessToken: tokenData.access_token,
                    locationId: tokenData.locationId
                });
                
                console.log('Session saved, redirecting to auth-success page');
                
                // Redirect to intermediate page that will then redirect to dashboard
                const successUrl = `${process.env.HOST}/auth-success?redirect=/dashboard`;
                
                const response = NextResponse.redirect(successUrl);
                response.cookies.set('ghl_session', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7,
                    path: '/',
                });
                
                console.log('Cookie set on response, redirecting to:', successUrl);
                return response;    
        }
        return NextResponse.json({message: 'Accion invalida'}, {status: 400})
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}