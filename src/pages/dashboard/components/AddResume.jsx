import React, { useState } from "react";
import { CopyPlus, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewResume } from "@/Services/resumeAPI";
import { useNavigate } from "react-router-dom";

function AddResume() {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createResume = async () => {
    if (resumetitle.trim() === "") {
      alert("Please add a title to your resume");
      return;
    }
    setLoading(true);
    const data = {
      data: {
        title: resumetitle,
        themeColor: "#000000",
      },
    };

    try {
      const res = await createNewResume(data);
      navigate(`/dashboard/edit-resume/${res.data.resume._id}`);
    } catch (error) {
      console.error("Error creating resume:", error);
      alert("Failed to create resume. Please try again.");
    } finally {
      setLoading(false);
      setResumetitle("");
      setOpenDialog(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setOpenDialog(true)}
        className="flex flex-col items-center justify-center cursor-pointer rounded-xl p-12 h-[380px] border-2 border-transparent
          bg-gradient-to-tr from-purple-600 via-indigo-700 to-blue-700
          shadow-lg
          hover:shadow-2xl
          hover:scale-105
          transition-transform duration-300 ease-in-out
          text-white"
        title="Create New Resume"
      >
        <CopyPlus size={48} className="mb-4" />
        <span className="text-xl font-semibold select-none">
          + New Resume
        </span>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-xl text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-2">
              Create a New Resume
            </DialogTitle>
            <DialogDescription className="mb-6 text-gray-300">
              Add a title to your new resume
            </DialogDescription>
            <Input
              autoFocus
              type="text"
              placeholder="Ex: Backend Developer Resume"
              value={resumetitle}
              onChange={(e) => setResumetitle(e.target.value)}
              className="mb-6 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-indigo-400 focus:ring-indigo-400"
            />
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setOpenDialog(false)}
                className="text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={createResume}
                disabled={resumetitle.trim() === "" || loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="animate-spin mr-2" size={20} />
                ) : (
                  "Create Resume"
                )}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddResume;
