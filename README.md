# Codeforces Tracker

A personal Codeforces problem tracker built with **React, Node.js, Express, MongoDB, and Tailwind CSS**.

The purpose of this project is to keep track of the Codeforces problems solved by a user and provide a clean interface to search, filter, and review their competitive programming progress.

Instead of manually remembering which problems have been solved, the application fetches the user's Codeforces submissions and stores the solved problems in a database.

---

## 🚀 Features

### Codeforces Synchronization

* Fetches solved submissions from Codeforces using the Codeforces API.
* Uses a Codeforces handle to identify the user's submissions.
* Automatically detects previously stored problems and avoids duplicate entries.
* Displays the number of newly added problems after synchronization.
* Shows the last synchronization time.

### Problem Tracking

Each stored problem contains information such as:

* Contest ID
* Problem index
* Problem name
* Rating
* Tags
* Codeforces problem URL
* Solved date

### Search

Search problems by their name using the search bar.

### Rating Filters

Problems are grouped dynamically according to their Codeforces rating.

For example:

* 800
* 900
* 1000
* 1200
* 1400
* etc.

The available ratings are generated from the problems stored in the database.

### Tag Filters

Problem tags are also generated dynamically.

This allows problems to be filtered by concepts such as:

* math
* greedy
* dp
* graphs
* implementation
* strings
* and other Codeforces tags

### Combined Filtering

Rating, tag, and search filters can work together.

For example:

> Find problems containing "array" that have rating 1200 and the `greedy` tag.

### Latest Solved Problems

The dashboard displays the most recently solved problems so that the user's latest progress is immediately visible.

### Codeforces Profile

The `@hr145cp` profile badge links directly to the user's Codeforces profile.

### Interactive UI

The frontend includes:

* Hover effects
* Active filter states
* Interactive buttons
* Search focus effects
* Problem-card interactions
* Smooth transitions
* Custom themed scrollbar

### Responsive Design

The interface is built using Tailwind CSS and is designed to work across different screen sizes.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* Mongoose

### Database

* MongoDB Atlas

### External API

* Codeforces API

### Development Tools

* Git
* GitHub
* VS Code
* MongoDB Compass
* MongoDB Atlas

---

## 🏗️ Project Structure

```text
codeforces-tracker/
│
├── backend/
│   ├── models/
│   │   └── Problem.js
│   │
│   ├── routes/
│   │   ├── codeforcesRoutes.js
│   │   └── problemRoutes.js
│   │
│   ├── services/
│   │   └── codeforcesService.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# ⚙️ How It Works

The application follows a simple flow:

```text
Codeforces
     │
     │ API
     ▼
Node.js + Express Backend
     │
     │ Store / Retrieve
     ▼
MongoDB Atlas
     │
     │ REST API
     ▼
React Frontend
     │
     ├── Search
     ├── Rating Filter
     ├── Tag Filter
     └── Latest Solved
