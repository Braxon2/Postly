## Postly
A social media platform built with the MERN stack (MongoDB, Express.js, React.js, and Node.js).

# Table of Contents
Introduction
Features
Technologies Used
Getting Started
Installation
Usage



# Introduction
Postly is a social media platform designed to provide users with a seamless and engaging experience. It allows users to create profiles, post content, interact with other users, and explore a variety of topics. The platform is built using the MERN stack, leveraging the power of MongoDB, Express.js, React.js, and Node.js to deliver a robust and scalable solution.

# Features
User authentication and authorization
Profile creation and management
Posting and sharing content
Commenting and liking posts
Responsive design for various devices

# Technologies Used
Frontend: React.js
Backend: Node.js with Express.js
Database: MongoDB

# Getting Started
To get started with Postly, you need to have Node.js and MongoDB installed on your machine. Follow the steps below to set up the project locally.
Prerequisites
Node.js
MongoDB
Git

# Installation
Clone the repository:
bash
Copy
git clone https://github.com/Braxon2/Postly.git
cd Postly
Install dependencies for both the frontend and backend:
bash
Copy

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

Set up environment variables:
Create a .env file in the backend directory and add the following variables:
env
Copy
PORT=4000
MONGO_URI=uri_to_connect_to_your_databe
JWT_SECRET=your_jwt_secret
Start the development servers:
bash
Copy
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm start
## Usage
Access the application via http://localhost:3000 in your web browser.
Create an account or log in to start using Postly.
