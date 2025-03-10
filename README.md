# CORSIT Website

This is the official website for CORSIT (Club of Robotics at Siddaganga Institute of Technology).

## Project Structure

- `client/`: Frontend React application
- `server/`: Backend Express API

## Deployment Instructions for Vercel

### Deploying the Server to Vercel

1. Create a Vercel account if you don't have one already at [vercel.com](https://vercel.com).
2. Install the Vercel CLI: `npm install -g vercel`
3. Navigate to the server directory: `cd server`
4. Run `vercel login` and follow the instructions to log in.
5. Run `vercel` to deploy the server.
6. Set up the following environment variables in the Vercel dashboard:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT token generation
   - `CORSIT_SECRET_KEY`: Secret key for user registration
   - `ADMIN_SECRET`: Secret key for admin authentication
   - `NODE_ENV`: Set to `production`

### Deploying the Client to Vercel

1. Navigate to the client directory: `cd client`
2. Run `vercel` to deploy the client.
3. After deployment, go to the Vercel dashboard and link your client project to the server project.
4. Update the `apiBaseUrl` in `client/src/config.js` to point to your deployed server URL.

## API Routes

The server API has been updated to use the `/api/` prefix for all routes. The following routes are available:

### Authentication Routes
- `POST /api/login`: Login with email and password
- `POST /api/register`: Register a new user
- `POST /api/signup-with-key`: Register with a secret key

### User Routes
- `GET /api/user`: Get the current user's profile
- `PUT /api/user/profile`: Update the current user's profile
- `PUT /api/user/password`: Change the current user's password

### Admin Routes
- `GET /api/admin/users`: Get all users (admin only)
- `PUT /api/admin/user/:id`: Update a user (admin only)
- `POST /api/admin/auth`: Authenticate as admin

### Team Routes
- `GET /api/team`: Get all team members

### Legacy Routes (for backward compatibility)
- `GET /profile`: Get the current user's profile
- `POST /edit-profile`: Update the current user's profile
- `POST /change-password`: Change the current user's password
- `GET /team`: Get all team members
- `POST /signup`: Register with a secret key
- `GET /admin/users`: Get all users (admin only)
- `PUT /admin/users/:userId`: Update a user (admin only)
- `DELETE /admin/users/:userId`: Delete a user (admin only)
- `POST /admin/auth`: Authenticate as admin

## Development

### Server

```bash
cd server
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Server

Create a `.env` file in the server directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORSIT_SECRET_KEY=your_corsit_secret_key
ADMIN_SECRET=your_admin_secret
PORT=5000
```

### Client

The client uses the configuration in `src/config.js` to determine the API URL based on the environment.

## File Storage

In the Vercel serverless environment, files are stored as base64-encoded data URLs in the database. For a production environment, it's recommended to use a cloud storage service like AWS S3, Google Cloud Storage, or Cloudinary.