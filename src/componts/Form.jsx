import { useState } from "react";
import axios from "axios";

function Form() {
    const [question, setQuestion] = useState("");
    const [selectedType, setSelectedType] = useState("");

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    // ✅ Axios POST Function
    const postData = async () => {
        if (!question || !selectedType) {
            alert("Please fill both question and type");
            return;
        }

        const payload = {
            question: question,
            type: selectedType
        };

        try {
            const response = await axios.post("http://45.250.277.161:3000/api/v1/createQuestions",question );
            console.log("Success:", response);
            alert("Question submitted!");
        } catch (error) {
            console.error("Error posting data:", error);
            alert("Failed to submit data");
        }
    };

    return (
        <div>
            <h2>Ask a Question</h2>

            {/* Question input */}
            <div>
                <input
                    type="text"
                    placeholder="Enter your question"
                    value={question}
                    onChange={handleQuestionChange}
                />
            </div>

            {/* Radio buttons for input type */}
            <div style={{ marginTop: "10px" }}>
                <p>Select input type:</p>
                {["inp", "save", "redio", "checkbox"].map((type) => (
                    <label key={type} style={{ marginRight: "15px" }}>
                        <input
                            type="radio"
                            name="type"
                            value={type}
                            checked={selectedType === type}
                            onChange={handleTypeChange}
                        />
                        {type}
                    </label>
                ))}
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: "20px" }}>
                <button onClick={postData}>Submit</button>
            </div>
        </div>
    );
}

export default Form;
