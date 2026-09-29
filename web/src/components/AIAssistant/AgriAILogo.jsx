import React from 'react';

/**
 * AgriConnect AI Professional Logo
 * Seamlessly integrates organic agricultural leaves with futuristic neural network nodes & Gemini sparkle.
 */
export default function AgriAILogo({ size = 36, animated = true, glowing = true, className = '' }) {
  const s = size;
  return (
    <div
      className={`agri-ai-logo-container ${className}`}
      style={{
        width: `${s}px`,
        height: `${s}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      {/* Outer ambient glow */}
      {glowing && (
        <div
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '12px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(5, 150, 105, 0.1) 70%, transparent 100%)',
            filter: 'blur(4px)',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
      )}

      <svg
        width={s}
        height={s}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'relative',
          zIndex: 1,
          filter: glowing ? 'drop-shadow(0 2px 6px rgba(16, 185, 129, 0.35))' : 'none'
        }}
      >
        <defs>
          {/* Main Leaf Gradient */}
          <linearGradient id="agriLeafGrad" x1="6" y1="42" x2="38" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="45%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#4ADE80" />
          </linearGradient>

          {/* Secondary Circuit Gradient */}
          <linearGradient id="agriCircuitGrad" x1="14" y1="36" x2="36" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="60%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </linearGradient>

          {/* Core Sparkle Gradient */}
          <linearGradient id="agriSparkleGrad" x1="28" y1="12" x2="42" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Soft Glass Background Badge */}
          <linearGradient id="agriBgGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#064E3B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#022C22" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Rounded Shield Container Background */}
        <rect
          x="1.5"
          y="1.5"
          width="45"
          height="45"
          rx="12"
          fill="url(#agriBgGrad)"
          stroke="rgba(74, 222, 128, 0.35)"
          strokeWidth="1.5"
        />

        {/* Neural Network Micro Grid Lines */}
        <path
          d="M12 36L20 28M20 28L28 26M20 28L22 18M28 26L34 20"
          stroke="url(#agriCircuitGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />

        {/* Organic Agri Sprout Leaf */}
        <path
          d="M12 36C12 36 13 22 24 16C28 24 24 33 12 36Z"
          fill="url(#agriLeafGrad)"
          stroke="#4ADE80"
          strokeWidth="1.2"
        />

        {/* Secondary Ascending Sprout Leaf */}
        <path
          d="M23 26C23 26 27 15 36 14C37 20 33 27 23 26Z"
          fill="url(#agriLeafGrad)"
          fillOpacity="0.9"
          stroke="#86EFAC"
          strokeWidth="1"
        />

        {/* Neural Nodes */}
        <circle cx="12" cy="36" r="2.5" fill="#4ADE80" />
        <circle cx="20" cy="28" r="2.2" fill="#38BDF8" />
        <circle cx="28" cy="26" r="2.2" fill="#A7F3D0" />
        <circle cx="22" cy="18" r="1.8" fill="#6EE7B7" />

        {/* Gemini 4-Point AI Sparkle Star */}
        <path
          d="M36 8C36 12 34 14 30 14C34 14 36 16 36 20C36 16 38 14 42 14C38 14 36 12 36 8Z"
          fill="url(#agriSparkleGrad)"
        />

        {/* Live Active Neural Core Glow */}
        <circle cx="36" cy="14" r="1.2" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
