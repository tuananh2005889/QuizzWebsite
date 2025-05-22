# Quiz Learning Platform

A modern web application for creating and taking quizzes, designed to help students practice and test their knowledge through multiple-choice questions.

## Features

- Create quiz sets with custom names
- Upload quiz questions via JAR files
- Interactive quiz interface with immediate feedback
- Score calculation and result display
- Responsive design using Tailwind CSS
- Real-time answer validation
- Progress tracking during quiz

## Tech Stack

- **Frontend:**
  - React with TypeScript
  - Tailwind CSS for styling
  - React Router for navigation
  - Axios for API calls

- **Backend:**
  - Node.js with Express
  - MySQL database
  - Multer for file uploads

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quiz-website
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
```

4. Create a MySQL database named 'quizz'

5. Create a `.env` file in the server directory with the following content:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=quizz
PORT=3001
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Creating a Quiz:**
   - Click "Create New Quiz" on the home page
   - Enter a name for your quiz set
   - Upload a JAR file containing quiz questions
   - Click "Create Quiz" to proceed

2. **Taking a Quiz:**
   - Select an answer from the multiple-choice options
   - Get immediate feedback on your answer
   - View the correct answer if you answered incorrectly
   - Click "Next Question" to proceed
   - View your final score and results at the end

## Project Structure

```
quiz-website/
├── src/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Quiz.tsx
│   │   └── Result.tsx
│   ├── App.tsx
│   └── main.tsx
├── server/
│   ├── index.js
│   └── uploads/
└── public/
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
