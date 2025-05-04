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
3. Start the development server:
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

This project is deployed on Vercel at [ikzienix.vercel.app](https://ikzienix.vercel.app)

### Environment Variables

The following environment variables are required for deployment:

```env
# NextAuth
NEXTAUTH_URL=https://ikzienix.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key_here
STRIPE_SECRET_KEY=your_secret_key_here
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT 