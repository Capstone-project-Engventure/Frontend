// Performance monitoring utilities
import React from 'react';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start timing a process
  startTiming(key: string): void {
    this.metrics.set(key, performance.now());
  }

  // End timing and log the result
  endTiming(key: string): number {
    const startTime = this.metrics.get(key);
    if (!startTime) {
      console.warn(`No start time found for key: ${key}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(key);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${key}: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  // Measure component render time
  measureComponent<T>(componentName: string, fn: () => T): T {
    this.startTiming(`render:${componentName}`);
    const result = fn();
    this.endTiming(`render:${componentName}`);
    return result;
  }

  // Measure async operations
  async measureAsync<T>(operationName: string, fn: () => Promise<T>): Promise<T> {
    this.startTiming(`async:${operationName}`);
    try {
      const result = await fn();
      this.endTiming(`async:${operationName}`);
      return result;
    } catch (error) {
      this.endTiming(`async:${operationName}`);
      throw error;
    }
  }

  // Log bundle size information
  logBundleInfo(): void {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('📦 Bundle Performance Info:');
      console.log('- DOM Content Loaded:', performance.getEntriesByType('navigation')[0]);
      console.log('- Resource Timings:', performance.getEntriesByType('resource').slice(0, 10));
    }
  }
}

// React Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();

  const measureRender = (componentName: string) => {
    return {
      start: () => monitor.startTiming(`render:${componentName}`),
      end: () => monitor.endTiming(`render:${componentName}`)
    };
  };

  return {
    measureRender,
    measureAsync: monitor.measureAsync.bind(monitor),
    logBundleInfo: monitor.logBundleInfo.bind(monitor)
  };
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    console.log('💾 Memory Usage:', {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
    });
  }
}; 