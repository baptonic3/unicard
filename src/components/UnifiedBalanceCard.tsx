import { useUniversalAccount } from '@/hooks/UniversalAccountProvider';

const ArbitrumSvg = () => (
  <svg width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.02515 12.1188V23.8794C5.02515 24.6295 5.4335 25.3245 6.09187 25.6995L16.4341 31.5815C16.7595 31.7656 17.127 31.8623 17.5008 31.8623C17.8746 31.8623 18.2421 31.7656 18.5675 31.5815L28.9064 25.6979C29.5664 25.3245 29.9731 24.6312 29.9731 23.8811V12.1172C29.9731 11.3671 29.5664 10.6721 28.9064 10.2987L18.5675 4.41675C18.2421 4.23271 17.8746 4.13599 17.5008 4.13599C17.127 4.13599 16.7595 4.23271 16.4341 4.41675L6.09187 10.3004C5.76872 10.4815 5.49968 10.7454 5.31248 11.065C5.12527 11.3847 5.025 11.7484 5.02515 12.1188Z" fill="#213147"/>
    <path d="M19.7558 20.2809L18.2808 24.2645C18.2406 24.3748 18.2406 24.4958 18.2808 24.6062L20.8192 31.4598L23.7527 29.7914L20.2309 20.2809C20.2129 20.2324 20.1805 20.1906 20.138 20.1611C20.0955 20.1316 20.0451 20.1157 19.9934 20.1157C19.9416 20.1157 19.8912 20.1316 19.8487 20.1611C19.8062 20.1906 19.7738 20.2324 19.7558 20.2809ZM22.7127 13.5822C22.6947 13.5338 22.6623 13.4919 22.6198 13.4624C22.5773 13.4329 22.5269 13.4171 22.4751 13.4171C22.4234 13.4171 22.373 13.4329 22.3305 13.4624C22.288 13.4919 22.2556 13.5338 22.2376 13.5822L20.7626 17.5658C20.7224 17.6761 20.7224 17.7971 20.7626 17.9075L24.9194 29.1281L27.8546 27.4596L22.7127 13.5822Z" fill="#12AAFF"/>
    <path d="M17.4974 4.85843C17.5706 4.86116 17.6423 4.87994 17.7074 4.91343L28.8996 11.2771C28.9627 11.3131 29.0152 11.365 29.0521 11.4275C29.0889 11.4901 29.1088 11.5612 29.1097 11.6338V24.3595C29.1097 24.5078 29.0296 24.6428 28.8996 24.7161L17.7074 31.0815C17.6433 31.1175 17.5709 31.1359 17.4974 31.1348C17.4249 31.1324 17.3538 31.1142 17.289 31.0815L6.09678 24.7228C6.03349 24.6867 5.98079 24.6345 5.94394 24.5717C5.90709 24.5088 5.88737 24.4373 5.88677 24.3645V11.6371C5.88677 11.4888 5.96677 11.3538 6.09678 11.2788L17.289 4.9151C17.3526 4.87894 17.4243 4.85944 17.4974 4.85843ZM17.4974 3C17.1007 3 16.7007 3.10001 16.344 3.30502L5.15506 9.66702C4.8054 9.8638 4.51423 10.1499 4.3113 10.496C4.10837 10.8421 4.00095 11.2359 4 11.6371V24.3628C4 25.1745 4.44002 25.9262 5.15506 26.3312L16.3456 32.6966C16.6981 32.8955 17.096 33 17.5007 33C17.9054 33 18.3033 32.8955 18.6558 32.6966L29.8464 26.3329C30.196 26.1361 30.4872 25.8501 30.6901 25.5039C30.893 25.1578 31.0005 24.764 31.0014 24.3628V11.6371C31.0005 11.2359 30.893 10.8421 30.6901 10.496C30.4872 10.1499 30.196 9.8638 29.8464 9.66702L18.6524 3.30502C18.3004 3.10484 17.9023 2.99972 17.4974 3Z" fill="#9DCCED"/>
    <path d="M10.0987 29.1431L11.1271 26.3663L13.2005 28.063L11.2621 29.8065L10.0987 29.1431Z" fill="#213147"/>
    <path d="M16.5556 10.7254H13.7188C13.6154 10.7243 13.5142 10.7553 13.4291 10.8141C13.344 10.8729 13.2793 10.9566 13.2438 11.0538L7.1618 27.4746L10.097 29.1431L16.794 11.0604C16.8074 11.0225 16.8114 10.9819 16.8058 10.9421C16.8002 10.9023 16.785 10.8644 16.7616 10.8317C16.7382 10.799 16.7073 10.7724 16.6714 10.7542C16.6356 10.736 16.5958 10.725 16.5556 10.7254ZM21.5209 10.7254H18.6824C18.5793 10.7247 18.4784 10.7558 18.3937 10.8146C18.309 10.8734 18.2445 10.9569 18.2091 11.0538L11.2637 29.8048L14.1988 31.4715L21.7576 11.0604C21.7709 11.0227 21.775 10.9822 21.7695 10.9425C21.7639 10.9028 21.7489 10.8651 21.7257 10.8324C21.7025 10.7997 21.6718 10.7731 21.6361 10.7547C21.6005 10.7364 21.561 10.7253 21.5209 10.7254Z" fill="white"/>
  </svg>
);

