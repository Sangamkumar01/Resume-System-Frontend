import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateThisResume } from "@/Services/resumeAPI";

function ThemeColor({ resumeInfo }) {
  const dispatch = useDispatch();
  const colors = [
    "#0D47A1", // Deep Navy Blue
    "#1565C0", // Medium Royal Blue
    "#1976D2", // Light Sky Blue
    "#1E88E5", // Soft Cerulean
    "#64B5F6", // Baby Blue
    "#D32F2F", // Deep Crimson Red
    "#E53935", // Warm Coral Red
    "#C2185B", // Mulberry Pink
    "#8E24AA", // Deep Purple Accent
    "#6D4C41", // Coffee Brown
    "#5D4037", // Cocoa Brown
    "#4E342E", // Earthy Dark Brown
    "#388E3C", // Emerald Green
    "#43A047", // Fresh Green
    "#F57C00", // Warm Orange
    "#FBC02D", // Golden Yellow
    "#455A64", // Slate Gray
    "#607D8B", // Cool Blue-Gray
    "#212121", // Almost Black
    "#757575", // Neutral Gray
  ];

  const [selectedColor, setSelectedColor] = useState();
  const { resume_id } = useParams();

  const onColorSelect = async (color) => {
    setSelectedColor(color);
    dispatch(
      addResumeData({
        ...resumeInfo,
        themeColor: color,
      })
    );
    const data = {
      data: {
        themeColor: color,
      },
    };
    await updateThisResume(resume_id, data)
      .then(() => {
        toast.success("Theme Color Updated");
      })
      .catch((error) => {
        toast.error("Error updating theme color");
      });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:from-purple-600 hover:to-red-600 transition"
          size="sm"
        >
          <Palette /> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((item, index) => (
            <div
              key={index}
              onClick={() => onColorSelect(item)}
              className={`h-5 w-5 rounded-full cursor-pointer
               hover:border-black border
               ${selectedColor === item ? "border-2 border-black" : ""}
               `}
              style={{
                background: item,
              }}
            ></div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;
