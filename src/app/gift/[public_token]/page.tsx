'use client';

import React, { use, useEffect, useState, useRef } from 'react';

/* ── Allowed Palette: #D3C0B1, #4E2712, #EBE5DE, #FFFFFF ── */

/* ── Logo component ── */
function Logo({ size = 40, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <img
      src="/images/app-logo.jpg"
      alt="Logo"
      style={{ width: size, height: size, borderRadius: size * 0.22, objectFit: 'cover', display: 'block', ...style }}
    />
  );
}

/* ─────────────────────────────── Types ─────────────────────────────── */

interface ServiceType { id: string; name: string; }
interface ServiceData {
  id?: string;
  name: string;
  image?: string | null;   /* legacy */
  image1?: string | null;  /* actual API field */
  currency: string;
  price?: string;
  base_price?: string;
  service_types?: ServiceType[];
  duration_minutes?: number;  /* legacy */
  duration?: number;          /* actual API field */
  name_ar?: string;
}
interface BranchData { id?: string; name: string; branch_id?: string; city?: string; address?: string; name_ar?: string; }
interface ServiceArrangementData {
  id?: string;
  image?: string | null;
  price?: string;
  effective_price?: string;
  currency?: string;
  arrangement_name?: string;  /* legacy */
  name?: string;              /* actual API field */
  arrangement_type: string;
}
interface Addon {
  id?: string;
  addon_id?: string;
  name: string;
  price?: string;
  currency?: string;
  description?: string;
  duration_minutes?: number;  /* legacy */
  duration?: number;          /* actual API field */
}
interface SenderData { name: string; phone_number?: string; }
interface RecipientData {
  id: string; name: string; email: string;
  avatar: string | null; phone_number: string;
}

interface OrderedItem {
  sku?: string;
  name: string;
  image?: string;
  price: number;
  name_ar?: string;
  name_en?: string;
  currency: string;
  quantity: number;
  product_id?: string;
  total_price: number;
}

interface DeliveryAddress {
  area?: string;
  city?: string;
  block?: string;
  floor?: string;
  notes?: string;
  street?: string;
  building?: string;
  apartment?: string;
}

interface DigitalProductData {
  video_url?: string | null;
  [key: string]: unknown;
}

interface GiftVoucher {
  id: string;
  gift_category: 'service' | 'digital' | 'physical' | string;
  service_data?: ServiceData;
  branch_data?: BranchData;
  service_arrangement_data?: ServiceArrangementData;
  addons?: Addon[];
  extra_time?: number;
  price_for_extra_time?: string;
  expire_date: string;
  status: string;
  sender_data: SenderData;
  recipient_phone?: string;
  recipient_data?: RecipientData;
  total_duration?: number;
  total_amount: string;
  currency: string;
  gift_message?: string;
  gift_template?: string;
  secret_code?: string;
  public_token: string;
  redeemed_at?: string | null;
  redeemed_by?: string | null;
  created_at: string;
  /* Physical-specific */
  ordered_items?: OrderedItem[];
  delivery_status?: string;
  delivery_status_label?: string;
  delivery_status_label_ar?: string;
  delivery_address?: DeliveryAddress;
  /* Digital-specific */
  digital_product_data?: DigitalProductData | null;
}

/* ─────────────────────────────── Helpers ────────────────────────────── */

function fmtDate(d: string) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return d; }
}

function fmtDuration(min: number) {
  if (!min) return '—';
  const h = Math.floor(min / 60), m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

function isExpired(dateStr: string) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

/* ─────────────────────────────── CSS ───────────────────────────────── */

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Lustria&family=Alex+Brush&family=Roboto:wght@300;400;500;600;700&display=swap');

  .gift-outer{
    min-height:100vh;
    background:#543C30;
    display:flex;align-items:flex-start;justify-content:center;padding:0;
  }
  .gift-shell{
    width:100%;max-width:430px;min-height:100vh;
    background:#D3C0B2;
    box-shadow:0 0 60px rgba(0,0,0,0.55), -12px 0 35px rgba(0,0,0,0.35), 12px 0 35px rgba(0,0,0,0.35);
    position:relative;overflow:hidden;
  }
  *{box-sizing:border-box;margin:0;padding:0;}

  @keyframes petalFall{
    0%{transform:translateY(-40px) rotate(0deg) scale(0.8);opacity:0}
    10%{opacity:0.9}90%{opacity:0.6}
    100%{transform:translateY(110vh) rotate(420deg) scale(1.1);opacity:0}
  }
  @keyframes shimmerSlide{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}
  @keyframes glow{
    0%,100%{box-shadow:0 0 20px rgba(211,192,177,0.4)}
    50%{box-shadow:0 0 40px rgba(211,192,177,0.7)}
  }
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes shake{
    0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}
  }
  @keyframes ringPulse{
    0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.7}
    50%{transform:translate(-50%,-50%) scale(1.08);opacity:0.3}
  }
  @keyframes bounceIn{
    0%{opacity:0;transform:scale(0.3)}50%{transform:scale(1.1)}70%{transform:scale(0.95)}100%{opacity:1;transform:scale(1)}
  }
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes revealSlide{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes giftBounce{
    0%{transform:scale(1) rotate(0deg)}25%{transform:scale(1.15) rotate(-5deg)}
    50%{transform:scale(1.2) rotate(5deg)}75%{transform:scale(1.1) rotate(-3deg)}100%{transform:scale(1) rotate(0deg)}
  }
  @keyframes pulseGlow{
    0%,100%{box-shadow:0 0 0 0 rgba(84,60,48,0.35)}50%{box-shadow:0 0 0 12px rgba(84,60,48,0)}
  }
  @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes modalIn{
    from{opacity:0;transform:scale(0.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}
  }
  @keyframes stepPop{0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
  @keyframes loadingPulse{
    0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(0.95)}
  }
  @keyframes videoFadeIn{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
  @keyframes ctaSlideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes skipFadeIn{from{opacity:0}to{opacity:1}}

  .petal{position:fixed;border-radius:50% 0 50% 0;pointer-events:none;animation:petalFall linear infinite;}
  .shimmer-bar{
    position:absolute;inset:0;
    background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.2) 50%,transparent 60%);
    animation:shimmerSlide 2.8s ease-in-out infinite;
  }
  .stat-card{
    background:#FFFFFF;border-radius:18px;padding:18px 12px;text-align:center;
    border:1px solid #EBE5DE;box-shadow:0 4px 18px rgba(78,39,18,0.05);
    animation:fadeUp 0.5s ease both;
  }
  .detail-card{
    background:#FFFFFF;border-radius:20px;overflow:hidden;
    border:1px solid #EBE5DE;box-shadow:0 6px 24px rgba(78,39,18,0.06);
    animation:fadeUp 0.5s ease both;
  }
  .tag{
    display:inline-flex;align-items:center;gap:5px;border-radius:20px;
    padding:4px 12px;font-size:0.75rem;font-weight:600;letter-spacing:0.6px;
    background:#EBE5DE;color:#4E2712;border:1px solid #D3C0B1;
  }
  .app-btn{
    display:flex;align-items:center;gap:12px;background:#FFFFFF;
    border:1.5px solid #D3C0B1;border-radius:16px;padding:14px 20px;
    color:#4E2712;cursor:pointer;flex:1;min-width:140px;transition:all 250ms;text-decoration:none;
  }
  .app-btn:hover{background:#EBE5DE;transform:translateY(-2px);}

  .flip-container{perspective:1000px;}
  .flip-card{position:relative;transform-style:preserve-3d;transition:transform 0.7s cubic-bezier(0.4,0,0.2,1);}
  .flip-card.flipped{transform:rotateY(180deg);}
  .flip-front,.flip-back{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:20px;}
  .flip-back{transform:rotateY(180deg);}
`;

/* ─────────────────────────────── Floating Petals ───────────────────── */

function FloatingPetals() {
  const petals = Array.from({ length: 16 }, (_, i) => ({
    size: 7 + (i % 5) * 5,
    left: `${(i * 19 + 3) % 100}%`,
    delay: `${(i * 0.55) % 9}s`,
    dur: `${8 + (i % 6) * 1.5}s`,
    opacity: 0.12 + (i % 4) * 0.05,
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {petals.map((p, i) => (
        <div key={i} className="petal" style={{
          width: p.size, height: p.size,
          background: `rgba(211, 192, 177, ${p.opacity})`,
          left: p.left, top: -40,
          animationDuration: p.dur,
          animationDelay: p.delay,
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────── Loading Screen ────────────────────── */

function GiftLoadingScreen() {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#543C30',
    }}>
      <FloatingPetals />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{
          fontSize: 72, marginBottom: 28,
          animation: 'giftBounce 1.8s ease-in-out infinite',
          display: 'inline-block',
        }}>🎁</div>

        {[120, 90, 60].map((size, i) => (
          <div key={size} style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: `1.5px solid rgba(211, 192, 177, ${0.2 + i * 0.15})`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -85%)',
            animation: `ringPulse ${2 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ marginBottom: 16 }}>
          <Logo size={48} />
        </div>

        <p style={{
          fontFamily: "'Lustria', serif",
          fontSize: '1.1rem', color: '#FFFFFF', marginBottom: 8,
          animation: 'loadingPulse 1.5s ease-in-out infinite',
        }}>
          Your gift is loading{dots}
        </p>
        <p style={{ color: '#D3C0B1', opacity: 0.9, fontSize: '0.82rem' }}>Please wait a moment ✨</p>

        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid rgba(211, 192, 177, 0.35)',
          borderTopColor: '#FFFFFF',
          animation: 'spin 0.9s linear infinite',
          margin: '24px auto 0',
        }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────── Secret Code Modal ─────────────────── */

