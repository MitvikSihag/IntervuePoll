import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RoleSelectionPage() {
  const [selected, setSelected] = useState("student");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selected === "student") navigate("/student");
    else navigate("/teacher");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-4">
      <span className="mb-6 bg-gradient-to-r from-primary-light to-primary text-white px-3 py-1 rounded-full">
        ✨ Intervue Poll
      </span>

      <h1 className="text-3xl sm:text-4xl mb-2 text-center">
        Welcome to the <span className="text-grayish-dark font-bold">Live Polling System</span>
      </h1>
      <p className="text-center text-grayish max-w-md mb-8">
        Please select the role that best describes you to begin using the live polling system
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div
          onClick={() => setSelected("student")}
          className={`cursor-pointer w-72 p-4 border rounded-lg shadow-sm transition 
            ${
              selected === "student"
                ? "border-primary-dark ring-1 ring-primary-dark bg-primary-light/10"
                : "border-gray-300 hover:border-primary-dark"
            }`}
        >
          <h2 className="font-bold text-lg text-grayish-dark mb-1">I’m a Student</h2>
          <p className="text-sm text-grayish">Participate in live polls and submit answers.</p>
        </div>

        <div
          onClick={() => setSelected("teacher")}
          className={`cursor-pointer w-72 p-4 border rounded-lg shadow-sm transition 
            ${
              selected === "teacher"
                ? "border-primary-dark ring-1 ring-primary-dark bg-primary-light/10"
                : "border-gray-300 hover:border-primary-dark"
            }`}
        >
          <h2 className="font-bold text-lg text-grayish-dark mb-1">I’m a Teacher</h2>
          <p className="text-sm text-grayish">Submit questions and view live poll results.</p>
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-[234px] bg-gradient-to-r from-primary-light to-primary text-white py-3 rounded-full font-semibold hover:from-primary-dark hover:to-primary transition"
      >
        Continue
      </button>
    </div>
  );
}

export default RoleSelectionPage;
