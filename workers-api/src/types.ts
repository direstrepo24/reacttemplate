export interface Env {
  // Define las variables de entorno que puedes usar en tu Worker
  // Por ejemplo: API_KEY?: string;
}

// Declaración para el tipo ExecutionContext de Cloudflare Workers
declare global {
  interface ExecutionContext {
    waitUntil(promise: Promise<any>): void;
    passThroughOnException(): void;
  }
} 