function SecretModal({ onSubmit, loading, error }: {
  onSubmit: (code: string) => void; loading: boolean; error: string;
}) {
  const [code, setCode] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => ref.current?.focus(), 350); }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#543C30',
    }}>
      {[500, 370, 240].map((s, i) => (
        <div key={s} style={{
          position: 'absolute', width: s, height: s, borderRadius: '50%',
          border: `1.5px solid rgba(211, 192, 177, ${0.25 + i * 0.1})`,
          top: '50%', left: '50%',
          animation: `ringPulse ${3 + i}s ease-in-out ${i * 0.8}s infinite`,
        }} />
      ))}

      <div style={{
        position: 'relative', zIndex: 1,
        background: '#FFFFFF', borderRadius: 28,
        padding: '52px 44px 44px',
        maxWidth: 420, width: '92%',
        boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
        border: '1px solid #D3C0B1',
        animation: 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        textAlign: 'center',
      }}>
        <div style={{
          width: 84, height: 84, borderRadius: '50%',
          background: '#543C30',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 28px rgba(84,60,48,0.35)',
          animation: 'float 3s ease-in-out infinite',
          fontSize: 38,
        }}>🎁</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Logo size={44} />
        </div>
        <p style={{ fontFamily: "'Alex Brush', cursive", fontSize: '1.6rem', color: '#543C30', lineHeight: 1, marginBottom: 8 }}>
          You have a gift!
        </p>
        <h2 style={{ fontFamily: "'Lustria', serif", fontSize: '1.3rem', color: '#543C30', marginBottom: 10 }}>
          Enter Your Secret Code
        </h2>
        <p style={{ color: '#543C30', opacity: 0.75, fontSize: '0.9rem', marginBottom: 28, lineHeight: 1.7 }}>
          Your secret code was shared with your gift.<br />Enter it below to unwrap your luxury experience.
        </p>

        <input
          id="gift-secret-code"
          ref={ref}
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && code.trim() && onSubmit(code.trim())}
          placeholder="Enter code…"
          maxLength={20}
          style={{
            width: '100%', padding: '17px 20px',
            borderRadius: 14, fontSize: '1.6rem',
            letterSpacing: '0.35em', textAlign: 'center',
            fontFamily: "'Lustria', serif", color: '#543C30',
            border: error ? '2px solid #543C30' : '2px solid #D3C0B1',
            background: '#EBE5DE', outline: 'none',
            transition: 'border 250ms, box-shadow 250ms',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#543C30'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(84,60,48,0.2)'; }}
          onBlur={e => { if (!error) { e.currentTarget.style.borderColor = '#D3C0B1'; e.currentTarget.style.boxShadow = 'none'; } }}
        />

        {error && (
          <p style={{ color: '#543C30', fontWeight: 700, fontSize: '0.84rem', marginTop: 10, animation: 'shake 0.4s ease' }}>
            ⚠ {error}
          </p>
        )}

        <button
          id="gift-submit-code"
          disabled={loading || !code.trim()}
          onClick={() => code.trim() && onSubmit(code.trim())}
          style={{
            width: '100%', marginTop: 18, padding: '16px',
            borderRadius: 14, border: 'none',
            background: loading || !code.trim() ? '#D3C0B1' : '#543C30',
            color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600,
            letterSpacing: '1.2px', textTransform: 'uppercase',
            cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
            boxShadow: loading || !code.trim() ? 'none' : '0 8px 24px rgba(84,60,48,0.3)',
            transition: 'all 300ms', fontFamily: "'Roboto', sans-serif",
          }}
          onMouseEnter={e => { if (!loading && code.trim()) { e.currentTarget.style.transform = 'translateY(-2px)'; } }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
        >
          {loading
            ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid #D3C0B1', borderTopColor: '#FFFFFF', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Unwrapping your gift…
              </span>
            : '✨ Unwrap My Gift'}
        </button>

        <p style={{ marginTop: 18, color: '#543C30', opacity: 0.6, fontSize: '0.78rem' }}>🔒 Secured &amp; encrypted</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Gift Reveal Popup ─────────────────── */

type RevealPhase = 'popup' | 'message' | 'surprise-teaser';

function GiftRevealPopup({ voucher, onRevealGift }: { voucher: GiftVoucher; onRevealGift: () => void }) {
  const [phase, setPhase] = useState<RevealPhase>('popup');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);

  function handleShowMessage() {
    setIsFlipped(true);
    setTimeout(() => setPhase('message'), 500);
  }

  function handleShowSurprise() {
    setShowSurprise(true);
    setTimeout(() => setPhase('surprise-teaser'), 300);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#543C30',
      backdropFilter: 'blur(12px)',
      padding: '20px',
    }}>
      <FloatingPetals />

      {[480, 340, 210].map((s, i) => (
        <div key={s} style={{
          position: 'absolute', width: s, height: s, borderRadius: '50%',
          border: `1px solid rgba(211,192,177,${0.15 + i * 0.1})`,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: `ringPulse ${3 + i}s ease-in-out ${i * 0.7}s infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{
        position: 'relative', zIndex: 1,
        background: '#FFFFFF', borderRadius: 32,
        padding: '44px 36px 40px',
        maxWidth: 400, width: '100%',
        boxShadow: '0 60px 120px rgba(0,0,0,0.4)',
        border: '1px solid #D3C0B1',
        animation: 'modalIn 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        textAlign: 'center', overflow: 'hidden',
      }}>
        <div className="shimmer-bar" />

        {/* ── Phase: popup ── */}
        {phase === 'popup' && (
          <div style={{ animation: 'slideUp 0.5s ease both' }}>
            <div style={{
              fontSize: 76, marginBottom: 20,
              display: 'inline-block',
              animation: 'giftBounce 2s ease-in-out infinite',
            }}>🎁</div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Logo size={38} />
            </div>

            <p style={{ fontFamily: "'Alex Brush', cursive", fontSize: '1.4rem', color: '#543C30', opacity: 0.8, marginBottom: 6, lineHeight: 1 }}>
              from {voucher.sender_data?.name || 'Someone Special'}
            </p>
            <h2 style={{ fontFamily: "'Lustria', serif", fontSize: '1.5rem', color: '#543C30', marginBottom: 8, lineHeight: 1.3 }}>
              You have a special gift! 🌸
            </h2>
            <p style={{ color: '#543C30', opacity: 0.75, fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 32 }}>
              Someone cares about you deeply.<br />Tap below to reveal your gift message.
            </p>

            <button
              id="gift-show-message-btn"
              onClick={handleShowMessage}
              style={{
                width: '100%', padding: '18px 24px',
                borderRadius: 18, border: 'none',
                background: '#543C30',
                color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700,
                letterSpacing: '0.5px', cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(84,60,48,0.35)',
                animation: 'pulseGlow 2s ease-in-out infinite',
                fontFamily: "'Roboto', sans-serif",
                transition: 'all 300ms',
              }}
            >
              💌 Show my Message
            </button>
          </div>
        )}

        {/* ── Phase: message (flip) ── */}
        {phase === 'message' && (
          <div style={{ animation: 'slideUp 0.5s ease both' }}>
            <div className="flip-container" style={{ marginBottom: 24, height: 150 }}>
              <div className={`flip-card${isFlipped ? ' flipped' : ''}`} style={{ height: 150 }}>
                <div className="flip-front" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#EBE5DE',
                  fontSize: 48, border: '1px solid #D3C0B1',
                }}>💌</div>
                <div className="flip-back" style={{
                  background: '#EBE5DE',
                  borderLeft: '4px solid #543C30',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  padding: '20px 18px',
                }}>
                  <div style={{ fontSize: '0.66rem', color: '#543C30', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
                    ✉ Gift Message
                  </div>
                  <p style={{
                    fontFamily: "'Lustria', serif", fontSize: '1rem',
                    color: '#543C30', fontStyle: 'italic', lineHeight: 1.7, margin: 0,
                  }}>
                    &ldquo;{voucher.gift_message || 'Wishing you joy and warmth!'}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <p style={{ color: '#543C30', opacity: 0.8, fontSize: '0.85rem', marginBottom: 8 }}>
              — with love from <strong style={{ color: '#543C30' }}>{voucher.sender_data?.name || 'Someone Special'}</strong>
            </p>

            {!showSurprise ? (
              <div style={{
                marginTop: 20, padding: '20px 18px',
                background: '#EBE5DE',
                borderRadius: 18, border: '1.5px dashed #D3C0B1',
                animation: 'fadeUp 0.6s 0.3s ease both',
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎀</div>
                <p style={{ fontFamily: "'Lustria', serif", color: '#543C30', fontSize: '0.95rem', marginBottom: 14, lineHeight: 1.5 }}>
                  You have a special <strong style={{ color: '#543C30' }}>gift package</strong>!<br />
                  <span style={{ fontSize: '0.82rem', color: '#543C30', opacity: 0.75 }}>Would you like to see it?</span>
                </p>
                <button
                  id="gift-reveal-surprise-btn"
                  onClick={handleShowSurprise}
                  style={{
                    padding: '12px 28px', borderRadius: 12, border: 'none',
                    background: '#543C30',
                    color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(84,60,48,0.3)',
                    fontFamily: "'Roboto', sans-serif", transition: 'all 250ms',
                  }}
                >
                  🎁 Yes, show me!
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 20, animation: 'fadeIn 0.4s ease' }}>
                <div style={{ fontSize: 40, animation: 'bounceIn 0.6s ease' }}>🎉</div>
              </div>
            )}
          </div>
        )}

        {/* ── Phase: surprise-teaser ── */}
        {phase === 'surprise-teaser' && (
          <div style={{ animation: 'slideUp 0.4s ease both' }}>
            <div style={{ fontSize: 60, marginBottom: 16, animation: 'bounceIn 0.6s ease', display: 'inline-block' }}>🎉</div>
            <h2 style={{ fontFamily: "'Lustria', serif", fontSize: '1.4rem', color: '#543C30', marginBottom: 8 }}>
              Get Ready! 🌸
            </h2>
            <p style={{ color: '#543C30', opacity: 0.75, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 28 }}>
              Your gift package is about to be revealed!
            </p>
            <button
              id="gift-open-surprise-btn"
              onClick={onRevealGift}
              style={{
                width: '100%', padding: '18px 24px',
                borderRadius: 18, border: 'none',
                background: '#543C30',
                color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(84,60,48,0.35)',
                fontFamily: "'Roboto', sans-serif", transition: 'all 300ms',
                animation: 'pulseGlow 2s ease-in-out infinite',
              }}
            >
              ✨ Open My Gift
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────── Digital Video Popup ───────────────── */

function DigitalVideoPopup({ videoUrl, onContinue }: { videoUrl: string; onContinue: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [showUnmuteBanner, setShowUnmuteBanner] = useState(false);

  useEffect(() => {
    // Show skip button after 3s
    const t = setTimeout(() => setShowSkip(true), 3000);

    // Attempt unmuted autoplay first
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        // Browser blocked unmuted autoplay, fall back to muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          setMuted(true);
          setShowUnmuteBanner(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }

    return () => clearTimeout(t);
  }, []);

  function toggleMute() {
    setMuted(m => {
      const nextMuted = !m;
      if (videoRef.current) videoRef.current.muted = nextMuted;
      if (!nextMuted) setShowUnmuteBanner(false);
      return nextMuted;
    });
  }

  function handleEnded() {
    setVideoEnded(true);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: '#000',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'videoFadeIn 0.6s ease both',
    }}>
      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        playsInline
        muted={muted}
        onEnded={handleEnded}
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain',
          position: 'absolute', inset: 0,
        }}
      />

      {/* Prominent Tap to Unmute Banner */}
      {showUnmuteBanner && !videoEnded && (
        <div
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              setMuted(false);
              setShowUnmuteBanner(false);
            }
          }}
          style={{
            position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 20,
            background: 'rgba(84, 60, 48, 0.92)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(211, 192, 177, 0.5)',
            borderRadius: 30, padding: '12px 24px',
            color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            animation: 'pulseGlow 2s ease-in-out infinite, fadeIn 0.4s ease',
            fontFamily: "'Roboto', sans-serif",
            whiteSpace: 'nowrap',
          }}
        >
          <span>🔊</span> Tap to Unmute
        </div>
      )}

      {/* Dark overlay gradient (bottom) */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Top gradient */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '18%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Skip button (top-right) */}
      {showSkip && !videoEnded && (
        <button
          id="gift-video-skip-btn"
          onClick={() => setVideoEnded(true)}
          style={{
            position: 'absolute', top: 20, right: 20, zIndex: 10,
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 24, padding: '8px 20px',
            color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.5px',
            fontFamily: "'Roboto', sans-serif",
            animation: 'skipFadeIn 0.5s ease both',
            transition: 'all 250ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
        >
          Skip ›
        </button>
      )}

      {/* Mute/Unmute toggle (bottom-left) */}
      {!videoEnded && (
        <button
          id="gift-video-mute-btn"
          onClick={toggleMute}
          title={muted ? 'Unmute video' : 'Mute video'}
          style={{
            position: 'absolute', bottom: videoEnded ? 160 : 30, left: 24, zIndex: 10,
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#FFFFFF', fontSize: '1.2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 250ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      )}

      {/* CTA after video ends */}
      {videoEnded && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '32px 28px 48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          animation: 'ctaSlideUp 0.7s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={36} />
          </div>
          <p style={{
            fontFamily: "'Alex Brush', cursive",
            fontSize: '1.4rem', color: '#D3C0B1', marginBottom: 6, textAlign: 'center',
          }}>
            A special message awaits you ✨
          </p>
          <button
            id="gift-video-show-message-btn"
            onClick={onContinue}
            style={{
              width: '100%', maxWidth: 360,
              padding: '18px 28px', borderRadius: 18, border: 'none',
              background: '#543C30',
              color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700,
              letterSpacing: '0.5px', cursor: 'pointer',
              boxShadow: '0 12px 36px rgba(84,60,48,0.5)',
              fontFamily: "'Roboto', sans-serif",
              animation: 'pulseGlow 2s ease-in-out infinite',
              transition: 'all 300ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
          >
            💌 Show My Message & Gift Pack
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────── Delivery Progress ─────────────────── */

const DELIVERY_STEPS = [
  { key: 'ordered',     label: 'Ordered',    icon: '📋' },
  { key: 'ready_to_go', label: 'Ready',       icon: '📦' },
  { key: 'on_the_way',  label: 'On the Way', icon: '🚚' },
  { key: 'delivered',   label: 'Delivered',  icon: '📬' },
  { key: 'received',    label: 'Received',   icon: '✓'  },
];

function getDeliveryStep(status: string | undefined): number {
  const s = (status ?? '').toLowerCase();
  if (s === 'received' || s.includes('received')) return 4;
  if (s === 'delivered' || (s.includes('delivered') && !s.includes('received'))) return 3;
  if (s === 'on_the_way' || s.includes('on_the_way') || s.includes('on the way') || s.includes('transit') || s.includes('shipped')) return 2;
  if (s === 'ready_to_go' || s.includes('ready_to_go') || s.includes('ready to go') || s.includes('confirmed') || s.includes('processing')) return 1;
  return 0;
}

function DeliveryProgressBar({ status }: { status: string | undefined }) {
  const activeStep = getDeliveryStep(status);

  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 24, padding: '24px 20px 20px',
      boxShadow: '0 6px 24px rgba(78,39,18,0.06)',
      border: '1px solid #EBE5DE', marginBottom: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#543C30',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          color: '#FFFFFF',
        }}>🚚</div>
        <h2 style={{ fontFamily: "'Lustria', serif", fontSize: '1rem', fontWeight: 700, color: '#4E2712' }}>
          Delivery Progress
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: 20, left: '10%', width: '80%', height: 3,
          background: '#EBE5DE', borderRadius: 2,
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', top: 20, left: '10%',
          width: `${(activeStep / (DELIVERY_STEPS.length - 1)) * 80}%`,
          height: 3,
          background: '#543C30',
          borderRadius: 2, transition: 'width 800ms cubic-bezier(0.4,0,0.2,1)',
        }} />

        {DELIVERY_STEPS.map((step, idx) => {
          const done = idx <= activeStep;
          const current = idx === activeStep;
          return (
            <div key={step.key} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              position: 'relative', flex: 1,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%', zIndex: 1,
                background: done ? '#543C30' : '#FFFFFF',
                border: done ? (current ? '2.5px solid #D3C0B1' : '2px solid #543C30') : '2px solid #EBE5DE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
                color: done ? '#FFFFFF' : '#D3C0B1',
                boxShadow: current ? '0 4px 16px rgba(84,60,48,0.35)' : 'none',
                transition: 'all 400ms ease',
                animation: current ? 'stepPop 0.6s ease' : 'none',
              }}>
                {step.icon}
              </div>
              <span style={{
                fontSize: '0.7rem', fontWeight: current ? 700 : 500,
                color: '#4E2712',
                opacity: done ? 1 : 0.6,
                letterSpacing: '0.3px', textAlign: 'center', lineHeight: 1.3,
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <span style={{
          display: 'inline-block', padding: '6px 18px', borderRadius: 999,
          background: '#EBE5DE', color: '#4E2712',
          fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.6px',
          textTransform: 'uppercase', border: '1px solid #D3C0B1',
        }}>
          {DELIVERY_STEPS[activeStep]?.icon} {DELIVERY_STEPS[activeStep]?.label}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Mark As Received Modal ─────────────── */

function MarkReceivedModal({ voucherId, onSuccess, onClose }: {
  voucherId: string; onSuccess: () => void; onClose: () => void;
}) {
  const [secretCode, setSecretCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 300); }, []);

  async function handleSubmit() {
    if (!secretCode.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(
        `/api/vouchers/${encodeURIComponent(voucherId)}/delivery-status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: { delivery_status: 'received', secret_code: secretCode.trim() } }),
        }
      );
      let data: Record<string, unknown> = {};
      try { data = await res.json(); } catch { /* empty */ }

      if (!res.ok) {
        const msg =
          (typeof data?.detail === 'string' ? data.detail : '') ||
          (typeof data?.message === 'string' ? data.message : '') ||
          (typeof data?.error === 'string' ? data.error : '') ||
          'Failed to confirm receipt. Please try again.';
        setError(msg);
        return;
      }
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 1800);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(84,60,48,0.85)', backdropFilter: 'blur(8px)',
      }} />
      <div style={{
        position: 'relative', zIndex: 1,
        background: '#FFFFFF', borderRadius: 28,
        padding: '44px 36px 40px',
        maxWidth: 400, width: '100%',
        boxShadow: '0 40px 100px rgba(84,60,48,0.3)',
        border: '1px solid #D3C0B1',
        animation: 'modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        textAlign: 'center',
      }}>
        <button
          onClick={onClose} aria-label="Close"
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 34, height: 34, borderRadius: '50%',
            background: '#EBE5DE', border: 'none', cursor: 'pointer',
            fontSize: '1rem', color: '#543C30',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✕</button>

        {success ? (
          <div style={{ animation: 'bounceIn 0.6s ease' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#543C30',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40, margin: '0 auto 20px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(84,60,48,0.3)',
            }}>✓</div>
            <h3 style={{ fontFamily: "'Lustria', serif", fontSize: '1.4rem', color: '#543C30', marginBottom: 10 }}>
              Gift Received! 🎉
            </h3>
            <p style={{ color: '#543C30', opacity: 0.8, fontSize: '0.9rem', lineHeight: 1.6 }}>
              Thank you! Your gift has been marked as received.
            </p>
          </div>
        ) : (
          <>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#543C30',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(84,60,48,0.3)',
              animation: 'float 3s ease-in-out infinite',
              color: '#FFFFFF',
            }}>📦</div>

            <h3 style={{ fontFamily: "'Lustria', serif", fontSize: '1.3rem', color: '#543C30', marginBottom: 8 }}>
              Confirm Receipt
            </h3>
            <p style={{ color: '#543C30', opacity: 0.75, fontSize: '0.86rem', lineHeight: 1.6, marginBottom: 28 }}>
              Enter your secret code to confirm you have received your gift.
            </p>

            <input
              id="received-secret-code"
              ref={inputRef}
              type="text"
              value={secretCode}
              onChange={e => setSecretCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && secretCode.trim() && handleSubmit()}
              placeholder="Enter secret code…"
              maxLength={24}
              style={{
                width: '100%', padding: '15px 18px',
                borderRadius: 14, fontSize: '1.3rem',
                letterSpacing: '0.3em', textAlign: 'center',
                fontFamily: "'Lustria', serif", color: '#543C30',
                border: error ? '2px solid #543C30' : '2px solid #D3C0B1',
                background: '#EBE5DE', outline: 'none',
                transition: 'border 250ms', marginBottom: 6,
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#543C30'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(84,60,48,0.2)'; }}
              onBlur={e => { if (!error) { e.currentTarget.style.borderColor = '#D3C0B1'; e.currentTarget.style.boxShadow = 'none'; } }}
            />

            {error && (
              <p style={{ color: '#543C30', fontWeight: 700, fontSize: '0.82rem', marginBottom: 10, animation: 'shake 0.4s ease' }}>
                ⚠ {error}
              </p>
            )}

            <button
              id="confirm-received-btn"
              disabled={submitting || !secretCode.trim()}
              onClick={handleSubmit}
              style={{
                width: '100%', marginTop: 14, padding: '15px',
                borderRadius: 14, border: 'none',
                background: submitting || !secretCode.trim() ? '#D3C0B1' : '#543C30',
                color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700,
                letterSpacing: '0.8px', textTransform: 'uppercase',
                cursor: submitting || !secretCode.trim() ? 'not-allowed' : 'pointer',
                boxShadow: submitting || !secretCode.trim() ? 'none' : '0 8px 24px rgba(84,60,48,0.3)',
                transition: 'all 250ms', fontFamily: "'Roboto', sans-serif",
              }}
            >
              {submitting
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid #D3C0B1', borderTopColor: '#FFFFFF', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Confirming…
                  </span>
                : '✓ Confirm Receipt'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────── Physical Gift Display ──────────────── */

function PhysicalGiftDisplay({ v }: { v: GiftVoucher }) {
  const deliveryStatus = v.delivery_status ?? '';
  const [localStatus, setLocalStatus] = useState(deliveryStatus);
  const [showReceivedModal, setShowReceivedModal] = useState(false);

  const localStep = getDeliveryStep(localStatus);
  const isDelivered = getDeliveryStep(deliveryStatus) === 3 && localStep !== 4;

  return (
    <div style={{
      background: '#D3C0B2',
      minHeight: '100vh', overflowX: 'hidden',
    }}>
      <FloatingPetals />

      {/* ── Top Bar (Only Logo) ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        background: '#543C30',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(78,39,18,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo size={38} />
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '5px 14px',
          fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: 1,
          border: '1px solid #D3C0B1',
        }}>
          🎁 GIFT
        </div>
      </div>

      <div style={{ padding: '20px 18px 40px' }}>

        {/* ── Gift From Banner (No price/qty) ── */}
        <div style={{
          background: '#FFFFFF', borderRadius: 24,
          padding: '24px 20px 20px',
          boxShadow: '0 8px 32px rgba(78,39,18,0.08)',
          border: '1px solid #EBE5DE', marginBottom: 18,
          animation: 'revealSlide 0.7s 0.1s ease both',
          position: 'relative', overflow: 'hidden',
        }}>
          <div className="shimmer-bar" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#D3C0B1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>From</div>
                <div style={{ fontFamily: "'Lustria', serif", fontSize: '1.15rem', color: '#4E2712', fontWeight: 700 }}>
                  {v.sender_data?.name || '—'}
                </div>
              </div>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                background: '#543C30',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                animation: 'float 3s ease-in-out infinite',
                overflow: 'hidden',
              }}>
                <Logo size={36} style={{ borderRadius: '50%' }} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.68rem', color: '#D3C0B1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>Special Gift</div>
                <div style={{ fontFamily: "'Lustria', serif", fontSize: '1.05rem', color: '#4E2712', fontWeight: 700 }}>
                  For You
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Delivery Progress ── */}
        <DeliveryProgressBar status={localStatus || deliveryStatus} />

        {/* ── Ordered Items (Only names) ── */}
        {v.ordered_items && v.ordered_items.length > 0 && (
          <div style={{
            background: '#FFFFFF', borderRadius: 24,
            boxShadow: '0 6px 24px rgba(78,39,18,0.06)',
            border: '1px solid #EBE5DE',
            overflow: 'hidden', marginBottom: 18,
            animation: 'fadeUp 0.6s 0.2s ease both',
          }}>
            <div style={{
              padding: '16px 20px 14px',
              borderBottom: '1px solid #EBE5DE',
              background: '#EBE5DE',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: '#543C30',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(84,60,48,0.2)',
              }}>🛍️</div>
              <div>
                <div style={{ fontFamily: "'Lustria', serif", fontWeight: 700, color: '#4E2712', fontSize: '1.05rem' }}>
                  Gift Items
                </div>
              </div>
            </div>

            <div style={{ padding: '8px 20px' }}>
              {v.ordered_items.map((item, idx) => (
                <div
                  key={item.product_id || idx}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 0',
                    borderBottom: idx < (v.ordered_items?.length ?? 1) - 1 ? '1px solid #EBE5DE' : 'none',
                  }}
                >
                  <div style={{
                    width: 58, height: 58, borderRadius: 16, overflow: 'hidden', flexShrink: 0,
                    background: '#EBE5DE', position: 'relative',
                    border: '1px solid #D3C0B1',
                  }}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name_en || item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                        🎁
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Lustria', serif", fontWeight: 700,
                      color: '#4E2712', fontSize: '1rem', lineHeight: 1.4,
                      wordBreak: 'break-word',
                    }}>
                      {item.name_en || item.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Mark as Received / Received Badge ── */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          {localStep === 4 ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 32px', borderRadius: 999,
              background: '#EBE5DE', color: '#4E2712',
              fontWeight: 700, fontSize: '0.95rem', border: '1.5px solid #D3C0B1',
              animation: 'bounceIn 0.6s ease',
            }}>
              <span>✓</span> Gift Marked as Received
            </div>
          ) : isDelivered ? (
            <div style={{ animation: 'fadeUp 0.6s 0.4s ease both' }}>
              <button
                id="gift-mark-received-btn"
                onClick={() => setShowReceivedModal(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  padding: '17px 44px', borderRadius: 999, border: 'none',
                  background: '#543C30',
                  color: '#FFFFFF', fontSize: '1rem', fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(78,39,18,0.35)',
                  fontFamily: "'Roboto', sans-serif",
                  transition: 'all 300ms ease',
                  animation: 'pulseGlow 2s ease-in-out infinite',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>📦</span>
                Mark as Received
              </button>
              <p style={{ marginTop: 12, fontSize: '0.82rem', color: '#4E2712', opacity: 0.8 }}>
                Your gift has been delivered! Tap to confirm receipt.
              </p>
            </div>
          ) : null}
        </div>

        {/* ── App Download CTA ── */}
        <AppCTA />

        {/* ── Footer ── */}
        <div style={{ textAlign: 'center', color: '#4E2712', opacity: 0.85, fontSize: '0.8rem', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <Logo size={34} />
          </div>
          <p style={{ lineHeight: 1.7 }}>
            Thank you for being with us.<br />
            <span style={{ color: '#D3C0B1', fontSize: '0.74rem' }}>
              Gift ID: {v.id?.substring(0, 8).toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      {/* ── Mark Received Modal ── */}
      {showReceivedModal && (
        <MarkReceivedModal
          voucherId={v.id}
          onSuccess={() => setLocalStatus('received')}
          onClose={() => setShowReceivedModal(false)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────── Status Badge ───────────────────────── */

function StatusBadge({ status, expired }: { status: string; expired: boolean }) {
  const s = (status || '').toLowerCase();
  let label = 'Active', icon = '●';
  if (expired) { label = 'Expired'; icon = '⚠'; }
  else if (s === 'redeemed') { label = 'Redeemed'; icon = '✓'; }
  else if (s === 'cancelled' || s === 'inactive') { label = 'Cancelled'; icon = '✕'; }

  return (
    <span style={{
      background: '#EBE5DE', color: '#4E2712', borderRadius: 20,
      padding: '5px 14px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: 1,
      border: '1px solid #D3C0B1',
    }}>
      {icon} {label.toUpperCase()}
    </span>
  );
}

/* ─────────────────────────────── App Download CTA ──────────────────── */

function AppCTA({ style, expireDate }: { style?: React.CSSProperties; expireDate?: string }) {
  const daysLeft = expireDate
    ? Math.max(0, Math.ceil((new Date(expireDate).getTime() - Date.now()) / 86400000))
    : null;

  const urgencyLine =
    daysLeft === null ? null
    : daysLeft === 0 ? 'Your gift expires today — book now before it’s too late.'
    : daysLeft <= 7 ? `Only ${daysLeft} day${daysLeft === 1 ? '' : 's'} left — secure your experience before it expires.`
    : daysLeft <= 30 ? `Your gift is valid for ${daysLeft} more days. Don’t let it go to waste.`
    : null;

  return (
    <div style={{
      margin: '0 0 28px',
      background: '#543C30',
      borderRadius: 24,
      padding: '32px 22px',
      boxShadow: '0 14px 40px rgba(84,60,48,0.25)',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid #D3C0B1',
      textAlign: 'center',
      ...style,
    }}>
      <div className="shimmer-bar" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>✨</div>
        <h3 style={{
          fontFamily: "'Lustria', serif",
          color: '#FFFFFF',
          fontSize: '1.2rem',
          fontWeight: 700,
          lineHeight: 1.5,
          marginBottom: urgencyLine ? 10 : 20,
        }}>
          Ready to redeem your gift?<br />
          <span style={{ fontWeight: 400, fontSize: '1rem', color: '#D3C0B1' }}>
            Download the USH Spa app and book your session in seconds.
          </span>
        </h3>

        {urgencyLine && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(211,192,177,0.15)',
            border: '1px solid rgba(211,192,177,0.3)',
            borderRadius: 30, padding: '8px 18px', marginBottom: 20,
          }}>
            <span style={{ fontSize: 14 }}>⏰</span>
            <span style={{ color: '#D3C0B1', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.3px' }}>
              {urgencyLine}
            </span>
          </div>
        )}

        {/* Download Buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            id="gift-app-store-link"
            href="https://apps.apple.com/us/app/ushspa/id6771279814"
            target="_blank"
            rel="noopener noreferrer"
            className="app-btn"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#4E2712">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.95 2.77 1 .08 2.05-.52 2.68-1.27z"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.62rem', color: '#4E2712', opacity: 0.7, letterSpacing: 0.8 }}>DOWNLOAD ON THE</div>
              <div style={{ fontFamily: "'Lustria', serif", fontSize: '0.95rem', fontWeight: 700, color: '#4E2712' }}>App Store</div>
            </div>
          </a>
          <a
            id="gift-play-store-link"
            href="https://play.google.com/store/apps/details?id=com.spaush.ushspa"
            target="_blank"
            rel="noopener noreferrer"
            className="app-btn"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#4E2712">
              <path d="M3.609 1.814L13.792 12 3.61 22.186c-.328-.31-.518-.763-.518-1.298V3.112c0-.535.19-.988.517-1.298zM15.207 13.415l2.296 2.296-12.01 6.844 9.714-9.14zm0-2.83L5.493 1.445l12.01 6.844-2.296 2.296zm1.414 1.415l3.208 1.828c.84.478.84 1.258 0 1.737l-3.208 1.828-2.008-2.008 2.008-2.008z"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.62rem', color: '#4E2712', opacity: 0.7, letterSpacing: 0.8 }}>GET IT ON</div>
              <div style={{ fontFamily: "'Lustria', serif", fontSize: '0.95rem', fontWeight: 700, color: '#4E2712' }}>Google Play</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Service Gift Page ─────────────────── */

function ServiceGiftDisplay({ v }: { v: GiftVoucher }) {
  const expired = isExpired(v.expire_date);
  /* Support both image (legacy) and image1 (actual API) */
  const heroImg = v.service_arrangement_data?.image || v.service_data?.image1 || v.service_data?.image || '';
  const serviceImg = v.service_data?.image1 || v.service_data?.image || '';
  const sd = v.service_data;
  const ar = v.service_arrangement_data;
  const br = v.branch_data;
  /* Support both duration (actual API) and duration_minutes (legacy) */
  const sdDuration = sd?.duration ?? sd?.duration_minutes ?? 0;
  const [revealed, setRevealed] = useState(false);

  useEffect(() => { setTimeout(() => setRevealed(true), 100); }, []);

  return (
    <div style={{ background: '#D3C0B2', overflowX: 'hidden', minHeight: '100vh' }}>
      <FloatingPetals />

      {/* ── Top Bar (Only Logo) ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        background: '#543C30',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(78,39,18,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo size={38} />
        </div>
        <StatusBadge status={v.status} expired={expired} />
      </div>

      {/* ── Expired Banner ── */}
      {expired && (
        <div style={{
          padding: '16px 24px',
          background: '#4E2712',
          borderBottom: '2px solid #D3C0B1',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem', fontFamily: "'Lustria', serif" }}>
              This Gift Voucher Has Expired
            </div>
            <div style={{ color: '#D3C0B1', fontSize: '0.8rem', marginTop: 2 }}>
              Expired on {fmtDate(v.expire_date)}
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Section ── */}
      <div style={{
        position: 'relative', height: 'clamp(280px, 52vw, 420px)', overflow: 'hidden',
        opacity: revealed ? 1 : 0, transform: revealed ? 'none' : 'scale(1.04)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}>
        {heroImg && (
          <img src={heroImg} alt="Experience" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(78,39,18,0.1) 0%, rgba(78,39,18,0.85) 100%)',
        }} />
        <div style={{
          position: 'absolute', top: 20, right: 20,
          background: '#4E2712',
          borderRadius: 50, padding: '9px 18px',
          color: '#FFFFFF', fontFamily: "'Lustria', serif",
          fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1,
          boxShadow: '0 4px 20px rgba(78,39,18,0.4)',
          border: '1.5px solid #D3C0B1',
        }}>
          🎁 GIFT VOUCHER
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 24px 30px' }}>
          <p style={{ fontFamily: "'Alex Brush', cursive", fontSize: '1.6rem', color: '#D3C0B1', margin: '0 0 4px' }}>
            {v.gift_template || 'Luxury Experience'}
          </p>
          <h1 style={{
            fontFamily: "'Lustria', serif",
            fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
            color: '#FFFFFF', fontWeight: 700, lineHeight: 1.2, margin: '0 0 10px',
            textShadow: '0 2px 12px rgba(0,0,0,0.35)',
          }}>
            {v.service_data?.name || 'Spa Service'}
          </h1>
          {v.service_data?.service_types?.length ? (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {v.service_data.service_types.map(st => (
                <span key={st.id} style={{
                  background: 'rgba(211,192,177,0.85)', borderRadius: 20,
                  padding: '4px 13px', color: '#4E2712', fontSize: '0.76rem', fontWeight: 700,
                }}>{st.name}</span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* ── From / To Gift Card ── */}
      <div style={{
        margin: '-32px 18px 0',
        background: '#FFFFFF', borderRadius: 24,
        padding: '26px 22px 22px',
        boxShadow: '0 16px 48px rgba(78,39,18,0.1)',
        border: '1px solid #EBE5DE',
        position: 'relative', zIndex: 5,
        animation: 'revealSlide 0.7s 0.2s ease both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 110 }}>
            <div style={{ fontSize: '0.68rem', color: '#D3C0B1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>From</div>
            <div style={{ fontFamily: "'Lustria', serif", fontSize: '1.05rem', color: '#4E2712', fontWeight: 700 }}>{v.sender_data?.name}</div>
            <div style={{ fontSize: '0.78rem', color: '#4E2712', opacity: 0.7, marginTop: 3 }}>{v.sender_data?.phone_number}</div>
          </div>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
            background: '#543C30',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            animation: 'float 3s ease-in-out infinite',
            overflow: 'hidden',
          }}>
            <Logo size={36} style={{ borderRadius: '50%' }} />
          </div>
          <div style={{ flex: 1, minWidth: 110, textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: '#D3C0B1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>To</div>
            <div style={{ fontFamily: "'Lustria', serif", fontSize: '1.05rem', color: '#4E2712', fontWeight: 700 }}>{v.recipient_data?.name}</div>
            <div style={{ fontSize: '0.78rem', color: '#4E2712', opacity: 0.7, marginTop: 3 }}>{v.recipient_phone}</div>
          </div>
        </div>
        {v.gift_message && (
          <div style={{
            marginTop: 20, padding: '16px 18px',
            background: '#EBE5DE',
            borderRadius: 14, borderLeft: '3.5px solid #4E2712',
          }}>
            <div style={{ fontSize: '0.68rem', color: '#D3C0B1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 7 }}>✉ Gift Message</div>
            <p style={{ fontFamily: "'Lustria', serif", fontSize: '1.05rem', color: '#4E2712', fontStyle: 'italic', lineHeight: 1.65, margin: 0 }}>
              &ldquo;{v.gift_message}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* ── Quick Stats Row (No Price) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '20px 18px 0' }}>
        {[
          { icon: '⏱', label: 'Duration', value: fmtDuration(v.total_duration || sdDuration || 0) },
          { icon: '🎁', label: 'Ritual', value: v.service_data?.name ? (v.service_data.name.length > 14 ? v.service_data.name.substring(0, 14) + '…' : v.service_data.name) : 'Special' },
          { icon: '📅', label: 'Valid Until', value: fmtDate(v.expire_date).replace(/,.*/, '') },
        ].map((s, i) => (
          <div key={s.label} className="stat-card" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
            <div style={{ fontSize: 22, marginBottom: 7 }}>{s.icon}</div>
            <div style={{ fontSize: '0.66rem', color: '#D3C0B1', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 5, fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontFamily: "'Lustria', serif", fontSize: '0.85rem', color: '#4E2712', fontWeight: 700, lineHeight: 1.3 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Gift Details ── */}
      <div style={{ margin: '16px 18px 24px', display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeUp 0.4s ease' }}>

        {/* Service Name */}
        {sd && (
          <div className="detail-card">
            <div style={{ padding: '13px 18px', borderBottom: '1px solid #EBE5DE', background: '#EBE5DE', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🧖</span>
              <span style={{ fontFamily: "'Lustria', serif", fontWeight: 700, color: '#4E2712', fontSize: '0.92rem' }}>Service</span>
            </div>
            <div style={{ display: 'flex', gap: 14, padding: '16px 18px', alignItems: 'flex-start' }}>
              {serviceImg && (
                <img src={serviceImg} alt={sd.name} style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover', display: 'block', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Lustria', serif", fontWeight: 700, color: '#4E2712', fontSize: '1.05rem', lineHeight: 1.3 }}>
                  {sd.name}
                </div>
                {sdDuration > 0 && (
                  <div style={{ fontSize: '0.82rem', color: '#4E2712', opacity: 0.7, marginTop: 6 }}>⏱ {fmtDuration(sdDuration)}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Addons */}
        {v.addons && v.addons.length > 0 && (
          <div className="detail-card">
            <div style={{ padding: '13px 18px', borderBottom: '1px solid #EBE5DE', background: '#EBE5DE', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>✨</span>
              <span style={{ fontFamily: "'Lustria', serif", fontWeight: 700, color: '#4E2712', fontSize: '0.92rem' }}>Add-ons</span>
            </div>
            <div style={{ padding: '4px 0' }}>
              {v.addons.map((a, i) => (
                <div key={a.addon_id ?? a.id ?? i} style={{
                  padding: '14px 18px',
                  borderBottom: i < (v.addons?.length ?? 1) - 1 ? '1px solid #EBE5DE' : 'none',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: '#4E2712', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>✨</div>
                  <div>
                    <div style={{ fontFamily: "'Lustria', serif", fontWeight: 600, color: '#4E2712', fontSize: '0.97rem' }}>{a.name}</div>
                    {(a.duration ?? a.duration_minutes ?? 0) > 0 && (
                      <div style={{ fontSize: '0.78rem', color: '#4E2712', opacity: 0.65, marginTop: 3 }}>⏱ {fmtDuration(a.duration ?? a.duration_minutes ?? 0)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extra Time */}
        {!!v.extra_time && (
          <div style={{
            background: '#FFFFFF', borderRadius: 20, padding: '16px 18px',
            border: '1px solid #EBE5DE', boxShadow: '0 4px 18px rgba(78,39,18,0.05)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, flexShrink: 0, background: '#4E2712', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>⏰</div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#D3C0B1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Bonus Extra Time</div>
              <div style={{ fontFamily: "'Lustria', serif", fontWeight: 700, color: '#4E2712', fontSize: '1rem' }}>+{fmtDuration(v.extra_time)}</div>
            </div>
          </div>
        )}

        {/* Branch */}
        {br && (
          <div style={{
            background: '#FFFFFF', borderRadius: 20, padding: '16px 18px',
            border: '1px solid #EBE5DE', boxShadow: '0 4px 18px rgba(78,39,18,0.05)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, flexShrink: 0, background: '#4E2712', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📍</div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#D3C0B1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Branch Location</div>
              <div style={{ fontFamily: "'Lustria', serif", fontWeight: 700, color: '#4E2712', fontSize: '1rem' }}>{br.name}</div>
            </div>
          </div>
        )}

      </div>

      {/* ── Experience Summary Banner (No price) ── */}
      <div style={{
        margin: '0 18px 24px',
        background: '#543C30',
        borderRadius: 24, padding: '24px 22px',
        boxShadow: '0 10px 36px rgba(84,60,48,0.25)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="shimmer-bar" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ color: '#D3C0B1', fontSize: '0.72rem', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 6 }}>Luxury Ritual</div>
          <div style={{ fontFamily: "'Lustria', serif", fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 700, lineHeight: 1.2 }}>
            {v.service_data?.name || v.gift_template || 'Signature Experience'}
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'right' }}>
          <div style={{ color: '#D3C0B1', fontSize: '0.72rem', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 6 }}>Total Time</div>
          <div style={{ fontFamily: "'Lustria', serif", fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 700, lineHeight: 1 }}>
            {fmtDuration(v.total_duration || 0)}
          </div>
        </div>
      </div>

      <AppCTA style={{ margin: '0 20px 28px' }} expireDate={v.expire_date} />

      <div style={{ textAlign: 'center', paddingBottom: 48, color: '#4E2712', opacity: 0.85, fontSize: '0.8rem', padding: '0 20px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <Logo size={34} />
        </div>
        <p style={{ lineHeight: 1.7 }}>
          Present this voucher at our branch to redeem your experience.<br />
          <span style={{ color: '#D3C0B1', fontSize: '0.74rem' }}>
            {expired ? '⚠ This voucher has expired' : `Valid until ${fmtDate(v.expire_date)}`}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Digital Gift Display ──────────────── */

function DigitalGiftDisplay({ v }: { v: GiftVoucher }) {
  const expired = isExpired(v.expire_date);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setTimeout(() => setRevealed(true), 100); }, []);

  return (
    <div style={{ background: '#D3C0B2', overflowX: 'hidden', minHeight: '100vh' }}>
      <FloatingPetals />

      {/* Top Bar */}
      <div style={{
        position: 'relative', zIndex: 10,
        background: '#543C30',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(78,39,18,0.25)',
      }}>
        <Logo size={38} />
        <StatusBadge status={v.status} expired={expired} />
      </div>

      {/* Expired Banner */}
      {expired && (
        <div style={{
          padding: '16px 24px', background: '#4E2712',
          borderBottom: '2px solid #D3C0B1',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem', fontFamily: "'Lustria', serif" }}>This Gift Voucher Has Expired</div>
            <div style={{ color: '#D3C0B1', fontSize: '0.8rem', marginTop: 2 }}>Expired on {fmtDate(v.expire_date)}</div>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #543C30 0%, #4E2712 100%)',
        padding: '48px 24px 56px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        opacity: revealed ? 1 : 0, transform: revealed ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        <div className="shimmer-bar" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 72, marginBottom: 16,
            display: 'inline-block',
            animation: 'giftBounce 2.5s ease-in-out infinite',
          }}>🎁</div>
          <p style={{ fontFamily: "'Alex Brush', cursive", fontSize: '1.6rem', color: '#D3C0B1', margin: '0 0 8px' }}>
            {v.gift_template || 'Your Digital Gift'}
          </p>
          <h1 style={{
            fontFamily: "'Lustria', serif",
            fontSize: 'clamp(1.4rem, 5vw, 2rem)',
            color: '#FFFFFF', fontWeight: 700, lineHeight: 1.2, margin: '0 0 14px',
            textShadow: '0 2px 12px rgba(0,0,0,0.35)',
          }}>
            Digital Gift Package
          </h1>
          <div style={{
            display: 'inline-block', padding: '6px 20px', borderRadius: 999,
            background: 'rgba(211,192,177,0.2)', border: '1px solid rgba(211,192,177,0.4)',
            color: '#D3C0B1', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1.2,
          }}>✨ DIGITAL EXPERIENCE</div>
        </div>
      </div>

      <div style={{ padding: '20px 18px 48px' }}>

        {/* From / To Card */}
        <div style={{
          margin: '-32px 0 20px',
          background: '#FFFFFF', borderRadius: 24,
          padding: '26px 22px 22px',
          boxShadow: '0 16px 48px rgba(78,39,18,0.1)',
          border: '1px solid #EBE5DE',
          position: 'relative', zIndex: 5,
          animation: 'revealSlide 0.7s 0.2s ease both',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 110 }}>
              <div style={{ fontSize: '0.68rem', color: '#D3C0B1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>From</div>
              <div style={{ fontFamily: "'Lustria', serif", fontSize: '1.05rem', color: '#4E2712', fontWeight: 700 }}>{v.sender_data?.name || '—'}</div>
              {v.sender_data?.phone_number && (
                <div style={{ fontSize: '0.78rem', color: '#4E2712', opacity: 0.7, marginTop: 3 }}>{v.sender_data.phone_number}</div>
              )}
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
              background: '#543C30',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              animation: 'float 3s ease-in-out infinite',
              overflow: 'hidden',
            }}>
              <Logo size={36} style={{ borderRadius: '50%' }} />
            </div>
            <div style={{ flex: 1, minWidth: 110, textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: '#D3C0B1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>To</div>
              <div style={{ fontFamily: "'Lustria', serif", fontSize: '1.05rem', color: '#4E2712', fontWeight: 700 }}>{v.recipient_data?.name || '—'}</div>
              {v.recipient_phone && (
                <div style={{ fontSize: '0.78rem', color: '#4E2712', opacity: 0.7, marginTop: 3 }}>{v.recipient_phone}</div>
              )}
            </div>
          </div>

          {/* Gift Message */}
          {v.gift_message && (
            <div style={{
              marginTop: 20, padding: '16px 18px',
              background: '#EBE5DE',
              borderRadius: 14, borderLeft: '3.5px solid #4E2712',
            }}>
              <div style={{ fontSize: '0.68rem', color: '#D3C0B1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 7 }}>✉ Gift Message</div>
              <p style={{ fontFamily: "'Lustria', serif", fontSize: '1.05rem', color: '#4E2712', fontStyle: 'italic', lineHeight: 1.65, margin: 0 }}>
                &ldquo;{v.gift_message}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '📅', label: 'Valid Until', value: fmtDate(v.expire_date) },
            { icon: '⏱', label: 'Duration', value: fmtDuration(v.total_duration || (v.service_data?.duration ?? v.service_data?.duration_minutes) || 0) },
          ].map((s, i) => (
            <div key={s.label} className="stat-card" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
              <div style={{ fontSize: 22, marginBottom: 7 }}>{s.icon}</div>
              <div style={{ fontSize: '0.66rem', color: '#D3C0B1', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 5, fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontFamily: "'Lustria', serif", fontSize: '0.85rem', color: '#4E2712', fontWeight: 700, lineHeight: 1.3 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Gift Details — Service, Addons, Extra Time, Branch */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>

          {/* Service */}
          {v.service_data && (
            <div className="detail-card">
              <div style={{ padding: '13px 18px', borderBottom: '1px solid #EBE5DE', background: '#EBE5DE', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>🧖</span>
                <span style={{ fontFamily: "'Lustria', serif", fontWeight: 700, color: '#4E2712', fontSize: '0.92rem' }}>Service</span>
              </div>
              <div style={{ display: 'flex', gap: 14, padding: '16px 18px', alignItems: 'center' }}>
                {(v.service_data.image1 || v.service_data.image) && (
                  <img
                    src={v.service_data.image1 || v.service_data.image!}
                    alt={v.service_data.name}
                    style={{ width: 68, height: 68, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Lustria', serif", fontWeight: 700, color: '#4E2712', fontSize: '1.05rem', lineHeight: 1.3 }}>
                    {v.service_data.name}
                  </div>
                  {(v.service_data.duration ?? v.service_data.duration_minutes ?? 0) > 0 && (
                    <div style={{ fontSize: '0.82rem', color: '#4E2712', opacity: 0.65, marginTop: 5 }}>
                      ⏱ {fmtDuration(v.service_data.duration ?? v.service_data.duration_minutes ?? 0)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Addons */}
          {v.addons && v.addons.length > 0 && (
            <div className="detail-card">
              <div style={{ padding: '13px 18px', borderBottom: '1px solid #EBE5DE', background: '#EBE5DE', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>✨</span>
                <span style={{ fontFamily: "'Lustria', serif", fontWeight: 700, color: '#4E2712', fontSize: '0.92rem' }}>Add-ons</span>
              </div>
              <div style={{ padding: '4px 0' }}>
                {v.addons.map((a, i) => (
                  <div key={a.addon_id ?? a.id ?? i} style={{
                    padding: '14px 18px',
                    borderBottom: i < (v.addons?.length ?? 1) - 1 ? '1px solid #EBE5DE' : 'none',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: '#4E2712', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✨</div>
                    <div>
                      <div style={{ fontFamily: "'Lustria', serif", fontWeight: 600, color: '#4E2712', fontSize: '0.97rem' }}>{a.name}</div>
                      {(a.duration ?? a.duration_minutes ?? 0) > 0 && (
                        <div style={{ fontSize: '0.78rem', color: '#4E2712', opacity: 0.65, marginTop: 2 }}>⏱ {fmtDuration(a.duration ?? a.duration_minutes ?? 0)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra Time */}
          {!!v.extra_time && (
            <div style={{
              background: '#FFFFFF', borderRadius: 20, padding: '16px 18px',
              border: '1px solid #EBE5DE', boxShadow: '0 4px 18px rgba(78,39,18,0.05)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, flexShrink: 0, background: '#4E2712', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>⏰</div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#D3C0B1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Bonus Extra Time</div>
                <div style={{ fontFamily: "'Lustria', serif", fontWeight: 700, color: '#4E2712', fontSize: '1rem' }}>+{fmtDuration(v.extra_time)}</div>
              </div>
            </div>
          )}

          {/* Branch */}
          {v.branch_data && (
            <div style={{
              background: '#FFFFFF', borderRadius: 20, padding: '16px 18px',
              border: '1px solid #EBE5DE', boxShadow: '0 4px 18px rgba(78,39,18,0.05)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, flexShrink: 0, background: '#4E2712', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📍</div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#D3C0B1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Branch Location</div>
                <div style={{ fontFamily: "'Lustria', serif", fontWeight: 700, color: '#4E2712', fontSize: '1rem' }}>{v.branch_data.name}</div>
              </div>
            </div>
          )}

        </div>

        {/* Info row */}
        <div className="detail-card" style={{ marginBottom: 24 }}>
          {[
            { label: 'Status', value: v.status?.charAt(0).toUpperCase() + v.status?.slice(1) },
            { label: 'Valid Until', value: fmtDate(v.expire_date) },
            { label: 'Redeemed', value: v.redeemed_at ? fmtDate(v.redeemed_at) : 'Not yet redeemed' },
            { label: 'Gift Issued', value: fmtDate(v.created_at) },
          ].map((r, i, arr) => (
            <div key={r.label} style={{
              padding: '15px 18px',
              borderBottom: i < arr.length - 1 ? '1px solid #EBE5DE' : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: '0.83rem', color: '#4E2712', opacity: 0.75 }}>{r.label}</span>
              <span style={{ fontFamily: "'Lustria', serif", fontSize: '0.88rem', fontWeight: 700, color: '#4E2712', textAlign: 'right' }}>
                {r.value || '—'}
              </span>
            </div>
          ))}
        </div>

        <AppCTA />

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#4E2712', opacity: 0.85, fontSize: '0.8rem', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <Logo size={34} />
          </div>
          <p style={{ lineHeight: 1.7 }}>
            {expired ? '⚠ This voucher has expired' : `Valid until ${fmtDate(v.expire_date)}`}<br />
            <span style={{ color: '#D3C0B1', fontSize: '0.74rem' }}>Gift ID: {v.id?.substring(0, 8).toUpperCase()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Page ──────────────────────────────── */

export default function GiftPage({ params }: { params: Promise<{ public_token: string }> }) {
  const { public_token } = use(params);

  const [phase, setPhase] = useState<'loading' | 'modal' | 'digital-video' | 'reveal' | 'gift-display'>('loading');
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [voucher, setVoucher] = useState<GiftVoucher | null>(null);
  const didFetch = useRef(false);

  /* ── Auto-fetch to determine category ── */
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const autoFetch = async () => {
      try {
        const res = await fetch(
          `/booknpay/api/v1/vouchers/public/${encodeURIComponent(public_token)}/`,
          { method: 'GET', headers: { 'Content-Type': 'application/json' } }
        );

        if (!res.ok) {
          setPhase('modal');
          return;
        }

        let data: Record<string, unknown> = {};
        try { data = await res.json(); } catch { /* empty */ }

        const raw = data?.data ?? data?.result ?? data?.voucher ?? data;
        const voucherData = (raw && typeof (raw as Record<string, unknown>)?.gift_category === 'string')
          ? raw as GiftVoucher
          : null;

        if (voucherData?.gift_category === 'physical') {
          setVoucher(voucherData);
          setPhase('reveal');
        } else if (voucherData?.gift_category === 'digital') {
          // Digital gifts always need secret code first
          setPhase('modal');
        } else {
          setPhase('modal');
        }
      } catch {
        setPhase('modal');
      }
    };

    autoFetch();
  }, [public_token]);

  /* ── Secret code submission (service/digital) ── */
  async function handleModalSubmit(secret_code: string) {
    setLoading(true);
    setModalError('');
    try {
      const res = await fetch(
        `/booknpay/api/v1/vouchers/public/${encodeURIComponent(public_token)}/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret_code }),
        }
      );

      let data: Record<string, unknown> = {};
      try { data = await res.json(); } catch { /* empty */ }

      if (!res.ok) {
        const msg =
          (typeof data?.detail === 'string' ? data.detail : '') ||
          (typeof data?.message === 'string' ? data.message : '') ||
          (typeof data?.error === 'string' ? data.error : '') ||
          (res.status === 404 ? 'Gift not found. Please check the link.' :
           res.status === 400 ? 'Invalid secret code. Please try again.' :
           res.status === 403 ? 'Access denied. Please check your secret code.' :
           'Something went wrong. Please try again.');
        setModalError(msg);
        return;
      }

      const raw = data?.data ?? data?.result ?? data?.voucher ?? data;
      const voucherData = (raw && typeof (raw as Record<string, unknown>)?.gift_category === 'string')
        ? raw as GiftVoucher
        : null;
      setVoucher(voucherData);

      if (voucherData?.gift_category === 'physical') {
        setPhase('reveal');
      } else if (voucherData?.gift_category === 'digital') {
        // Check for video in digital_product_data
        const videoUrl = voucherData.digital_product_data?.video_url;
        if (videoUrl) {
          setPhase('digital-video');
        } else {
          // No video — go straight to reveal popup
          setPhase('reveal');
        }
      } else {
        setPhase('gift-display');
      }
    } catch {
      setModalError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div className="gift-outer">
        <div className="gift-shell">

          {/* Loading */}
          {phase === 'loading' && <GiftLoadingScreen />}

          {/* Secret code modal (service/digital) */}
          {phase === 'modal' && (
            <>
              <FloatingPetals />
              <SecretModal onSubmit={handleModalSubmit} loading={loading} error={modalError} />
            </>
          )}

          {/* Digital video popup */}
          {phase === 'digital-video' && voucher && (
            <DigitalVideoPopup
              videoUrl={voucher.digital_product_data!.video_url!}
              onContinue={() => setPhase('reveal')}
            />
          )}

          {/* Reveal popup (physical + digital) */}
          {phase === 'reveal' && voucher && (
            <>
              <div style={{ filter: 'blur(4px)', pointerEvents: 'none', opacity: 0.25, userSelect: 'none' }}>
                {voucher.gift_category === 'physical'
                  ? <PhysicalGiftDisplay v={voucher} />
                  : voucher.gift_category === 'digital'
                  ? <DigitalGiftDisplay v={voucher} />
                  : <ServiceGiftDisplay v={voucher} />}
              </div>
              <GiftRevealPopup voucher={voucher} onRevealGift={() => setPhase('gift-display')} />
            </>
          )}

          {/* Final display */}
          {phase === 'gift-display' && voucher && (
            voucher.gift_category === 'physical'
              ? <PhysicalGiftDisplay v={voucher} />
              : voucher.gift_category === 'digital'
              ? <DigitalGiftDisplay v={voucher} />
              : <ServiceGiftDisplay v={voucher} />
          )}
        </div>
      </div>
    </>
  );
}
