import qs from "qs";

const GHL_BASE={
    OAUTH: 'https://marketplace.gohighlevel.com/oauth',
    BASE: 'https://services.leadconnectorhq.com',
    VERSION: '2021-07-28',
    USER_TYPE: 'Company'
}

const GHL_API={
    authorize:({config})=>`${GHL_BASE.OAUTH}/chooselocation?${qs.stringify(config)}`,
    token: `${GHL_BASE.BASE}/oauth/token`,
    redirect_uri: `${process.env.HOST}/${process.env.GHL_OAUTH_REDIRECT_URI}`
    
}

export {
    GHL_BASE,
    GHL_API
}