'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } from '@/lib/supabase/auth';
import { Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';

type Mode = 'signin' | 'signup' | 'reset';

export default function AuthContent() {
  const [mode,     setMode]     = useState<Mode>('signin');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');

  const router      = useRouter();
  const searchParams = useSearchParams();
  const redirect    = searchParams.get('from') || '/';

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      toast.error(err.message || 'Google sign in failed');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      if (mode === 'reset') {
        await resetPassword(email);
        toast.success('Password reset email sent! Check your inbox.');
        setMode('signin');
        return;
      }
      if (mode === 'signup') {
        if (!name.trim())        { toast.error('Enter your name'); return; }
        if (password.length < 6) { toast.error('Password must be 6+ characters'); return; }
        await signUpWithEmail(email, password, name);
        toast.success('Account created! Welcome to AroundJos 🎉');
      } else {
        await signInWithEmail(email, password);
        toast.success('Welcome back!');
      }
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      const code = err.message || '';
      const msg =
        code.includes('Invalid login')      ? 'Invalid email or password' :
        code.includes('already registered') ? 'Email already registered' :
        code.includes('valid email')        ? 'Invalid email address' :
        err.message || 'Authentication failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-surface-50 dark:bg-dark-bg">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-earth-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-500 rounded-2xl flex items-center justify-center text-white font-black font-display">AJ</div>
            <span className="text-2xl font-black font-display text-surface-900 dark:text-white">
              Around<span className="text-brand-500">Jos</span>
            </span>
          </Link>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl border border-surface-100 dark:border-dark-border shadow-card p-7">
          <div className="mb-6">
            {mode === 'reset' && (
              <button onClick={() => setMode('signin')} className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 dark:hover:text-white mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <h1 className="font-display font-black text-2xl text-surface-900 dark:text-white">
              {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset password'}
            </h1>
            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
              {mode === 'signin' ? 'Sign in to AroundJos' : mode === 'signup' ? "Join AroundJos — it's free" : "We'll send you a reset link"}
            </p>
          </div>

          {mode !== 'reset' && (
            <>
              <button onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-dark-card2 border-2 border-surface-200 dark:border-dark-border hover:border-brand-300 text-surface-700 dark:text-white font-semibold py-3 rounded-2xl transition-all text-sm disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </button>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-surface-100 dark:bg-dark-border" />
                <span className="text-xs text-surface-400">or with email</span>
                <div className="flex-1 h-px bg-surface-100 dark:bg-dark-border" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name" icon={<User className="w-4 h-4" />} required />
            )}
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com" icon={<Mail className="w-4 h-4" />} required />
            {mode !== 'reset' && (
              <Input label="Password" type={showPass ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
                icon={<Lock className="w-4 h-4" />}
                iconRight={
                  <button type="button" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />
            )}
            {mode === 'signin' && (
              <div className="text-right">
                <button type="button" onClick={() => setMode('reset')} className="text-xs text-brand-500 hover:text-brand-600 font-medium">
                  Forgot password?
                </button>
              </div>
            )}
            <Button type="submit" fullWidth loading={loading}>
              {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
            </Button>
          </form>

          {mode !== 'reset' && (
            <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-brand-500 font-bold hover:text-brand-600">
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-surface-400 mt-6">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-brand-500">Terms</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-brand-500">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
