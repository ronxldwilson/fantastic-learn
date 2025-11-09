# Learn Python - Interactive Learning App

A comprehensive, interactive web application designed to teach Python programming through structured modules, quizzes, and hands-on learning experiences.

## 🚀 Features

- **Comprehensive Python Curriculum**: Covers Python basics, data structures, OOP, functions, file handling, and error handling
- **Interactive Quizzes**: Multiple-choice questions and text-based exercises
- **Progress Tracking**: Monitor your learning journey with detailed statistics
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Dark Mode Support**: Automatic dark/light mode based on system preferences

## 📚 Topics Covered

- 🐍 **Python Basics** - Variables, data types, operators
- 🔀 **Control Structures** - Loops, conditionals
- 📊 **Data Structures** - Lists, dictionaries, tuples, sets
- ⚙️ **Functions** - Defining and using functions
- 🏗️ **Object-Oriented Programming** - Classes, objects, inheritance
- 📁 **File Handling** - Reading and writing files
- 🛡️ **Error Handling** - Exceptions and try-except blocks

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans & Geist Mono

## 🏃 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/learn-py.git
   cd learn-py
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser** and visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
learn-py/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home page
│   ├── progress/          # Progress tracking page
│   ├── quiz/              # Quiz pages (dynamic routes)
│   └── topics/            # Topic pages (dynamic routes)
├── components/            # Reusable React components
│   ├── Navigation.tsx     # Site navigation
│   └── QuizQuestion.tsx   # Quiz question component
├── lib/                   # Utility libraries
│   ├── data/              # Quiz and topic data
│   │   ├── topics.json    # Topic metadata
│   │   ├── quizzes/       # Individual quiz files by topic
│   │   └── dataLoader.ts  # Dynamic data loading utilities
│   └── types.ts           # TypeScript type definitions
└── public/                # Static assets
```

## 🎯 How It Works

1. **Browse Topics**: Start from the home page and choose a Python topic
2. **Take Quizzes**: Each topic contains multiple quizzes with different difficulty levels
3. **Answer Questions**: Mix of multiple-choice and text-input questions
4. **Track Progress**: View your scores and completion statistics
5. **Learn & Improve**: Use explanations to understand correct answers

## 📊 Progress Tracking

- Quiz completion status
- Individual question scores
- Overall topic progress
- Recent quiz results
- Persistent storage using localStorage

## 🛠️ Adding New Content

The app is designed to be easily extensible. To add new topics and quizzes:

1. **Add Topic Metadata**: Update `lib/data/topics.json` with new topic info
2. **Create Quiz File**: Create `lib/data/quizzes/[topic-id].json` with quiz data
3. **Quiz JSON Structure**:
   ```json
   [
     {
       "id": "quiz-id",
       "title": "Quiz Title",
       "description": "Quiz description",
       "difficulty": "beginner|intermediate|advanced",
       "questions": [
         {
           "id": "q1",
           "type": "multiple-choice|text-input",
           "question": "Question text",
           "options": ["Option A", "Option B"] // for multiple-choice
           "correctAnswer": "Correct Answer",
           "explanation": "Explanation text"
         }
       ]
     }
   ]
   ```

The app automatically loads new content without code changes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js and Tailwind CSS
