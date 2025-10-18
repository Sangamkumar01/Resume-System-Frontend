import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";

const formTemplate = {
  universityName: "",
  degree: "",
  major: "",
  grade: "",
  gradeType: "CGPA",
  startDate: "",
  endDate: "",
  description: "",
};

function Education({ resumeInfo, enanbledNext }) {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [educationList, setEducationList] = useState(resumeInfo?.education || [{ ...formTemplate }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, education: educationList }));
  }, [educationList]);

  const addNewEducation = () => {
    setEducationList((prev) => [...prev, { ...formTemplate }]);
  };

  const removeEducation = (index) => {
    if (educationList.length === 1) {
      toast("At least one education entry is required");
      return;
    }
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedList = educationList.map((edu, i) =>
      i === index ? { ...edu, [name]: value } : edu
    );
    setEducationList(updatedList);
  };

  const onSave = async () => {
    if (!educationList.length) {
      toast.error("Please add at least one education entry");
      return;
    }
    setLoading(true);
    try {
      if (!resume_id) throw new Error("Resume ID not found");
      await updateThisResume(resume_id, { data: { education: educationList } });
      toast("Education section saved successfully");
      enanbledNext && enanbledNext(true);
    } catch (error) {
      toast.error("Error updating education: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-blue-600 mt-10">
      <h2 className="font-bold text-lg text-blue-700">Education</h2>
      <p className="text-sm text-gray-600">Add your educational details</p>

      <div>
        {educationList.map((edu, index) => (
          <div key={index} className="my-5 p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-blue-600">Education {index + 1}</h3>
              <Button
                variant="outline"
                className="text-red-600 border-red-300 hover:text-red-800"
                onClick={() => removeEducation(index)}
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-gray-600">University Name</label>
                <Input
                  name="universityName"
                  value={edu.universityName}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="e.g., XYZ University"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Degree</label>
                <Input
                  name="degree"
                  value={edu.degree}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="e.g., B.Tech"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Major</label>
                <Input
                  name="major"
                  value={edu.major}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  value={edu.startDate}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={edu.endDate}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-600">Grade</label>
                <div className="flex items-center gap-4">
                  <select
                    name="gradeType"
                    className="py-2 px-4 border border-gray-300 rounded-md text-sm"
                    value={edu.gradeType}
                    onChange={(e) => handleChange(e, index)}
                  >
                    <option value="CGPA">CGPA</option>
                    <option value="GPA">GPA</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                  <Input
                    name="grade"
                    value={edu.grade}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="e.g., 8.5"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-600">Description</label>
                <Textarea
                  name="description"
                  value={edu.description}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Describe your coursework, achievements, etc."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button
          onClick={addNewEducation}
          variant="outline"
          className="text-blue-600 border-blue-300 hover:border-blue-600"
        >
          + Add More Education
        </Button>
        <Button
          onClick={onSave}
          disabled={loading}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Education;
