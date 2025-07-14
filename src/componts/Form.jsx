import { useState } from "react";
import axios from "axios";

const API_URL = "https://localhost:3000/api/v1/getAllQuestions"; 

function Form({ onAddQuestion }) {
    const [question, setQuestion] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleQuestionChange = (e) => setQuestion(e.target.value);
    const handleTypeChange = (e) => setSelectedType(e.target.value);

    const postData = async () => {
        if (!question || !selectedType) {
            setMessage("❌ Please fill both question and type.");
            setIsError(true);
            return;
        }

        const payload = { question, type: selectedType };
        console.log("Sending payload:", payload);

        try {
            await axios.post(API_URL, payload, {
                headers: { "Content-Type": "application/json" },
            });

            if (onAddQuestion) onAddQuestion();

            setQuestion("");
            setSelectedType("");
            setMessage("✅ Question submitted successfully!");
            setIsError(false);
        } catch (error) {
            setMessage("❌ Failed to submit data: " + error.message);
            setIsError(true);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gradient-to-br from-blue-100 to-white border-2 border-blue-400 rounded-xl shadow-lg">
            <div className="w-full flex flex-col items-center">
                <h2 className="text-2xl font-bold text-blue-500 text-center mb-6">
                    Ask a Question
                </h2>
            </div>

            {/* Question Input */}
            <div className="mb-4">
                <label htmlFor="question" className="block text-gray-700 mb-2 text-center">
                    Enter your question:
                </label>
                <input
                    type="text"
                    id="question"
                    placeholder="Enter your question"
                    value={question}
                    onChange={handleQuestionChange}
                    className="w-full px-4 py-2 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-orange-400 transition"
                />
            </div>

            {/* Radio Buttons for Type */}
            <div className="mb-4">
                <p className="text-gray-700 mb-2 text-center">Select input type:</p>
                <div className="flex flex-wrap gap-4 justify-center">
                    {["input", "button", "radio", "checkbox"].map((type) => (
                        <label key={type} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="type"
                                value={type}
                                checked={selectedType === type}
                                onChange={handleTypeChange}
                                className="accent-blue-500"
                            />
                            <span className="text-gray-700">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Message display */}
            {message && (
                <p
                    className={`text-center mb-4 font-medium ${
                        isError ? "text-red-600" : "text-green-600"
                    }`}
                >
                    {message}
                </p>
            )}

            {/* Submit Button */}
            <button
                onClick={postData}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-orange-400 transition font-semibold"
            >
                Submit
            </button>
        </div>
    );
}

export default Form;
