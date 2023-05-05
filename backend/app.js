const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

const config = require("./config.json");
const { verifyToken } = require("./middleware");
const app = express();

const users = [
  {
    id: 1,
    email: "user1@tracker.com",
    password: "User@123456",
    fullname: "User 1",
  },
  {
    id: 2,
    email: "user2@tracker.com",
    password: "User@123456",
    fullname: "User 2",
  },
];

const goals = [
  {
    id: 1,
    userId: 1,
    title: "Goal 1",
    description: "Goal 1",
    deadline: "2022-11-10",
    steps: [
      {
        id: 1,
        title: "Goal 1 Step 1",
        description: "Goal 1 Step 1",
        status: 0,
        deadline: "2022-11-7"
      },
      {
        id: 2,
        title: "Goal 1 Step 2",
        description: "Goal 1 Step 2",
        status: 1,
        deadline: "2022-11-8"
      },
      {
        id: 3,
        title: "Goal 1 Step 3",
        description: "Goal 1 Step 3",
        status: 2,
        deadline: "2022-11-9"
      },
    ],
  },
  {
    id: 2,
    userId: 1,
    title: "Goal 2",
    description: "Goal 2",
    deadline: "2022-11-22",
    steps: [
      {
        id: 1,
        title: "Goal 2 Step 1",
        description: "Goal 2 Step 1",
        status: 0,
        deadline: "2022-11-20",
      },
      {
        id: 2,
        title: "Goal 2 Step 2",
        description: "Goal 2 Step 2",
        status: 1,
        deadline: "2022-11-21",
      },
      {
        id: 3,
        title: "Goal 2 Step 3",
        description: "Goal 2 Step 3",
        status: 2,
        deadline: "2022-11-22",
      },
    ],
  },
];

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  const user = users.find((c) => c.email === email && c.password === password);
  if (user) {
    const { id, email, fullname } = user;
    const token = jwt.sign({ id, email, fullname }, config.jwt_key);
    res.json({ success: true, data: token });
  } else {
    res.status(404).send({ success: false, message: "There is no user" });
  }
});

app.get("/goals", [verifyToken], (req, res, next) => {
  res.json({ success: true, data: goals });
});

app.get("/goals/:goal_id", [verifyToken], (req, res, next) => {
  const goalId = req.params.goal_id;
  
  findGoal(res, goalId, (goal) => {
    res.json({ success: true, data: goal });
  });
});

app.post("/goals", [verifyToken], (req, res, next) => {
  const { title, description, deadline } = req.body;
  const { userId } = req;

  const newGoal = { id: getNextId(goals), userId, title, description, deadline, steps: [] };
  goals.push(newGoal);

  res.json({ success: true, data: newGoal });
});

app.patch("/goals/:goal_id", [verifyToken], (req, res, next) => {
  const goalId = req.params.goal_id;

  findGoal(res, goalId, (goal) => {
    const { title, description, deadline } = req.body;
    goal.title = title ? title : goal.title;
    goal.description = description ? description : goal.description;
    goal.deadline = deadline ? deadline : goal.deadline;

    res.json({ success: true, data: goal });
  });
});

app.delete("/goals/:goal_id", [verifyToken], (req, res, next) => {
  const goalId = req.params.goal_id;

  findGoal(res, goalId, (goal) => {
    goals.splice(
      goals.findIndex((c) => c.id == goalId),
      1
    );
    
    res.json({ success: true });
  });
});

app.get("/goals/:goal_id/steps", [verifyToken], (req, res, next) => {
  const goalId = req.params.goal_id;

  findGoal(res, goalId, (goal) => {
    const steps = goal.steps;
    res.json({ success: true, data: steps });
  });
});

app.post("/goals/:goal_id/steps", [verifyToken], (req, res, next) => {
  const goalId = req.params.goal_id;

  findGoal(res, goalId, (goal) => {
    const { title, description, status, deadline } = req.body;
    const step = {
      id: getNextId(goal.steps),
      title,
      description,
      status: parseInt(status),
      deadline,
    };
    goal.steps.push(step);

    res.json({ success: true, data: goal });
  });
});

app.patch("/goals/:goal_id/steps/:step_id", [verifyToken], (req, res, next) => {
  const goalId = req.params.goal_id;
  const stepId = req.params.step_id;

  findStep(res, goalId, stepId, (goal, step) => {
    const { title, description, status, deadline } = req.body;
    step.title = title;
    step.description = description;
    step.status = status;
    step.deadline = deadline;

    res.json({ success: true, data: step });
  });
});

app.delete(
  "/goals/:goal_id/steps/:step_id",
  [verifyToken],
  (req, res, next) => {
    const goalId = req.params.goal_id;
    const stepId = req.params.step_id;

    findStep(res, goalId, stepId, (goal, step) => {
      goal.steps.splice(
        goal.steps.findIndex((c) => c.id == stepId),
        1
      );

      res.json({ success: true });
    });
  }
);

app.all("*", (req, res, next) => {
  next(new Error("Route not found"));
});
app.use((err, req, res, next) => {
  res.json({ error: err.message });
});
app.listen(3000, () => console.log(`listening on 3000`));

findGoal = (res, goalId, action) => {
  const goal = goals.find((c) => c.id == goalId);

  if (goal) {
    action(goal);
  } else {
    res
      .status(404)
      .send({ success: false, message: `There is no goal ${goalId}` });
  }
};

findStep = (res, goalId, stepId, action) => {
  findGoal(res, goalId, (goal) => {
    const step = goal.steps.find((c) => c.id == stepId);

    if (step) {
      action(goal, step);
    } else {
      res
        .status(404)
        .send({
          success: false,
          message: `There is no step ${stepId} in goal ${goalId}`,
        });
    }
  });
};

getNextId = (arr) => {
  const sorted = [...arr].sort((a, b) => (a.id > b.id ? -1 : 1));
  return sorted && sorted.length > 0 ? sorted[0].id + 1 : 1;
};
