import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";

function Header({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("✅ User Found in Header");
    } else {
      console.log("⚠️ User Not Found in Header");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.statusCode === 200) {
        dispatch(addUserData(""));
        navigate("/");
      }
    } catch (error) {
      console.log("Logout Error:", error.message);
    }
  };

  // Blue Gradient Button Style
  const buttonStyles =
    "bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full shadow-lg hover:from-blue-700 hover:to-cyan-600 transition flex items-center gap-2 justify-center";

  // Custom SVG logo component
  const Logo = () => (
    <Link to="/" className="flex items-center cursor-pointer hover:opacity-80 transition">
      <img
        src="https://cdn-icons-png.flaticon.com/512/16258/16258028.png"
        alt="Logo"
        className="h-12 w-12 object-contain"
      />
      <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white select-none">
        Resume System
      </span>
    </Link>
  );

  return (
    <header
      id="printHeader"
      className="flex justify-between px-10 py-5 shadow-md items-center bg-white dark:bg-gray-900 z-50"
    >
      <Logo />

      {/* Auth Section */}
      {user ? (
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate("/dashboard")} className={buttonStyles}>
            Dashboard
          </Button>
          <Button onClick={handleLogout} className={buttonStyles}>
            Logout
          </Button>
        </div>
      ) : (
        <Link to="/auth/sign-in">
          <Button className={buttonStyles}>Get Started</Button>
        </Link>
      )}
    </header>
  );
}

export default Header;
