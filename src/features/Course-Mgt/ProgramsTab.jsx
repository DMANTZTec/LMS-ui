import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Eye, Pencil } from 'lucide-react';


const programsData = [
    {
        id: "P001",
        name: "Computer Science",
        courses: 3,
        fee: "$15,000",
        coursesList: [
            { id: "C101", subject: "Programming", name: "Introduction to Python", duration: "12 weeks" },
            { id: "C102", subject: "Data Structures", name: "Advanced Algorithms", duration: "16 weeks" },
            { id: "C103", subject: "Web Development", name: "Full Stack JavaScript", duration: "14 weeks" },
        ],
    },
    {
        id: "P002",
        name: "Business Administration",
        courses: 2,
        fee: "$12,000",
        coursesList: [
            { id: "C201", subject: "Accounting and Finance", name: "introduction to finance", duration: "8 weeks" },
            { id: "C202", subject: "Marketing", name: "introduction to Marketing", duration: "10 weeks" }
        ],
    },
    {
        id: "P003",
        name: "Digital Marketing",
        courses: 4,
        fee: "$10,000",
        coursesList: [
            { id: "C301", subject: "Google Digital Marketing and E-commerce", name: "introduction to digital marketing & E-commerce", duration: "14 weeks" },
            { id: "C302", subject: "Meta Social Media Marketing", name: "introduction to Social Media Marketing", duration: "10 weeks" },
            { id: "C303", subject: "IBM Growth Hacking", name: "introduction to Growth Hacking", duration: "10 weeks" },
            { id: "C304", subject: "Affiliate Marketing", name: "introduction to Affiliate Marketing", duration: "8 weeks" }
        ],
    }

];

const ProgramsTab = () => {
    const [openRow, setOpenRow] = useState(null);

    return (

        <div className="p-6 bg-gray-100">
            <h2 className='text-2xl font-semibold mb-4'>Programs</h2>
            <div className="rounded-xl border shadow-sm bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className='bg-gray-100'>
                            <TableHead />
                            <TableHead>PROGRAM ID</TableHead>
                            <TableHead>PROGRAM NAME</TableHead>
                            <TableHead>NO OF COURSES</TableHead>
                            <TableHead>FEE</TableHead>
                            <TableHead>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {programsData.map((program) => (
                            <>

                                <TableRow key={program.id}>
                                    <TableCell>
                                        <Button onClick={() => setOpenRow(openRow === program.id ? null : program.id)} variant='ghost'>
                                            {openRow === program.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{program.id}</TableCell>
                                    <TableCell>{program.name}</TableCell>
                                    <TableCell>{program.courses}</TableCell>
                                    <TableCell>{program.fee}</TableCell>
                                    <TableCell className="flex gap-2">

                                        <Eye className="w-5 h-5 text-blue-500 cursor-pointer" />
                                        <Pencil className="w-5 h-5 text-green-500 cursor-pointer" />
                                    </TableCell>
                                </TableRow>

                                {/* Expanded Row */}
                                {(openRow === program.id && program.coursesList.length > 0) && (


                                    <TableRow>
                                        <TableCell colSpan={6} className='bg-gray-100'>
                                            <div className='bg-white rounded-lg p-{10}'>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className='bg-gray-200'>
                                                            <TableHead>COURSE ID</TableHead>
                                                            <TableHead>SUBJECT NAME</TableHead>
                                                            <TableHead>COURSE NAME</TableHead>
                                                            <TableHead>DURATION</TableHead>
                                                        </TableRow>
                                                    </TableHeader>

                                                    <TableBody>
                                                        {program.coursesList.map((course) => (
                                                            <TableRow key={course.id}>
                                                                <TableCell>{course.id}</TableCell>
                                                                <TableCell>{course.subject}</TableCell>
                                                                <TableCell>{course.name}</TableCell>
                                                                <TableCell>{course.duration}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        ))}
                    </TableBody>
                </Table>

            </div>
        </div>

    );
}

export default ProgramsTab;