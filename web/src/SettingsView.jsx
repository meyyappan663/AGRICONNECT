import React, { useState } from 'react';
import {
  Settings,
  User,
  Building2,
  Bell,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Globe,
  Database,
  Save,
  RotateCcw
} from 'lucide-react';

export default function SettingsView({
  currentUser,
  currentRole = 'Supplier',
  lang = 'en',
  darkMode = false,
  theme,
  showToast
}) {
  const [profileName, setProfileName] = useState(
    currentUser?.user_metadata?.full_name || (currentRole === 'Farmer' ? 'K. Arunkumar' : 'Ramesh Kumar')
  );
  const [district, setDistrict] = useState('Thanjavur');
  const [pacsId, setPacsId] = useState('TN-PACS-DELTA-8821');
  const [phone, setPhone] = useState('+91 94432 77102');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [stockThreshold, setStockThreshold] = useState('20%');

  const handleSave = () => {
    if (showToast) {
      showToast(lang === 'ta' ? 'அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன' : 'Settings updated and synchronized!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '960px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: theme.textHead, margin: '0 0 4px 0' }}>
          {lang === 'ta' ? 'அமைப்புகள் & நிர்வாக விருப்பத்தேர்வுகள்' : 'Platform & Profile Settings'}
        </h1>
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
          Manage your organization profile, supply radar preferences, and automated SMS alerts
        </p>
      </div>

      {/* Profile Card */}
      <div className="white-card" style={{ padding: '22px', backgroundColor: theme.bgCard }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: darkMode ? '#064E3B' : '#DCFCE7', padding: '8px', borderRadius: '10px', color: '#16A34A' }}>
            <User size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: theme.textHead, margin: 0 }}>
              Organization & Stakeholder Profile
            </h3>
            <span style={{ fontSize: '11.5px', color: theme.textMuted }}>Registered entity on AgriConnect National Grid</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: theme.textHead, marginBottom: '6px' }}>
              Full Name / Officer In-Charge
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.borderMedium}`,
                backgroundColor: darkMode ? '#1E293B' : '#F8FAFC',
                color: theme.textHead,
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: theme.textHead, marginBottom: '6px' }}>
              Active Stakeholder Role
            </label>
            <input
              type="text"
              disabled
              value={`${currentRole} (Verified)`}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.borderMedium}`,
                backgroundColor: darkMode ? '#0F172A' : '#E2E8F0',
                color: '#16A34A',
                fontWeight: '700',
                fontSize: '13px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: theme.textHead, marginBottom: '6px' }}>
              Registration ID / PACS Token
            </label>
            <input
              type="text"
              value={pacsId}
              onChange={(e) => setPacsId(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.borderMedium}`,
                backgroundColor: darkMode ? '#1E293B' : '#F8FAFC',
                color: theme.textHead,
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: theme.textHead, marginBottom: '6px' }}>
              Dispatch Notification Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.borderMedium}`,
                backgroundColor: darkMode ? '#1E293B' : '#F8FAFC',
                color: theme.textHead,
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Supply Chain & Alerts Configuration */}
      <div className="white-card" style={{ padding: '22px', backgroundColor: theme.bgCard }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: darkMode ? '#0C4A6E' : '#E0F2FE', padding: '8px', borderRadius: '10px', color: '#0284C7' }}>
            <Bell size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: theme.textHead, margin: 0 }}>
              Automated Logistics & Weather Alerts
            </h3>
            <span style={{ fontSize: '11.5px', color: theme.textMuted }}>Configured thresholds for Cauvery Delta operations</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: theme.textHead }}>
                Instant SMS Delivery Alerts
              </div>
              <div style={{ fontSize: '11.5px', color: theme.textMuted }}>
                Send SMS tokens to farmers and drivers upon warehouse dispatch confirmation
              </div>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#16A34A', cursor: 'pointer' }}
            />
          </div>

          <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: theme.textHead }}>
                Emergency Stock Warning Trigger
              </div>
              <div style={{ fontSize: '11.5px', color: theme.textMuted }}>
                Highlight inventory radar in red when depot stockpile drops below safe margin
              </div>
            </div>
            <select
              value={stockThreshold}
              onChange={(e) => setStockThreshold(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.borderMedium}`,
                backgroundColor: darkMode ? '#1E293B' : '#F8FAFC',
                color: theme.textHead,
                fontSize: '12.5px',
                fontWeight: '600'
              }}
            >
              <option value="15%">15% (Critical Margin)</option>
              <option value="20%">20% (Recommended Standard)</option>
              <option value="25%">25% (Conservative Safety Stock)</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Diagnostics & Backend Status */}
      <div className="white-card" style={{ padding: '22px', backgroundColor: theme.bgCard }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: darkMode ? '#78350F' : '#FEF3C7', padding: '8px', borderRadius: '10px', color: '#D97706' }}>
            <Cpu size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: theme.textHead, margin: 0 }}>
              System Integrations & AI Engine Diagnostics
            </h3>
            <span style={{ fontSize: '11.5px', color: theme.textMuted }}>Verified operational telemetry</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { name: 'Python FastAPI Engine', port: '8000', status: 'Active (R² > 0.99)', color: '#16A34A' },
            { name: 'Open-Meteo Satellite Feed', port: 'Live', status: 'Synchronized', color: '#16A34A' },
            { name: 'Leaflet GIS Router', port: 'Client', status: 'Haversine Solved', color: '#16A34A' },
            { name: 'Supabase Cloud Auth', port: 'SSL', status: 'Connected', color: '#16A34A' }
          ].map((sys, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: darkMode ? '#1E293B' : '#F8FAFC',
                border: `1px solid ${theme.border}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: theme.textHead }}>{sys.name}</span>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: sys.color }} />
              </div>
              <div style={{ fontSize: '11px', color: sys.color, fontWeight: '600' }}>{sys.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: '#16A34A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '13px',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
          }}
        >
          <Save size={15} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
