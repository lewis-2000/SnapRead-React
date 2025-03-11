import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Question {
  id: number;
  text: string;
  options: string[];
  answer: string;
  form: string;
  class: string;
}

const API_URL = "http://localhost:8000/questions/";

const QuestionRepository: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedForm, setSelectedForm] = useState("Form 1");
  const [selectedClass, setSelectedClass] = useState("A");
  const [options, setOptions] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ✅ Extract text from image using Tesseract.js
  const extractTextFromImage = (image: File) => {
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(image);

    Tesseract.recognize(image, "eng", { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        setExtractedText(text);
        toast.info("Text extracted successfully!");
      })
      .catch(() => toast.error("Failed to extract text."));
  };

  // ✅ Fill the form with selected text for editing
  const fillFormWithSelectedText = () => {
    const selectedText = window.getSelection()?.toString().trim();
    if (!selectedText) {
      toast.warn("No text selected!");
      return;
    }

    setNewQuestion(selectedText);
    toast.success("Selected text added to form for editing.");
  };

  // ✅ Send question to FastAPI backend
  const sendQuestionToBackend = async (question: Question) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      });

      if (!response.ok) throw new Error("Failed to save question.");

      toast.success("Question saved to backend!");
    } catch {
      toast.error("Error saving question.");
    }
  };

  // ✅ Add a new question from the form
  const addQuestion = () => {
    if (!newQuestion.trim()) {
      toast.warn("Question text is empty!");
      return;
    }

    const question: Question = {
      id: Date.now(),
      text: newQuestion.trim(),
      options: options.filter((opt) => opt.trim() !== ""),
      answer: answer.trim(),
      form: selectedForm,
      class: selectedClass,
    };

    setQuestions((prev) => [...prev, question]);
    sendQuestionToBackend(question);
    resetForm();
  };

  // ✅ Reset form inputs
  const resetForm = () => {
    setNewQuestion("");
    setOptions([]);
    setAnswer("");
  };

  // ✅ Handle file drop
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      extractTextFromImage(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="p-6 text-black min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-4">Question Repository</h1>

      {/* Message for Drag and Drop */}
      <p className="mb-4 text-gray-700">
        Drag and drop an image file below or click to upload for text
        extraction.
      </p>

      {/* Question Input Form */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter a question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="border px-4 py-2 w-full rounded-lg text-black"
        />
        <input
          type="text"
          placeholder="Enter options (comma separated)"
          value={options.join(", ")}
          onChange={(e) =>
            setOptions(e.target.value.split(",").map((opt) => opt.trim()))
          }
          className="border px-4 py-2 w-full rounded-lg text-black"
        />
        <input
          type="text"
          placeholder="Enter the answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="border px-4 py-2 w-full rounded-lg text-black"
        />
        <select
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option>Form 1</option>
          <option>Form 2</option>
          <option>Form 3</option>
          <option>Form 4</option>
        </select>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
        </select>
        <button
          onClick={addQuestion}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Image Upload */}
      <div
        className="mb-4 border-2 border-dashed border-gray-500 p-4 rounded-lg text-center cursor-pointer"
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
        title="Drag and drop an image here or click to upload"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) extractTextFromImage(e.target.files[0]);
          }}
          className="hidden"
        />
        <p>Drag and drop an image here or click to upload</p>
      </div>

      {/* Image and Extracted Text Side by Side */}
      <div className="flex gap-4 mt-6">
        {/* Uploaded Image */}
        {selectedImage && (
          <div className="w-1/2">
            <img
              src={selectedImage}
              alt="Uploaded"
              className="w-full rounded-lg border shadow-lg"
            />
          </div>
        )}

        {/* Extracted Text */}
        {extractedText && (
          <div className="w-1/2">
            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="border p-2 w-full h-40"
            ></textarea>
            <div className="flex gap-2 mt-2">
              <button
                onClick={fillFormWithSelectedText}
                className="bg-blue-600 text-white px-4 py-2"
              >
                Add Selected Text
              </button>
              <button
                onClick={() => setExtractedText("")}
                className="bg-gray-600 text-white px-4 py-2"
              >
                Clear Extracted Text
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Display Added Questions */}
      {questions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Added Questions</h2>
          <ul className="border p-4 rounded-lg bg-gray-100">
            {questions.map((q) => (
              <li key={q.id} className="border-b p-2">
                <strong>{q.text}</strong>
                {q.options.length > 0 && <p>Options: {q.options.join(", ")}</p>}
                {q.answer && <p>Answer: {q.answer}</p>}
                <p>
                  Form: {q.form}, Class: {q.class}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestionRepository;
