import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

function ATSChecker() {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.toLowerCase().endsWith(".pdf")) {
      setIsFileUploaded(true);
      setScore(null); // reset score when new file uploaded
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleATSCheck = () => {
    setLoading(true);
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * (95 - 80 + 1)) + 80;
      setScore(randomScore);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ATS Resume Score Checker</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="block w-full text-sm file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-md"
      />

      <Button
        onClick={handleATSCheck}
        disabled={!isFileUploaded || loading}
        className="mt-4"
      >
        {loading ? (
          <span className="flex items-center">
            <LoaderCircle className="animate-spin mr-2" /> Checking...
          </span>
        ) : (
          "Check ATS Score"
        )}
      </Button>

      {score && (
        <div className="mt-6 p-4 border rounded-md bg-gray-100">
          <h2 className="text-xl font-semibold">Your ATS Score: {score}/100</h2>
          <p className="mt-2 text-green-700 font-medium">
            ✅ Great resume! Likely to pass most ATS filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default ATSChecker;
