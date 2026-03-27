# TechKraft Inc. - Real Estate API Task

This is the backend server for a real estate application task. It provides APIs for user authentication, property listings, and managing favourites.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm
- PostgreSQL

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-folder>/server
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the `server` directory by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your PostgreSQL database credentials and a `SECRET_KEY` for JWT.

    ```env
    DB_NAME=your_db_name
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    DB_HOST=localhost
    DB_DIALECT=postgres
    DB_PORT=5432
    SECRET_KEY=your_super_secret_key
    ```

4.  **Seed the database with property data:**

    This command will populate the `properties` table with dummy data.

    ```bash
    npm run seed:properties
    ```

    To clear existing properties and re-seed, use the `--force` flag:

    ```bash
    npm run seed:properties -- --force
    ```

5.  **Run the application:**
    - **Development mode** (with hot-reloading):

      ```bash
      npm start
      ```

## API Example Flows

All authenticated routes require a `Bearer <token>` in the `Authorization` header.

### 1. Sign Up

Create a new user account.

- **Endpoint:** `POST /users/signup`
- **Body:**

  ```json
  {
    "fullname": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

### 2. Sign In

Authenticate and receive a JWT.

- **Endpoint:** `POST /users/signin`
- **Body:**

  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

- **Response:**

  ```json
  {
    "message": "User signed in successfully",
    "token": "your_jwt_token"
  }
  ```

### 3. Add a Favourite

Add a property to the user's favourites list.

- **Endpoint:** `POST /favourites/add`
- **Headers:** `Authorization: Bearer <your_jwt_token>`
- **Body:**

  ```json
  {
    "propertyId": "the_uuid_of_a_property"
  }
  ```

### 4. View Favourites

Retrieve all properties favourited by the user.

- **Endpoint:** `GET /favourites/all`
- **Headers:** `Authorization: Bearer <your_jwt_token>`
- **Response:** A list of favourite entries, each including the full property details.
