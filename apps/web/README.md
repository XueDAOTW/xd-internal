# XD Internal

Internal website for managing membership, governance, and other DAO tings.

## About

This app uses a bunch of frameworks/services to bootstrap and speed up development 🥴:

**App**

- [Next.js](https://nextjs.org/docs) as the app framework, including API.

**Authentication**

- [NextAuth](https://next-auth.js.org/) for user authentication.
- [RainbowKit](https://www.rainbowkit.com/docs/introduction) for wallet connection.
- [Magic Link](https://magic.link/) for email OTP login, possibly as a wallet provider in the future too for onboarding users without wallets.

**Styling**

- [TailwindCSS](https://tailwindcss.com/) as a CSS framework.
- [daisyUI](https://daisyui.com/) for Tailwind components and themes.

**Storage**

- [PlanetScale](https://planetscale.com/) for MySQL database.
- [AWS S3](https://aws.amazon.com/s3/) for storing/serving assets.

## Getting Started

Please feel free to clone this repo, and open a PR or issue for any fixes / features :)

### Prerequisites

- Copy `.env.template` to a local `.env` file.
- Contact Terrance on [Telegram](https://t.me/YHTerrance) for env vars and access setup (until we have better password/auth management software like 1password lol)

### Running server

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is deployed on [Vercel](https://vercel.com/). There are no deployment envs or steps set up other than merging to main, but feel free to help add those ty.

## Database Management

This app uses PlanetScale as an easy-to-setup MySQL platform. See [`packages/database` README](/packages/database/README.md) for instructioins on how to update db schemas.
