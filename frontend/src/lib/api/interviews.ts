// src/lib/api/interviews.ts
import { authApi } from './auth';

const API_BASE_URL = 'http://localhost:3001/api';

export const interviewApi = {
  // Fetch all interviews for the dashboard
  getInterviews: async () => {
    try {
      const token = authApi.getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/interviews`, { headers });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.success ? data.interviews : [];
    } catch (error) {
      console.error('Error fetching interviews:', error);
      return [];
    }
  },

  // Create a new interview and generate OTP
  createInterview: async (payload: { title: string; description: string; duration: string; stack: string; instructions: string }) => {
    try {
      const token = authApi.getToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/interviews/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data; // Returns new interview object
    } catch (error) {
      console.error('Error creating interview:', error);
      throw error;
    }
  },

  // Validate OTP and join interview
  joinInterview: async (payload: { code: string; name: string; email: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interviews/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data; // Returns sessionId and interviewTitle
    } catch (error) {
      console.error('Error joining interview:', error);
      throw error;
    }
  },

  // Get Candidate Session Details
  getSessionDetails: async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interviews/session/${sessionId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } catch (error) {
      console.error('Error fetching session details:', error);
      throw error;
    }
  }
};
