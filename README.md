# TS Express Starter

This is a TypeScript-based Express.js starter project.

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies using npm or yarn:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Install TypeScript and ts-node globally:

   ```sh
   npm install -g typescript ts-node
   # or
   yarn global add typescript ts-node
   ```

4. Create a [.env](http://_vscodecontentref_/5) file based on [.env.example](http://_vscodecontentref_/6) and fill in the required environment variables.

## Scripts

- `npm run dev` or `yarn dev`: Start the development server with nodemon.
- `npm run watch` or `yarn watch`: Watch for TypeScript file changes and compile.

## Environment Variables

- `PORT`: Server port.
- `DB_URI`: MongoDB connection URI.
- `JWT_SECRET_KEY`: Secret key for JWT.
- `email`: Email address for sending emails.
- `password`: Password for the email account.
- `cloud_name`: Cloudinary cloud name.
- `CLOUDINARY_API_SECRET_KEY`: Cloudinary API secret key.
- `CLOUDINARY_API_KEY`: Cloudinary API key.

## Packages

- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling tool.
- `bcrypt`: Library for hashing passwords.
- `jsonwebtoken`: Library for generating and verifying JSON Web Tokens.
- `dotenv`: Loads environment variables from a [.env](http://_vscodecontentref_/7) file.
- `multer`: Middleware for handling `multipart/form-data`, used for file uploads.
- `cloudinary`: Cloud-based image and video management service.
- `nodemailer`: Module for sending emails.
- `mailgen`: Generates HTML and plain text email content.
- `cors`: Middleware for enabling Cross-Origin Resource Sharing.
- `nodemon`: Utility that monitors for any changes in your source and automatically restarts your server.
