
import React, { useEffect, useReducer } from "react";

const questions = [
    {
    id:1,
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris"
  },
  {
    id:2,
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Jupiter", "Saturn", "Mars"],
    answer: "Jupiter"
  },
  {
    id:3,
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Fe", "Hg"],
    answer: "Au"  
  },
  {
    id:4,
    question: "What is the smallest country in the world?",
    options: ["Vatican City", "Monaco", "Nauru", "San Marino"],
    answer: "Vatican City"
  },
  {
    id:5,
    question: "What is the largest ocean in the world?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answer: "Pacific Ocean"
  },
  {
    id:6,
    question: "Which language is used to build react?",
    options: ["python", "java", "javascript", "c++"],
    answer: "javascript"
  },
  {
    id:7,
    question: "Which is the largest continent in the world?",
    options: ["Asia", "Africa", "Europe", "North America"],
    answer: "Asia"
  },
  {
    id:8,
    question: "Which is the largest desert in the world?",
    options: ["Sahara Desert", "Gobi Desert", "Kalahari Desert", "Arabian Desert"],
    answer: "Sahara Desert"
  },
  {
    id:9,
    question: "Which is the largest country in the world by land area?",
    options: ["Russia", "Canada", "China", "United States"],
    answer: "Russia"
  },
  {
    id:10,
    question: "Which is the largest river in the world by volume?",
    options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
    answer: "Amazon River"
  }
];

const initialState = {
  started: false,
  currentQuestion: 0,
  answers: {},
  timeLeft: 60,
  quizStatus: "not-started",
  score: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "START_QUIZ":
      return {
        ...state,
        started: true,
        quizStatus: "running",
        timeLeft: 60,
        currentQuestion: 0,
        answers: {},
        score: 0,
      };

    case "SELECT_ANSWER":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: action.answer,
        },
      };

    case "NEXT":
      return {
        ...state,
        currentQuestion: Math.min(
          state.currentQuestion + 1,
          questions.length - 1
        ),
      };

    case "PREVIOUS":
      return {
        ...state,
        currentQuestion: Math.max(state.currentQuestion - 1, 0),
      };

    case "TICK":
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };

    case "SUBMIT": {
      let score = 0;

      questions.forEach((question) => {
        if (state.answers[question.id] === question.answer) {
          score++;
        }
      });

      return {
        ...state,
        quizStatus: "submitted",
        score,
      };
    }

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    started,
    currentQuestion,
    answers,
    timeLeft,
    quizStatus,
    score,
  } = state;

  const question = questions[currentQuestion];

  // Timer
  useEffect(() => {
    if (quizStatus !== "running") return;

    if (timeLeft <= 0) {
      dispatch({ type: "SUBMIT" });
      return;
    }

    const timer = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStatus, timeLeft]);

  const handleAnswer = (answer) => {
    dispatch({
      type: "SELECT_ANSWER",
      questionId: question.id,
      answer,
    });
  };

  const percentage = Math.round((score / questions.length) * 100);

  // Start Screen
  if (!started) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
            Q
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mt-5">
            Quiz Assessment
          </h1>

          <p className="text-gray-500 mt-2">
            Test your React knowledge with this assessment.
          </p>

          <div className="mt-6 bg-blue-50 rounded-xl p-4 text-left">
            <p className="text-gray-700">
              <b>Total Questions:</b> {questions.length}
            </p>
            <p className="text-gray-700 mt-2">
              <b>Time Limit:</b> 60 seconds
            </p>
            <p className="text-gray-700 mt-2">
              <b>Question Type:</b> Multiple Choice
            </p>
          </div>

          <button
            onClick={() => dispatch({ type: "START_QUIZ" })}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Result Screen
  if (quizStatus === "submitted") {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
            ✓
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mt-5">
            Quiz Completed
          </h1>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-5">
              <p className="text-gray-500">Score</p>
              <p className="text-3xl font-bold text-blue-600">
                {score}/{questions.length}
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-5">
              <p className="text-gray-500">Percentage</p>
              <p className="text-3xl font-bold text-blue-600">
                {percentage}%
              </p>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Quiz Assessment
          </h1>

          <div className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold">
            Time: {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Progress */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-5">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <span>
              {Math.round(
                ((currentQuestion + 1) / questions.length) * 100
              )}
              %
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${
                  ((currentQuestion + 1) / questions.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-7">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-semibold text-blue-600">
              Question {currentQuestion + 1}
            </span>

            <span className="text-sm text-gray-500">
              {Object.keys(answers).length}/{questions.length} Answered
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-7">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {question.options.map((option, index) => {
              const selected = answers[question.id] === option;

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition ${
                    selected
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="font-medium">
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              disabled={currentQuestion === 0}
              onClick={() => dispatch({ type: "PREVIOUS" })}
              className="px-6 py-3 rounded-xl border border-blue-600 text-blue-600 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50"
            >
              ← Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={() => dispatch({ type: "SUBMIT" })}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => dispatch({ type: "NEXT" })}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Question Numbers */}
        <div className="bg-white rounded-xl shadow-sm mt-5 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">
            Questions
          </h3>

          <div className="flex flex-wrap gap-3">
            {questions.map((q, index) => {
              const answered = answers[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() =>
                    dispatch({
                      type: "NEXT",
                      // handled below by direct state navigation
                    })
                  }
                  className={`w-10 h-10 rounded-lg font-semibold ${
                    index === currentQuestion
                      ? "bg-blue-600 text-white"
                      : answered
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;