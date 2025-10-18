import Header from "@/components/custom/Header";
import React, { useEffect } from "react";
import heroSnapshot from "@/assets/heroSnapshot.jpg";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaInfoCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { startUser } from "../../Services/login.js";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "@/features/user/userFeatures.js";

function HomePage() {
  const user = useSelector((state) => state.editUser.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await startUser();
        if (response.statusCode === 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(null));
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        dispatch(addUserData(null));
      }
    };
    fetchResponse();
  }, [dispatch]);

  const handleGetStartedClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth/sign-in");
    }
  };

  const handleLearnMoreClick = () => {
    window.open("https://github.com/Sangamkumar01", "_blank");
  };

  // Custom simple logo component (replace with your own logo file if needed)
  const Logo = () => (
    <svg
      className="w-10 h-10 text-blue-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 17l10 5 10-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12l10 5 10-5" />
    </svg>
  );

  return (
    <>
      {/* Override Header to include new logo */}
      <Header user={user} logo={<Logo />} darkMode={true} />

      <main className="min-h-screen bg-gray-900 flex flex-col justify-center">
        <section className="container mx-auto px-6 md:px-12 lg:px-20 py-20 flex flex-col md:flex-row items-center gap-12">
          {/* Left Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight text-white">
              Build your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
               Verified
              </span>{" "}
              <br />
              Dynamic Resume
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-lg mx-auto md:mx-0">
              Create a smart, auto-updating resume powered by your real achievements — internships, courses, projects, and hackathons.
            </p>

            <div className="flex flex-col sm:flex-row sm:justify-start gap-4 max-w-xs mx-auto md:mx-0">
              <Button
                onClick={handleGetStartedClick}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-full shadow-lg hover:from-blue-700 hover:to-cyan-600 transition"
              >
                Get Started
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/tools/ats-checker")}
                className="px-8 py-3 rounded-full border border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition"
              >
                Check ATS Score
              </Button>

              <Button
                variant="ghost"
                onClick={handleLearnMoreClick}
                className="px-8 py-3 rounded-full text-gray-400 hover:text-blue-400 transition flex items-center justify-center gap-2"
              >
                Learn More <FaInfoCircle />
              </Button>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="shadow-2xl rounded-xl overflow-hidden max-w-md md:max-w-full hover:scale-105 transition-transform duration-300">
              <img
                src={heroSnapshot}
                alt="Dashboard preview"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-auto">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy;2025 Resume Ecosystem. Building verified, dynamic resumes for the future.
          </p>
          <Button
            variant="secondary"
            onClick={handleLearnMoreClick}
            className="flex items-center gap-2 text-gray-400 hover:text-white border-gray-600 hover:border-white"
          >
            <FaGithub className="w-5 h-5" />
            GitHub
          </Button>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
