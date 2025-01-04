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

3. Create a [.env](http://_vscodecontentref_/1) file based on [.env.example](http://_vscodecontentref_/2) and fill in the required environment variables.

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

## License

This project is licensed under the MIT License.
