import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Eye, Pencil } from 'lucide-react';

import { api } from '@/api/CourseMgtController';
import { programFeeApi } from '@/api/program-fee-controller';
import ProgramFormDialog from './ProgramsTabComponents/ProgramFormDialog';
import ProgramViewDialog from './ProgramsTabComponents/ProgramViewDialog';
import EditProgram from './ProgramsTabComponents/EditProgram';
import AddCoursesDialog from './ProgramsTabComponents/AddCoursesDialog';
import RemoveCoursesDialog from './ProgramsTabComponents/RemoveCoursesDialog';
import DeleteProgramDialog from './ProgramsTabComponents/DeleteProgramDialog';
import ProgramFeeDialog, { durationLabel } from './ProgramsTabComponents/ProgramFeeDialog';

// const programsData = [
//     {
//         id: "P001",
//         programName: "Computer Science",
//         courses: 3,
//         fee: "$15,000",
//         coursesList: [
//             { id: "C101", subject: "Programming", name: "Introduction to Python", duration: "12 weeks" },
//             { id: "C102", subject: "Data Structures", name: "Advanced Algorithms", duration: "16 weeks" },
//             { id: "C103", subject: "Web Development", name: "Full Stack JavaScript", duration: "14 weeks" },
//         ],
//     },
//     {
//         id: "P002",
//         name: "Business Administration",
//         courses: 2,
//         fee: "$12,000",
//         coursesList: [
//             { id: "C201", subject: "Accounting and Finance", name: "introduction to finance", duration: "8 weeks" },
//             { id: "C202", subject: "Marketing", name: "introduction to Marketing", duration: "10 weeks" }
//         ],
//     },
//     {
//         id: "P003",
//         name: "Digital Marketing",
//         courses: 4,
//         fee: "$10,000",
//         coursesList: [
//             { id: "C301", subject: "Google Digital Marketing and E-commerce", name: "introduction to digital marketing & E-commerce", duration: "14 weeks" },
//             { id: "C302", subject: "Meta Social Media Marketing", name: "introduction to Social Media Marketing", duration: "10 weeks" },
//             { id: "C303", subject: "IBM Growth Hacking", name: "introduction to Growth Hacking", duration: "10 weeks" },
//             { id: "C304", subject: "Affiliate Marketing", name: "introduction to Affiliate Marketing", duration: "8 weeks" }
//         ],
//     }

// ];


// Fetches the current fee & duration for a single program from
// getProgramFeeSetting and renders the FEE / DURATION table cells.
// Shares the ['programFee', programId] cache key with ProgramFeeDialog,
// so opening that dialog and this cell never triggers duplicate requests.
const ProgramFeeCells = ({ program }) => {
    const { data: feeData, isLoading } = useQuery({
        queryKey: ['programFee', program.programId],
        queryFn: async () => {
            const response = await programFeeApi.getProgramFeeSetting(program.programId);
            return response.data;
        },
        staleTime: 2 * 60 * 1000,
    });

    const fee = feeData?.currentFee?.fee;
    const durationText = feeData?.currentFee?.durationLabel
        || durationLabel(feeData?.currentFee?.duration)
        || feeData?.duration;

    return (
        <>
            <TableCell>
                {isLoading ? '…' : (fee != null ? `₹${Number(fee).toLocaleString('en-IN')}` : '#NA')}
            </TableCell>
            <TableCell>
                {isLoading ? '…' : (durationText || '0 Months')}
            </TableCell>
        </>
    );
};



