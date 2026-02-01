// API Service for communicating with the backend
import type { SchemaDefinition, SQLDialect, GenerateSchemaResponse } from '../engine/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiError {
  detail: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: `HTTP error ${response.status}`,
      }));
      throw new Error(error.detail);
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string; version: string; ai_provider: string }> {
    return this.request('/api/health');
  }

  async generateSchema(
    prompt: string,
    dialect: SQLDialect,
    additionalContext?: string
  ): Promise<SchemaDefinition> {
    const response = await this.request<GenerateSchemaResponse>('/api/generate-schema', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        dialect,
        additionalContext,
      }),
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to generate schema');
    }

    return response.schema as SchemaDefinition;
  }

  async refineSchema(
    schema: SchemaDefinition,
    refinementPrompt: string
  ): Promise<SchemaDefinition> {
    const response = await this.request<GenerateSchemaResponse>('/api/refine-schema', {
      method: 'POST',
      body: JSON.stringify({
        schema,
        refinementPrompt,
      }),
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to refine schema');
    }

    return response.schema as SchemaDefinition;
  }
}

// Export singleton instance
export const api = new ApiService();
export default api;
