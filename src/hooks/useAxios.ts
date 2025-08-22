import { useState, useCallback, useRef } from 'react';
import axiosService from '../config/axios';

interface UseAxiosState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAxiosReturn<T> extends UseAxiosState<T> {
  execute: (config?: any) => Promise<T | null>;
  reset: () => void;
  setData: (data: T) => void;
}

export function useAxios<T = any>(): UseAxiosReturn<T> {
  const [state, setState] = useState<UseAxiosState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (config?: any): Promise<T | null> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axiosService.getInstance().request({
        ...config,
        signal: abortControllerRef.current.signal
      });

      setState({
        data: response.data,
        loading: false,
        error: null
      });

      return response.data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return null;
      }

      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage
      });

      return null;
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData
  };
}

export function useAxiosGet<T = any>(url: string, config?: any): UseAxiosReturn<T> {
  const { execute, ...state } = useAxios<T>();

  const executeGet = useCallback(async (additionalConfig?: any) => {
    return execute({
      method: 'GET',
      url,
      ...config,
      ...additionalConfig
    });
  }, [execute, url, config]);

  return {
    ...state,
    execute: executeGet
  };
}

export function useAxiosPost<T = any>(url: string, config?: any): UseAxiosReturn<T> {
  const { execute, ...state } = useAxios<T>();

  const executePost = useCallback(async (data?: any, additionalConfig?: any) => {
    return execute({
      method: 'POST',
      url,
      data,
      ...config,
      ...additionalConfig
    });
  }, [execute, url, config]);

  return {
    ...state,
    execute: executePost
  };
}

export function useAxiosPut<T = any>(url: string, config?: any): UseAxiosReturn<T> {
  const { execute, ...state } = useAxios<T>();

  const executePut = useCallback(async (data?: any, additionalConfig?: any) => {
    return execute({
      method: 'PUT',
      url,
      data,
      ...config,
      ...additionalConfig
    });
  }, [execute, url, config]);

  return {
    ...state,
    execute: executePut
  };
}

export function useAxiosDelete<T = any>(url: string, config?: any): UseAxiosReturn<T> {
  const { execute, ...state } = useAxios<T>();

  const executeDelete = useCallback(async (additionalConfig?: any) => {
    return execute({
      method: 'DELETE',
      url,
      ...config,
      ...additionalConfig
    });
  }, [execute, url, config]);

  return {
    ...state,
    execute: executeDelete
  };
}

export default useAxios;
