# hyperlocal

An open source, privacy focused, community engagement platform

This project uses [Nextjs](https://nextjs.org/) as the rails for a [React](https://react.dev/) based web application that leverages [Keystone 6](https://keystonejs.com/) as a backend data engine.

## Getting Started

### Prerequisites

1. node v20
2. pnpm v9 (or your fav package manager)
3. postgres DB (or MySQL, SQLite)

In local development, you can start both Nextjs and Keystone development servers by running:

```
pnpm run dev
```

When deploying to PROD, `Keystone` will compile with the `--no-ui` flag and the keystone admin ui will not be available.

> GraphQL yoga is used to proxy Keystone context to the Nextjs Application.
