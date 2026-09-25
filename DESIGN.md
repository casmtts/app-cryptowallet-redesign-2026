# Design System: CryptoApp Wallet

## 1. Visual Theme & Atmosphere

Follow the Stitch project **2026 App UI Redesign - Crypto Wallet**, especially **Portfolio Overview (2026 Redesign)** and **Login & Auth - Light Mode (2026)**. The interface is a compact mobile wallet: bright, precise, quietly premium, and data-first. Use white surfaces over a cool light canvas, fine gray-green borders, pill controls, and restrained deep-teal highlights. Keep a single-column reading flow, generous touch targets, and compact numeric details. Deposit, Send, Swap, Analytics, and authentication screens share the same system.

## 2. Color Palette & Roles

- **Cool Mist Canvas** (`#F4F7F8`) — app background.
- **Clean Surface** (`#FFFFFF`) — portfolio card, inputs, dialogs, and bottom navigation.
- **Raised Mist** (`#EDF2F3`) — action wells and selected chart controls.
- **Primary Ink** (`#172B2E`) — headings and balances.
- **Muted Ink** (`#4C6063`) — asset names and supporting text.
- **Quiet Ink** (`#718386`) — labels, metadata, and inactive controls.
- **Deep Teal** (`#007D83`) — primary actions, selected controls, focus, and chart line.
- **Leaf Green** (`#16805A`) — positive price movement and healthy sync status.
- **Hairline** (`#DCE5E6`) — borders and separators.
- **Soft Rule** (`#E8EEEF`) — low-contrast row dividers.
- **Asset Network Colors** (`#F4B942`, `#8C7BFF`, `#37C89A`, `#EABF48`) — token identity only.
- **Loss Coral** (`#C94B58`) — negative asset movement and validation errors.

Keep teal as the sole interface accent; green communicates gains, and token hues identify assets. Maintain readable contrast for small metadata on white surfaces. Do not add decorative glow effects or saturated interface colors.

## 3. Typography Rules

- **Display and body:** Geist. Use controlled, medium-weight headings and tabular financial figures.
- **Numeric metadata:** JetBrains Mono for tickers, quantities, and compact labels.
- **Scale:** 36/42 px mobile hero, 26/32 px section title, 16/24 px body, 14/20 px secondary body, 11/14 px uppercase label.
- Keep currency values legible and right aligned. Use `tnum` where the platform supports it.

## 4. Component Stylings

- **Primary action:** Deep-teal filled pill with white label, 48–56 px touch height; brief scale feedback on press.
- **Secondary action:** White or raised-mist fill, fine gray-green border, dark label; no heavy shadow.
- **Portfolio surface:** White panel with 28–32 px corners, thin hairline border, balance, positive delta, line chart, and timeframe pills.
- **Token rows:** Flat list, circular network mark, name/ticker and quantity on the left, USD value and change on the right. Separate rows with low-contrast lines rather than nested cards.
- **Chart:** Teal line with a low-opacity fill, no distracting grid, selected period in a raised pill.
- **Navigation:** Fixed bottom pill with four compact destinations and a clear teal active state.
- **Dialogs:** White surface, concise title and explanation, teal primary action. The network picker offers Ethereum Mainnet and Bitcoin Mainnet; the demo portfolio balance remains aggregated.
- **Deposit:** Show an explicit Bitcoin/Ethereum network selector, a centered QR visual, an address field, and confirmation timing. Mark the address and QR as illustrative and warn users not to send funds.
- **Send:** Stack asset selection, destination, amount, network fee, and estimated arrival in a review-first form. Clearly label the review as a mockup that never broadcasts a transaction.
- **Swap:** Place source and destination assets in one conversion panel with a direction switch. Show the estimated amount, indicative rate, fee, and slippage; label all quote data as a demo.
- **Analytics:** Lead with total balance and period change, followed by a compact chart, summary measures, and asset allocation rows. Label market figures as demonstration data.
- **Authentication:** Left-aligned welcome copy, compact login/register switch, labels above outlined white inputs, teal focus and primary action states, inline red validation. Keep the account creation form scrollable with the keyboard and safe areas.
- **Touch states:** Minimum 44 px interactive areas. Use opacity/transform feedback without a bright halo.

## 5. Layout Principles

Use a 4/8 px spacing rhythm. On mobile, use 20–24 px side gutters. The portfolio stacks header, balance/chart, quick actions, allocation, holdings, connection status, and bottom navigation. Deposit and Send use a clear, review-first single-column form. Swap keeps both sides of the conversion visually connected. Analytics stacks the chart, summary figures, and holdings. Authentication uses one centered, left-aligned form column constrained to roughly 420 px. Screens must scroll with safe-area and keyboard insets.

## 6. Motion & Interaction

Use quick, tactile press feedback and short fades for dialogs. Avoid continuous shimmer, bouncing, or motion on financial values. Keep chart and card animations on opacity/transform only; respect reduced-motion preferences. Inputs show a restrained teal border on focus and inline errors without layout overlap.

## 7. Anti-Patterns

- No arbitrary gradients, neon glows, dark surfaces, or accent colors outside the Stitch system.
- No card grid for the holdings list; keep the holdings as aligned rows.
- No emoji token marks or generic placeholder branding.
- No fake market feed claims: this starter uses seeded PostgreSQL data and should label market status as demo/synced sample data until a real market provider is connected.
- No hidden balance changes, misleading real-time claims, or inaccessible low-contrast labels.
