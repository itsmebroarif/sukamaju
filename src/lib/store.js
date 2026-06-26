import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Theme Store
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: nextTheme };
      }),
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      }
    }),
    { name: 'kafeinarts-theme' }
  )
);

// 2. Language Store
export const useLangStore = create(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'kafeinarts-lang' }
  )
);

// 3. Navigation & Wizard Store
export const useNavStore = create((set) => ({
  page: 'home', // 'home', 'games', 'services', 'about', 'contact', 'admin'
  wizardOpen: null, // 'game', 'service', null
  setPage: (page) => {
    if (page === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else {
      // Clear path if going back to standard pages to keep URL clean
      if (window.location.pathname === '/admin') {
        window.history.pushState(null, '', `/#${page}`);
      } else {
        window.location.hash = page;
      }
    }
    set({ page });
  },
  openWizard: (wizardOpen) => set({ wizardOpen }),
  closeWizard: () => set({ wizardOpen: null }),
}));

// Initialize hash & path listener
if (typeof window !== 'undefined') {
  const handleNavChange = () => {
    const path = window.location.pathname;
    if (path === '/admin') {
      useNavStore.setState({ page: 'admin' });
      return;
    }

    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'games', 'services', 'about', 'contact'];
    if (validPages.includes(hash)) {
      useNavStore.setState({ page: hash });
    } else if (hash === '') {
      useNavStore.setState({ page: 'home' });
    } else {
      useNavStore.setState({ page: 'not-found' });
    }
  };

  window.addEventListener('hashchange', handleNavChange);
  window.addEventListener('popstate', handleNavChange);
  
  // Set initial page from hash/path
  setTimeout(() => {
    handleNavChange();
  }, 100);
}

// 4. Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [], // Array of { gameId, quantity }
      addToCart: (gameId) => set((state) => {
        const existing = state.cart.find((item) => item.gameId === gameId);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.gameId === gameId ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }
        return { cart: [...state.cart, { gameId, quantity: 1 }] };
      }),
      removeFromCart: (gameId) => set((state) => ({
        cart: state.cart.filter((item) => item.gameId !== gameId),
      })),
      updateQuantity: (gameId, quantity) => set((state) => {
        if (quantity <= 0) {
          return { cart: state.cart.filter((item) => item.gameId !== gameId) };
        }
        return {
          cart: state.cart.map((item) =>
            item.gameId === gameId ? { ...item, quantity } : item
          ),
        };
      }),
      clearCart: () => set({ cart: [] }),
      getItemCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: 'kafeinarts-cart' }
  )
);

// 5. Admin Store
export const useAdminStore = create(
  persist(
    (set) => ({
      unlocked: false,
      githubOwner: 'itsmebroarif',
      githubRepo: 'kafeinarts-studio',
      githubBranch: 'main',
      githubPath: 'src/data/games.json',
      githubToken: '',
      
      setUnlocked: (unlocked) => set({ unlocked }),
      setGithubConfig: (config) => set((state) => ({ ...state, ...config })),
      logout: () => set({ unlocked: false })
    }),
    { name: 'kafeinarts-admin' }
  )
);
