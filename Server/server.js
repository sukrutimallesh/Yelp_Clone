//dotenv 
require("dotenv").config();

// importing the express
const express = require("express");

const cors = require("cors");

//connecting the databse to the express
// const db = require("./db/index")
const db = require("./db");

//importing morgan
const morgan = require("morgan");

//creating an instance of express and stored in variable app
const app = express();

app.use(cors());
// Parse JSON bodies
// this is a middleware as well 
app.use(express.json());

//Creating a middleware, if used properly a middleware can reduce the code.
// app.use((req, res, next) => {
//     console.log("yeah, our middleware");
//     next();
// });


//routes
//Get all the restaurants
app.get("/api/v1/restaurants", async (req, res) => {
    try{
        //const results = await db.query("SELECT * FROM restaurants");
        const restaurantRatingsData  = await db.query(
        "SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id;");

        res.status(200).json({
            status : "success",
            results: restaurantRatingsData.rows.length,
            data : {
                restaurants : restaurantRatingsData.rows,
            },
    });
    } catch (err) {
        console.log(err);
    }    
});

//in creating restaurant(post) we had the issue of not being able to find the json file we sent,
//express has a built in tool that makes our life easier (written below)
//this tool helps access the req.body property in post route
app.use(express.json());

//Get a restaurant 
app.get("/api/v1/restaurants/:id", async(req, res) => {
    console.log(req.params.id);
    try{
        //we should never do the below query, as it is prone to sql injection attacks
        // const results = await db.query(`SELECT * FROM restaurants where id = ${req.params.id}`);
        const restaurant = await db.query("SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id where id = $1", [req.params.id]);

        const reviews = await db.query("SELECT * FROM reviews where restaurant_id = $1", [req.params.id]);

        res.status(200).json({
            status: "success",
            data: {
                //getting the first row in the results
                restaurant: restaurant.rows[0],
                reviews: reviews.rows
            },
        });
    } catch (err){
        console.log(err);
    }    
});

//Create a Restaurant
app.post("/api/v1/restaurants", async (req, res) => {
    try{
        const results = await db.query("INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *", 
        [req.body.name, req.body.location, req.body.price_range]);
        //because of  middleware the body gets attcked as an object for the below command
        // console.log(req.body);
        console.log(results);

        res.status(201).json({
            status: "success",
            data: {
                restaurant: results.rows[0],
            },
        });
    } catch(err){
        console.log(err);
    }
});

//Update restaurants
app.put("/api/v1/restaurants/:id", async (req, res) => {
    try{
        const results = await db.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *", 
        [req.body.name, req.body.location, req.body.price_range, req.params.id]);
    
        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows[0],
            },
        });
    } catch (err){
        console.log(err);
    }
    console.log(req.params.id);
    console.log(req.body);
});

//Delete restaurant

app.delete("/api/v1/restaurants/:id", async (req, res) => {
    try{
        const results = await db.query("DELETE FROM restaurants where id = $1", [req.params.id]);
        res.status(204).json({
            status: "success"
        });
    } catch (err){
        console.log(err);
    }
});

app.post("/api/v1/restaurants/:id/addReview", async(req, res) => {
    try {
        const newReview = await db.query("INSERT INTO reviews (restaurant_id, name, review, rating) VALUES ($1, $2, $3, $4) returning *;", 
        [req.params.id, req.body.name, req.body.review, req.body.rating ]);
        res.status(201).json({
            status: "success",
            data: {
                review: newReview.rows[0]
            }
        });
    } catch (err) {
        console.log(err);
    }
});

//tell express app to listen on a specific port
//callback function is a function which is to be executed after another function has finished execution

//instead of hard coding the port values, we can use environment varibales because sometimes development and production environment have different ports 
//if the port is used or doesn't exist, then the default is written after ||port_number
const port = process.env.PORT || 3001;
app.listen(port, () => {
    //template string (backtick) for formatting
    console.log(`server is up and listening on port ${port}`);
});