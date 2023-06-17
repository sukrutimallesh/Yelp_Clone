CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    price_range INTEGER
);

INSERT INTO restaurants (name, location, price_range)
VALUES ('Hardys', 'tampa', 2),
       ('Chipotle', 'la', 3);


CREATE TABLE reviews(
    id  BIGSERIAL NOT NULL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL REFERENCES restaurants(id),
    name VARCHAR(50) NOT NULL,
    review TEXT NOT NULL,
    rating INT NOT NULL check(rating >= 1 and rating <= 5)
);

INSERT INTO reviews (restaurant_id, name, review, rating)
VALUES (1, 'John', 'Great restaurant with excellent service!', 4);

SELECT * FROM restaurants 
LEFT JOIN (
  SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average_rating 
  FROM reviews 
  GROUP BY restaurant_id
) reviews ON restaurants.id = reviews.restaurant_id;