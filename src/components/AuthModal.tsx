import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  Home,
  Briefcase,
  LogIn,
  UserPlus,
  CheckCircle2,
  Info,
  Loader2,
  Chrome
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, defaultMode }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode ?? 'login');
  const [role, setRole] = useState<'client' | 'professional'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpType, setOtpType] = useState<'signup' | 'email'>('signup');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    setShowOtpScreen(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // OAuth cannot carry arbitrary signup metadata. Keep the user's selected
      // role locally until Supabase returns them to this browser tab.
      if (mode === 'signup') {
        sessionStorage.setItem(
          'archconnect_google_signup_intent',
          JSON.stringify({ role, name: name.trim() })
        );
      }
      sessionStorage.setItem('archconnect_google_oauth_pending', 'true');

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err.message ?? 'Google login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        // 1. Create auth user — name & role go into metadata
        //    so the DB trigger auto-creates user_profiles row
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              name: name.trim(),
              role: role,
            },
          },
        });

        if (signUpError) {
          if (signUpError.message.includes('already registered') || signUpError.message.includes('User already registered'))
            throw new Error('This email is already registered. Please log in.');
          throw signUpError;
        }
        if (!data.user) throw new Error('Signup failed — no user returned.');

        // 2. Fallback upsert — trigger normally handles this,
        //    but this ensures profile exists even if trigger is delayed
        await supabase
          .from('user_profiles')
          .upsert({
            id: data.user.id,
            name: name.trim(),
            role: role as UserRole,
          }, { onConflict: 'id' });

        // 3a. Session exists → email confirmation OFF → direct login
        if (data.session) {
          const authUser: AuthUser = {
            id: data.user.id,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            role: role as UserRole,
            joinedAt: data.user.created_at,
          };
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            onLogin(authUser);
            onClose();
          }, 1200);
          return;
        }

        // 3b. No session → email confirmation still ON
        setOtpType('signup');
        setShowOtpScreen(true);
        setError('✅ Sign up successful! We have sent a verification link to your email.');
        setLoading(false);
        return;

      } else {
        // Login
        const inputEmail = email.trim().toLowerCase();
        if ((inputEmail === 'admin' || inputEmail === 'admin@archconnect.com') && password === 'kfyarchconnect') {
          const adminUser: AuthUser = {
            id: 'admin-system',
            name: 'Platform Administrator',
            email: 'admin@archconnect.com',
            role: 'admin',
            joinedAt: new Date().toISOString()
          };
          localStorage.setItem('admin_session', JSON.stringify(adminUser));
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            onLogin(adminUser);
            onClose();
          }, 1000);
          return;
        }

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: inputEmail,
          password,
        });

        if (signInError) {
          const msg = signInError.message;
          if (msg.includes('Email not confirmed') || msg.toLowerCase().includes('confirm')) {
            // Transition to verification OTP screen
            setOtpType('signup');
            setShowOtpScreen(true);
            setError('⚠️ Your email is not confirmed yet. A verification code has been sent to your email. Please enter it below to confirm.');
            setLoading(false);
            return;
          }
          if (msg.includes('Invalid login credentials'))
            throw new Error('Invalid email or password. Please try again.');
          throw signInError;
        }
        if (!data.user) throw new Error('Login failed.');

        // Fetch profile to get name + role
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('name, role, joined_at')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
          await supabase.auth.signOut();
          throw new Error(
            'Profile setup is incomplete. Please sign up again with your email and password.'
          );
        }

        let avatar = undefined;
        if (profile.role === 'professional') {
          const { data: prof } = await supabase
            .from('professionals')
            .select('avatar')
            .eq('owner_id', data.user.id)
            .maybeSingle();
          if (prof?.avatar) {
            avatar = prof.avatar;
          }
        }

        const authUser: AuthUser = {
          id: data.user.id,
          name: profile.name,
          email: data.user.email!,
          role: profile.role as UserRole,
          joinedAt: profile.joined_at,
          avatar: avatar,
        };

        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onLogin(authUser);
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (resendError) throw resendError;
      setError('✅ A fresh verification link has been sent to your email.');
    } catch (err: any) {
      setError(err.message ?? 'Failed to resend link. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationStatus = async (showSuccessAlert: boolean = false) => {
    if (!email || !password) return;
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        if (showSuccessAlert) {
          setError('⚠️ Email is still not confirmed. Please check your inbox and click the link.');
        }
        return;
      }

      if (data?.user) {
        // Fetch profile to get name + role
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('name, role, joined_at')
          .eq('id', data.user.id)
          .single();

        let avatar = undefined;
        if (profile?.role === 'professional') {
          const { data: prof } = await supabase
            .from('professionals')
            .select('avatar')
            .eq('owner_id', data.user.id)
            .maybeSingle();
          if (prof?.avatar) {
            avatar = prof.avatar;
          }
        }

        const authUser: AuthUser = {
          id: data.user.id,
          name: profile?.name || name || 'User',
          email: data.user.email!,
          role: (profile?.role || role) as UserRole,
          joinedAt: profile?.joined_at || data.user.created_at,
          avatar: avatar,
        };

        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onLogin(authUser);
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      console.warn('Verification check failed:', err);
    }
  };

  useEffect(() => {
    let intervalId: any;
    
    if (showOtpScreen && email && password) {
      // Poll every 3 seconds
      intervalId = setInterval(() => {
        checkVerificationStatus(false);
      }, 3000);
      
      // Run once immediately
      checkVerificationStatus(false);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [showOtpScreen, email, password]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#FDF8F0] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#4A3728] text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-[#C4A882]" />
            </div>
            <h2 className="font-display font-bold text-lg text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {success ? (
          <div className="p-10 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#4A3728]">
              {otpType === 'signup' && showOtpScreen ? 'Email Verified & Logged In!' : mode === 'login' ? 'Logged In!' : 'Account Created!'}
            </h3>
            <p className="text-xs text-slate-500">Redirecting to your dashboard…</p>
          </div>
        ) : showOtpScreen ? (
          <div className="p-6 space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-[#4A3728]/5 text-[#4A3728] rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-[#9B7B5A]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-[#4A3728]">
                Verify Your Email
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                We have sent a confirmation link to <strong className="text-[#4A3728]">{email}</strong>.
              </p>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed font-medium">
                Please check your inbox and click the verification link. Once verified, this page will automatically log you in.
              </p>
            </div>

            {error && (
              <p className={`text-xs p-3 rounded-xl border ${
                error.startsWith('✅') || error.includes('successful')
                  ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                  : 'text-red-600 bg-red-50 border-red-200'
              }`}>
                {error}
              </p>
            )}

            <div className="space-y-3 py-1">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9B7B5A]" />
                <span>Waiting for email confirmation...</span>
              </div>
              
              <button
                type="button"
                onClick={() => checkVerificationStatus(true)}
                disabled={loading}
                className="w-full py-2.5 bg-[#9B7B5A] hover:bg-[#4A3728] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>I've Verified My Email</span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 pt-3 border-t border-slate-200/60">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-xs font-semibold text-[#9B7B5A] hover:underline disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                Didn't receive the email? Resend Link
              </button>
              <button
                type="button"
                onClick={() => { setShowOtpScreen(false); setError(''); }}
                className="text-xs font-semibold text-slate-500 hover:text-[#4A3728] hover:underline cursor-pointer"
              >
                ← Back to Login / Sign Up
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Mode Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-slate-200/60 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('login'); resetForm(); }}
                className={`py-2 flex items-center justify-center gap-1.5 rounded-lg transition-all ${
                  mode === 'login' ? 'bg-[#4A3728] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); resetForm(); }}
                className={`py-2 flex items-center justify-center gap-1.5 rounded-lg transition-all ${
                  mode === 'signup' ? 'bg-[#4A3728] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </button>
            </div>


            {/* Role Selector — signup only */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  I am joining as…
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      role === 'client'
                        ? 'border-[#4A3728] bg-[#4A3728]/5 text-[#4A3728]'
                        : 'border-slate-200 text-slate-500 hover:border-[#9B7B5A]/50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      role === 'client' ? 'bg-[#4A3728] text-white' : 'bg-slate-100'
                    }`}>
                      <Home className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold">User</span>
                    <span className="text-[10px] text-center leading-snug text-slate-400 font-normal">
                      Post requirements & find experts
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('professional')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      role === 'professional'
                        ? 'border-[#4A3728] bg-[#4A3728]/5 text-[#4A3728]'
                        : 'border-slate-200 text-slate-500 hover:border-[#9B7B5A]/50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      role === 'professional' ? 'bg-[#4A3728] text-white' : 'bg-slate-100'
                    }`}>
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold">Professional</span>
                    <span className="text-[10px] text-center leading-snug text-slate-400 font-normal">
                      Architect, Engineer, Designer
                    </span>
                  </button>
                </div>

              </div>
            )}

            {/* Full Name — signup only */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'professional' ? 'Ar. John Doe' : 'Rahul Sharma'}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                  />
                </div>
              </div>
            )}

            {/* Email / Username */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                {mode === 'login' ? 'Username or Email' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === 'login' ? 'admin or name@domain.com' : 'name@domain.com'}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#4A3728] focus:outline-none focus:ring-2 focus:ring-[#4A3728]"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4A3728] hover:bg-[#6B5040] disabled:bg-[#4A3728]/50 text-white font-bold text-sm rounded-full shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Log In to Dashboard' : 'Create Free Account'}</span>
                  <ArrowRight className="w-4 h-4 text-[#C4A882]" />
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-white hover:bg-slate-50 disabled:bg-slate-100 text-slate-700 font-bold text-sm rounded-full border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Chrome className="w-4 h-4 text-[#4285F4]" />
              <span>Continue with Google</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); resetForm(); }}
                className="text-xs font-semibold text-[#9B7B5A] hover:underline"
              >
                {mode === 'login' ? "Don't have an account? Sign Up" : 'Already registered? Log In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
