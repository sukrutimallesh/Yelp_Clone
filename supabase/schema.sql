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
