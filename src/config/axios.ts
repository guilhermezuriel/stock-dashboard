import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { env } from './env';

class AxiosService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: 'https://finnhub.io/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        if (env.FINNHUB_API_KEY && env.FINNHUB_API_KEY.length > 10 && env.FINNHUB_API_KEY !== 'your_api_key_here') {
          config.params = {
            ...config.params,
            token: env.FINNHUB_API_KEY,
          };
        }
        
        console.log(`${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          console.error(`${error.response.status} ${error.response.config.url}:`, error.response.data);
          
          if (error.response.status === 401) {
            console.error('Unauthorized: Check your API key');
          } else if (error.response.status === 429) {
            console.error('Rate limit exceeded: Too many requests');
          } else if (error.response.status >= 500) {
            console.error('Server error: Try again later');
          }
        } else if (error.request) {
          console.error('Network error: No response received');
        } else {
          console.error('Request setup error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }

  public setBaseURL(url: string) {
    this.instance.defaults.baseURL = url;
  }

  public setAuthToken(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public removeAuthToken() {
    delete this.instance.defaults.headers.common['Authorization'];
  }

  public setRequestTimeout(timeout: number) {
    this.instance.defaults.timeout = timeout;
  }
}

export const axiosService = new AxiosService();
export default axiosService;
