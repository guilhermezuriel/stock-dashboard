# 🚀 Axios Configuration Guide

This guide explains how to configure and use Axios in the Stock Price Dashboard.

## 📦 Installation

Axios is already installed in the project:

```bash
npm install axios
```

## ⚙️ Configuration Files

### 1. `src/config/axios.ts` - Main Axios Service

This file provides a centralized Axios service with:

- **Base Configuration**: Default settings for Finnhub API
- **Interceptors**: Request/response logging and error handling
- **Authentication**: Automatic API key injection
- **Error Handling**: Specific error messages for different HTTP status codes

### 2. `src/config/api.ts` - Multi-API Configuration

Supports multiple financial data providers:

- **Finnhub**: Primary data source
- **Alpha Vantage**: Alternative data source
- **Yahoo Finance**: Free data source
- **Polygon**: Premium data source

### 3. `src/config/env.ts` - Environment Variables

Manages all API keys and configuration:

```typescript
export const env = {
  FINNHUB_API_KEY: import.meta.env.VITE_FINNHUB_API_KEY || '',
  ALPHA_VANTAGE_API_KEY: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || '',
  POLYGON_API_KEY: import.meta.env.VITE_POLYGON_API_KEY || '',
  // ... other configs
};
```

## 🔑 Environment Variables Setup

Create a `.env` file in the root directory:

```bash
# Required
VITE_FINNHUB_API_KEY=your_finnhub_api_key_here

# Optional
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
VITE_POLYGON_API_KEY=your_polygon_api_key_here

# Dashboard Configuration
VITE_DEFAULT_SYMBOLS=AAPL,MSFT,GOOGL,BINANCE:BTCUSDT
VITE_CHART_UPDATE_INTERVAL=5000
VITE_MAX_DATA_POINTS=1000
```

## 🎯 Usage Examples

### Basic API Call

```typescript
import axiosService from '../config/axios';

// GET request
const data = await axiosService.get('/quote', {
  params: { symbol: 'AAPL' }
});

// POST request
const response = await axiosService.post('/endpoint', {
  data: 'value'
});
```

### Using Financial API Service

```typescript
import financialApiService from '../services/financialApiService';

// Get stock quote
const quote = await financialApiService.getStockQuote('AAPL');

// Get company profile
const profile = await financialApiService.getCompanyProfile('AAPL');

// Search stocks
const results = await financialApiService.searchStocks('Apple');
```

### Using Custom Hooks

```typescript
import { useAxiosGet } from '../hooks/useAxios';

const { data, loading, error, execute } = useAxiosGet('/quote');

useEffect(() => {
  execute({ params: { symbol: 'AAPL' } });
}, [execute]);
```

## 🔧 Customization

### Adding New API Provider

1. **Update `src/config/api.ts`**:

```typescript
export const apiConfigs = {
  // ... existing configs
  newProvider: {
    baseURL: 'https://api.newprovider.com',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.NEW_PROVIDER_API_KEY}`
    }
  }
};
```

2. **Add environment variable**:

```typescript
// src/config/env.ts
export const env = {
  // ... existing vars
  NEW_PROVIDER_API_KEY: import.meta.env.VITE_NEW_PROVIDER_API_KEY || ''
};
```

3. **Update validation**:

```typescript
// src/config/api.ts
export const isApiConfigured = (provider: keyof typeof apiConfigs): boolean => {
  switch (provider) {
    // ... existing cases
    case 'newProvider':
      return Boolean(env.NEW_PROVIDER_API_KEY && env.NEW_PROVIDER_API_KEY.length > 10);
    default:
      return false;
  }
};
```

### Custom Interceptors

```typescript
// src/config/axios.ts
private setupInterceptors() {
  // Request interceptor
  this.instance.interceptors.request.use(
    (config) => {
      // Add custom headers
      config.headers['X-Custom-Header'] = 'value';
      
      // Log requests
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  this.instance.interceptors.response.use(
    (response) => {
      // Transform response data
      return response;
    },
    (error) => {
      // Handle specific errors
      if (error.response?.status === 429) {
        console.error('Rate limit exceeded');
      }
      return Promise.reject(error);
    }
  );
}
```

## 🚨 Error Handling

The Axios service includes comprehensive error handling:

- **401 Unauthorized**: API key issues
- **429 Rate Limit**: Too many requests
- **5xx Server Errors**: Server-side issues
- **Network Errors**: Connection problems

### Custom Error Handling

```typescript
try {
  const data = await axiosService.get('/endpoint');
  return data;
} catch (error: any) {
  if (error.response) {
    // Server responded with error status
    console.error(`Error ${error.response.status}:`, error.response.data);
  } else if (error.request) {
    // Request made but no response
    console.error('No response received');
  } else {
    // Request setup error
    console.error('Request error:', error.message);
  }
  return null;
}
```

## 📊 Performance Features

### Request Cancellation

```typescript
import { useAxios } from '../hooks/useAxios';

const { execute, reset } = useAxios();

// Cancel previous request when component unmounts
useEffect(() => {
  return () => reset();
}, [reset]);
```

### Automatic Retries

```typescript
// Configure retry logic in axios service
private setupRetryLogic() {
  this.instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status >= 500 && this.retryCount < this.maxRetries) {
        this.retryCount++;
        return this.instance.request(error.config);
      }
      return Promise.reject(error);
    }
  );
}
```

## 🔒 Security

### API Key Management

- Keys are stored in environment variables
- Automatic injection in request headers
- Validation before use
- Secure localStorage fallback

### Request Validation

```typescript
// Validate API key before making requests
if (!env.FINNHUB_API_KEY || !isValidApiKey(env.FINNHUB_API_KEY)) {
  throw new Error('Invalid API key');
}
```

## 📱 Testing

### Mock Axios for Testing

```typescript
// __mocks__/axios.ts
export default {
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
};
```

### Test API Calls

```typescript
import { renderHook } from '@testing-library/react';
import { useAxiosGet } from '../hooks/useAxios';

test('should make API call', async () => {
  const { result } = renderHook(() => useAxiosGet('/test'));
  
  await result.current.execute();
  
  expect(result.current.data).toBeDefined();
});
```

## 🌟 Best Practices

1. **Use TypeScript**: Define interfaces for all API responses
2. **Error Boundaries**: Implement React error boundaries for API errors
3. **Loading States**: Always show loading indicators during API calls
4. **Caching**: Implement response caching for frequently accessed data
5. **Rate Limiting**: Respect API rate limits and implement backoff strategies
6. **Logging**: Use structured logging for debugging API issues
7. **Monitoring**: Track API performance and error rates

## 📚 Additional Resources

- [Axios Documentation](https://axios-http.com/)
- [Finnhub API Documentation](https://finnhub.io/docs/api)
- [Alpha Vantage API Documentation](https://www.alphavantage.co/documentation/)
- [Polygon API Documentation](https://polygon.io/docs/)

---

**Happy coding! 🚀**
