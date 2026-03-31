'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import { useAdminLogin } from '@/hooks/api/admin/useAdminAuth';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');

  const { mutate: login, isPending } = useAdminLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    login(
      { username, password },
      {
        onError: (err) => {
          // Show backend message inline — lockout, wrong creds, etc.
          setError(err?.message || 'Invalid credentials. Try again.');
        },
      }
    );
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left — Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M12 12c-3-5-8-6-9-5s1 6 5 7c-4 2-4 6-2 6s5-3 6-5"/>
            <path d="M12 12c3-5 8-6 9-5s-1 6-5 7c4 2 4 6 2 6s-5-3-6-5"/>
            <line x1="12" y1="3" x2="12" y2="21"/>
          </svg>
          <div>
            <span className="font-serif italic text-lg">Inner</span>
            <span className="eb-garamond-quote">Flame</span>
          </div>
        </div>

        <div className="space-y-6">
          <blockquote className="border-l-4 border-foreground pl-6">
            <p className="text-2xl font-serif italic leading-relaxed text-foreground">
              Your space. Your rules. Your words.
            </p>
          </blockquote>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground pl-6">
            — admin panel
          </p>
        </div>

        <p className="text-xs font-mono text-muted-foreground">
          InnerFlame · content management
        </p>
      </div>

      {/* Right — Form */}
      <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16">

        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-12 lg:hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M12 12c-3-5-8-6-9-5s1 6 5 7c-4 2-4 6-2 6s5-3 6-5"/>
            <path d="M12 12c3-5 8-6 9-5s-1 6-5 7c4 2 4 6 2 6s-5-3-6-5"/>
            <line x1="12" y1="3" x2="12" y2="21"/>
          </svg>
          <span className="font-serif italic">Inner</span>
          <span className="eb-garamond-quote">Flame</span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div>
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
              — welcome back
            </span>
            <h1 className="text-3xl font-serif italic mt-3 mb-1">Sign in</h1>
            <p className="text-sm font-reading text-muted-foreground">
              Manage your blog content.
            </p>
          </div>

          {/* Inline error — shows backend message (lockout, wrong creds) */}
          {error && (
            <div className="text-sm text-destructive border border-destructive/30 bg-destructive/5 px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isPending}
                className="h-11 font-reading border-foreground/20 focus:border-foreground/50"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isPending}
                  className="h-11 pr-10 font-reading border-foreground/20 focus:border-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${DESIGN_CONSTANTS.transitions.fast}`}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || !username || !password}
              className={`group w-full h-11 flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-wide border-4 border-foreground bg-background hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[8px] active:translate-y-[8px] disabled:opacity-40 disabled:pointer-events-none`}
            >
              {isPending ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