const ProgramsTab = () => {
    const [openRow, setOpenRow] = useState(null);
    const [programsData, setProgramsData] = useState([]);

    const fetchProgamsData = async () => {
const result = await api.getAllPrograms();
console.log("result.data is: ", result.data);
return result.data
}


const {data, isPending, error, refetch } = useQuery({
    queryKey: ['programsData'],
    queryFn: fetchProgamsData,
    staleTime: 2 * 60 * 1000
});
    
useEffect(() => {

if(data)
setProgramsData(data);

},[data]);

if (isPending) return <div>Loading ...</div>;
if (error) return <div>Error: {error.message}</div>;

    return (

        <div className="p-6 bg-gray-100">
           <div className="flex items-center justify-between mb-4">
                <h2 className='text-[18px] md:text-3xl font-semibold'>Programs</h2>
                <ProgramFormDialog onSubmitSuccess={refetch} />
            </div>
            <div className="rounded-xl shadow bg-white overflow-x-auto">
                <Table className="min-w-[700px]">
                    <TableHeader>
                        <TableRow className='bg-gray-100 text-[10px] md:text-[12px]'>
                            <TableHead />
                            <TableHead>PROGRAM ID</TableHead>
                            <TableHead>PROGRAM NAME</TableHead>
                            <TableHead>NO OF COURSES</TableHead>
                            <TableHead>FEE</TableHead>
                            <TableHead>DURATION</TableHead>
                            <TableHead>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {programsData.map((program, index) => (
                            <React.Fragment key={program.programId}>

                                <TableRow className="text-[10px] md:text-[12px]">
                                    <TableCell>
                                        <Button onClick={() => setOpenRow(openRow === program.id ? null : program.id)} variant='ghost'>
                                            {openRow === program.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{program.programId}</TableCell>
                                    <TableCell>{program.programTitle}</TableCell>
                                    <TableCell>{program.coursesList.length}</TableCell>
                                    <ProgramFeeCells program={program} />
                                    <TableCell className="flex gap-2">
                                          {/* <Button variant='ghost'>
                                            <Eye className="w-5 h-5 text-blue-500 cursor-pointer" />
                                          </Button>
                                        <Button variant='ghost'>
                                            <Pencil className="w-5 h-5 text-green-500 cursor-pointer" />
                                        </Button> */}
                                        {/* Start */}
                                          <ProgramViewDialog program={program} />
                                        <EditProgram program={program} onUpdateSuccess={refetch} />
                                        <ProgramFeeDialog program={program} onSaveSuccess={refetch} />
                                         <DeleteProgramDialog programId={program.programId} id={program.id} programTitle={program.programTitle} onDeleteSuccess={refetch}/>
                                         
                                        {/* END */}
                                        
                                    </TableCell>
                                </TableRow>

                                {/* Expanded Row */}
                                {(openRow === program.id && program.coursesList?.length >= 0) && (


                                    <TableRow>
                                        <TableCell colspan={7} className='bg-gray-100'>
                                            <div className='bg-white rounded-lg overflow-x-auto ml-10 mr-10'>
                                                {/* Code Add course */}
                                              <div className="flex justify-between items-center mb-3">
                                                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Program Syllabus Structure</h4>
                                                    <AddCoursesDialog program={program} onAddSuccess={refetch} />
                                                </div>
                                                {/* END  */}
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className='bg-gray-200 text-[10px] md:text-[12px]'>
                                                            <TableHead>COURSE ID</TableHead>
                                                            <TableHead>SUBJECT NAME</TableHead>
                                                            <TableHead>COURSE NAME</TableHead>
                                                            <TableHead>DURATION</TableHead>
                                                            <TableHead className="text-right">DISMISS</TableHead>
                                                        </TableRow>
                                                    </TableHeader>

                                                    <TableBody>
                                                        {program.coursesList.map((course) => (
                                                            <TableRow key={course.id} className="text-[10px] md:text-[12px]">
                                                                <TableCell>{course.courseId}</TableCell>
                                                                <TableCell>{course.subjectNm}</TableCell>
                                                                <TableCell>{course.courseTitle}</TableCell>
                                                                <TableCell>{course.duration}</TableCell>
                                                                      {/* Course Removal Action Trigger Hook */}
                                                                <TableCell className="text-right">
                                                                    <RemoveCoursesDialog 
                                                                        programId={program.programId} 
                                                                        courseId={course.courseId || course.id} 
                                                                        courseTitle={course.courseTitle} 
                                                                        onRemoveSuccess={refetch} 
                                                                    />
                                                                </TableCell>
                                                                {/* END */}
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>

            </div>
        </div>

    );
}

export default ProgramsTab;