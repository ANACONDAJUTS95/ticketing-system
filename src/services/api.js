import axios from 'axios';

const API_URL = 'https://queue-system-api.onrender.com/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const queueService = {
  // Get all tickets for a department
  getDepartmentQueue: async (department) => {
    const response = await api.get(`/queues/${department}`);
    return response.data;
  },

  // Generate new ticket
  generateTicket: async (department, prefix) => {
    const response = await api.post('/queues/generate', { department, prefix });
    return response.data;
  }
};

export const ticketService = {
  // Get ticket status
  getTicketStatus: async (code) => {
    const response = await api.get(`/tickets/${code}`);
    return response.data;
  }
};

export const adminService = {
  // Admin login
  login: async (email, password) => {
    try {
      const response = await api.post('/admin/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data;
      }
      throw new Error('No token received');
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  },

  // Remove ticket
  removeTicket: async (code) => {
    const response = await api.delete(`/admin/tickets/${code}`);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  }
}; 