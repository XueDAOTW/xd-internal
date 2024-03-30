# Database

Shared database library using [Prisma](https://www.prisma.io/) as ORM

## Database Management

We are using PlanetScale as an easy-to-setup MySQL platform.

### Prerequisites

- Get added/access to our PlanetScale organization.
- Install the [PlanetScale CLI](https://github.com/planetscale/cli)
- Make sure `DATABASE_URL` is set in `.env`
- Authenticate the CLI with the following command:
  ```
  pscale auth login
  ```

### How to Execute Prisma Migrations

1. Connect to the `development` branch:

   ```
   pscale connect xd development --port 3309

   ```

2. Make changes in `prisma/schema.prisma` file and update the schema in PlanetScale:
   ```
   yarn db:push
   ```
3. Open a deploy request for the `development` branch, so that you can deploy these changes to `main`.
   ```
   pscale deploy-request create xd development
   ```
4. Review and complete the deploy request.
