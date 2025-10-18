import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/custom/RichTextEditor";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";

const formTemplate = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  workSummary: "",
};

function Experience({ resumeInfo, enanbledNext, enanbledPrev }) {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [experienceList, setExperienceList] = useState(resumeInfo?.experience || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, experience: experienceList }));
  }, [experienceList]);

  const addExperience = () => {
    setExperienceList((prev) => [...prev, formTemplate]);
  };

  const removeExperience = (index) => {
    setExperienceList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    const { name, value, type, checked } = e.target;
    const updatedList = experienceList.map((exp, i) =>
      i === index ? { ...exp, [name]: type === "checkbox" ? checked : value } : exp
    );
    setExperienceList(updatedList);
  };

  const handleRichTextChange = (value, name, index) => {
    const updatedList = experienceList.map((exp, i) =>
      i === index ? { ...exp, [name]: value } : exp
    );
    setExperienceList(updatedList);
  };

  const onSave = async () => {
    setLoading(true);
    try {
      if (!resume_id) throw new Error("Resume ID missing");
      const data = { data: { experience: experienceList } };
      await updateThisResume(resume_id, data);
      toast("Resume Updated", { description: "Experience section saved successfully" });
      enanbledNext(true);
      enanbledPrev(true);
    } catch (error) {
      toast(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-blue-600 mt-10">
      <h2 className="font-bold text-lg text-blue-700">Experience</h2>
      <p className="text-sm text-gray-600">Add your previous job experiences</p>

      {experienceList.map((exp, index) => (
        <div key={index} className="my-5 p-4 border rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-blue-600">Experience {index + 1}</h3>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-800 border-red-300"
              onClick={() => removeExperience(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600">Position Title</label>
              <Input
                name="title"
                value={exp.title}
                onChange={(e) => handleChange(e, index)}
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Company Name</label>
              <Input
                name="companyName"
                value={exp.companyName}
                onChange={(e) => handleChange(e, index)}
                placeholder="e.g., ABC Corp"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">City</label>
              <Input
                name="city"
                value={exp.city}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">State</label>
              <Input
                name="state"
                value={exp.state}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Start Date</label>
              <Input
                type="date"
                name="startDate"
                value={exp.startDate}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">End Date</label>
              <Input
                type="date"
                name="endDate"
                value={exp.endDate}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-600">Work Summary</label>
              <RichTextEditor
                index={index}
                defaultValue={exp.workSummary}
                onRichTextEditorChange={(value) => handleRichTextChange(value, "workSummary", index)}
                resumeInfo={resumeInfo}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <Button
          onClick={addExperience}
          variant="outline"
          className="text-blue-600 border-blue-300 hover:border-blue-600"
        >
          + Add {experienceList?.length > 0 ? "More" : ""} Experience
        </Button>
        <Button onClick={onSave} className="bg-blue-600 text-white hover:bg-blue-700">
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Experience;
