// Domain types for auth feature
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Domain events
export type AuthEvent = 
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

// Domain commands
export interface LoginCommand {
  email: string;
  password: string;
}

// Domain results
export type AuthResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };