import React, { useState } from "react";
import { Sparkles, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";
import { updateThisResume } from "@/Services/resumeAPI";

const prompt = `
Given the job title "{jobTitle}", generate a list of 3 summary entries — one for each experience level: "Fresher", "Mid-Level", and "Senior". 
Each summary should be 3–4 lines and provided as a JSON array with this format:

[
  {
    "experience_level": "Fresher",
    "summary": "..."
  },
  {
    "experience_level": "Mid-Level",
    "summary": "..."
  },
  {
    "experience_level": "Senior",
    "summary": "..."
  }
]

Return only the JSON. Do not include any explanations or markdown formatting.
`;

function Summary({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);
  const { resume_id } = useParams();

  const handleInputChange = (e) => {
    enanbledNext(false);
    enanbledPrev(false);
    const newSummary = e.target.value;
    setSummary(newSummary);
    dispatch(addResumeData({ ...resumeInfo, [e.target.name]: newSummary }));
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { data: { summary } };

    if (resume_id) {
      updateThisResume(resume_id, data)
        .then(() => toast("Resume Updated", { type: "success" }))
        .catch((error) => toast("Error updating resume", { description: error.message }))
        .finally(() => {
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  };

  const setSummery = (summary) => {
    dispatch(addResumeData({ ...resumeInfo, summary }));
    setSummary(summary);
  };

  const GenerateSummeryFromAI = async () => {
    setLoading(true);
    if (!resumeInfo?.jobTitle) {
      toast("Please Add Job Title");
      setLoading(false);
      return;
    }

    const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.jobTitle);
    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      const text = await result.response.text();
      let parsed = null;

      try {
        parsed = JSON.parse(text);
      } catch (err) {
        console.error("Invalid JSON from AI:", text);
        toast("AI response is not valid JSON", { description: "Check console for more details." });
        setAiGenerateSummeryList([]);
        return;
      }

      if (!Array.isArray(parsed)) {
        toast("AI did not return a list of summaries.");
        console.error("AI returned non-array data:", parsed);
        setAiGenerateSummeryList([]);
        return;
      }

      setAiGenerateSummeryList(parsed);
      toast("Summary Generated", { type: "success" });
    } catch (error) {
      console.error("Error generating summary from AI:", error);
      toast("Failed to generate summary", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-xl border-t-4 border-blue-500 mt-10">
      <h2 className="font-bold text-lg text-blue-600">Summary</h2>
      <p className="text-sm text-gray-600">Add Summary for your job title</p>

      <form className="mt-7" onSubmit={onSave}>
        <div className="flex justify-between items-end">
          <label className="text-sm text-gray-700 font-medium">Add Summary</label>
          <Button
            variant="outline"
            onClick={GenerateSummeryFromAI}
            type="button"
            size="sm"
            className="border-blue-500 text-blue-500 flex gap-2"
          >
            <Sparkles className="h-4 w-4" /> Generate from AI
          </Button>
        </div>
        <Textarea
          name="summary"
          className="mt-5"
          required
          value={summary || resumeInfo?.summary}
          onChange={handleInputChange}
        />
        <div className="mt-2 flex justify-end">
          <Button type="submit" disabled={loading} className="bg-blue-500 text-white">
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>

      {Array.isArray(aiGeneratedSummeryList) && aiGeneratedSummeryList.length > 0 && (
        <div className="my-5">
          <h2 className="font-bold text-lg text-blue-600">Suggestions</h2>
          {aiGeneratedSummeryList.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                enanbledNext(false);
                enanbledPrev(false);
                setSummery(item?.summary);
              }}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer border border-blue-300 hover:bg-blue-50 transition"
            >
              <h2 className="font-bold my-1 text-blue-500">
                Level: {item?.experience_level}
              </h2>
              <p className="text-gray-700">{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
