import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AddNewCourse = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end">
      
      {/* <Button
        onClick={() => navigate("/addCourse")}
        className="px-3 py-3 text-lg font-semibold rounded-sm shadow-md hover:scale-105 transition-all duration-200"
      >
        ➕ Add New Course
      </Button> */}
      <Button
        onClick={() => navigate("/addCourse")}
        className="gap-2 active:scale-95 "
      >
           <Plus size={16} />
         Add New Course
      </Button>


    </div>
  );
};

export default AddNewCourse;
