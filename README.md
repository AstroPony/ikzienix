# Ikzienix - Affordable Festival Sunglasses

A modern e-commerce platform for affordable sunglasses, perfect for festivals and outdoor adventures.

## Features

- 🛍️ Product browsing and collections
- 🛒 Shopping cart functionality
- 🔐 Google authentication
- 📱 Responsive design
- 🎨 Modern UI with animations
- 📦 Delivery address management

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your environment variables:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Testing on Mobile

### Option 1: Local Network Access
1. Find your computer's local IP address
2. Start the development server with:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```
3. Access the site from your mobile device using:
   ```
   http://your-local-ip:3000
   ```

### Option 2: Vercel Preview
1. Push your changes to GitHub
2. Vercel will automatically create a preview deployment
3. Access the preview URL from your mobile device

### Option 3: ngrok (Recommended)
1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```
2. Start your development server:
   ```bash
   npm run dev
   ```
3. In a new terminal, run:
   ```bash
   ngrok http 3000
   ```
4. Use the ngrok URL on your mobile device

## Deployment

The site is configured for deployment on Vercel. Simply push to your GitHub repository, and Vercel will handle the deployment automatically.

## Environment Variables

- `NEXTAUTH_URL`: Your site's URL (automatically set by Vercel)
- `NEXTAUTH_SECRET`: A secure random string for session encryption
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 