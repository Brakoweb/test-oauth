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

    static async refreshToken({ refreshToken }) {
        try {
            console.log('--GHL refreshing access token...');
            
            const payload = {
                client_id: process.env.GHL_CLIENT_ID,
                client_secret: process.env.GHL_CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                user_type: GHL_BASE.USER_TYPE
            };
            
            const { data } = await axios.post(GHL_API.token, payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            console.log('--GHL token refresh success');
            return data;
        } catch (error) {
            console.error(`--GHL token refresh failed, reason: ${error?.message}`);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', JSON.stringify(error.response.data));
            }
            return null;
        }
    }

    static async getContacts({ accessToken, locationId }) {
        try {
            console.log('--GHL fetching contacts for locationId:', locationId);
            
            const { data } = await axios.post(
                `${GHL_BASE.BASE}/contacts/search`,
                {
                    locationId: locationId,
                    pageLimit: 100
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Version': GHL_BASE.VERSION,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('--GHL get contacts success, count:', data.contacts?.length || 0);
            return data.contacts || [];
        } catch (error) {
            console.log(`--GHL get contacts failed, reason: ${error?.message}`);
            if (error.response) {
                console.log('Response status:', error.response.status);
                console.log('Response data:', JSON.stringify(error.response.data));
            }
            return [];
        }
    }

    static async getUserByEmail({ accessToken, locationId, email }) {
        try {
            console.log('--GHL fetching user by email:', email);
            
            // Filter users by email (POST request)
            const { data } = await axios.post(
                `${GHL_BASE.BASE}/users/search/filter-by-email`,
                {
                    locationId: locationId,
                    email: email
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Version': GHL_BASE.VERSION,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('--GHL search user success:', data);
            
            // Return first matching user
            if (data.users && data.users.length > 0) {
                return data.users[0];
            }
            
            // If no users array, maybe the response is directly the user
            if (data.id) {
                return data;
            }
            
            return null;
        } catch (error) {
            console.log(`--GHL search user failed, reason: ${error?.message}`);
            if (error.response) {
                console.log('Response status:', error.response.status);
                console.log('Response data:', JSON.stringify(error.response.data));
            }
            return null;
        }
    }

    static async getUserInfo({ accessToken, userId }) {
        try {
            console.log('--GHL fetching user info for userId:', userId);
            
            const { data } = await axios.get(
                `${GHL_BASE.BASE}/users/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Version': GHL_BASE.VERSION,
                    },
                }
            );
            console.log('--GHL get user info success:', data);
            return data;
        } catch (error) {
            console.log(`--GHL get user info failed, reason: ${error?.message}`);
            if (error.response) {
                console.log('Response status:', error.response.status);
                console.log('Response data:', JSON.stringify(error.response.data));
            }
            return null;
        }
    }
}
