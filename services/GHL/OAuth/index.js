import { headers } from "next/headers.js";
import axios from "axios";
import { GHL_API, GHL_BASE } from "../../../constants/server/index.js";

export class GoHighLevelOAuthService {
    static authorize(){
        return GHL_API.authorize({
            config: {
                client_id: process.env.GHL_CLIENT_ID,
                redirect_uri: GHL_API.redirect_uri,
                response_type: 'code',
                scope: process.env.GHL_OAUTH_SCOPES
            }
});
    }

    static async redirect({code}){
        try{
            const payload={
                code,
                client_id: process.env.GHL_CLIENT_ID,
                client_secret: process.env.GHL_CLIENT_SECRET,
                redirect_uri: GHL_API.redirect_uri,
                grant_type: 'authorization_code',
                user_type: GHL_BASE.USER_TYPE
            }
            const {data, status}=await axios.post(GHL_API.token,payload,{
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return data;
        }catch(error){
           console.log(`--GHL OAuth redirect failed, reason: ${error?.message}`); 
        }
    }
}
