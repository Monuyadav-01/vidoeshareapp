# Video Sharing App Backend

## Overview

This is the backend of a video-sharing application, built using Node.js, Express, MongoDB, and Cloudinary for media storage. It provides API endpoints for user authentication, video uploads, streaming, likes, comments, and more.

## Features

- User authentication (JWT-based login & signup)
- Video upload & storage (Cloudinary integration)
- Video streaming
- Like & dislike functionality
- Commenting system
- User profile management

## Tech Stack

- **Backend Framework:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Token (JWT)
- **File Storage:** Cloudinary

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/video-sharing-backend.git
   cd video-sharing-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Video Management

- `POST /api/videos/upload` - Upload a video
- `GET /api/videos/:id` - Get video details
- `GET /api/videos/stream/:id` - Stream video
- `POST /api/videos/:id/like` - Like a video
- `POST /api/videos/:id/comment` - Add a comment

### User Management

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## Deployment

You can deploy this backend using platforms like:

- **Render**
