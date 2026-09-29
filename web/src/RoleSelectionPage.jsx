import React from 'react';
import {
  Sprout,
  ArrowRight,
  LogOut,
  Building2,
  Truck,
  Store,
  User,
  Sun,
  Moon
} from 'lucide-react';

export default function RoleSelectionPage({
  currentUser,
  onSelectRole,
  onLogout,
  darkMode = false,
  onToggleTheme
}) {
  const roles = [
    {
      id: 'Supplier',
      title: 'Supplier',
      description: 'Manage products, stock and supply to distributors/retailers',
      bgColor: darkMode ? 'rgba(6, 78, 59, 0.4)' : '#F0FDF4',
      borderColor: darkMode ? '#065F46' : '#BBF7D0',
      iconBg: darkMode ? '#064E3B' : '#DCFCE7',
      iconColor: '#16A34A',
      btnColor: '#166534',
      badge: 'Manufacturing & Apex Stock'
    },
    {
      id: 'Distributor',
      title: 'Distributor',
      description: 'Manage warehouse, deliveries and retailer orders',
      bgColor: darkMode ? 'rgba(12, 74, 110, 0.4)' : '#F0F9FF',
      borderColor: darkMode ? '#075985' : '#BAE6FD',
      iconBg: darkMode ? '#0C4A6E' : '#E0F2FE',
      iconColor: '#0284C7',
      btnColor: '#0369A1',
      badge: 'Logistics & Fleet Rakes'
    },
    {
      id: 'Retailer',
      title: 'Retailer',
      description: 'Manage shop inventory, sales and orders',
      bgColor: darkMode ? 'rgba(120, 53, 15, 0.4)' : '#FFFBEB',
      borderColor: darkMode ? '#92400E' : '#FDE68A',
      iconBg: darkMode ? '#78350F' : '#FEF3C7',
      iconColor: '#D97706',
      btnColor: '#B45309',
      badge: 'Local PACS & Agro Stores'
    },
    {
      id: 'Farmer',
      title: 'Farmer',
      description: 'View crop requirements, place orders and track delivery',
      bgColor: darkMode ? 'rgba(88, 28, 135, 0.4)' : '#FAF5FF',
      borderColor: darkMode ? '#6B21A8' : '#E9D5FF',
      iconBg: darkMode ? '#581C87' : '#F3E8FF',
      iconColor: '#9333EA',
      btnColor: '#7E22CE',
      badge: 'Subsidy Passbook & Requisitions'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: "url('/role_selection_bg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Light / Atmospheric overlay for readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: darkMode ? 'rgba(11, 15, 25, 0.88)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(3px)',
        zIndex: 1
      }} />

      {/* Top Header Navbar */}
      <header style={{
        position: 'relative',
        zIndex: 2,
        height: '68px',
        padding: '0 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: darkMode ? '1px solid #1E293B' : '1px solid rgba(226, 232, 240, 0.8)',
        backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(22, 163, 74, 0.3)'
          }}>
            <Sprout size={20} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <span style={{
            fontSize: '20px',
            fontWeight: '900',
            letterSpacing: '-0.5px',
            color: darkMode ? '#F8FAFC' : '#0F172A'
          }}>
            Agri<span style={{ color: '#16A34A' }}>Connect</span>
          </span>
        </div>

        {/* User Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onToggleTheme}
            title={darkMode ? "Switch to Normal Mode" : "Switch to Dark Mode"}
            style={{
              background: 'none',
              border: darkMode ? '1px solid #334155' : '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '6px 8px',
              cursor: 'pointer',
              color: darkMode ? '#FDE047' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: '20px',
            backgroundColor: darkMode ? '#1E293B' : '#F1F5F9',
            fontSize: '12px',
            fontWeight: '600',
            color: darkMode ? '#E2E8F0' : '#334155'
          }}>
            <User size={14} color="#16A34A" />
            <span>{currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Logged In'}</span>
          </div>

          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'none',
              border: darkMode ? '1px solid #334155' : '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: '600',
              color: darkMode ? '#94A3B8' : '#64748B',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content: Select Your Role */}
      <main style={{
        position: 'relative',
        zIndex: 2,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Title & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{
            fontSize: '34px',
            fontWeight: '900',
            letterSpacing: '-0.8px',
            color: darkMode ? '#F8FAFC' : '#0F172A',
            marginBottom: '8px'
          }}>
            Select Your Role
          </h1>
          <p style={{
            fontSize: '15px',
            color: darkMode ? '#94A3B8' : '#64748B',
            fontWeight: '500',
            margin: 0
          }}>
            Choose your role to access your personalized agricultural supply dashboard
          </p>
        </div>

        {/* 4 Role Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          width: '100%',
          maxWidth: '1100px'
        }}>
          {roles.map((r) => {
            return (
              <div
                key={r.id}
                style={{
                  backgroundColor: r.bgColor,
                  border: `1.5px solid ${r.borderColor}`,
                  borderRadius: '16px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 30px -5px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)';
                }}
                onClick={() => onSelectRole(r.id)}
              >
                <div>
                  {/* Role Custom Illustration / Icon */}
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '18px',
                    backgroundColor: r.iconBg,
                    margin: '0 auto 18px auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}>
                    {r.id === 'Supplier' && (
                      <Building2 size={38} color={r.iconColor} strokeWidth={2} />
                    )}
                    {r.id === 'Distributor' && (
                      <Truck size={38} color={r.iconColor} strokeWidth={2} />
                    )}
                    {r.id === 'Retailer' && (
                      <Store size={38} color={r.iconColor} strokeWidth={2} />
                    )}
                    {r.id === 'Farmer' && (
                      <Sprout size={38} color={r.iconColor} strokeWidth={2} />
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: darkMode ? '#F8FAFC' : '#0F172A',
                    textAlign: 'center',
                    marginBottom: '8px'
                  }}>
                    {r.title}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: darkMode ? '#CBD5E1' : '#475569',
                    textAlign: 'center',
                    lineHeight: 1.45,
                    minHeight: '40px',
                    margin: '0 0 20px 0'
                  }}>
                    {r.description}
                  </p>
                </div>

                {/* Continue Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRole(r.id);
                  }}
                  style={{
                    width: '100%',
                    padding: '11px',
                    backgroundColor: '#166534',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 10px rgba(22, 101, 52, 0.25)',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <span>Continue</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
