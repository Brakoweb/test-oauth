import { NextResponse } from "next/server";
import { GoHighLevelOAuthService } from "../../../../../services/GHL/OAuth/index.js";

export async function GET(req, res) {
    try{
        const {action}= await res.params;
        switch(action){
            case 'authorize':
                return NextResponse.redirect(GoHighLevelOAuthService.authorize());
            case 'redirect':
                const { code } = Object.fromEntries(req.nextUrl.searchParams);
                if(!code){
                    return NextResponse.redirect(process.env.GHL_OAUTH_FAIL);
                }

                await GoHighLevelOAuthService.redirect({code});
                return NextResponse.redirect(process.env.GHL_OAUTH_SUCCESS);    
        }
        return NextResponse.json({message: 'Accion invalida'}, {status: 400})
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}