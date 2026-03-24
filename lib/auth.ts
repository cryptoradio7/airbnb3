import { auth } from '../auth';

export { auth };

// Pour la compatibilité avec getServerSession
export const authOptions = {
  // Cette fonction est utilisée par getServerSession
  // Dans NextAuth v5, on utilise directement `auth()`
};