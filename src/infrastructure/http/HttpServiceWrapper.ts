import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * HTTP istekleri için resilience (dayanıklılık) mekanizmaları sağlayan wrapper sınıfı.
 * - Retry: 5xx ve 429 hatalarında 3 kez deneme yapar, 3 saniye aralıkla.
 * - Timeout: 30 saniye timeout süresi.
 * - Circuit Breaker: Ardışık 5 başarısız istekten sonra devre açılır (10 saniye süreyle).
 */
export class HttpServiceWrapper {
  private readonly client: AxiosInstance;
  private circuitOpen: boolean = false;
  private consecutiveFailures: number = 0;
  private readonly MAX_CONSECUTIVE_FAILURES = 5;
  private readonly CIRCUIT_RESET_TIMEOUT = 10000;
  private readonly REQUEST_TIMEOUT = 30000;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 3000;

  constructor(baseURL?: string) {
    this.client = axios.create({ 
      baseURL,
      timeout: this.REQUEST_TIMEOUT
    });
  }

  private isRetryableError(error: any): boolean {
    if (axios.isAxiosError(error) && !error.response) {
      return true;
    }

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      return (status >= 500 && status <= 599) || status === 429;
    }

    return false;
  }

  private async executeWithRetries<T>(fn: () => Promise<T>, retries: number = 0): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries < this.MAX_RETRIES && this.isRetryableError(error)) {
        console.log(`Retry attempt ${retries + 1} of ${this.MAX_RETRIES} after ${this.RETRY_DELAY}ms`);
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        return this.executeWithRetries(fn, retries + 1);
      }
      throw error;
    }
  }

  private async executeWithCircuitBreaker<T>(fn: () => Promise<T>): Promise<T> {
    if (this.circuitOpen) {
      throw new Error('Circuit breaker is open - too many failures');
    }

    try {
      const result = await fn();
      this.consecutiveFailures = 0;
      return result;
    } catch (error) {
      if (this.isRetryableError(error)) {
        this.consecutiveFailures++;
        
        if (this.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES) {
          this.circuitOpen = true;
          console.log(`Circuit breaker opened due to ${this.consecutiveFailures} consecutive failures`);
          
          setTimeout(() => {
            this.circuitOpen = false;
            this.consecutiveFailures = 0;
            console.log('Circuit breaker reset and ready to try again');
          }, this.CIRCUIT_RESET_TIMEOUT);
        }
      }
      
      throw error;
    }
  }

  private async request<T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.executeWithCircuitBreaker(() => 
      this.executeWithRetries(() => 
        this.client.request<T, R, D>(config)
      )
    );
  }

  public get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.request<T, R, D>({ ...config, method: 'GET', url });
  }

  public post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.request<T, R, D>({ ...config, method: 'POST', url, data });
  }

  public put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.request<T, R, D>({ ...config, method: 'PUT', url, data });
  }

  public delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.request<T, R, D>({ ...config, method: 'DELETE', url });
  }

  public patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.request<T, R, D>({ ...config, method: 'PATCH', url, data });
  }
}

// Örnek Kullanım
/*
async function testHttpServiceWrapper() {
  const http = new HttpServiceWrapper('https://jsonplaceholder.typicode.com');

  try {
    const response = await http.get('/posts/1');
    console.log('Data:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
*/