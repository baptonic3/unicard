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
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 24,
        padding: '32px',
        width: '100%',
        maxWidth: 480,
        position: 'relative',
        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
        fontFamily: 'Inter, sans-serif',
        color: '#111',
      }}>
        {/* Close */}
        {onClose && (
          <button onClick={onClose} aria-label="Close" style={{
            position: 'absolute', top: 16, right: 16,
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
            color: '#64748b', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: '#e6fcf5',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>Pass Issued</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              Arbitrum One • {passId && Number(passId) > 0 ? `Pass #${passId}` : 'Confirmed'}
            </div>
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
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, lineHeight: 1.3, color: '#111' }}>{itemTitle}</h2>
          {itemDescription && (
            <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{itemDescription}</p>
          )}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 10, padding: '6px 12px',
            background: '#e6fcf5', border: '1px solid #e2e8f0',
            borderRadius: 20, fontSize: 13, fontWeight: 600, color: '#10b981',
          }}>
            ${priceUSDC.toFixed(2)} USDC paid
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>On-chain proof</div>

          {arbTxHash && (
            <a href={arbUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 16px', borderRadius: 10,
              background: '#f8fafc', border: '1px solid #e2e8f0',
              color: '#334155', textDecoration: 'none', fontSize: 13, fontWeight: 600,
              transition: 'background 0.2s',
            }}>
              View on Arbiscan
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ marginLeft: 'auto' }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          )}

          {particleTxId && (
            <a href={uxUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 16px', borderRadius: 10,
              background: '#f8fafc', border: '1px solid #e2e8f0',
              color: '#334155', textDecoration: 'none', fontSize: 13, fontWeight: 600,
            }}>
              View on UniversalX
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ marginLeft: 'auto' }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          )}

          {/* Buyer address */}
          <div style={{
            marginTop: 4, padding: '10px 14px', borderRadius: 10,
            background: '#f1f5f9', border: '1px solid #e2e8f0',
            fontSize: 12, color: '#64748b',
          }}>
            Issued to: <span style={{ fontFamily: 'monospace', color: '#111', fontWeight: 600 }}>{buyerAddress}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center' }}>
          <span style={{ color: '#94a3b8', fontSize: 11 }}>Powered by</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#00e599' }}>UniCard</span>
          <span style={{ color: '#94a3b8', fontSize: 11 }}>× Particle Network × Arbitrum</span>
        </div>
      </div>
  );
}
