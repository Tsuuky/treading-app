# Treading App - Paper Trading éducatif (Next.js + TypeScript)

> **Date de référence** : 2026-03-14 (Europe/Paris)  
> **Usage** : application fictive/éducative de paper trading. **Non production-ready** sans audits sécurité, conformité, légaux/fiscaux.

## Fonctionnalités
- Portfolio multi-actifs (actions + cryptos), exécution simulée market/limit.
- Journal de trade (notes, émotions, respect du plan, setup).
- KPIs: winrate, expectancy, profit factor, sharpe annualisé (daily), max drawdown, turnover.
- Backtesting daily: MA crossover (+ structure pour Bollinger).
- Live paper trading via SSE + fallback polling/backoff.

## Stack
- Next.js Pages Router + TypeScript (`/pages`, `/pages/api/*`).
- SQLite (script `scripts/importHistorical.ts`) via `better-sqlite3`.
- Cache anti-flood: LRU mémoire + Redis optionnel (si `REDIS_URL`).
- Rate limiting token bucket (global/provider/route/client).
- Batching symboles (`/api/market/quote?symbols=BTCUSDT,ETHUSDT,AAPL`).

## Stratégie anti-spam API (obligatoire)
1. **Token bucket**: buckets serveur/provider/route/client.
2. **Cache TTL**: quote court, daily long (`CACHE_TTL_*`).
3. **Batching**: agrégation serveur ~100ms pour regrouper plusieurs demandes symboles.
4. **Backoff exponentiel + jitter**: en cas d'erreurs / 429 / Retry-After.

## Providers & patterns
- **Alpha Vantage** (actions)
  - Exemple daily: `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=AAPL&apikey=KEY`
  - Tier free: limité, appeler en daily, 1 symbole/call.
- **CoinGecko** (crypto REST)
  - Batch quote: `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd`
  - Gérer 429 + backoff.
- **Binance**
  - WS streams: docs officielles Spot WS.
  - REST limits: docs officielles `exchangeInfo/rateLimits`, gérer 429/418 + Retry-After.

## Modes d'exécution
- `MODE=MOCK` (défaut): aucune API externe, données `/data/mock`.
- `MODE=LIVE`: providers externes + rate limit/caching actifs.
- Un seul mode à la fois.

## Installation
```bash
npm install
npm run import:mock
npm run dev
npm test
```

## Variables d'environnement
Voir `.env.example` (ne jamais committer vos clés).

## Déploiement
- Dockerfile dev fourni.
- **Vercel/serverless**: sockets persistants limités, préférer polling serverless-friendly ou worker externe pour WS partagé.
