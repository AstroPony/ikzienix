# Ikzienix

A modern streetwear e-commerce platform built with Next.js, Bootstrap 5, and Prisma.

## Features

- 🎨 Modern, responsive design with dark theme
- 🛍️ Product catalog with filtering and sorting
- 🔒 Admin panel with feature flag management
- 📧 Contact form with email notifications
- 🛒 Shopping cart functionality
- 🔐 User authentication and authorization

## Tech Stack

- **Frontend**: Next.js, React, Bootstrap 5, SCSS
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Email**: Nodemailer
- **Authentication**: NextAuth.js

## Prerequisites

- Node.js 18+ and npm
- MySQL database
- SMTP server for email functionality

## Project Structure

```
ikzienix/
├── prisma/              # Database schema and migrations
├── public/             # Static assets
│   └── images/        # Image files
├── src/
│   ├── app/           # Next.js app directory
│   │   ├── api/       # API routes
│   │   └── (routes)/  # Page routes
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   └── styles/       # SCSS styles
└── scripts/          # Utility scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
