// src/lib/HttpClient.ts
import { Configuration } from '@/generated/api';
import { config } from './config';
import { setAuthToken } from './api-config';

export class HttpClient {
  public readonly baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
    // Initialize with fake JWT token from environment variables
    const fakeJwtToken = import.meta.env.VITE_FAKE_JWT_TOKEN;
    if (fakeJwtToken) {
      setAuthToken(fakeJwtToken);
    }
  }

  createConfiguration(): Configuration {
    return new Configuration({
      basePath: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      middleware: [{
        pre: async (context) => {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), this.timeout);
          context.init.signal = controller.signal;
          return context;
        },
        post: async (context) => {
          if (!context.response.ok) {
            throw new Error(`HTTP error! Status: ${context.response.status}`);
          }
          return context;
        }
      }]
    });
  }
}

export const httpClient = new HttpClient();
