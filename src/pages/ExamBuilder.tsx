import React, { useEffect, useState } from "react";
import axios from "axios";

interface Question {
  id: number;
  text: string;
  options: string[];
  answer: string;
}

const ExamBuilder: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState<string>(""); // Exam title
  const [examId, setExamId] = useState<number | null>(null); // Store created exam ID
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/questions/");
        setQuestions(response.data);
      } catch (err) {
        setError("Error fetching questions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Add or remove a question from the selection
  const toggleQuestionSelection = (question: Question) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.some((q) => q.id === question.id)) {
        return prevSelected.filter((q) => q.id !== question.id); // Remove if already selected
      } else {
        return [...prevSelected, question]; // Add new question
      }
    });
  };

  // Submit selected questions to the backend
  const createExam = async () => {
    if (!examTitle.trim()) {
      alert("Please enter an exam title.");
      return;
    }
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/exams/", {
        title: examTitle,
        question_ids: selectedQuestions.map((q) => q.id),
      });

      setExamId(response.data.id); // Store the created exam ID
      alert("Exam created successfully!");
    } catch (err) {
      console.error("Error creating exam", err);
      alert("Failed to create exam.");
    }
  };

  // Download the exam PDF
  const downloadExamPDF = () => {
    if (!examId) {
      alert("No exam created yet.");
      return;
    }
    window.open(`http://127.0.0.1:8000/exams/${examId}/export/`, "_blank");
  };

  // Download the marking scheme PDF
  const downloadMarkingSchemePDF = () => {
    if (!examId) {
      alert("No exam created yet.");
      return;
    }
    window.open(
      `http://127.0.0.1:8000/exams/${examId}/export/marking_scheme`,
      "_blank"
    );
  };

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Exam Builder</h1>
      <p>Create and structure your exams here.</p>

      {/* Exam Title Input */}
      <div className="mt-4">
        <label className="block font-semibold">Exam Title:</label>
        <input
          type="text"
          value={examTitle}
          onChange={(e) => setExamTitle(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter exam title..."
        />
      </div>

      {/* Available Questions */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Available Questions</h2>
        <ul className="mt-4">
          {questions.map((question) => (
            <li
              key={question.id}
              className={`mb-4 p-4 border rounded-md ${
                selectedQuestions.some((q) => q.id === question.id)
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300"
              }`}
            >
              <h3 className="font-bold">{question.text}</h3>
              <ul>
                {question.options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-500">Answer: {question.answer}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={() => toggleQuestionSelection(question)}
              >
                {selectedQuestions.some((q) => q.id === question.id)
                  ? "Remove from Exam"
                  : "Add to Exam"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Selected Questions */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Selected Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <div
              key={question.id}
              className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
            >
              <h3 className="font-semibold text-lg text-gray-800">
                {question.text}
              </h3>
              <ul className="mt-2">
                {question.options.map((option, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2 text-gray-500">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </li>
                ))}
              </ul>
              <button className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition">
                Add to Exam
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Exam Button */}
      <button
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md"
        onClick={createExam}
      >
        Create Exam
      </button>

      {/* Export Buttons */}
      {examId && (
        <div className="mt-4">
          <button
            className="mr-2 px-4 py-2 bg-purple-500 text-white rounded-md"
            onClick={downloadExamPDF}
          >
            Download Exam PDF
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={downloadMarkingSchemePDF}
          >
            Download Marking Scheme
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamBuilder;
