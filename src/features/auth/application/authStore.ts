import { create } from 'zustand';
import { AuthState, AuthEvent, LoginCommand, User, AuthResult } from '../domain/types';

// Pure function to handle auth state updates
const authReducer = (state: AuthState, event: AuthEvent): AuthState => {
  switch (event.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: event.payload,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: event.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null
      };
    default:
      return state;
  }
};

// Pure function for login validation
const validateLoginCommand = (command: LoginCommand): string | null => {
  if (!command.email) return 'Email is required';
  if (!command.password) return 'Password is required';
  if (!command.email.includes('@')) return 'Invalid email format';
  if (command.password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

// Pure function to simulate API call
const loginApi = async (command: LoginCommand): Promise<AuthResult<User>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful login
  if (command.email === 'test@example.com' && command.password === 'password123') {
    return {
      success: true,
      data: {
        id: '1',
        email: command.email,
        name: 'Test User'
      }
    };
  }
  
  return {
    success: false,
    error: 'Invalid credentials'
  };
};

// Zustand store with pure functions
export const useAuthStore = create<AuthState & {
  login: (command: LoginCommand) => Promise<void>;
  logout: () => void;
}>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (command) => {
    // Validate command
    const validationError = validateLoginCommand(command);
    if (validationError) {
      set(state => authReducer(state, {
        type: 'LOGIN_FAILURE',
        payload: validationError
      }));
      return;
    }

    // Update state for loading
    set(state => authReducer(state, { type: 'LOGIN_REQUEST' }));

    try {
      const result = await loginApi(command);
      
      if (result.success) {
        set(state => authReducer(state, {
          type: 'LOGIN_SUCCESS',
          payload: result.data
        }));
      } else {
        set(state => authReducer(state, {
          type: 'LOGIN_FAILURE',
          payload: result.error
        }));
      }
    } catch (error) {
      set(state => authReducer(state, {
        type: 'LOGIN_FAILURE',
        payload: 'An unexpected error occurred'
      }));
    }
  },

  logout: () => {
    set(state => authReducer(state, { type: 'LOGOUT' }));
  }
}));