const BaseSvg = () => (
  <svg width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 9.08511C7 8.37011 7 8.01322 7.13444 7.73944C7.264 7.47667 7.47667 7.26278 7.74067 7.13444C8.01444 7 8.37133 7 9.08511 7H26.9149C27.6299 7 27.9856 7 28.2606 7.13444C28.5233 7.26278 28.736 7.47667 28.8643 7.73944C29 8.01444 29 8.37133 29 9.08511V26.9149C29 27.6299 29 27.9856 28.8656 28.2606C28.736 28.5233 28.5233 28.736 28.2606 28.8643C27.9856 29 27.6287 29 26.9149 29H9.08511C8.37011 29 8.01444 29 7.73944 28.8656C7.47666 28.7364 7.26426 28.5236 7.13567 28.2606C7 27.9856 7 27.6287 7 26.9149V9.08511Z" fill="#0052FF"/>
  </svg>
);

const SolanaSvg = () => (
  <svg width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M27.6195 11.853C27.4511 12.0075 27.2316 12.0945 27.003 12.0975H5.37002C4.60202 12.0975 4.21502 11.22 4.74602 10.7055L8.29952 7.2795C8.46463 7.11956 8.68467 7.02886 8.91452 7.026H30.63C31.4055 7.026 31.785 7.911 31.245 8.4285L27.6195 11.853Z" fill="url(#paint0_linear_66_3001)"/>
    <path d="M27.6195 28.737C27.4499 28.8887 27.2306 28.9731 27.003 28.974H5.37002C4.60202 28.974 4.21502 28.104 4.74602 27.5895L8.29952 24.1545C8.46603 23.9978 8.68591 23.9104 8.91452 23.91H30.63C31.4055 23.91 31.785 24.789 31.245 25.302L27.6195 28.737Z" fill="url(#paint1_linear_66_3001)"/>
    <path d="M27.6195 15.7095C27.4499 15.5577 27.2306 15.4734 27.003 15.4725H5.37002C4.60202 15.4725 4.21502 16.3425 4.74602 16.857L8.29952 20.292C8.46602 20.4465 8.68502 20.532 8.91452 20.5365H30.63C31.4055 20.5365 31.785 19.6575 31.245 19.1445L27.6195 15.7095Z" fill="url(#paint2_linear_66_3001)"/>
    <defs>
      <linearGradient id="paint0_linear_66_3001" x1="4.50152" y1="82.5615" x2="32.1885" y2="82.3065" gradientUnits="userSpaceOnUse">
        <stop stop-color="#599DB0"/>
        <stop offset="1" stop-color="#47F8C3"/>
      </linearGradient>
      <linearGradient id="paint1_linear_66_3001" x1="4.50152" y1="13.752" x2="32.0115" y2="13.5405" gradientUnits="userSpaceOnUse">
        <stop stop-color="#C44FE2"/>
        <stop offset="1" stop-color="#73B0D0"/>
      </linearGradient>
      <linearGradient id="paint2_linear_66_3001" x1="6.05402" y1="18.0045" x2="30.4545" y2="18.0045" gradientUnits="userSpaceOnUse">
        <stop stop-color="#778CBF"/>
        <stop offset="1" stop-color="#5DCDC9"/>
      </linearGradient>
    </defs>
  </svg>
);

const UnifiedBalanceCard = () => {
  const { primaryAssets } = useUniversalAccount();

  // Hardcoded Dashboard Light Theme matches
  const t = {
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#111',
    subtext: '#64748b',
    cardShadow: '0 2px 4px rgba(0,0,0,0.02)'
  };
  
  const balance = primaryAssets?.totalAmountInUSD?.toFixed(2) || '0.00';

  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: t.cardShadow, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: t.text }}>Chains & assets</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
        {(() => {
          const tokensWithBalance = primaryAssets?.assets?.filter((a: any) => Number(a.amount) > 0) || [];
          if (tokensWithBalance.length === 0) {
            return <div style={{ fontSize: '14px', color: t.subtext, marginTop: '16px' }}>Loading assets or wallet empty...</div>;
          }

          return tokensWithBalance.map((asset: any, index: number) => {
            const symbol = (asset.tokenType || 'Token').toUpperCase();
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {(() => {
                      if (symbol === 'ETH' || symbol === 'USDC' || symbol === 'USDT') {
                        return <img src={`/icons/${symbol.toLowerCase()}.png`} alt={symbol} style={{ width: '28px', height: '28px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />;
                      }
                      return (
                        <div style={{ width: '28px', height: '28px', background: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                          <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>{symbol[0]}</span>
                        </div>
                      );
                    })()}
                    <span style={{ fontSize: '15px', fontWeight: 700, color: t.text }}>{symbol}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: t.text }}>
                    {Number(asset.amount).toFixed(4).replace(/\.?0+$/, '')} <span style={{ color: t.subtext, fontWeight: 500 }}>(${Number(asset.amountInUSD || 0).toFixed(2)})</span>
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '40px' }}>
                  {asset.chainAggregation?.filter((c: any) => Number(c.amount) > 0).map((chain: any, idx: number) => {
                    const cId = chain.token?.chainId;
                    const chainName = cId === 42161 ? 'Arbitrum' : cId === 8453 ? 'Base' : cId === 10132 ? 'Solana' : cId === 1 ? 'Ethereum' : cId === 137 ? 'Polygon' : cId === 11155111 ? 'Sepolia' : cId === 84532 ? 'Base Sepolia' : cId === 421614 ? 'Arbitrum Sepolia' : `Chain ${cId || 'Unknown'}`;
                    
                    let chainIcon = (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '10px' }}>🔗</span>
                      </div>
                    );

                    if (cId === 42161 || cId === 421614) chainIcon = <ArbitrumSvg />;
                    else if (cId === 8453 || cId === 84532) chainIcon = <BaseSvg />;
                    else if (cId === 10132) chainIcon = <SolanaSvg />;
                    else if (cId === 137) {
                      chainIcon = (
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#8247e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#fff' }}>P</span>
                        </div>
                      );
                    } else if (cId === 1 || cId === 11155111) {
                      chainIcon = (
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#627eea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#fff' }}>E</span>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {chainIcon}
                          <span style={{ fontSize: '13px', color: t.subtext, fontWeight: 500 }}>{chainName}</span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: t.subtext }}>
                          {Number(chain.amount).toFixed(4).replace(/\.?0+$/, '')} <span style={{ opacity: 0.8 }}>(${Number(chain.amountInUSD || 0).toFixed(2)})</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          });
        })()}
      </div>

      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: t.subtext }}>Total balance</span>
        <span style={{ fontSize: '16px', fontWeight: 700, color: t.text }}>${balance}</span>
      </div>
    </div>
  );
};

export default UnifiedBalanceCard;
