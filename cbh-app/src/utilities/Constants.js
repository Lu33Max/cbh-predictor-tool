const API_BASE_URL_DEVELOPMENT = 'http://localhost:5210';
const API_BASE_URL_PRODUCTION = 'http://appname.azurewebsites.net';

const ENDPOINTS = {
    BING_entries: 'api/BingSearchTerms',
    GOOGLE_entries: 'api/GoogleSearchTerms',
    LEAD_entries: 'api/LeadEntries',
    ORDER_entries: 'api/OrderEntries',

    GET_entry_BY_ID: 'get-entry-by-id'
};

const development = {
    API_URL_BING_entries: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.BING_entries}`,
    API_URL_GOOGLE_entries: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.GOOGLE_entries}`,
    API_URL_LEAD_entries: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.LEAD_entries}`,
    API_URL_ORDER_entries: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.ORDER_entries}`,
    API_URL_BASE: `${API_BASE_URL_DEVELOPMENT}`,

    API_URL_GET_entry_BY_ID: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.GET_entry_BY_ID}`
};

const production = {
    API_URL_BING_entries: `${API_BASE_URL_PRODUCTION}/${ENDPOINTS.BING_entries}`,
    API_URL_GOOGLE_entries: `${API_BASE_URL_PRODUCTION}/${ENDPOINTS.GOOGLE_entries}`,
    API_URL_LEAD_entries: `${API_BASE_URL_PRODUCTION}/${ENDPOINTS.LEAD_entries}`,
    API_URL_ORDER_entries: `${API_BASE_URL_PRODUCTION}/${ENDPOINTS.ORDER_entries}`,
    API_URL_BASE: `${API_BASE_URL_PRODUCTION}`,

    API_URL_GET_entry_BY_ID: `${API_BASE_URL_PRODUCTION}/${ENDPOINTS.GET_entry_BY_ID}`
};

const Constants = process.env.NODE_ENV === 'development' ? development : production;

export default Constants;