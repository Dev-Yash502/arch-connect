import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User, Building, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'homeowner' | 'professional'>('homeowner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#f9f9f7] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#003629] text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-[#ecc246]" />
            </div>
            <h2 className="font-display font-bold text-lg text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create Arch-Connect Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#003629]">
              Authentication Successful
            </h3>
            <p className="text-xs text-slate-600">Logged in as {email || 'user@arch-connect.com'}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Account Role Selector */}
            <div className="grid grid-cols-2 gap-2 bg-slate-200/60 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setRole('homeowner')}
                className={`py-2 rounded-lg transition-all ${
                  role === 'homeowner' ? 'bg-[#003629] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Homeowner
              </button>
              <button
                type="button"
                onClick={() => setRole('professional')}
                className={`py-2 rounded-lg transition-all ${
                  role === 'professional' ? 'bg-[#003629] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Architect / Expert
              </button>
            </div>

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
                    placeholder="Ar. John Doe"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#003629] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#003629] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#003629] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold text-sm rounded-full shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>{mode === 'login' ? 'Log In to Dashboard' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4 text-[#ecc246]" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-xs font-semibold text-[#755b00] hover:underline"
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
