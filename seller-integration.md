## Seller Integration

UniCard exposes a Stripe-like API for sellers:

### 1. Create a Checkout Session

```bash
curl -X POST https://unicard-smoky.vercel.app/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "itemSlug": "onchain-rooftop-mixer",
    "successUrl": "https://yoursite.com/success",
    "cancelUrl": "https://yoursite.com/cancel",
    "webhookUrl": "https://yoursite.com/api/webhook"
  }'
```

**Response:**
```json
{
  "sessionId": "cmrrunn...",
  "checkoutUrl": "https://unicard-smoky.vercel.app/checkout/cmrrunn..."
}
```

### 2. Redirect the Buyer

```html
<a href="{{ checkoutUrl }}">Pay with UniCard</a>
```

### 3. Receive Webhook

On successful payment, UniCard fires a `POST` to your `webhookUrl`:

```json
{
  "event": "checkout.session.completed",
  "sessionId": "cmrrunn...",
  "status": "complete",
  "passId": 7,
  "particleTxId": "...",
  "arbTxHash": "0x...",
  "buyerAddress": "0x..."
}
```

---