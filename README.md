# eStatya - Technical Posts Platform

A platform for sharing technical posts and knowledge within the Ukrainian tech community.

## Table of Contents
- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## About

eStatya is a platform designed for Ukrainian developers and tech enthusiasts to share technical articles, tutorials, and insights. Our mission is to foster knowledge exchange and build a strong technical community in Ukraine.

## Features

- User registration and authentication
- Create, read, update, and delete technical posts
- Post categorization and tagging
- User profiles and author information
- Commenting system
- Search functionality
- Responsive design for all devices

## Getting Started

### Prerequisites
- Python 3.9+
- PostgreSQL
- Redis (for caching)
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/eStatya.git
cd eStatya
```

2. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements/dev.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=postgresql://username:password@localhost/database_name
SECRET_KEY=your-secret-key
DEBUG=False
REDIS_URL=redis://localhost:6379
```

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the development server:
```bash
python -m uvicorn main:app --reload
```

## Usage

### Endpoints

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh JWT token

#### Users
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `GET /users/{user_id}` - Get specific user profile

#### Posts
- `GET /posts` - Get all posts (with pagination and filtering)
- `POST /posts` - Create a new post (requires authentication)
- `GET /posts/{post_id}` - Get a specific post
- `PUT /posts/{post_id}` - Update a post (requires ownership)
- `DELETE /posts/{post_id}` - Delete a post (requires ownership)
- `GET /posts/search?q={query}` - Search posts by keyword

#### Categories
- `GET /categories` - Get all available categories
- `GET /categories/{category_id}/posts` - Get posts by category

#### Comments
- `GET /posts/{post_id}/comments` - Get comments for a post
- `POST /posts/{post_id}/comments` - Add a comment to a post
- `PUT /comments/{comment_id}` - Update a comment (requires ownership)
- `DELETE /comments/{comment_id}` - Delete a comment (requires ownership)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Register a new account or login with existing credentials
2. Include the received token in the Authorization header for subsequent requests
3. Tokens expire after 24 hours and can be refreshed using the refresh endpoint

## Contributing

We welcome contributions to eStatya! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the existing code style.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, feel free to open an issue in the repository.

---

Made with ❤️ for the Ukrainian tech community
