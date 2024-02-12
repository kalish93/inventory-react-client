const BASE_URL = ''; 

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method: HttpMethod;
  headers?: { [key: string]: string };
  body?: string | object;
}

const makeRequest = async <T>(url: string, options: RequestOptions): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export default makeRequest;