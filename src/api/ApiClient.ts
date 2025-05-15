/**
 * ApiClient for handling HTTP requests
 * Uses environment variables for base URL configuration
 */

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
};

class ApiClient {
  private baseUrl: string;

  constructor() {
    // Use the appropriate URL based on the environment
    this.baseUrl =
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_API_URL_PRODUCTION
        : import.meta.env.VITE_API_URL_DEVELOPMENT;
  }

  // Helper method to build URL with query parameters
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  // GET request
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }

  // POST request
  async post<T>(
    endpoint: string,
    data: any,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data: any,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }

  // DELETE request
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }
}

// Export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Also export the class for testing or custom instances
export { ApiClient };
