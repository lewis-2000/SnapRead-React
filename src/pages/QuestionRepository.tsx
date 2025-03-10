import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Question {
  id: number;
  text: string;
}

const QuestionRepository: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [queuedQuestions, setQueuedQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const addQuestion = () => {
    if (newQuestion.trim() === "") return;
    const question = { id: Date.now(), text: newQuestion };
    setQuestions([...questions, question]);
    setQueuedQuestions([...queuedQuestions, question]);
    setNewQuestion("");
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
    setQueuedQuestions(queuedQuestions.filter((q) => q.id !== id));
  };

  const sendQuestionsToStorage = async () => {
    try {
      const response = await fetch("https://your-storage-api.com/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queuedQuestions),
      });
      if (response.ok) {
        setQueuedQuestions([]);
        toast.success("Questions sent to storage successfully!");
      } else {
        toast.error("Failed to send questions to storage.");
      }
    } catch (error) {
      console.error("Error sending questions to storage:", error);
      toast.error("An error occurred while sending questions to storage.");
    }
  };

  const extractTextFromImage = (image: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(image);

    Tesseract.recognize(image, "eng", {
      logger: (m) => console.log(m),
    }).then(({ data: { text } }) => {
      setExtractedText(text);
      toast.info(
        "Text extracted. You can now select and add text to questions."
      );
    });
  };

  const startEditing = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion(question.text);
  };

  const saveEditedQuestion = () => {
    if (editingQuestion) {
      const updatedQuestions = questions.map((q) =>
        q.id === editingQuestion.id ? { ...q, text: newQuestion } : q
      );
      setQuestions(updatedQuestions);
      setQueuedQuestions(updatedQuestions);
      setEditingQuestion(null);
      setNewQuestion("");
    }
  };

  const addSelectedTextToQuestions = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.trim() !== "") {
      const question = { id: Date.now(), text: selectedText.trim() };
      setQuestions([...questions, question]);
      setQueuedQuestions([...queuedQuestions, question]);
    }
  };

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

      {/* Add/Edit Question Form */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <input
          type="text"
          placeholder="Enter a question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="border px-4 py-2 w-full rounded-lg text-black"
          title="Enter a question here"
        />
        {editingQuestion ? (
          <button
            onClick={saveEditedQuestion}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
            title="Save the edited question"
          >
            Save
          </button>
        ) : (
          <button
            onClick={addQuestion}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            title="Add the question"
          >
            Add
          </button>
        )}
      </div>

      {/* Upload Image for Text Extraction */}
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
            if (e.target.files && e.target.files[0]) {
              extractTextFromImage(e.target.files[0]);
            }
          }}
          className="hidden"
        />
        <p>Drag and drop an image here or click to upload</p>
      </div>

      {/* Display Selected Image and Extracted Text */}
      {selectedImage && (
        <div className="flex flex-col md:flex-row mb-4">
          <div className="w-full md:w-1/2 pr-0 md:pr-2 mb-4 md:mb-0">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full rounded-lg"
            />
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-2 relative">
            <textarea
              ref={textAreaRef}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="border px-4 py-2 w-full h-40 rounded-lg text-black"
              title="Edit the extracted text here"
            />
            <button
              onClick={addSelectedTextToQuestions}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              title="Add selected text to questions"
            >
              Add Selected Text to Questions
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <ul className="mb-4">
        {questions.map((q) => (
          <li
            key={q.id}
            className="flex justify-between items-center bg-gray-800 p-3 rounded-lg mb-2"
          >
            <span>{q.text}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => startEditing(q)}
                className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition"
                title="Edit this question"
              >
                Edit
              </button>
              <button
                onClick={() => deleteQuestion(q.id)}
                className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition"
                title="Delete this question"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Send Questions to Storage */}
      <button
        onClick={sendQuestionsToStorage}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        title="Send all questions to storage"
      >
        Send to Storage
      </button>
    </div>
  );
};

export default QuestionRepository;
