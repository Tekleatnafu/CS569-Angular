# Final Project - CS569 Web Application Development II

## Team members

<!-- - Tekletsadik Yigzaw (tyigzaw@miu.edu) -->

Tekletsadik Yigzaw (yigzawtekletsadik@gmail.com)

## Requirements

You will be building an application for personal goal tracker:

- After you sign-in, CRUD your personal goals along with a deadline date you want the goal to be
  achieved.
- Once a goal is created, you should CRUD a roadmap of dates/steps, each step has a status “not-
  started/in-progress/completed”. Steps beyond their deadline should be displayed with a
  warning.
- Goals should be displayed with a progress bar and percentage (based on the completed steps)

## Development instructions

### Start the backend

1. Go to Terminal, and the code repository.
2. Go to "backend" folder

`cd backend`

3. (Only run first time) Run command

`npm install`

4. Run the server

`npx nodemon app.js`

Then you backend is hosted on `http://localhost:3000`

The http examples is in `test.http` file.

Available RESTful API:

- POST /login
- POST /goals
- PATCH /goals/:goal_id
- DELETE /goals/:goal_id
- POST /goals/:goal_id/steps
- PATCH /goals/:goal_id/steps/:step_id
- DELETE /goals/:goal_id/steps/:step_id
