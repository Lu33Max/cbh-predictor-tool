const API_BASE_URL_DEVELOPMENT = 'http://localhost:5210';
const API_BASE_URL_PRODUCTION = 'http://appname.azurewebsites.net';

const ENDPOINTS = {
    BING_ENTRIES: 'api/BingSearchTerms',
    GOOGLE_ENTRIES: 'api/GoogleSearchTerms',
    LEAD_ENTRIES: 'api/LeadEntries',
    ORDER_ENTRIES: 'api/OrderEntries',

    GET_ENTRY_BY_ID: 'get-entry-by-id'
};

const development = {
    API_URL_BING_ENTRIES: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.BING_ENTRIES}`,
    API_URL_GOOGLE_ENTRIES: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.GOOGLE_ENTRIES}`,
    API_URL_LEAD_ENTRIES: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.LEAD_ENTRIES}`,
    API_URL_ORDER_ENTRIES: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.ORDER_ENTRIES}`,
    API_URL_BASE: `${API_BASE_URL_DEVELOPMENT}`,

    API_URL_GET_ENTRY_BY_ID: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.GET_ENTRY_BY_ID}`
};

const production = {
    API_URL_BING_entries: `${API_BASE_URL_PRODUCTION}/${ENDPOINTS.BING_ENTRIES}`,
    API_URL_GOOGLE_ENTRIES: `${API_BASE_URL_PRODUCTION}/${ENDPOINTS.GOOGLE_ENTRIES}`,
    API_URL_LEAD_ENTRIES: `${API_BASE_URL_PRODUCTION}/${ENDPOINTS.LEAD_ENTRIES}`,
    API_URL_ORDER_ENTRIES: `${API_BASE_URL_PRODUCTION}/${ENDPOINTS.ORDER_ENTRIES}`,
    API_URL_BASE: `${API_BASE_URL_PRODUCTION}`,

    API_URL_GET_ENTRY_BY_ID: `${API_BASE_URL_PRODUCTION}/${ENDPOINTS.GET_ENTRY_BY_ID}`
};

const Constants = process.env.NODE_ENV === 'development' ? development : production;

export default Constants;