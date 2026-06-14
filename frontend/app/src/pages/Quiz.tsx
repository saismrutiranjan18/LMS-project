import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Flag,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuizStore } from '@/store';

interface Question {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export default function Quiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { 
    timeRemaining, 
    isQuizActive, 
    startQuiz, 
    submitAnswer, 
    submitQuiz,
    tickTimer 
  } = useQuizStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Mock quiz data
  const quiz = {
    id: quizId || '1',
    title: 'Python Basics Quiz',
    description: 'Test your understanding of Python fundamentals',
    timeLimit: 15, // minutes
    passingScore: 70,
    questions: [
      {
        id: '1',
        question: 'What is the correct way to create a variable in Python?',
        options: [
          { id: 'a', text: 'var x = 5' },
          { id: 'b', text: 'x = 5' },
          { id: 'c', text: 'int x = 5' },
          { id: 'd', text: 'let x = 5' },
        ],
        correctAnswer: 'b',
        explanation: 'In Python, you simply assign a value to a variable using the = operator. No declaration keyword is needed.',
      },
      {
        id: '2',
        question: 'Which of the following is a valid Python data type?',
        options: [
          { id: 'a', text: 'array' },
          { id: 'b', text: 'list' },
          { id: 'c', text: 'vector' },
          { id: 'd', text: 'matrix' },
        ],
        correctAnswer: 'b',
        explanation: 'List is a built-in data type in Python. Arrays require the array module, while vector and matrix are not built-in types.',
      },
      {
        id: '3',
        question: 'What does the len() function do?',
        options: [
          { id: 'a', text: 'Returns the length of an object' },
          { id: 'b', text: 'Creates a new list' },
          { id: 'c', text: 'Converts to lowercase' },
          { id: 'd', text: 'Rounds a number' },
        ],
        correctAnswer: 'a',
        explanation: 'The len() function returns the number of items in an object, such as the number of characters in a string or elements in a list.',
      },
      {
        id: '4',
        question: 'How do you create a function in Python?',
        options: [
          { id: 'a', text: 'function myFunc():' },
          { id: 'b', text: 'def myFunc():' },
          { id: 'c', text: 'create myFunc():' },
          { id: 'd', text: 'func myFunc():' },
        ],
        correctAnswer: 'b',
        explanation: 'Functions in Python are defined using the def keyword followed by the function name and parentheses.',
      },
      {
        id: '5',
        question: 'What is the output of print(2 ** 3)?',
        options: [
          { id: 'a', text: '6' },
          { id: 'b', text: '8' },
          { id: 'c', text: '9' },
          { id: 'd', text: '23' },
        ],
        correctAnswer: 'b',
        explanation: 'The ** operator is used for exponentiation in Python. 2 ** 3 equals 2³ = 8.',
      },
    ] as Question[],
  };

  useEffect(() => {
    if (!isQuizActive && !showResults) {
      startQuiz(quiz);
    }
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isQuizActive && timeRemaining > 0) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    } else if (timeRemaining === 0 && isQuizActive) {
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [isQuizActive, timeRemaining, tickTimer]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answerId }));
    submitAnswer(currentQuestion.id, [answerId]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(answers[quiz.questions[currentQuestionIndex + 1].id] || '');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answers[quiz.questions[currentQuestionIndex - 1].id] || '');
    }
  };

  const handleSubmit = () => {
    submitQuiz();
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const score = calculateScore();
  const passed = score >= quiz.passingScore;

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Card className="border-none shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <Trophy className="w-12 h-12 text-green-500" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-500" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-[#1A202C] mb-2">
                {passed ? 'Congratulations!' : 'Quiz Completed'}
              </h2>
              <p className="text-[#718096]">
                {passed 
                  ? 'You passed the quiz with flying colors!' 
                  : 'Keep practicing and try again!'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-[#F8FAFC] rounded-xl">
                <p className="text-3xl font-bold text-[#1A202C]">{score}%</p>
                <p className="text-sm text-[#718096]">Your Score</p>
              </div>
              <div className="text-center p-4 bg-[#F8FAFC] rounded-xl">
                <p className="text-3xl font-bold text-[#1A202C]">{quiz.passingScore}%</p>
                <p className="text-sm text-[#718096]">Passing Score</p>
              </div>
              <div className="text-center p-4 bg-[#F8FAFC] rounded-xl">
                <p className="text-3xl font-bold text-[#1A202C]">
                  {Object.keys(answers).filter(id => {
                    const q = quiz.questions.find(q => q.id === id);
                    return q && answers[id] === q.correctAnswer;
                  }).length}
                </p>
                <p className="text-sm text-[#718096]">Correct Answers</p>
              </div>
            </div>

            {/* Question Review */}
            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-[#1A202C]">Question Review</h3>
              {quiz.questions.map((q, i) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                return (
                  <div 
                    key={q.id} 
                    className={`p-4 rounded-xl border ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium text-[#1A202C]">Question {i + 1}: {q.question}</p>
                        <p className="text-sm text-[#718096] mt-1">
                          Your answer: {q.options.find(o => o.id === answers[q.id])?.text || 'Not answered'}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mt-1">
                            Correct answer: {q.options.find(o => o.id === q.correctAnswer)?.text}
                          </p>
                        )}
                        <p className="text-sm text-[#718096] mt-2 italic">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              {!passed && (
                <Button 
                  className="bg-[#0056D1]"
                  onClick={() => window.location.reload()}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A202C]">{quiz.title}</h1>
          <p className="text-[#718096]">{quiz.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            timeRemaining < 60 ? 'bg-red-100 text-red-600' : 'bg-[#E6F0FF] text-[#0056D1]'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#718096]">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm text-[#718096]">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card className="border-none shadow-lg mb-6">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <span className="w-10 h-10 bg-[#0056D1] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              {currentQuestionIndex + 1}
            </span>
            <h3 className="text-xl font-semibold text-[#1A202C] pt-2">
              {currentQuestion.question}
            </h3>
          </div>

          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={handleAnswerSelect}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedAnswer === option.id
                    ? 'border-[#0056D1] bg-[#E6F0FF]'
                    : 'border-[#E6F0FF] hover:border-[#0056D1]/50'
                }`}
              >
                <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                <Label 
                  htmlFor={option.id} 
                  className="flex-1 cursor-pointer flex items-center gap-3"
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                    selectedAnswer === option.id
                      ? 'bg-[#0056D1] text-white'
                      : 'bg-[#F8FAFC] text-[#718096]'
                  }`}>
                    {option.id.toUpperCase()}
                  </span>
                  <span className="text-[#1A202C]">{option.text}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentQuestionIndex(i);
                setSelectedAnswer(answers[quiz.questions[i].id] || '');
              }}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                i === currentQuestionIndex
                  ? 'bg-[#0056D1] text-white'
                  : answers[quiz.questions[i].id]
                  ? 'bg-green-100 text-green-600'
                  : 'bg-[#E6F0FF] text-[#718096]'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <Button
            className="bg-[#0056D1]"
            onClick={handleNext}
            disabled={!selectedAnswer}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={handleSubmit}
          >
            <Flag className="w-4 h-4 mr-2" />
            Submit Quiz
          </Button>
        )}
      </div>

      {/* Warning */}
      {timeRemaining < 120 && (
        <Alert className="mt-6 bg-red-50 border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <AlertDescription className="text-red-600">
            Less than 2 minutes remaining! Please submit your answers soon.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
