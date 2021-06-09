## :bulb: Who am I and why I made this website

My name is Davide Halili, I'm 18, I live in Italy and I love programming :)

When I was a little kid I always liked to pick things apart and see how they worked, and computers were the most intricate and beautiful machines I could play with. It's been 5 years since I wrote my first line of code; I really liked videogames and started making my own videogames when I was 15, I had a lot of fun but soon I wanted to learn more and ended up dabbling with cybersecurity, data science and finally with full-stack development. I realized what I really liked was full-stack development and took courses on the most popular languages, libraries and frameworks such as HTML5/CSS3, React, NodeJS, MongoDB, MySQL, Redux etc.

I definitely have a lot to learn and I'm still a beginner, but it's time to turn this passion into a profession and this project is the first step towards that!

## :scroll: Small Guide

The project's goal was to built an ecommerce website to showcase my skills while also practicing the tools I learned. You can find more information about the tools used below. The project is currently hosted on https://davide-halili-ecommerce-demo.herokuapp.com.

## Installation

```console
  $ git clone https://github.com/d4ve02/portfolio-website-demo.git
  $ cd portfolio-website-demo
```

To run backend (port 5000):

1. Edit backend/.env to set the environment variables needed or set them manually
2. Run:

```console
  $ cd backend
  $ npm i
  $ npm start
```

To run frontend (port 3000):

```console
  $ cd frontend
  $ npm i
  $ npm start
```

## :desktop_computer: Website's features

-   Frontend:
    -   Sign In, Sign Up and Logout
    -   Search for products in the marketplace
    -   Filter products based on price and rating
    -   Add a product to the database, view its details or modify them
    -   Add a product to the shopping cart, order it or complete/cancel its delivery.
    -   Update user's account and delete account
-   Backend
    -   Fully working and fully tested RESTful api
    -   Authentication and authorization
    -   Double validation with Joi and mongoose
    -   Error handling and logging

## :mag_right: Tools and technologies utilized

This project is based on the MERN stack, consisting on MongoDB, Express, React and NodeJS.

### The frontend

I avoided using Bootstrap for the frontend and instead built everything from scratch to practice using HTML5 and CSS3. The website is fully responsive on all screen sizes.
The user interface is based on React and I used Redux to manage the global state and avoid prop drilling.

### The backend

The backend is built upon NodeJS and Express, while the database is managed by MongoDB using mongoose.
The server is fully tested (95%) with Jest, all routes are tested (integration tests) as well as various minor other functions (integration/unit tests).

## :label: Compatibility

This website was tested and is fully working on:

-   :white_check_mark: Chrome Desktop v89
-   :white_check_mark: Chrome Mobile v89
-   :white_check_mark: Firefox v87
-   :white_check_mark: Opera v74
-   :white_check_mark: Microsoft Edge v89
-   :x: Internet Explorer (lacks ES6 support)
-   :grey_question: Safari (I don't have any device to test this browser)

## :pushpin: Contact me!

-   email: halilidavide00@gmail.com