```

When the user clicks **Sync Codeforces**:

1. The frontend sends a request to the backend.
2. The backend fetches the user's Codeforces submissions.
3. Solved submissions are processed.
4. Duplicate problems are ignored.
5. New problems are stored in MongoDB.
6. The frontend requests the updated problem list.
7. The dashboard displays the updated data.

---

# 📦 Installation

If you want to run this project locally, first clone the repository.

```bash
git clone https://github.com/hr145gh/codeforces-tracker.git
cd codeforces-tracker
```


---

## Backend Setup

Move into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Replace the MongoDB connection string with your own MongoDB Atlas connection string.

Start the backend:

```bash
node server.js
```

The backend should run on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal and move to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local URL, usually:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# 🔄 Using the Application

Once both frontend and backend are running:

1. Open the frontend in your browser.
2. Click **Sync Codeforces**.
3. The application fetches solved submissions.
4. New problems are stored in MongoDB.
5. Use the search bar to find problems.
6. Use Rating to filter by difficulty.
7. Use Tags to filter by topic.
8. Combine filters to narrow down the problem list.
9. Click a problem to open it on Codeforces.
10. Click `@hr145cp` to open the Codeforces profile.

---

# 📚 What I Learned

This project helped me connect several concepts into one complete application.

### Backend Development

I learned how to:

* Build REST APIs using Express.
* Create API routes and controllers.
* Connect a Node.js application to MongoDB.
* Design MongoDB schemas using Mongoose.
* Separate routes, models, and services.
* Handle API requests and errors.
* Work with external APIs.

### API Integration

A major part of the project was learning how to work with the Codeforces API.

I learned how to:

* Fetch external API data.
* Process submission data.
* Filter successful submissions.
* Identify unique solved problems.
* Handle paginated API responses.
* Convert external API data into a structure suitable for MongoDB.

### Database

I learned how to:

* Design a MongoDB document structure.
* Store Codeforces problem information.
* Query stored problems.
* Prevent duplicate problem records.
* Work with MongoDB Atlas.

### React

On the frontend, I learned how to:

* Manage state with `useState`.
* Fetch data with `useEffect`.
* Render dynamic lists.
* Create search functionality.
* Implement multiple filters.
* Combine multiple filtering conditions.
* Update the UI after API operations.
* Handle loading and synchronization states.

### Tailwind CSS

I learned how to:

* Build layouts using utility classes.
* Create responsive interfaces.
* Design cards, buttons, inputs, and badges.
* Implement hover and active states.
* Create subtle transitions and animations.
* Build a consistent color system.
* Customize browser UI elements such as the scrollbar.

### Full-Stack Integration

Most importantly, this project helped me understand how the different parts of a full-stack application communicate:

```text
React
  ↓
Axios
  ↓
Express API
  ↓
Service Layer
  ↓
Codeforces API / MongoDB
  ↓
Express API
  ↓
React
```

This was one of the main goals of the project: understanding how a real application connects the frontend, backend, database, and external APIs together.

---

# 🎯 How This Project Helps Users

Competitive programmers solve a large number of problems over time. After hundreds of problems, it becomes difficult to remember:

* Which problems were solved?
* Which ratings have been practiced?
* Which topics have been covered?
* Which problems were solved recently?
* Which areas need more practice?

Codeforces Tracker provides a centralized dashboard for this information.

Instead of going through a long Codeforces submission history, users can quickly search and filter their solved problems.

For example, a user can identify:

```text
All solved problems
        ↓
    Rating 1200
        ↓
      Greedy
        ↓
   Search by name
```

This makes the solved-problem history easier to explore and review.

The project can therefore be useful as a **personal competitive-programming progress tracker** and as a foundation for future features such as progress statistics, topic-wise analysis, rating distribution, streak tracking, and personalized practice lists.

---

# 🔮 Possible Future Improvements

The current project focuses on the core tracking functionality. Some possible future improvements include:

* User authentication
* Support for multiple Codeforces users
* Progress charts
* Rating distribution visualization
* Topic-wise statistics
* Solving streak tracking
* Unsolved problem recommendations
* Weak-topic identification
* Contest performance tracking
* Codeforces contest history
* Deployment
* Automatic scheduled synchronization
* Pagination for very large problem collections

---

# 🤝 Contributing

Contributions and suggestions are welcome.

To contribute:

```bash
git clone https://github.com/hr145gh/codeforces-tracker.git
cd codeforces-tracker
```

Create a new branch:

```bash
git checkout -b feature/your-feature
```

Make your changes, commit them, and push the branch:

```bash
git add .
git commit -m "add your feature"
git push origin feature/your-feature
```

Then open a pull request.

---

# 📄 License

This project is intended primarily as a personal learning and portfolio project.

---

## 👨‍💻 Author

**Harshit Raj**

MCA Student | Full-Stack Developer | Competitive Programmer

Built to combine competitive programming practice with full-stack web development.
