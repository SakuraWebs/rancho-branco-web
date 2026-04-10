import { motion } from 'motion/react';
import { Lock, LogIn, Mail } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import bgImage from '../assets/gramado-eventos-campo-livramento.webp';
import logoImage from '../assets/logo.webp';

export default function MaintenancePage() {
  const { user, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          className="w-full h-full object-cover"
          alt="Rancho Branco Background"
          src={bgImage}
        />
        <div className="absolute inset-0 bg-primary/80"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl w-full bg-surface/10 backdrop-blur-xl p-12 rounded-[2rem] border border-white/10 shadow-2xl"
      >
        <img 
          src={logoImage} 
          alt="Rancho Branco" 
          className="h-24 md:h-32 w-auto mx-auto mb-12 invert opacity-90"
        />
        
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-fixed text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <Lock size={14} />
            Acesso Restrito
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
            Estamos em Manutenção
          </h1>
          <p className="text-white/70 font-light text-lg leading-relaxed mb-10">
            O Rancho Branco está preparando uma nova experiência digital para você. 
            No momento, o acesso é exclusivo para administradores autorizados.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {!user ? (
              <button
                onClick={handleLogin}
                className="w-full bg-white text-primary px-8 py-4 rounded-full font-label text-lg font-bold shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
              >
                <LogIn size={20} />
                Entrar com Google
              </button>
            ) : (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4 mb-4 justify-center">
                  {user.photoURL && (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-12 h-12 rounded-full border-2 border-white/20" />
                  )}
                  <div className="text-left">
                    <p className="text-white font-medium">{user.displayName}</p>
                    <p className="text-white/50 text-sm">{user.email}</p>
                  </div>
                </div>
                {user.email !== 'enrique.rfm@gmail.com' ? (
                  <div className="text-red-400 text-sm font-medium flex items-center justify-center gap-2 mt-4">
                    <Mail size={16} />
                    Acesso não autorizado para este e-mail.
                  </div>
                ) : (
                  <p className="text-secondary-fixed text-sm font-medium">Redirecionando...</p>
                )}
                <button
                  onClick={() => auth.signOut()}
                  className="mt-6 text-white/50 hover:text-white text-sm underline underline-offset-4 transition-colors"
                >
                  Sair da conta
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <footer className="relative z-10 mt-12 text-white/40 text-xs font-light tracking-widest uppercase">
        © {new Date().getFullYear()} Rancho Branco • Todos os direitos reservados
      </footer>
    </div>
  );
}
