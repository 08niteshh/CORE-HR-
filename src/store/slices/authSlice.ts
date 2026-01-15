import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, UserRole } from '@/types';

const TOKEN_KEY = 'corehr_token';
const USER_KEY = 'corehr_user';

const loadAuthState = (): AuthState => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr) as User;
      return { user, token, isAuthenticated: true };
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
  
  return { user: null, token: null, isAuthenticated: false };
};

const initialState: AuthState = loadAuthState();

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

// Simulated user database
const USERS_KEY = 'corehr_users';

const getUsers = (): Record<string, { password: string; user: User }> => {
  const usersStr = localStorage.getItem(USERS_KEY);
  if (usersStr) {
    return JSON.parse(usersStr);
  }
  // Default admin user
  const defaultUsers = {
    'admin@corehr.com': {
      password: 'admin123',
      user: {
        id: '1',
        email: 'admin@corehr.com',
        name: 'Admin User',
        role: 'admin' as UserRole,
      },
    },
  };
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

const saveUsers = (users: Record<string, { password: string; user: User }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const generateToken = () => {
  return `jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      const { email, password } = action.payload;
      const users = getUsers();
      const userData = users[email];
      
      if (userData && userData.password === password) {
        const token = generateToken();
        state.user = userData.user;
        state.token = token;
        state.isAuthenticated = true;
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData.user));
      } else {
        throw new Error('Invalid credentials');
      }
    },
    register: (state, action: PayloadAction<RegisterPayload>) => {
      const { email, password, name, role } = action.payload;
      const users = getUsers();
      
      if (users[email]) {
        throw new Error('User already exists');
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
      };
      
      users[email] = { password, user: newUser };
      saveUsers(users);
      
      const token = generateToken();
      state.user = newUser;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(USER_KEY, JSON.stringify(state.user));
      }
    },
  },
});

export const { login, register, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
