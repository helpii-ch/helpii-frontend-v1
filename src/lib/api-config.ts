import { Configuration } from '../generated/api/runtime';

let currentToken: string | null = null;

export const setAuthToken = (token: string) => {
    currentToken = token;
};

export const clearAuthToken = () => {
    currentToken = null;
};

export const createApiConfig = (baseUrl: string): Configuration => {
    return new Configuration({
        basePath: baseUrl,
        middleware: [{
            pre: async (context) => {
                if (currentToken) {
                    context.init.headers = {
                        ...context.init.headers,
                        'Authorization': `Bearer ${currentToken}`
                    };
                }
                return context;
            }
        }]
    });
};
