import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import SimpeRichTextEditor from "@/components/custom/SimpeRichTextEditor";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";

const formFields = {
  projectName: "",
  techStack: "",
  projectSummary: "",
};

function Project({ resumeInfo, setEnabledNext, setEnabledPrev }) {
  const [projectList, setProjectList] = useState(resumeInfo?.projects || []);
  const [loading, setLoading] = useState(false);
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, projects: projectList }));
  }, [projectList]);

  const addProject = () => {
    setProjectList([...projectList, formFields]);
  };

  const removeProject = (index) => {
    const newList = projectList.filter((_, i) => i !== index);
    setProjectList(newList);
  };

  const handleChange = (e, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);
    const { name, value } = e.target;
    const list = [...projectList];
    list[index] = { ...list[index], [name]: value };
    setProjectList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...projectList];
    list[index] = { ...list[index], [name]: value };
    setProjectList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        projects: projectList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Project");
      updateThisResume(resume_id, data)
        .then(() => {
          toast("Resume Updated", "success");
        })
        .catch((error) => {
          toast("Error updating resume", `${error.message}`);
        })
        .finally(() => {
          setEnabledNext(true);
          setEnabledPrev(true);
          setLoading(false);
        });
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-blue-600 bg-blue-50/10 mt-10">
      <h2 className="font-bold text-lg text-blue-800">Project</h2>
      <p className="text-sm text-blue-700">Add your projects</p>

      <div>
        {projectList?.map((project, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-center my-2">
              <h3 className="font-bold text-lg text-blue-700">Project {index + 1}</h3>
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => removeProject(index)}
              >
                <Trash2 size={18} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 border border-blue-300/50 bg-blue-100/20 p-3 rounded-lg shadow-sm">
              <div>
                <label className="text-xs text-blue-600">Project Name</label>
                <Input
                  type="text"
                  name="projectName"
                  value={project?.projectName}
                  placeholder="e.g., Portfolio Website"
                  onChange={(e) => handleChange(e, index)}
                  className="text-blue-900"
                />
              </div>

              <div>
                <label className="text-xs text-blue-600">Tech Stack</label>
                <Input
                  type="text"
                  name="techStack"
                  value={project?.techStack}
                  placeholder="React, Node.js, Express, MongoDB"
                  onChange={(e) => handleChange(e, index)}
                  className="text-blue-900"
                />
              </div>

              <div className="col-span-2">
                <SimpeRichTextEditor
                  index={index}
                  defaultValue={project?.projectSummary}
                  onRichTextEditorChange={(event) =>
                    handleRichTextEditor(event, "projectSummary", index)
                  }
                  resumeInfo={resumeInfo}
                />
              </div>
              
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between py-2">
        <Button
          onClick={addProject}
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-100"
        >
          + Add {resumeInfo?.experience?.length > 0 ? "more" : ""} project
        </Button>
        <Button
          onClick={onSave}
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Project;
