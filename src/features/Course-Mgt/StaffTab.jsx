import React , { useState } from 'react';
import { Button } from '@/components/ui/button';

import AddNewStaffMember from '@/features/Course-Mgt/addStaff/AddNewStaffMember';

const StaffTab = () => {
 
    const [isAddNewStaffMemberModal, setIsAddNewStaffMemberModal] = useState(false);

  return (
  <>
  <div className="p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg font-medium text-slate-800 mb-4">This is Staff tab.</h3>
        {/* External Trigger Button */}
        <Button
          onClick={() => setIsAddNewStaffMemberModal(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
        >
          Add New Staff Member
        </Button>
      </div>
      <AddNewStaffMember 
       open={isAddNewStaffMemberModal}
       onOpenChange={setIsAddNewStaffMemberModal} />
  </>
  );
}; 

export default StaffTab;