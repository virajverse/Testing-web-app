// Simple admin authentication utilities
// TODO: Replace with Supabase Auth when implementing proper authentication

export const isAdminAuthenticated = (): boolean => {
  return sessionStorage.getItem('admin_authenticated') === 'true';
};

export const authenticateAdmin = (key: string): boolean => {
  const correctKey = import.meta.env.VITE_ADMIN_SECRET_KEY;
  
  if (key === correctKey) {
    sessionStorage.setItem('admin_authenticated', 'true');
    return true;
  }
  
  return false;
};

export const logoutAdmin = (): void => {
  sessionStorage.removeItem('admin_authenticated');
};

export const isValidAdminEmail = (email: string): boolean => {
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
  return adminEmails.includes(email.toLowerCase().trim());
};

// Environment variables validation
export const validateEnvVars = (): { isValid: boolean; missing: string[] } => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_ADMIN_SECRET_KEY',
    'VITE_WHATSAPP_NUMBER'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  return {
    isValid: missing.length === 0,
    missing
  };
};