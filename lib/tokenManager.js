import { getTokens, saveTokens, isTokenExpired } from './database.js';
import { GoHighLevelOAuthService } from '../services/GHL/OAuth/index.js';

/**
 * Get valid tokens for a location, automatically refreshing if needed
 * @param {string} locationId - The location ID
 * @returns {Promise<Object|null>} - Valid tokens or null if refresh fails
 */
export async function getValidTokens(locationId) {
    const tokens = getTokens(locationId);
    
    if (!tokens) {
        console.log('[TokenManager] No tokens found for location:', locationId);
        return null;
    }
    
    // Check if tokens are expired or about to expire
    if (isTokenExpired(locationId)) {
        console.log('[TokenManager] 🔄 Token expired, attempting refresh...');
        
        // Try to refresh the token
        const newTokens = await GoHighLevelOAuthService.refreshToken({
            refreshToken: tokens.refreshToken
        });
        
        if (newTokens) {
            // Save the new tokens
            saveTokens(locationId, {
                access_token: newTokens.access_token,
                refresh_token: newTokens.refresh_token || tokens.refreshToken, // Use new refresh token if provided
                expires_in: newTokens.expires_in,
                scope: newTokens.scope || tokens.scope,
                companyId: tokens.companyId
            });
            
            console.log('[TokenManager] ✅ Token refreshed successfully');
            
            // Return the new tokens in the expected format
            return {
                accessToken: newTokens.access_token,
                refreshToken: newTokens.refresh_token || tokens.refreshToken,
                expiresIn: newTokens.expires_in,
                scope: newTokens.scope || tokens.scope,
                companyId: tokens.companyId
            };
        } else {
            console.error('[TokenManager] ❌ Token refresh failed');
            return null;
        }
    }
    
    // Tokens are still valid, return them
    console.log('[TokenManager] ✅ Using existing valid tokens');
    return tokens;
}
