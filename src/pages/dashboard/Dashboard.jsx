import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllResumeData } from "@/Services/resumeAPI";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";

function Dashboard() {
  const user = useSelector((state) => state.editUser.userData);
  const [resumeList, setResumeList] = React.useState([]);

  const fetchAllResumeData = async () => {
    try {
      const resumes = await getAllResumeData();
      console.log(
        `Printing from DashBoard List of Resumes got from Backend`,
        resumes.data
      );
      setResumeList(resumes.data);
    } catch (error) {
      console.log("Error from dashboard", error.message);
    }
  };

  useEffect(() => {
    fetchAllResumeData();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#121212] p-10 md:px-20 lg:px-32 text-gray-300">
      <header className="mb-10">
        <h2 className="text-4xl font-extrabold text-white tracking-tight">My Resumes</h2>
        <p className="mt-2 text-gray-400 text-lg">
          Start creating your AI resume for your next job role
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Add Resume card with plus icon and text */}
        <AddResume />

        {resumeList.length > 0 ? (
          resumeList.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              refreshData={fetchAllResumeData}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No resumes found. Create one to get started!
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
