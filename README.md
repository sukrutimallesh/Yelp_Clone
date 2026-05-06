# Yelp Clone — Restaurant Review Platform

A full-stack restaurant review application built with the PERN stack, deployed to Vercel with Supabase PostgreSQL. Users can browse restaurants, submit reviews with star ratings, add new restaurants, and perform full CRUD operations — all backed by a real dataset parsed from Yelp's open dataset (500K+ records).

**[Live Demo](https://yelp-clone-sukruti.vercel.app)** | **[GitHub](https://github.com/sukrutimallesh/Yelp_Clone)**

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18 (Create React App), React Router v6    |
| Styling    | Bootstrap 5                                     |
| HTTP       | Axios                                           |
| Backend    | Node.js, Vercel Serverless Functions            |
| Database   | PostgreSQL via Supabase                         |
| Deployment | Vercel (frontend + serverless API)              |

---

## Features

- **Browse Restaurants** — View a list of all restaurants with average star rating and review count
- **Add Restaurants** — Submit new restaurants with name, location, and price range
- **Restaurant Detail Page** — See full restaurant info, all reviews, and aggregated rating
- **Submit Reviews** — Leave a review with your name, written review, and 1–5 star rating
- **Edit & Delete** — Full CRUD: update restaurant details or remove them from the list
- **Star Ratings** — Interactive star display on listing and detail pages
- **Yelp Dataset** — Seeded with 500K+ real restaurant entries from Yelp's open dataset
- **Serverless API** — Each route is a dedicated Vercel serverless function (no Express server required)

---

## Architecture

```
Client (React CRA)
       |
       | HTTP requests to /api/restaurants
       v
Vercel Serverless Functions (api/)
       |
       | Supabase JS client
       v
Supabase PostgreSQL (restaurants + reviews tables)
```

### API Routes

| Method | Route                                   | Description              |
|--------|-----------------------------------------|--------------------------|
| GET    | `/api/restaurants`                      | List all restaurants     |
| POST   | `/api/restaurants`                      | Create a restaurant      |
| GET    | `/api/restaurants/[id]`                 | Get one restaurant + reviews |
| PUT    | `/api/restaurants/[id]`                 | Update a restaurant      |
| DELETE | `/api/restaurants/[id]`                 | Delete a restaurant      |
| POST   | `/api/restaurants/[id]/addReview`       | Add a review             |

---

## Project Structure

```
Yelp_Clone/
├── Client/                   # React frontend (Create React App)
│   ├── src/
│   │   ├── apis/
│   │   │   └── RestaurantFinder.js   # Axios instance
│   │   ├── components/
│   │   └── routes/
│   └── package.json
├── api/                      # Vercel Serverless Functions
│   ├── _db.js                # Supabase client helper
│   ├── restaurants.js        # GET all + POST
│   ├── restaurants/
│   │   ├── [id].js           # GET one + PUT + DELETE
│   │   └── [id]/
│   │       └── addReview.js  # POST review
│   └── package.json
├── supabase/
│   └── schema.sql            # Database schema
├── vercel.json               # Vercel build + routing config
├── .env.example              # Environment variable template
└── README.md
```

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account and project

### 1. Clone the repo

```bash
git clone https://github.com/sukrutimallesh/Yelp_Clone.git
cd Yelp_Clone
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open the SQL editor and run the contents of `supabase/schema.sql`
3. Copy your **Project URL** and **service_role secret key** from Project Settings → API

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your actual Supabase credentials:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

### 4. Install dependencies

```bash
# Install API dependencies
cd api && npm install && cd ..

# Install frontend dependencies
cd Client && npm install && cd ..
```

### 5. Run locally with Vercel CLI

```bash
npm install -g vercel
vercel dev
```

This starts the full stack locally — serverless functions at `/api/*` and the React app served from `Client/`.

Alternatively, run the React dev server separately:

```bash
cd Client && npm start
```

The frontend proxies `/api` requests to `http://localhost:3001` (configured in `Client/package.json`).

---

## Deployment to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sukrutimallesh/Yelp_Clone)

### Manual deploy

```bash
vercel --prod
```

Set the following environment variables in the Vercel dashboard (Project → Settings → Environment Variables):

| Variable               | Value                              |
|------------------------|------------------------------------|
| `SUPABASE_URL`         | Your Supabase project URL          |
| `SUPABASE_SERVICE_KEY` | Your Supabase service role key     |

---

## Database Schema

```sql
create table public.restaurants (
  id serial primary key,
  name varchar(50) not null,
  location varchar(50) not null,
  price_range int check(price_range >= 1 and price_range <= 5)
);

create table public.reviews (
  id serial primary key,
  restaurant_id int references public.restaurants(id) on delete cascade,
  name varchar(50),
  review text,
  rating int check(rating >= 1 and rating <= 5)
);
```

---

## Screenshots

> Add screenshots here. Place image files in `Client/public/screenshots/` and reference them below.

| Restaurant List | Restaurant Detail | Add Restaurant |
|-----------------|-------------------|----------------|
| *(screenshot)*  | *(screenshot)*    | *(screenshot)* |

---

## License

MIT
