## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a [.env](http://_vscodecontentref_/11) file based on [.env.example](http://_vscodecontentref_/12) and fill in the required environment variables.

## Scripts

- `npm run dev`: Start the development server with nodemon.
- `npm run watch`: Watch for TypeScript file changes and compile.

## Environment Variables

- [PORT](http://_vscodecontentref_/13): Server port.
- [DB_URI](http://_vscodecontentref_/14): MongoDB connection URI.
- [JWT_SECRET_KEY](http://_vscodecontentref_/15): Secret key for JWT.
- [email](http://_vscodecontentref_/16): Email address for sending emails.
- [password](http://_vscodecontentref_/17): Password for the email account.
- [cloud_name](http://_vscodecontentref_/18): Cloudinary cloud name.
- [CLOUDINARY_API_SECRET_KEY](http://_vscodecontentref_/19): Cloudinary API secret key.
- [CLOUDINARY_API_KEY](http://_vscodecontentref_/20): Cloudinary API key.

## Endpoints

### Authentication

- `POST /api/auth/sign-up`: Register a new user.

## License

This project is licensed under the MIT License.
