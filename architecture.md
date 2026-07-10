## Architecture
```mermaid
graph TD
    A["Merchant Site / Frontend"] -->|"Redirects to Checkout URL"| B["unicard.app/checkout/[sessionId]"]
    B --> C{Logged in?}
    C -->|No| D["Show Email OTP (Magic)"]
    D --> E["Check Balance"]
    C -->|Yes| E
    E --> F{Has Funds?}
    F -->|No| G["Show Deposit Address (Any chain)"]
    F -->|Yes| H{Delegated?}
    H -->|No| I["Prompts EIP-7702 Signature"]
    H -->|Yes| J["BuyPassButton"]
    I --> J
    J -->|"createUniversalTransaction()<br>+ signAndSend()"| K["Client polls Particle API"]
    K -->|"Confirmed"| L["POST /api/purchase"]
    L -->|"issuePassOnChain()"| M["POST webhookUrl & Redirect to Merchant"]