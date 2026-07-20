import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CurrentUser, Role } from '@/auth/roles';
import { deriveIsReadonly } from '@/auth/roles';

interface UserContextValue {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  setRoles: (roles: Role[]) => void;
}

const defaultUser: CurrentUser = {
  id: 'user-001',
  name: 'Tunda Adewale',
  email: 'tunda.adewale@autochek.africa',
  roles: ['DEAL_ADMIN', 'COLLECTIONS_ADMIN_AFS', 'AFS_HEAD'],
  country: 'NG',
  isReadonly: false,
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [roles, setRolesState] = useState<Role[]>(defaultUser.roles);

  const setRoles = useCallback((nextRoles: Role[]) => {
    setRolesState(nextRoles);
  }, []);

  const login = useCallback(
    (email: string, _password: string) => {
      void _password;
      setUser({
        ...defaultUser,
        email: email || defaultUser.email,
        roles,
        isReadonly: deriveIsReadonly(roles),
      });
    },
    [roles],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const currentUser = useMemo<CurrentUser | null>(() => {
    if (!user) return null;
    return {
      ...user,
      roles,
      isReadonly: deriveIsReadonly(roles),
    };
  }, [user, roles]);

  const value = useMemo(
    () => ({
      user: currentUser,
      isAuthenticated: currentUser !== null,
      login,
      logout,
      setRoles,
    }),
    [currentUser, login, logout, setRoles],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useCurrentUser(): CurrentUser {
  const ctx = useContext(UserContext);
  if (!ctx?.user) throw new Error('useCurrentUser must be used when authenticated');
  return ctx.user;
}

export function useUserContext(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be used within UserProvider');
  return ctx;
}

export function useAuth(): Pick<UserContextValue, 'isAuthenticated' | 'login' | 'logout'> {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useAuth must be used within UserProvider');
  return { isAuthenticated: ctx.isAuthenticated, login: ctx.login, logout: ctx.logout };
}
