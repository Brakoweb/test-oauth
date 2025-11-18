module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/constants/server/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GHL_API",
    ()=>GHL_API,
    "GHL_BASE",
    ()=>GHL_BASE
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qs$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/qs/lib/index.js [app-route] (ecmascript)");
;
const GHL_BASE = {
    OAUTH: 'https://marketplace.gohighlevel.com/oauth',
    BASE: 'https://services.leadconnectorhq.com',
    VERSION: '2021-07-28',
    USER_TYPE: 'Company'
};
const GHL_API = {
    authorize: ({ config })=>`${GHL_BASE.OAUTH}/chooselocation?${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qs$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].stringify(config)}`,
    token: `${GHL_BASE.BASE}/oauth/token`,
    redirect_uri: `${process.env.HOST}/${process.env.GHL_OAUTH_REDIRECT_URI}`
};
;
}),
"[project]/services/GHL/OAuth/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GoHighLevelOAuthService",
    ()=>GoHighLevelOAuthService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$server$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/server/index.js [app-route] (ecmascript)");
;
;
;
class GoHighLevelOAuthService {
    static authorize() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$server$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GHL_API"].authorize({
            config: {
                client_id: process.env.GHL_CLIENT_ID,
                redirect_uri: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$server$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GHL_API"].redirect_uri,
                response_type: 'code',
                scope: process.env.GHL_OAUTH_SCOPES
            }
        });
    }
    static async redirect({ code }) {
        try {
            const payload = {
                code,
                client_id: process.env.GHL_CLIENT_ID,
                client_secret: process.env.GHL_CLIENT_SECRET,
                redirect_uri: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$server$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GHL_API"].redirect_uri,
                grant_type: 'authorization_code',
                user_type: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$server$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GHL_BASE"].USER_TYPE
            };
            const { data, status } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$server$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GHL_API"].token, payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return data;
        } catch (error) {
            console.log(`--GHL OAuth redirect failed, reason: ${error?.message}`);
        }
    }
    static async getContacts({ accessToken, locationId }) {
        try {
            console.log('--GHL fetching contacts for locationId:', locationId);
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$server$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GHL_BASE"].BASE}/contacts/search`, {
                locationId: locationId,
                pageLimit: 100
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Version': __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$server$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GHL_BASE"].VERSION,
                    'Content-Type': 'application/json'
                }
            });
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
}
}),
"[project]/lib/session.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSession",
    ()=>clearSession,
    "getSession",
    ()=>getSession,
    "setSession",
    ()=>setSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
const COOKIE_NAME = 'ghl_session';
async function setSession(data) {
    console.log('setSession - Data to save:', data);
    const token = await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](data).setProtectedHeader({
        alg: 'HS256'
    }).setExpirationTime('7d').sign(secret);
    console.log('setSession - Token created:', token ? 'yes' : 'no');
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
    });
    console.log('setSession - Cookie set with name:', COOKIE_NAME);
    return token;
}
async function getSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    console.log('getSession - Token from cookie:', token ? 'present' : 'missing');
    if (!token) return null;
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, secret);
        console.log('getSession - Payload:', payload);
        return payload;
    } catch (error) {
        console.log('getSession - Error verifying token:', error.message);
        return null;
    }
}
async function clearSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete(COOKIE_NAME);
}
}),
"[project]/src/app/api/v2/[action]/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$GHL$2f$OAuth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/GHL/OAuth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/session.js [app-route] (ecmascript)");
;
;
;
async function GET(request, context) {
    try {
        const { action } = await context.params;
        switch(action){
            case 'authorize':
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$GHL$2f$OAuth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoHighLevelOAuthService"].authorize());
            case 'redirect':
                const { code } = Object.fromEntries(request.nextUrl.searchParams);
                if (!code) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(process.env.GHL_OAUTH_FAIL);
                }
                const tokenData = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$GHL$2f$OAuth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoHighLevelOAuthService"].redirect({
                    code
                });
                console.log('Token data received:', tokenData);
                if (!tokenData || !tokenData.access_token) {
                    console.log('No token data, redirecting to fail');
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(process.env.GHL_OAUTH_FAIL);
                }
                console.log('Saving session with:', {
                    accessToken: tokenData.access_token ? 'present' : 'missing',
                    locationId: tokenData.locationId
                });
                const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setSession"])({
                    accessToken: tokenData.access_token,
                    locationId: tokenData.locationId
                });
                console.log('Session saved, redirecting to auth-success page');
                // Redirect to intermediate page that will then redirect to dashboard
                const successUrl = `${process.env.HOST}/auth-success?redirect=/dashboard`;
                const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(successUrl);
                response.cookies.set('ghl_session', token, {
                    httpOnly: true,
                    secure: ("TURBOPACK compile-time value", "development") === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7,
                    path: '/'
                });
                console.log('Cookie set on response, redirecting to:', successUrl);
                return response;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Accion invalida'
        }, {
            status: 400
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8dbc99e0._.js.map