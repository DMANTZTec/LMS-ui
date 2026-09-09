export const courses = {
  active: 3,
  planned: 2,
  completed: 5,
};

export const classes = {
  total: 42,
  skipped: 8,
  monthTotal: 10,
  monthSkipped: 3,
};

export const hours = {
  total: 127,
};

export const mentorPoints = {
  total: 850,
  thisMonth: 120,
};

export const weeklyPerf = {
  hours: [
    { d: "12/08", v: 18 },
    { d: "12/15", v: 22 },
    { d: "12/22", v: 15 },
    { d: "12/29", v: 20 },
  ],

  rating: [
    { d: "12/08", v: 4.2 },
    { d: "12/15", v: 4.5 },
    { d: "12/22", v: 3.8 },
    { d: "12/29", v: 4.8 },
  ],

  attended: [
    { d: "12/08", v: 5 },
    { d: "12/15", v: 4 },
    { d: "12/22", v: 6 },
    { d: "12/29", v: 5 },
  ],
  tasksCompleted: [
    { d: "12/08", v: 3 },
    { d: "12/15", v: 5 },
    { d: "12/22", v: 2 },
    { d: "12/29", v: 4 },
  ],
};


export const initialTasks = [
  {
    id: "t1",
    title: "Complete React Hooks Assignment",
    description: "Build a todo app using useState and useEffect hooks",
    tags: ["Advanced Web Development", "React Hooks"],
    status: "active",
  },
  {
    id: "t2",
    title: "Study Array Sorting Algorithms",
    description: "Review quicksort, mergesort, and their time complexities",
    tags: ["Data Structures & Algorithms", "Array Manipulation"],
    status: "active",
  },
  {
    id: "t3",
    title: "Read ML Chapter 4",
    description: "Linear regression and gradient descent",
    tags: ["Machine Learning Fundamentals"],
    status: "completed",
  },
];

export const courseOptions = [
  "Advanced Web Development",
  "Data Structures & Algorithms",
  "Machine Learning Fundamentals",
];

export const chapterOptions = ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"];

export const topicOptions = ["React Hooks", "Sorting", "Regression", "DOM"];

export const tasks = {
  active: [
    {
      id: "1",
      title: "Complete React Hooks Assignment",

      description:
        "Build a todo app using useState and useEffect",

      tags: [
        "Advanced Web Development",
        "React Hooks",
      ],
    },

    {
      id: "2",
      title: "Study Array Sorting Algorithms",

      description:
        "Review quicksort, mergesort, and their complexity",

      tags: [
        "Data Structures & Algorithms",
        "Array Manipulation",
      ],
    },
  ],

  completed: [
    {
      id: "3",
      title: "Submit ML Project Proposal",

      description:
        "Proposal for sentiment analysis project",

      tags: ["Machine Learning Fundamentals"],
    },
  ],
};