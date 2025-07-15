import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/createQuetions";
const del_api = "http://localhost:3000/api/v1/deleteData/";
const update_api = "http://localhost:3000/api/v1/updateData/";

function Table() {
  const [data, setData] = useState([
       {
      _id: "1",
      question: "What is your name?",
      questionType: "input",
      answer: "",
    },
    {
      _id: "2",
      question: "What is your gender?",
      questionType: "radio",
      answer: "",
    },
    {
      _id: "3",
      question: "Select your hobbies",
      questionType: "checkbox",
      answer: "",
    },
  ]);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(res.data.allData || []);
    } catch (error) {
      setMessage("❌ Failed to fetch data: " + error.message);
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const HandleDelete = async (id) => {
    try {
      await axios.delete(`${del_api}${id}`);
      setMessage("✅ Question deleted successfully!");
      setIsError(false);
      setData((prevData) => prevData.filter((item) => item._id !== id));
    } catch (error) {
      setMessage("❌ Failed to delete question: " + error.message);
      setIsError(true);
    }
  };

  const HandleEdit = async (id) => {
    const item = data.find((q) => q._id === id);

    if (!item) {
      setMessage("❌ Question not found.");
      setIsError(true);
      return;
    }

    try {
      await axios.put(`${update_api}${id}`, {
        question: item.question,
        questionType: item.questionType,
      });

      setMessage("✅ Question updated successfully!");
      setIsError(false);
      fetchData();
    } catch (error) {
      setMessage("❌ Failed to update question: " + error.message);
      setIsError(true);
    }
  };

  const renderInput = (q) => {
    const value = answers[q._id] || "";

    switch (q.questionType) {
      case "input":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(q._id, e.target.value.trim())}
            className="w-full p-2 border rounded"
          />
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={value === true || value === "true"}
            onChange={(e) => handleChange(q._id, e.target.checked)}
          />
        );
      case "radio":
        return (
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name={`radio-${q._id}`}
                value="male"
                checked={value === "male"}
                onChange={(e) => handleChange(q._id, e.target.value)}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name={`radio-${q._id}`}
                value="female"
                checked={value === "female"}
                onChange={(e) => handleChange(q._id, e.target.value)}
              />
              Female
            </label>
          </div>
        );
      case "button":
        return (
          <button
            onClick={() => handleChange(q._id, "Clicked")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Are you sure?
          </button>
        );
      default:
        return <span className="text-gray-500">Unsupported type</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 space-y-10">
      {message && (
        <p
          className={`text-center font-medium ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      {data.length > 0 && (
        <div className="p-6 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-300 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-blue-600 text-center mb-6">
            📋 All Submitted Questions
          </h3>
          <ul className="space-y-4 flex flex-col items-center">
            {data.map((item, index) => (
              <li
                key={index}
                className="w-full max-w-xl bg-white border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-800 font-medium mb-2">
                  <strong>Q:</strong> {item.question}
                </p>
                <div className="mb-2">{renderInput(item)}</div>
                <div className="mt-3 flex gap-3 justify-center">
                  <button
                    onClick={() => HandleEdit(item._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition duration-200"
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => HandleDelete(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
                  >
                    🗑 Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Table;
