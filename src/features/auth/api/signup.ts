import axios from 'axios';
import Cookies from 'js-cookie';
import { SignupResponse, SignupFormData } from '../types';

/**
 * Signup API
 * 
 * Note: We use axios directly here instead of AvocadoClient because:
 * 1. This is part of the auth flow, even though it requires a token
 * 2. Keeping all auth-related endpoints (login/signup) consistent in their implementation
 * 3. Auth endpoints should be independent of the main API client to avoid
 *    potential circular dependencies or auth state issues
 * 
 * Development Mode:
 * Set NEXT_PUBLIC_BYPASS_AUTH=true in .env.development to bypass authentication
 * and return mock response for UI/UX development
 */
export const signup = async (formData: SignupFormData): Promise<SignupResponse> => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const api_url = `${baseURL}/api/auth/signup`;

  try {
    const response = await axios.post(api_url, formData, {
      headers: {
        'Authorization': Cookies.get('token'),
        'Content-Type': 'application/json'
      }
    });

    return {
      success: response.data.success,
      message: response.data.message
    };

  } catch (error: any) {
    console.error('Error during signup:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Signup failed'
    };
  }
};
