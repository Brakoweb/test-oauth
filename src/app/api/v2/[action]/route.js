import { NextResponse } from "next/server";
import { GoHighLevelOAuthService } from "../../../../../services/GHL/OAuth/index.js";
import { setSession } from '../../../../../lib/session.js';
import { saveTokens } from '../../../../../lib/database.js';

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
                
                if (!tokenData || !tokenData.access_token) {
                    return NextResponse.redirect(process.env.GHL_OAUTH_FAIL);
                }

                // Save tokens to database (permanent storage)
                saveTokens(tokenData.locationId, tokenData);

                const token = await setSession({
                    accessToken: tokenData.access_token,
                    locationId: tokenData.locationId,
                    isAdmin: true
                });
                
                // Redirect to intermediate page with token in URL (same as SSO flow)
                const successUrl = `${process.env.HOST}/auth-success?token=${encodeURIComponent(token)}`;
                
                return NextResponse.redirect(successUrl);    
        }
        return NextResponse.json({message: 'Accion invalida'}, {status: 400})
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}