import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Sprout,
  Sun,
  Moon,
  Truck,
  Warehouse,
  ShoppingBag,
  UserCheck
} from 'lucide-react';

export default function AuthPage({ onLoginSuccess, darkMode = false, onToggleTheme }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Email & Password Sign In / Sign Up via Supabase
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        if (data.session) {
          onLoginSuccess(data.user);
        } else {
          setSuccessMsg('Account created successfully! Check your email or use Quick Access Demo.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.session) {
          onLoginSuccess(data.user);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth via Supabase
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const redirectUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) throw error;
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  // Handle GitHub OAuth via Supabase
  const handleGitHubSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const redirectUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) throw error;
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  // Instant Demo Login (Goes to Role Selection)
  const handleDemoLogin = (role = null) => {
    const demoUser = {
      id: 'demo-user-id',
      email: role ? `${role.toLowerCase()}@agriconnect.in` : 'demo@agriconnect.in',
      user_metadata: {
        full_name: role ? `${role} User` : 'AgriConnect User',
        role: role || null // null will trigger the Role Selection screen
      }
    };
    try {
      localStorage.setItem('hackdude_demo_user', JSON.stringify(demoUser));
    } catch (_) {}
    onLoginSuccess(demoUser);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: darkMode ? '#0B0F19' : '#FFFFFF',
      color: darkMode ? '#F8FAFC' : '#0F172A',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* ========================================================
          LEFT COLUMN: Farm Hero Banner (Exact match to uploaded design)
      ======================================================== */}
      <div style={{
        flex: '1 1 50%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 56px',
        backgroundImage: "url('/login_farm_hero.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#FFFFFF',
        minHeight: '100vh'
      }}>
        {/* Soft atmospheric green overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(6, 44, 25, 0.45) 0%, rgba(4, 30, 18, 0.85) 100%)',
          zIndex: 1
        }} />

        {/* Brand Header */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
          }}>
            <Sprout size={24} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px', color: '#FFFFFF', lineHeight: 1.1 }}>
              AgriConnect
            </div>
            <div style={{ fontSize: '12px', color: '#86EFAC', fontWeight: '600', letterSpacing: '0.4px' }}>
              Farm to Future
            </div>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px', margin: 'auto 0 40px 0' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '900',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: '16px',
            color: '#FFFFFF'
          }}>
            Smarter Supply Chain for a Stronger Agriculture
          </h1>
          <p style={{
            fontSize: '16px',
            lineHeight: 1.5,
            color: 'rgba(255, 255, 255, 0.85)',
            fontWeight: '400'
          }}>
            AI-powered logistics for farmers, suppliers, distributors and retailers.
          </p>
        </div>

        {/* Bottom 4 Circular Icon Badges */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'Farmers', icon: Sprout },
            { label: 'Suppliers', icon: Warehouse },
            { label: 'Distributors', icon: Truck },
            { label: 'Retailers', icon: ShoppingBag },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'transform 0.2s'
                }}>
                  <Icon size={20} />
                </div>
                <span style={{ fontSize: '11px', color: '#FFFFFF', fontWeight: '600', opacity: 0.9 }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          RIGHT COLUMN: Clean White Form (Exact match to uploaded design)
      ======================================================== */}
      <div style={{
        flex: '1 1 50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '36px 48px',
        backgroundColor: darkMode ? '#0F172A' : '#FFFFFF',
        overflowY: 'auto'
      }}>
        {/* Top Bar: Switch to Sign Up + Theme Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '13px', color: darkMode ? '#94A3B8' : '#64748B' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#166534',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </div>

          <button
            onClick={onToggleTheme}
            title={darkMode ? "Switch to Normal Mode" : "Switch to Dark Mode"}
            style={{
              background: 'none',
              border: darkMode ? '1px solid #334155' : '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: darkMode ? '#FDE047' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Form Container (Centered) */}
        <div style={{
          maxWidth: '400px',
          width: '100%',
          margin: 'auto',
          padding: '20px 0'
        }}>
          <h2 style={{
            fontSize: '30px',
            fontWeight: '900',
            letterSpacing: '-0.5px',
            color: darkMode ? '#F8FAFC' : '#0F172A',
            marginBottom: '6px'
          }}>
            {isSignUp ? 'Create an Account' : 'Welcome Back!'}
          </h2>
          <p style={{
            fontSize: '14px',
            color: darkMode ? '#94A3B8' : '#64748B',
            marginBottom: '28px'
          }}>
            {isSignUp ? 'Join AgriConnect for smarter agricultural supply' : 'Login to your account to continue'}
          </p>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div style={{
              backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#DC2626',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              backgroundColor: darkMode ? 'rgba(34, 197, 94, 0.15)' : '#F0FDF4',
              border: '1px solid #86EFAC',
              color: '#16A34A',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email / Username Input */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: darkMode ? '#CBD5E1' : '#334155', display: 'block', marginBottom: '6px' }}>
                Email / Username
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94A3B8' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    border: darkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: darkMode ? '#F8FAFC' : '#0F172A',
                    outline: 'none',
                    backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: darkMode ? '#CBD5E1' : '#334155', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94A3B8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    border: darkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: darkMode ? '#F8FAFC' : '#0F172A',
                    outline: 'none',
                    backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: darkMode ? '#94A3B8' : '#64748B' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#166534', cursor: 'pointer' }}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset instructions sent to your registered email."); }} style={{ color: '#166534', textDecoration: 'none', fontWeight: '600' }}>
                Forgot password?
              </a>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: '#166534',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(22, 101, 52, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              <span>{loading ? 'Authenticating...' : 'Authenticate'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* OR Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '22px 0',
            color: '#94A3B8',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: darkMode ? '#334155' : '#E2E8F0' }} />
            <span style={{ padding: '0 12px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: darkMode ? '#334155' : '#E2E8F0' }} />
          </div>

          {/* Social OAuth Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                padding: '11px',
                backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
                border: darkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                color: darkMode ? '#F8FAFC' : '#1E293B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'background-color 0.2s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Continue with GitHub */}
            <button
              type="button"
              onClick={handleGitHubSignIn}
              style={{
                width: '100%',
                padding: '11px',
                backgroundColor: darkMode ? '#1E293B' : '#0F172A',
                border: darkMode ? '1px solid #334155' : '1px solid #0F172A',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'background-color 0.2s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', marginTop: '16px' }}>
          New to AgriConnect? <button onClick={() => setIsSignUp(true)} style={{ background: 'none', border: 'none', color: '#166534', fontWeight: '700', cursor: 'pointer', padding: 0 }}>Create an account</button>
        </div>
      </div>
    </div>
  );
}
