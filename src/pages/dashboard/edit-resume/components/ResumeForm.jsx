import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import PersonalDetails from "./form-components/PersonalDetails";
import Summary from "./form-components/Summary";
import Experience from "./form-components/Experience";
import Education from "./form-components/Education";
import Skills from "./form-components/Skills";
import Project from "./form-components/Project";
import { ArrowLeft, ArrowRight, HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeColor from "./ThemeColor";

function ResumeForm() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enabledNext, setEnabledNext] = useState(true);
  const [enabledPrev, setEnabledPrev] = useState(false);
  const resumeInfo = useSelector((state) => state.editResume.resumeData);

  useEffect(() => {
    if (currentIndex === 0) {
      setEnabledPrev(false);
    } else {
      setEnabledPrev(true);
    }

    if (currentIndex === 5) {
      setEnabledNext(false);
    } else {
      setEnabledNext(true);
    }
  }, [currentIndex]);

  return (
    <div className="flex flex-col gap-5">
      {/* Top Bar with Navigation */}
      <div className="flex justify-between items-center p-3">
        <div className="flex gap-2 items-center">
          <Link to="/dashboard">
            <Button
              size="sm"
              variant="ghost"
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
            >
              <HomeIcon className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <ThemeColor resumeInfo={resumeInfo} />
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
              }
            }}
            disabled={!enabledPrev}
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
            onClick={() => {
              if (currentIndex < 5) {
                setCurrentIndex(currentIndex + 1);
              }
            }}
            disabled={!enabledNext}
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Form Sections */}
      {currentIndex === 0 && (
        <PersonalDetails resumeInfo={resumeInfo} enanbledNext={setEnabledNext} />
      )}
      {currentIndex === 1 && (
        <Summary
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enanbledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 2 && (
        <Experience
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enanbledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 3 && (
        <Project
          resumeInfo={resumeInfo}
          setEnabledNext={setEnabledNext}
          setEnabledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 4 && (
        <Education
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enanbledPrev={setEnabledPrev}
        />
      )}
      {currentIndex === 5 && (
        <Skills
          resumeInfo={resumeInfo}
          enanbledNext={setEnabledNext}
          enanbledPrev={setEnabledPrev}
        />
      )}
    </div>
  );
}

export default ResumeForm;
