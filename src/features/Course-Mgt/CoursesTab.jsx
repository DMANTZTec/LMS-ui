import React from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from '@/components/ui/table';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';
import { Eye, Pencil, User } from 'lucide-react';


const CoursesTab = () => {


const courses = [
    { id: "CS101", subject: "Computer Science", name: "Introduction to Programming", duration: "12 weeks", fee: "$500" },
    { id: "CS201", subject: "Computer Science", name: "Data Structures and Algorithms", duration: "16 weeks", fee: "$650" },
    { id: "MATH101", subject: "Mathematics", name: "Calculus I", duration: "14 weeks", fee: "$450" },
    { id: "MATH201", subject: "Mathematics", name: "Linear Algebra", duration: "12 weeks", fee: "$500" },
    { id: "PHY101", subject: "Physics", name: "General Physics", duration: "15 weeks", fee: "$550" },
    { id: "PHY201", subject: "Physics", name: "Quantum Mechanics", duration: "16 weeks", fee: "$700" },
    { id: "CHEM101", subject: "Chemistry", name: "General Chemistry", duration: "14 weeks", fee: "$500" },
    { id: "CHEM201", subject: "Chemistry", name: "Organic Chemistry", duration: "16 weeks", fee: "$600" },
    { id: "BIO101", subject: "Biology", name: "Introduction to Biology", duration: "12 weeks", fee: "$475" },
    { id: "ENG101", subject: "English", name: "English Composition", duration: "10 weeks", fee: "$400" },
]


    return (
        <>
         <h2 className='text-2xl font-semibold text-center mb-6'>Course Management</h2>

                    {/* filter */}
                    <div className='mb-4'>
                        <Select>
                            <SelectTrigger className='w-[200px]'>
                                <SelectValue placeholder="All Subjects" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                <SelectItem value="cs">Computer Science</SelectItem>
                                <SelectItem value="math">Mathemetics</SelectItem>
                                <SelectItem value="phy">Physics</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                    {/* Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course ID</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Course Name</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Fee</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {courses.map((course, index) => (
                                <TableRow key={course.id}>
                                    <TableCell>{course.id}</TableCell>
                                    <TableCell>{course.subject}</TableCell>
                                    <TableCell>{course.name}</TableCell>
                                    <TableCell>{course.duration}</TableCell>
                                    <TableCell>{course.fee}</TableCell>
                                    <TableCell>
                                        <div className='flex gap-3'>
                                            <Eye className="w-5 h-5 text-blue-500 cursor-pointer" />
                                            <Pencil className="w-5 h-5 text-green-500 cursor-pointer" />
                                        </div>           </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <p className='text-sm text-gray-500 mt-4'>Showing 10 of 10 courses</p>
        </>
    );
}

export default CoursesTab;