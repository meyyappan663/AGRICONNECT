import React from 'react';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  BarChart3,
  Compass,
  Sparkles,
  Settings,
  Leaf,
  Store,
  Sun,
  Truck,
  ChevronLeft,
  ChevronRight,
  Sprout,
  X,
  Bot,
  MessageSquare
} from 'lucide-react';
import AgriAILogo from './components/AIAssistant/AgriAILogo';

export default function SlideBar({
  currentRole = 'Supplier',
  activeTab = 'dashboard',
  onSelectTab,
  onOpenAssistant = () => {},
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
  mobileOpen = false,
  onCloseMobile,
  lang = 'en',
  darkMode = false,
  theme,
  ordersCount = 8,
  alertsCount = 4
}) {
  // Navigation tabs configured by user role
  const getNavItems = () => {
    switch (currentRole) {
      case 'Farmer':
        return [
          { id: 'dashboard', label: lang === 'ta' ? 'டாஷ்போர்டு' : 'Dashboard', icon: LayoutDashboard },
          { id: 'farmer_home', label: lang === 'ta' ? 'விவசாயி போர்டல்' : 'My Farm & Quota', icon: Leaf },
          { id: 'farmer_crop_doctor', label: lang === 'ta' ? 'AI பயிர் மருத்துவர்' : 'AI Crop Doctor', icon: Sparkles, badge: 'AI' },
          { id: 'farmer_orders', label: lang === 'ta' ? 'பதிவுகள்' : 'My Requisitions', icon: Package, count: 1 },
          { id: 'farmer_advisory', label: lang === 'ta' ? 'பயிர் வழிகாட்டி' : 'TN Agro Advisory', icon: Sun },
          { id: 'radar', label: lang === 'ta' ? 'கிடங்கு இருப்பு' : 'Depot Stocks', icon: Warehouse },
          { id: 'settings', label: lang === 'ta' ? 'அமைப்புகள்' : 'Settings', icon: Settings },
        ];
      case 'Distributor':
        return [
          { id: 'dashboard', label: lang === 'ta' ? 'டாஷ்போர்டு' : 'Dashboard', icon: LayoutDashboard },
          { id: 'map', label: lang === 'ta' ? 'போக்குவரத்து வரைபடம்' : 'Route & Fleet', icon: Compass },
          { id: 'radar', label: lang === 'ta' ? 'கிடங்கு இருப்புகள்' : 'Depots & Inventory', icon: Warehouse },
          { id: 'transfers', label: lang === 'ta' ? 'லாரி சரக்குகள்' : 'Fleet Transfers', icon: Truck, count: 4 },
          { id: 'predict', label: lang === 'ta' ? 'AI தேவை கணிப்பு' : 'Demand Analytics', icon: BarChart3 },
          { id: 'farmer_crop_doctor', label: lang === 'ta' ? 'AI பயிர் மருத்துவர்' : 'AI Crop Doctor', icon: Sparkles, badge: 'AI' },
          { id: 'settings', label: lang === 'ta' ? 'அமைப்புகள்' : 'Settings', icon: Settings },
        ];
      case 'Retailer':
        return [
          { id: 'dashboard', label: lang === 'ta' ? 'டாஷ்போர்டு' : 'Dashboard', icon: LayoutDashboard },
          { id: 'products', label: lang === 'ta' ? 'கடை பொருட்கள்' : 'Store Products', icon: Store },
          { id: 'transfers', label: lang === 'ta' ? 'விற்பனை & ஆர்டர்கள்' : 'Farmer Orders', icon: ShoppingCart, count: 14 },
          { id: 'radar', label: lang === 'ta' ? 'கிடங்கு இருப்பு' : 'Stock Radar', icon: Warehouse },
          { id: 'predict', label: lang === 'ta' ? 'AI தேவை கணிப்பு' : 'Demand AI', icon: BarChart3 },
          { id: 'farmer_crop_doctor', label: lang === 'ta' ? 'AI பயிர் மருத்துவர்' : 'AI Crop Doctor', icon: Sparkles, badge: 'AI' },
          { id: 'settings', label: lang === 'ta' ? 'அமைப்புகள்' : 'Settings', icon: Settings },
        ];
      case 'Supplier':
      default:
        return [
          { id: 'dashboard', label: lang === 'ta' ? 'டாஷ்போர்டு' : 'Dashboard', icon: LayoutDashboard },
          { id: 'products', label: lang === 'ta' ? 'பொருட்கள்' : 'Products', icon: Package },
          { id: 'radar', label: lang === 'ta' ? 'இருப்பு ரேடார்' : 'Inventory', icon: Warehouse },
          { id: 'transfers', label: lang === 'ta' ? 'ஆர்டர்கள் & தளவாடம்' : 'Orders', icon: ShoppingCart, count: ordersCount },
          { id: 'predict', label: lang === 'ta' ? 'பகுப்பாய்வு' : 'Analytics', icon: BarChart3 },
          { id: 'map', label: lang === 'ta' ? 'விநியோக வரைபடம்' : 'Supply Grid', icon: Compass },
          { id: 'farmer_crop_doctor', label: lang === 'ta' ? 'AI பயிர் மருத்துவர்' : 'AI Crop Doctor', icon: Sparkles, badge: 'AI' },
          { id: 'settings', label: lang === 'ta' ? 'அமைப்புகள்' : 'Settings', icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();
  const sidebarWidth = isCollapsed && !isMobile ? '72px' : '245px';

  const sidebarContent = (
    <div
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        maxWidth: sidebarWidth,
        height: '100%',
        backgroundColor: '#0A3628',
        background: 'linear-gradient(180deg, #072B20 0%, #0B3D2E 50%, #062319 100%)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 1100,
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Top Header & Branding */}
      <div>
        <div
          style={{
            height: '64px',
            padding: isCollapsed && !isMobile ? '0 14px' : '0 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed && !isMobile ? 'center' : 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div
            onClick={() => onSelectTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '11px',
              cursor: 'pointer',
              userSelect: 'none',
              overflow: 'hidden'
            }}
          >
            {/* Green Leaf Icon Container */}
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                flexShrink: 0
              }}
            >
              <Sprout size={22} color="#FFFFFF" strokeWidth={2.4} />
            </div>

            {(!isCollapsed || isMobile) && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '17px',
                    fontWeight: '800',
                    letterSpacing: '-0.3px',
                    color: '#FFFFFF',
                    lineHeight: 1.15
                  }}
                >
                  Agri<span style={{ color: '#4ADE80' }}>Connect</span>
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#86EFAC',
                    letterSpacing: '0.4px',
                    textTransform: 'uppercase'
                  }}
                >
                  Farm to Future
                </span>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          {isMobile && (
            <button
              onClick={onCloseMobile}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Menu Links */}
        <nav
          style={{
            padding: isCollapsed && !isMobile ? '16px 8px' : '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (isMobile && onCloseMobile) onCloseMobile();
                }}
                title={isCollapsed && !isMobile ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: isCollapsed && !isMobile ? '10px 0' : '10px 14px',
                  justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                  backgroundColor: isActive ? '#16A34A' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.72)',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  position: 'relative',
                  boxShadow: isActive ? '0 4px 14px rgba(22, 163, 74, 0.35)' : 'none',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} color={isActive ? '#FFFFFF' : 'currentColor'} />
                </div>

                {(!isCollapsed || isMobile) && (
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}

                {(!isCollapsed || isMobile) && item.badge && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: '800',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      padding: '1px 6px',
                      borderRadius: '6px',
                      letterSpacing: '0.4px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}

                {(!isCollapsed || isMobile) && item.count !== undefined && item.count > 0 && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      padding: '1px 7px',
                      borderRadius: '10px'
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Central AI Chat Bot Button */}
      {(!isCollapsed || isMobile) ? (
        <div style={{ padding: '14px' }}>
          <button
            onClick={onOpenAssistant}
            style={{
              width: '100%',
              backgroundColor: 'rgba(16, 185, 129, 0.14)',
              border: '1px solid rgba(74, 222, 128, 0.35)',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              color: '#FFFFFF',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.14)';
              e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.35)';
            }}
          >
            <AgriAILogo size={36} glowing={true} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25, flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#F8FAFC' }}>
                  AgriConnect AI
                </span>
                <span
                  style={{
                    fontSize: '8.5px',
                    fontWeight: '800',
                    backgroundColor: 'rgba(74, 222, 128, 0.25)',
                    color: '#4ADE80',
                    padding: '1px 5px',
                    borderRadius: '6px',
                    letterSpacing: '0.4px'
                  }}
                >
                  GEMINI
                </span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: '600', color: '#A7F3D0', marginTop: '2px' }}>
                Chat & Voice Assistant
              </span>
            </div>
          </button>
        </div>
      ) : (
        <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onOpenAssistant}
            title="AgriConnect AI Assistant (Chat & Voice)"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <AgriAILogo size={38} glowing={true} />
          </button>
        </div>
      )}
    </div>
  );

  // If Mobile: Render as slide-over drawer with backdrop overlay
  if (isMobile) {
    if (!mobileOpen) return null;
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex'
        }}
      >
        {/* Backdrop overlay */}
        <div
          onClick={onCloseMobile}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(2px)',
            animation: 'fadeIn 0.2s ease'
          }}
        />
        {/* Drawer Content */}
        <div style={{ position: 'relative', zIndex: 2001, height: '100%' }}>
          {sidebarContent}
        </div>
      </div>
    );
  }

  // Desktop: Fixed/Sticky Left Sidebar
  return (
    <aside
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0
      }}
    >
      {sidebarContent}
    </aside>
  );
}
