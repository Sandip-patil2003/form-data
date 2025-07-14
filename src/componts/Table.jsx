import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = "https://localhost:3000/api/v1/getAllQuestions";

function DynamicQuestionForm() {
    const [questions, setQuestions] = useState([
        { id: 0, question: 'What is your favorite color?', type: 'input' },
       
    ]);

    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState([
        { id: 999, question: 'What is your name?', answer: 'John Doe' }
    ]);

    const fetchQuestions = async () => {
        try {
            const res = await axios.get(API_URL);
            setQuestions(res.data);
            console.log(res);
        } catch (err) {
            console.log("API fetch failed, using default questions" +err.message);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleChange = (id, value) => {
        setAnswers(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSave = () => {
        const result = questions.map((q) => ({
            id: q.id,
            question: q.question,
            answer: answers[q.id] || ''
        }));

        setSubmitted(prev => [...prev, ...result]);
        setAnswers({});
    };

    const handleDelete = (id) => {
        setSubmitted(prev => prev.filter(item => item.id !== id));
    };

    // ✅ POST edited row to API
    const handleEdit = async (row) => {
        try {
            await axios.post(API_URL, {
                id: row.id,
                question: row.question,
                answer: row.answer
            });
            alert('Row posted successfully to API');
        } catch (error) {
            alert('Failed to post row');
        }
    };

    const renderInput = (q) => {
        const value = answers[q.id] || "";

        switch (q.type) {
            case 'input':
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                );
            case 'checkbox':
                return (
                    <input
                        type="checkbox"
                        checked={value === true || value === 'true'}
                        onChange={(e) => handleChange(q.id, e.target.checked)}
                    />
                );
            case 'radio':
                return (
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name={`radio-${q.id}`}
                                value="male"
                                checked={value === "male"}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name={`radio-${q.id}`}
                                value="female"
                                checked={value === "female"}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                            />
                            Female
                        </label>
                    </div>
                );
            default:
                return <span className="text-gray-500">Unsupported type</span>;
        }
    };

   // ... imports and state logic remain the same

return (
    <div className="min-h-screen bg-white p-6">
        <div className="max-w-3xl mx-auto p-6 bg-gradient-to-b from-blue-100 to-white border-2 border-blue-300 rounded-xl shadow-md">
            <h2 className="text-3xl text-center font-bold text-blue-600 mb-6">Answer the Questions</h2>

            {/* Input section */}
            <div className="space-y-6 mb-8">
                {questions.map((q) => (
                    <div key={q.id}>
                        <label className="block text-center text-gray-700 font-medium mb-2">
                            {q.question}
                        </label>
                        <div className="flex justify-center">
                            {renderInput(q)}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-orange-500 text-white font-bold py-2 rounded-lg transition"
            >
                Save Answers
            </button>
        </div>

        {/* Table */}
        {submitted.length > 0 && (
            <div className="max-w-3xl mx-auto mt-12 p-6 bg-gradient-to-b from-white to-blue-50 border-2 border-blue-300 rounded-xl shadow">
                <h3 className="text-2xl text-center font-bold text-blue-500 mb-4">Submitted Answers</h3>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-blue-300 rounded">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="py-2 px-4 border text-blue-700">ID</th>
                                <th className="py-2 px-4 border text-blue-700">Question</th>
                                <th className="py-2 px-4 border text-blue-700">Answer</th>
                                <th className="py-2 px-4 border text-blue-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submitted.map((row, index) => (
                                <tr key={row.id + '-' + index} className="text-center">
                                    <td className="py-2 px-4 border">{index + 1}</td>
                                    <td className="py-2 px-4 border">{row.question}</td>
                                    <td className="py-2 px-4 border">{row.answer.toString()}</td>
                                    <td className="py-2 px-4 border space-x-2">
                                        <button
                                            onClick={() => handleEdit(row)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(row.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
);

}

export default DynamicQuestionForm;
