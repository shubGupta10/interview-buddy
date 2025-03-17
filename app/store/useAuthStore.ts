import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface AuthState {
    user: {
        id: string;
        email: string;
        name: string;
        provider: string;
        profileImage: string;
        isAdmin: boolean
    } | null;
    setUser: (user: AuthState["user"]) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
      (set) => ({
        user: null,
        setUser: (user) =>
          set({
            user: user ? { ...user } : null 
          }),
        logout: () => set({ user: null }) 
      }),
      { name: "auth-storage" }
    )
  );
  
  export default useAuthStore;