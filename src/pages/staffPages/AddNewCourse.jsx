import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AddNewCourse = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end">
      
      <Button
        onClick={() => navigate("/addCourse")}
        className="px-6 py-3 text-lg font-semibold rounded-xl shadow-md hover:scale-105 transition-all duration-200"
      >
        ➕ Add New Course
      </Button>

    </div>
  );
};

export default AddNewCourse;