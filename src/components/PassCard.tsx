import { useEffect, useRef } from 'react';
import { arbiscanTxUrl, universalXActivityUrl } from '@/lib/contracts';

interface PassCardProps {
  passId: number;
  itemTitle: string;
  itemDescription?: string;
  itemImageUrl?: string;
  priceUSDC: number;
  buyerAddress: string;
  arbTxHash: string;
  particleTxId: string;
  onClose?: () => void;
}

// ── Minimal QR renderer using the Google Charts API ──────────────────────────
// Avoids any npm dependency — safe for mainnet hackathon demo.
function QRCode({ value, size = 140 }: { value: string; size?: number }) {
  const encoded = encodeURIComponent(value);
  const src = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encoded}&choe=UTF-8`;
  return (
    <img
      src={src}
      alt="Pass QR Code"
      width={size}
      height={size}
      style={{ display: 'block', borderRadius: 8, background: '#fff', padding: 4 }}
    />
  );
}

export default function PassCard({
  passId,
  itemTitle,
  itemDescription,
  itemImageUrl,
  priceUSDC,
  buyerAddress,
  arbTxHash,
  particleTxId,
  onClose,
}: PassCardProps) {
  const qrValue = `unicard:pass:${passId}:${buyerAddress}`;
  const arbUrl = arbiscanTxUrl(arbTxHash);
  const uxUrl = universalXActivityUrl(particleTxId);

  return (
    <div style={{
        background: 'linear-gradient(160deg, #1a0a2e 0%, #0a0a1f 100%)',
        border: '1px solid rgba(124,58,237,0.35)',
        borderRadius: 24,
        padding: '32px',
        width: '100%',
        maxWidth: 480,
        position: 'relative',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        fontFamily: 'Inter, sans-serif',
        color: '#fff',
      }}>
        {/* Close */}
        {onClose && (
          <button onClick={onClose} aria-label="Close" style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(255,255,255,0.07)', border: 'none',
            borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
            color: '#888', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>Access Pass Issued</div>
            <div style={{ fontSize: 11, color: '#555' }}>Arbitrum One • Pass #{passId}</div>
          </div>
        </div>

        {/* Item banner */}
        {itemImageUrl && (
          <img src={itemImageUrl} alt={itemTitle} style={{
            width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 20,
          }}/>
        )}

        {/* Title + price */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>{itemTitle}</h2>
          {itemDescription && (
            <p style={{ color: '#666', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{itemDescription}</p>
          )}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 10, padding: '6px 12px',
            background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 20, fontSize: 13, fontWeight: 600, color: '#a78bfa',
          }}>
            ${priceUSDC.toFixed(2)} USDC paid
          </div>
        </div>

        {/* QR + links */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* QR */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>Scan to verify</div>
            <QRCode value={qrValue} size={120} />
          </div>

          {/* Links */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>On-chain proof</div>

            <a href={arbUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 500,
              transition: 'background 0.2s',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#28a0f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
              View on Arbiscan
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ marginLeft: 'auto' }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>

            {particleTxId && (
              <a href={uxUrl} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
                color: '#a78bfa', textDecoration: 'none', fontSize: 13, fontWeight: 500,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                View on UniversalX
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" style={{ marginLeft: 'auto' }}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            )}

            {/* Buyer address */}
            <div style={{
              marginTop: 4, padding: '8px 12px', borderRadius: 8,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              fontSize: 11, color: '#444',
            }}>
              Issued to: <span style={{ fontFamily: 'monospace', color: '#666' }}>{buyerAddress.slice(0, 6)}…{buyerAddress.slice(-4)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center' }}>
          <span style={{ color: '#333', fontSize: 11 }}>Powered by</span>
          <span style={{ fontSize: 11, fontWeight: 700, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>UniCard</span>
          <span style={{ color: '#333', fontSize: 11 }}>× Particle Network × Arbitrum</span>
        </div>
      </div>
  );
}
