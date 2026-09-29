import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  ArrowRight,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Warehouse,
  Sparkles,
  ShoppingBag,
  DollarSign
} from 'lucide-react';

export default function ProductsView({
  theme,
  darkMode = false,
  lang = 'en',
  onOpenRequisition,
  onNavigate
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const CATEGORIES = ['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Micronutrients'];

  const PRODUCTS = [
    {
      id: 'PROD-01',
      name: 'CR-1009 Sub-1 Certified Paddy',
      category: 'Seeds',
      stockKg: 5000,
      minThresholdKg: 2000,
      manufacturer: 'TNAU Seed Certification Center',
      subsidizedPrice: '₹38 / kg',
      marketPrice: '₹75 / kg',
      status: 'Normal',
      desc: 'Flood tolerant Samba paddy seed, high grain yield 5.5 t/ha, 155 days duration.'
    },
    {
      id: 'PROD-02',
      name: 'Neem-Coated Urea (46% N)',
      category: 'Fertilizers',
      stockKg: 4000,
      minThresholdKg: 8000,
      manufacturer: 'SPIC Tuticorin / NFL',
      subsidizedPrice: '₹5.91 / kg',
      marketPrice: '₹54.40 / kg',
      status: 'Low Stock',
      desc: 'Slow release nitrogen fertilizer minimizing volatilization losses in flooded delta paddy.'
    },
    {
      id: 'PROD-03',
      name: 'Di-Ammonium Phosphate (18:46:0)',
      category: 'Fertilizers',
      stockKg: 6200,
      minThresholdKg: 3000,
      manufacturer: 'IFFCO Cuddalore',
      subsidizedPrice: '₹27.00 / kg',
      marketPrice: '₹76.00 / kg',
      status: 'Normal',
      desc: 'Basal application phosphate promoting vigorous root development and tillering.'
    },
    {
      id: 'PROD-04',
      name: 'Muriate of Potash (60% K2O)',
      category: 'Fertilizers',
      stockKg: 1800,
      minThresholdKg: 3500,
      manufacturer: 'IPL Indian Potash Ltd',
      subsidizedPrice: '₹34.00 / kg',
      marketPrice: '₹64.00 / kg',
      status: 'Critical',
      desc: 'Essential for disease resistance, stem strength, and panicle grain filling.'
    },
    {
      id: 'PROD-05',
      name: 'Trichoderma Viride & Pseudomonas',
      category: 'Pesticides',
      stockKg: 2500,
      minThresholdKg: 3000,
      manufacturer: 'TNAU Bio-Control Labs',
      subsidizedPrice: '₹120 / L',
      marketPrice: '₹380 / L',
      status: 'Low Stock',
      desc: 'Eco-safe bio-fungicide protecting roots from sheath blight and bacterial leaf streak.'
    },
    {
      id: 'PROD-06',
      name: 'Zinc Sulphate Monohydrate (33% Zn)',
      category: 'Micronutrients',
      stockKg: 3100,
      minThresholdKg: 1500,
      manufacturer: 'Coimbatore Agro Minerals',
      subsidizedPrice: '₹45 / kg',
      marketPrice: '₹95 / kg',
      status: 'Normal',
      desc: 'Prevents Khaira zinc deficiency chlorosis in calcareous alluvial delta soils.'
    }
  ];

  const filtered = PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: theme.textHead, margin: '0 0 4px 0' }}>
            {lang === 'ta' ? 'வேளாண் பொருட்கள் மற்றும் விநியோக பட்டியல்' : 'Agricultural Products Catalog & Inventory'}
          </h1>
          <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
            {lang === 'ta' ? 'சான்றளிக்கப்பட்ட விதைகள், உரங்கள், உயிரி பூச்சிக்கொல்லிகள் மற்றும் நுண்ணூட்டச்சத்துக்கள்' : 'Certified seeds, ICAR/TNAU fertilizers, bio-pesticides and micronutrients'}
          </p>
        </div>

        <button
          onClick={onOpenRequisition}
          style={{
            backgroundColor: '#16A34A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '9px 16px',
            fontSize: '13px',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
          }}
        >
          <Plus size={16} />
          <span>+ New Requisition Order</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="white-card"
        style={{
          padding: '14px 18px',
          backgroundColor: theme.bgCard,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                backgroundColor: selectedCategory === cat ? '#16A34A' : (darkMode ? '#1E293B' : '#F1F5F9'),
                color: selectedCategory === cat ? '#FFFFFF' : theme.textMuted,
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '12.5px',
                fontWeight: selectedCategory === cat ? '700' : '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: darkMode ? '#1E293B' : '#F8FAFC',
            border: `1px solid ${theme.borderMedium}`,
            borderRadius: '8px',
            padding: '6px 12px',
            width: '280px'
          }}
        >
          <Search size={15} color={theme.textMuted} />
          <input
            type="text"
            placeholder="Search products or manufacturer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '12px',
              color: theme.textHead,
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px'
        }}
      >
        {filtered.map((p) => {
          const isLow = p.status === 'Low Stock' || p.status === 'Critical';
          const pct = Math.min(100, Math.round((p.stockKg / (p.minThresholdKg * 1.5)) * 100));

          return (
            <div
              key={p.id}
              className="white-card"
              style={{
                padding: '18px 20px',
                backgroundColor: theme.bgCard,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${p.status === 'Critical' ? '#DC2626' : p.status === 'Low Stock' ? '#D97706' : '#16A34A'}`
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '800',
                      letterSpacing: '0.4px',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: darkMode ? '#1E293B' : '#F1F5F9',
                      color: theme.textMuted
                    }}
                  >
                    {p.category}
                  </span>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: p.status === 'Critical' ? '#FEE2E2' : p.status === 'Low Stock' ? '#FEF3C7' : '#DCFCE7',
                      color: p.status === 'Critical' ? '#DC2626' : p.status === 'Low Stock' ? '#D97706' : '#16A34A',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isLow ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                    {p.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: theme.textHead, margin: '0 0 4px 0' }}>
                  {p.name}
                </h3>
                <div style={{ fontSize: '11.5px', color: '#0284C7', fontWeight: '600', marginBottom: '8px' }}>
                  🏢 {p.manufacturer}
                </div>
                <p style={{ fontSize: '12px', color: theme.textMuted, margin: '0 0 14px 0', lineHeight: 1.35 }}>
                  {p.desc}
                </p>

                {/* Stock Level Progress */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: '600', marginBottom: '4px' }}>
                    <span style={{ color: theme.textMuted }}>Current Stockpile</span>
                    <span style={{ color: theme.textHead }}>
                      {p.stockKg.toLocaleString()} kg / L <span style={{ color: theme.textMuted, fontWeight: '400' }}>(min {p.minThresholdKg.toLocaleString()})</span>
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '7px', borderRadius: '4px', backgroundColor: darkMode ? '#334155' : '#E2E8F0', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        borderRadius: '4px',
                        backgroundColor: p.status === 'Critical' ? '#DC2626' : p.status === 'Low Stock' ? '#D97706' : '#16A34A',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Pricing DBT vs Market */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: darkMode ? '#1E293B' : '#F8FAFC',
                    fontSize: '11.5px',
                    marginBottom: '14px'
                  }}
                >
                  <div>
                    <span style={{ color: theme.textMuted }}>DBT Price: </span>
                    <strong style={{ color: '#16A34A' }}>{p.subsidizedPrice}</strong>
                  </div>
                  <div>
                    <span style={{ color: theme.textMuted }}>Market: </span>
                    <span style={{ textDecoration: 'line-through', color: theme.textMuted }}>{p.marketPrice}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={onOpenRequisition}
                style={{
                  width: '100%',
                  padding: '8px 0',
                  borderRadius: '8px',
                  border: `1.5px solid ${isLow ? '#DC2626' : '#16A34A'}`,
                  backgroundColor: 'transparent',
                  color: isLow ? '#DC2626' : '#16A34A',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isLow ? '#DC2626' : '#16A34A';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isLow ? '#DC2626' : '#16A34A';
                }}
              >
                <Plus size={14} />
                <span>{isLow ? 'Request Emergency Restock' : 'Order Stock Rebalance'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
