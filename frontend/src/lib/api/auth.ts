const API_BASE_URL = 'http://localhost:3001/api';

export const authApi = {
  register: async (payload: { name: string; email: string; password: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  login: async (payload: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('company');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getCompany: () => {
    const comp = localStorage.getItem('company');
    return comp ? JSON.parse(comp) : null;
  }
};
