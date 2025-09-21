# Knowledge Exchange API

An AdonisJS 5 REST API for a marketplace of books and tutoring services. It supports user registration/login, role management (admin/seller/tutor/customer), books/catalog, orders and payments metadata, contact messages, and basic file uploads.

## Prerequisites

- Node 18+
- MySQL 8+ (or switch to SQLite; see notes)
- Git Bash or a terminal

## Setup

1. Install dependencies

```bash
npm install
```

1. Environment

Create a `.env` in the project root:

```env
HOST=0.0.0.0
PORT=3333
NODE_ENV=development
APP_KEY=REPLACE_WITH_GENERATED_KEY
APP_NAME=Knowledge_Exchange
DRIVE_DISK=local

DB_CONNECTION=mysql
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB_NAME=knowledge_exchange

# SMTP (for order emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=postmaster@example.com
SMTP_PASSWORD=app_password
```

Generate an app key and paste into `APP_KEY`:

```bash
node ace generate:key
```

1. Database

- Create the database in MySQL:

```sql
CREATE DATABASE knowledge_exchange CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

- Run migrations

```bash
node ace migration:run
```

- (Optional) Seed roles/admin/customer data

```bash
node ace db:seed
```

## Run

- Development

```bash
npm run dev
```

- Production build

```bash
npm run build && npm start
```

## Auth & Middleware

- Auth uses OAT tokens (`Authorization: Bearer <token>`) per `config/auth.ts`.
- Named middleware:
  - `auth`: requires a valid token
  - `role:<name>`: requires the authenticated user to have a role (e.g. `role:seller`)

## Standard Response Wrapper

Successful responses often use:

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

## File Uploads

- Uses the local drive. Files are stored in `tmp/uploads` and served from `/uploads/*`.
- Ensure `DRIVE_DISK=local`.

## Pagination Utility

`PaginationUtil` supports:

```ts
{
  page: number,
  pageSize: number,
  filter?: [{ columns: string | string[], operation?: string, value: any }],
  sort?: { column: string, order: 'asc' | 'desc' }
}
```

Returned shape:

```ts
{ total: number, paginatedData }
```

## Routes Overview

List routes at any time:

```bash
node ace list:routes
```

### Public

- `GET /` Health check
- `POST /api/register` Register
  - body: `{ name, gender, email, password }`
- `POST /api/login` Login
  - body: `{ email, password }`
- `POST /contact` Create contact message
  - body: `{ name, email, subject, message }`

### Authenticated (auth)

- `DELETE /api/users/:id` Delete user
- Categories
  - `POST /api/categories` Create category `{ name }`
  - `GET /api/categories` List categories
- Books (seller/customer constraints inside controller)
  - `POST /api/books` Create book + images (multipart)
    - fields: `name, category_id, author, condition, price, quantity`
    - files: `path[]` (one or more images)
  - `GET /api/books` List all books (with images, category)
  - `PUT /api/books/:id` Update book basic fields; optional single file `path`
  - `DELETE /api/books/:id` Delete book
  - `DELETE /api/bookImages/:id` Delete a book image
- Orders
  - `PUT /api/orders/:id` Update order status `{ status }`
  - `PUT /api/orders/:id/:payment-status` Update payment status `{ status }`
- Tutors
  - `GET /api/tutors/:id` Show tutor by id (for current user in controller)
  - `PUT /api/tutors/:id` Update tutor
  - `DELETE /api/tutors/:id` Delete tutor
  - `GET /api/location/:location` Tutors by location
- Role requests
  - `POST /api/approve-role/:role/:userId` (admin) Approve role for user
  - `GET /api/pending-applications` (admin) List pending sellers/tutors

### Seller-only (role:seller)

- `GET /api/seller` Get current seller profile
- `POST /api/logout` Logout
- Categories
  - `POST /api/seller/categories` Create category
  - `GET /api/seller/categories` List categories
- Books
  - `POST /api/seller/books` Create
  - `GET /api/seller/books` List
  - `GET /api/seller/seller-book-list/:sellerId` List seller books by sellerId
  - `PUT /api/seller/books/:id` Update
  - `DELETE /api/seller/books/:id` Delete
  - `DELETE /api/seller/bookImages/:id` Delete image

### Customer-only (role:customer)

- `GET /api/customer` Get current customer
- `PUT /api/customer/:id` Update user (minimal example)
- `POST /api/orders` Create order
  - body: `{ name, email, phone, address, bookId, buyingQuantity, offer? }`
- `GET /api/customer/books` List books
- `GET /api/customer/tutors` List tutors
- `POST /api/apply-seller` Apply as seller `{ name, phoneNumber }`
- `POST /api/apply-tutor` Apply as tutor (multipart)
  - fields: `subject, qualifications, fee, location`
  - file: `profilePicture`
- `GET /api/seller-status` Get seller application status
- `GET /api/tutor-status` Get tutor application status

### Tutor-only (role:tutor)

- `PUT /api/tutors/updateProfile/:id` Update tutor
- `GET /api/tutors` Show current tutor

## Models & Migrations

- Users, Roles, UserRoles, Customers, Sellers, Tutors
- Books, BookImages, Categories
- Orders, OrderItems, PaymentDetails
- Contacts

Run or revert migrations:

```bash
node ace migration:run
node ace migration:rollback
```

## Seeding

Seeders are in `database/seeders`. Example:

```bash
node ace db:seed
```

## Mail

Configure SMTP in `.env`. Order creation and status changes send emails via `@adonisjs/mail`.

## Notes / Troubleshooting

- MySQL access denied: verify `MYSQL_USER`, `MYSQL_PASSWORD`, and that the user has privileges on `MYSQL_DB_NAME`.
- To switch to SQLite quickly, set `DB_CONNECTION=sqlite` and adjust `config/database.ts` accordingly.

## License

MIT
