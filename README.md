# ERP backend – authentication (NestJS + Supabase Auth)

Company registration with **email verification handled by Supabase Auth**, then sign-in.

- Logins (email, password, verification) live in **Supabase Auth**.
- Company details (name, license number, owner, description) live in the `companies` table, linked to the login.
- This API sits in front of both and exposes simple endpoints to the React app.

## How it works

1. `POST /api/auth/register` – creates the Supabase Auth user (Supabase emails the verification link), then saves the company details.
2. The owner clicks the link in the email. Supabase confirms the address and redirects to `FRONTEND_URL/email-verified`.
3. `POST /api/auth/login` – works only after verification (otherwise `403 EMAIL_NOT_VERIFIED`). Returns `accessToken`, `refreshToken` and the company.
4. `POST /api/auth/refresh` swaps the refresh token for a new pair (access tokens last about 1 hour).

## Setup

### 1. Environment
```bash
yarn install
cp .env.example .env
```
Fill in `.env`:

| Variable | Where to find it |
| --- | --- |
| `SUPABASE_URL` | Project Settings -> API -> **Project URL** (`https://xxxx.supabase.co`) |
| `SUPABASE_PUBLISHABLE_KEY` | Project Settings -> API Keys -> **Publishable key** (`sb_publishable_...`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings -> API Keys -> **Secret key** (`sb_secret_...`). Never share it or put it in the frontend. |
| `FRONTEND_URL` | `http://localhost:5173` while developing |

### 2. Create the tables
Supabase -> **SQL Editor** -> New query:
1. Paste `database/schema.sql` -> **Run** (companies / tenancy).
2. Paste `database/services.sql` -> **Run** (people, products, finance_entries + RLS).

Each of those three service tables is keyed by `company_id` (the signed-in auth user). Row Level Security only allows `auth.uid()` to see its own rows. The API also always scopes queries to the token's user id, so one company never receives another company's data.

(The first script deletes the old `companies` table from an earlier version, so run it before you have real data.)

### 3. Configure Supabase Auth (dashboard)
1. **Authentication -> Sign In / Providers -> Email**: make sure **Confirm email** is ON.
2. **Authentication -> URL Configuration**:
   - **Site URL**: `http://localhost:5173`
   - **Redirect URLs**: add `http://localhost:5173/email-verified`
   (When you go live, add your real domain here too.)
3. **Email delivery** – pick one:
   - *Quick test:* do nothing. Supabase's built-in email only sends to **members of your Supabase organization** and only **2 emails per hour**. Register with your own Supabase account email.
   - *Any recipient (recommended):* **Authentication -> Emails -> SMTP Settings** -> enable custom SMTP. Example with Gmail:
     - Sender email: your Gmail address, Sender name: your product name
     - Host `smtp.gmail.com`, Port `465`
     - Username: your Gmail address
     - Password: a Google **App Password** (Google Account -> Security -> 2-Step Verification -> App passwords)
   - *Production:* use a real email service on your own domain (Resend, Postmark, Brevo, AWS SES) in the same SMTP settings. The default limit with custom SMTP is 30 emails/hour; change it under Authentication -> Rate Limits.
4. Optional: **Authentication -> Emails -> Templates -> Confirm sign up** lets you edit the email's text and look.

### 4. Run
```bash
yarn start:dev      # http://localhost:3000/api
```

## API

| Method | Path | Body | Notes |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | companyName, licenseNumber, email, ownerName, businessDescription, password | 201, Supabase sends the verification email |
| POST | `/api/auth/resend-verification` | email | 200, same reply whether or not the account exists |
| POST | `/api/auth/login` | email, password | 200 `{ accessToken, refreshToken, company }`, 403 `EMAIL_NOT_VERIFIED` if unverified |
| POST | `/api/auth/refresh` | refreshToken | 200 `{ accessToken, refreshToken }` |
| POST | `/api/auth/logout` | – | Needs `Authorization: Bearer <accessToken>` |
| GET | `/api/auth/me` | – | Needs `Authorization: Bearer <accessToken>` |

| GET/POST/PATCH/DELETE | `/api/people` | tenant-scoped customers, staff, suppliers |
| GET/POST/PATCH/DELETE | `/api/products` | tenant-scoped products (`POST /api/products/:id/image` for the photo) |
| GET `/api/finance`, GET `/api/finance/summary` | income vs expenses |
| POST | `/api/finance/income` | selling income |
| POST | `/api/finance/expenses` | staff salary, product buying, or store maintenance |
| DELETE | `/api/finance/:id` | remove an entry you created |

## Structure

```
src/
├── config/      typed, validated environment (AppConfigService)
├── supabase/    SupabaseService (clients) + SupabaseAuthService (sign-up, sign-in, refresh, ...)
├── companies/   CompaniesRepository (only code touching the table), mapper, types
├── auth/        AuthController -> AuthService; SupabaseAuthGuard, CurrentUser decorator, DTOs
├── people/      customers, staff, suppliers (scoped to the signed-in company)
├── products/    product catalogue + image upload
├── finance/     income, three expense types, monthly growth summary
└── common/      shared decorators, exceptions, error codes
```

Every piece of logic is an injectable class that receives its dependencies through its constructor.

## Adding the admin panel later
Import `AuthModule` in your new module, protect routes with `@UseGuards(SupabaseAuthGuard)`
and read the signed-in user with `@CurrentUser()`.

## Troubleshooting
- **`SUPABASE_URL must be the Project URL`** – you used the `postgresql://` string; use the `https://...supabase.co` Project URL.
- **`Invalid API key`** – wrong key, or a key from a different project.
- **`Could not find the table 'public.companies'`** – run `database/schema.sql`.
- **`Email delivery is not set up for this address yet`** – you are using Supabase's built-in email with a non-team address; set up custom SMTP (step 3).
- **`Too many emails have been requested`** – Supabase email rate limit; wait, or raise the limit after setting up custom SMTP.
- **After clicking the email link you land on the wrong page** – the redirect URL in step 3 is missing or does not match exactly.
