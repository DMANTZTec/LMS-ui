import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const RemoveCoursesDialog = ({ programId, courseId, courseTitle, onRemoveSuccess }) => {
  const [open, setOpen] = useState(false);

  const handleConfirmDelete = () => {
    // Action: Connect to api.removeCourseFromProgram(programId, courseId) here
    console.log(`Removed Course ${courseId} from Program ${programId}`);
    setOpen(false);
    if (onRemoveSuccess) onRemoveSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-1 h-auto hover:bg-red-50 group">
          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">Remove Course Confirmation</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm text-gray-600">
            Are you sure you want to remove <span className="font-semibold text-gray-900">{courseTitle} ({courseId})</span>? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
            Confirm Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveCoursesDialog;