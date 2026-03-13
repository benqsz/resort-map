# Resort map

## Prerequisites
- Node.js
- pnpm (if you don't have pnpm, see [this](https://pnpm.io/installation#using-corepack) )

## Starting the app

1. Install dependencies
```bash
pnpm install
```

2. Start the app:
```bash
node run.js --map path/to/map.ascii --bookings path/to/bookings.json
```

Available CLI options:
- `--map <path>`: Path to the ASCII resort map file (default: `map.ascii` in the working directory).
- `--bookings <path>`: Path to the bookings and guest information file (default: `bookings.json` in the working directory).

For local development with default files, you can also run:
```bash
pnpm dev
```


## Testing
Run all tests:
```bash
pnpm test
```

## Core design decisions and trade-offs

- Next.js chosen for ability to easily run backend and frontend in one app.
- Data loading, validation and booking logic are all server-side in API routes, keeping the frontend simple and focused on UI.
- The map refreshes on user action rather than via WebSockets, meaning concurrent users could briefly see stale availability.