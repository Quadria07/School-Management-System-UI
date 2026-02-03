import React, { useState } from "react";
import { BroadsheetData } from "./types";
import executiveSignature from "figma:asset/639e8ae965bd0c9c29dc6d16de5f3e8f3b6dcfc2.png";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { X, Upload, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface StudentReportCardProps {
  student: BroadsheetData;
  term: string;
  session: string;
  class: string;
  schoolLogo: string;
  adminSignature: string | null;
  principalSignature: string | null;
  principalRemark: string;
  onPrincipalRemarkChange: (remark: string) => void;
  onPrincipalSignatureUpload: (signature: string) => void;
  onRemovePrincipalSignature: () => void;
  onAdminSignatureUpload: (signature: string) => void;
  onRemoveAdminSignature: () => void;
  resultType?: "ca" | "term"; // Add resultType prop
  userRole?: string; // Add userRole prop to check permissions
  subjects?: any[]; // Allow passing dynamic subjects
  highlightedSubject?: string; // Subject to highlight
}

export const StudentReportCard: React.FC<
  StudentReportCardProps
> = ({
  student,
  term,
  session,
  class: className,
  schoolLogo,
  adminSignature,
  principalSignature,
  principalRemark,
  onPrincipalRemarkChange,
  onPrincipalSignatureUpload,
  onRemovePrincipalSignature,
  onAdminSignatureUpload,
  onRemoveAdminSignature,
  resultType = "term", // Default to 'term' if not provided
  userRole, // Accept userRole
  subjects, // Accept dynamic subjects
  highlightedSubject, // Accept highlightedSubject
}) => {
  // State for affective & psychomotor skills
  const [skills, setSkills] = useState({
    punctuality: "EXCELLENT",
    neatness: "V.GOOD",
    politeness: "EXCELLENT",
    honesty: "V.GOOD",
    cooperation: "EXCELLENT",
    leadership: "GOOD",
    sports: "V.GOOD",
    initiative: "GOOD",
  });

  // State for class teacher's remark
  const [classTeacherRemark, setClassTeacherRemark] = useState(
    "Excellent performance! Keep up the good work and maintain this outstanding result."
  );

  // State for zoom level (100 = default size, 150 = 1.5x size, etc.)
  const [zoomLevel, setZoomLevel] = useState(100);

  // Skill rating options
  const skillOptions = ["EXCELLENT", "V.GOOD", "GOOD", "FAIR", "POOR"];

  const handleSkillChange = (skillName: keyof typeof skills, value: string) => {
    setSkills(prev => ({ ...prev, [skillName]: value }));
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200)); // Max 200%
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50)); // Min 50%
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  console.log(
    "StudentReportCard received adminSignature:",
    adminSignature ? "Yes" : "No",
  );

  const handlePrincipalSignatureUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPrincipalSignatureUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdminSignatureUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAdminSignatureUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Zoom Controls - Only for Principal and Teacher */}
      {(userRole === "Principal" || userRole === "Teacher") && (
        <div className="flex items-center justify-end gap-3 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <span className="text-sm font-semibold text-blue-900">
            Zoom: {zoomLevel}%
          </span>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleZoomOut}
              size="sm"
              variant="outline"
              className="h-8 px-3"
              disabled={zoomLevel <= 50}
            >
              <ZoomOut className="w-4 h-4 mr-1" />
              Out
            </Button>
            <Button
              onClick={handleResetZoom}
              size="sm"
              variant="outline"
              className="h-8 px-3"
              disabled={zoomLevel === 100}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button
              onClick={handleZoomIn}
              size="sm"
              variant="outline"
              className="h-8 px-3"
              disabled={zoomLevel >= 200}
            >
              <ZoomIn className="w-4 h-4 mr-1" />
              In
            </Button>
          </div>
        </div>
      )}

      {/* Report Card Container with Zoom */}
      <div className="overflow-auto">
        <div 
          style={{ 
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top left',
            width: `${10000 / zoomLevel}%`
          }}
        >
          <div className="p-2.5 bg-white min-w-[646px]">
            {/* School Header */}
            <div className="border border-blue-950 p-2 mb-2">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
                {/* School Logo */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
                  <img
                    src={schoolLogo}
                    alt="BFOIA Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* School Info */}
                <div className="flex-1 text-center">
                  <h1 className="text-sm sm:text-base font-bold text-blue-950 mb-0">
                    BISHOP FELIX OWOLABI INT'L ACADEMY
                  </h1>
                  <p className="text-[8px] text-gray-700 mb-0">
                    1, Faithtriumph Drive, Behind Galaxy Hotel, West
                    Bye Pass, Ring Road, Osogbo, Osun State
                  </p>
                  <p className="text-[8px] font-semibold text-blue-900">
                    MOTTO ..... learning for an Exceptional Nation
                  </p>
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="border border-gray-400 mb-2">
              <div className="bg-gray-200 p-1.5 text-center">
                <h2 className="text-sm font-bold text-blue-950">
                  {resultType === "ca"
                    ? "MID-TERM ASSESSMENT RECORD"
                    : "EXAMINATION RECORD"}
                </h2>
              </div>
            </div>

            {/* Student Information Section */}
            <div className="border border-gray-400 mb-2 overflow-x-auto">
              <div className="grid grid-cols-12 divide-x divide-gray-400 min-w-[504px]">
                {/* Student Photo */}
                <div className="col-span-2 p-1.5 flex items-center justify-center bg-gray-50">
                  <div className="w-14 h-17 bg-gray-200 border border-gray-400 flex items-center justify-center overflow-hidden">
                    {student.passportPhoto ? (
                      <img 
                        src={student.passportPhoto} 
                        alt={student.studentName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-[7px] text-center">
                        STUDENT
                        <br />
                        PHOTO
                      </span>
                    )}
                  </div>
                </div>

                {/* Student Details */}
                <div className="col-span-10">
                  <div className="grid grid-cols-4 text-[8px]">
                    {/* Row 1 */}
                    <div className="border-b border-gray-400 p-2">
                      <span className="font-semibold">NAME:</span>{" "}
                      {student.studentName}
                    </div>
                    <div className="border-b border-l border-gray-400 p-2">
                      <span className="font-semibold">
                        ADMISSION NO:
                      </span>{" "}
                      STU
                      {student.overallPosition
                        .toString()
                        .padStart(4, "0")}
                    </div>
                    <div className="border-b border-l border-gray-400 p-2">
                      <span className="font-semibold">CLASS:</span>{" "}
                      {className}
                    </div>
                    <div className="border-b border-l border-gray-400 p-2">
                      <span className="font-semibold">TERM:</span>{" "}
                      {term}
                    </div>

                    {/* Row 2 */}
                    <div className="border-b border-gray-400 p-2">
                      <span className="font-semibold">GENDER:</span>{" "}
                      Male
                    </div>
                    <div className="border-b border-l border-gray-400 p-2">
                      <span className="font-semibold">AGE:</span> 12
                    </div>
                    <div className="border-b border-l border-gray-400 p-2">
                      <span className="font-semibold">SESSION:</span>{" "}
                      {session}
                    </div>
                    <div className="border-b border-l border-gray-400 p-2">
                      <span className="font-semibold">
                        ATTENDANCE:
                      </span>{" "}
                      65/65
                    </div>

                    {/* Row 3 */}
                    <div className="border-b border-gray-400 p-2 col-span-2">
                      <span className="font-semibold">
                        NO. OF TIMES SCHOOL OPENED:
                      </span>{" "}
                      65
                    </div>
                    <div className="border-b border-l border-gray-400 p-2 col-span-2">
                      <span className="font-semibold">
                        NO. OF TIMES PRESENT:
                      </span>{" "}
                      65
                    </div>

                    {/* Row 4 */}
                    <div className="p-2 col-span-2">
                      <span className="font-semibold">
                        NO. IN CLASS:
                      </span>{" "}
                      45
                    </div>
                    <div className="border-l border-gray-400 p-2 col-span-2">
                      <span className="font-semibold">CLUB:</span>{" "}
                      Science Club
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Table */}
            <div className="border border-gray-400 mb-2 overflow-x-auto">
              <table className="w-full text-[8px] border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-400 p-1 text-left font-bold">
                      SUBJECTS
                    </th>
                    {resultType === "ca" ? (
                      <>
                        <th className="border border-gray-400 p-1 font-bold text-center w-16">
                          PERIODIC<br />TEST (10)
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center w-16">
                          MID TEST<br />(10)
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center w-12">
                          Q&P<br />(5)
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center w-12">
                          C/P<br />(5)
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center w-16">
                          TOTAL<br />(30)
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center w-14">
                          %<br />SCORE
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center w-14">
                          GRADE
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center">
                          REMARK
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="border border-gray-400 p-1 font-bold text-center w-16">
                          CA<br />(30)
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center w-16">
                          EXAM<br />(70)
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center w-16">
                          TOTAL<br />(100)
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center w-14">
                          GRADE
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center w-16">
                          CLASS<br />AVG
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center w-16">
                          RANK
                        </th>
                        <th className="border border-gray-400 p-1 font-bold text-center">
                          REMARK
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {/* Subject rows with mock data */}
                  {resultType === "ca"
                    ? // CA Results Table
                      (subjects || [
                        {
                          subject: "MATHEMATICS",
                          periodicTest: 8,
                          midTermTest: 8,
                          qp: 4,
                          cp: 4,
                          caTotal: 24,
                          percentScore: 80.0,
                          grade: "A",
                          remark: "EXCELLENT",
                        },
                        {
                          subject: "ENGLISH LANGUAGE",
                          periodicTest: 7,
                          midTermTest: 8,
                          qp: 4,
                          cp: 5,
                          caTotal: 24,
                          percentScore: 80.0,
                          grade: "A",
                          remark: "VERY GOOD",
                        },
                        // Fallback data truncated for brevity as subjects will likely be passed
                      ]).map((row, index) => (
                        <tr key={index} className={highlightedSubject && row.subject.toUpperCase().includes(highlightedSubject.toUpperCase()) ? "bg-orange-100 font-medium border-l-4 border-l-orange-500" : ""}>
                          <td className="border border-gray-400 p-0.5 font-semibold">
                            {row.subject}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center">
                            {row.periodicTest ?? row.ca1 ?? '-'}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center">
                            {row.midTermTest ?? row.ca2 ?? '-'}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center">
                            {row.qp ?? '-'}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center">
                            {row.cp ?? '-'}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center font-bold text-blue-600">
                            {row.caTotal ?? ((row.periodicTest || 0) + (row.midTermTest || 0) + (row.qp || 0) + (row.cp || 0))}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center">
                            {row.percentScore ? row.percentScore.toFixed(1) : (((row.caTotal ?? 0) / 30) * 100).toFixed(1)}%
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center font-bold text-purple-600">
                            {row.grade}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center">
                            {row.remark || (row.grade === 'A' ? 'EXCELLENT' : row.grade === 'B' ? 'VERY GOOD' : 'GOOD')}
                          </td>
                        </tr>
                      ))
                    : // Term Results Table
                      (subjects || [
                        {
                          subject: "MATHEMATICS",
                          ca: 30,
                          exam: 55,
                          total: 85,
                          grade: "A",
                          average: 72.5,
                          rank: "5th",
                          remark: "EXCELLENT",
                        },
                        {
                          subject: "ENGLISH LANGUAGE",
                          ca: 32,
                          exam: 48,
                          total: 80,
                          grade: "A",
                          average: 68.3,
                          rank: "3rd",
                          remark: "VERY GOOD",
                        },
                      ]).map((row, index) => (
                        <tr key={index} className={highlightedSubject && row.subject.toUpperCase().includes(highlightedSubject.toUpperCase()) ? "bg-orange-100 font-medium border-l-4 border-l-orange-500" : ""}>
                          <td className="border border-gray-400 p-0.5 font-semibold">
                            {row.subject}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center">
                            {row.ca ?? ((row.ca1 || 0) + (row.ca2 || 0))}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center">
                            {row.exam ?? '-'}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center font-bold">
                            {row.total}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center font-bold">
                            {row.grade}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center">
                            {row.average ?? '-'}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center font-bold text-purple-600">
                            {row.rank ?? '-'}
                          </td>
                          <td className="border border-gray-400 p-0.5 text-center">
                            {row.remark || (row.grade === 'A' ? 'EXCELLENT' : row.grade === 'B' ? 'VERY GOOD' : 'GOOD')}
                          </td>
                        </tr>
                      ))}

                  {/* Summary Rows */}
                  <tr className="bg-gray-100 font-bold">
                    <td
                      className="border border-gray-400 p-0.5"
                      colSpan={3}
                    >
                      TOTAL MARKS OBTAINABLE
                    </td>
                    <td
                      className="border border-gray-400 p-0.5 text-center"
                      colSpan={resultType === "ca" ? 6 : 5}
                    >
                      {resultType === "ca" ? "450" : "1500"}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td
                      className="border border-gray-400 p-0.5"
                      colSpan={3}
                    >
                      TOTAL MARKS OBTAINED
                    </td>
                    <td
                      className="border border-gray-400 p-0.5 text-center"
                      colSpan={resultType === "ca" ? 6 : 5}
                    >
                      {resultType === "ca" ? "365" : "1175"}
                    </td>
                  </tr>
                  <tr className="bg-yellow-50 font-bold">
                    <td
                      className="border border-gray-400 p-0.5"
                      colSpan={3}
                    >
                      OVERALL AVERAGE
                    </td>
                    <td
                      className="border border-gray-400 p-0.5 text-center text-sm text-blue-600"
                      colSpan={resultType === "ca" ? 6 : 5}
                    >
                      {resultType === "ca" ? "81.1%" : "78.33%"}
                    </td>
                  </tr>
                  <tr className="bg-yellow-50 font-bold">
                    <td
                      className="border border-gray-400 p-0.5"
                      colSpan={3}
                    >
                      POSITION IN CLASS
                    </td>
                    <td
                      className="border border-gray-400 p-0.5 text-center text-sm text-purple-600"
                      colSpan={resultType === "ca" ? 6 : 5}
                    >
                      5TH
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Grading Scale - Full Width */}
            <div className="border border-gray-400 mb-1.5">
              <div className="bg-gray-200 p-1 border-b border-gray-400">
                <h3 className="text-[8px] font-bold text-center">
                  GRADING SCALE (100 marks)
                </h3>
              </div>
              <div className="p-1.5 text-[8px]">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-semibold whitespace-nowrap">
                    80-100: A (EXCELLENT)
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="font-semibold whitespace-nowrap">
                    70-79: B (V.GOOD)
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="font-semibold whitespace-nowrap">
                    60-69: C (GOOD)
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="font-semibold whitespace-nowrap">
                    50-59: D (FAIR)
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="font-semibold whitespace-nowrap">
                    40-49: E (PASS)
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="font-semibold whitespace-nowrap">
                    0-39: F (FAIL)
                  </span>
                </div>
              </div>
            </div>

            {/* Skills & Remarks Section */}
            <div className="grid grid-cols-1 gap-2 mb-1.5">
              {/* Skills & Behavior Assessment - Full Width */}
              <div className="border border-gray-400">
                <div className="bg-gray-200 p-1 border-b border-gray-400">
                  <h3 className="text-[8px] font-bold text-center">
                    AFFECTIVE & PSYCHOMOTOR SKILLS
                  </h3>
                </div>
                <div className="p-1.5 text-[8px]">
                  <div className="grid grid-cols-4 gap-x-2 gap-y-1.5">
                    {/* Punctuality */}
                    <div className="flex flex-col gap-1">
                      <span>Punctuality:</span>
                      {userRole === "Principal" || userRole === "Teacher" ? (
                        <Select
                          value={skills.punctuality}
                          onValueChange={(value) =>
                            handleSkillChange("punctuality", value)
                          }
                        >
                          <SelectTrigger className="h-6 text-[8px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {skillOptions.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-6 px-1.5 py-1 border rounded text-[8px] bg-gray-50">
                          {skills.punctuality}
                        </div>
                      )}
                    </div>
                    
                    {/* Neatness */}
                    <div className="flex flex-col gap-1">
                      <span>Neatness:</span>
                      {userRole === "Principal" || userRole === "Teacher" ? (
                        <Select
                          value={skills.neatness}
                          onValueChange={(value) =>
                            handleSkillChange("neatness", value)
                          }
                        >
                          <SelectTrigger className="h-6 text-[8px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {skillOptions.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-6 px-1.5 py-1 border rounded text-[8px] bg-gray-50">
                          {skills.neatness}
                        </div>
                      )}
                    </div>
                    
                    {/* Politeness */}
                    <div className="flex flex-col gap-1">
                      <span>Politeness:</span>
                      {userRole === "Principal" || userRole === "Teacher" ? (
                        <Select
                          value={skills.politeness}
                          onValueChange={(value) =>
                            handleSkillChange("politeness", value)
                          }
                        >
                          <SelectTrigger className="h-6 text-[8px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {skillOptions.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-6 px-1.5 py-1 border rounded text-[8px] bg-gray-50">
                          {skills.politeness}
                        </div>
                      )}
                    </div>
                    
                    {/* Honesty */}
                    <div className="flex flex-col gap-1">
                      <span>Honesty:</span>
                      {userRole === "Principal" || userRole === "Teacher" ? (
                        <Select
                          value={skills.honesty}
                          onValueChange={(value) =>
                            handleSkillChange("honesty", value)
                          }
                        >
                          <SelectTrigger className="h-6 text-[8px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {skillOptions.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-6 px-1.5 py-1 border rounded text-[8px] bg-gray-50">
                          {skills.honesty}
                        </div>
                      )}
                    </div>

                    {/* Cooperation */}
                    <div className="flex flex-col gap-1">
                      <span>Cooperation:</span>
                      {userRole === "Principal" || userRole === "Teacher" ? (
                        <Select
                          value={skills.cooperation}
                          onValueChange={(value) =>
                            handleSkillChange("cooperation", value)
                          }
                        >
                          <SelectTrigger className="h-6 text-[8px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {skillOptions.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-6 px-1.5 py-1 border rounded text-[8px] bg-gray-50">
                          {skills.cooperation}
                        </div>
                      )}
                    </div>

                    {/* Leadership */}
                    <div className="flex flex-col gap-1">
                      <span>Leadership:</span>
                      {userRole === "Principal" || userRole === "Teacher" ? (
                        <Select
                          value={skills.leadership}
                          onValueChange={(value) =>
                            handleSkillChange("leadership", value)
                          }
                        >
                          <SelectTrigger className="h-6 text-[8px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {skillOptions.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-6 px-1.5 py-1 border rounded text-[8px] bg-gray-50">
                          {skills.leadership}
                        </div>
                      )}
                    </div>

                    {/* Sports */}
                    <div className="flex flex-col gap-1">
                      <span>Sports:</span>
                      {userRole === "Principal" || userRole === "Teacher" ? (
                        <Select
                          value={skills.sports}
                          onValueChange={(value) =>
                            handleSkillChange("sports", value)
                          }
                        >
                          <SelectTrigger className="h-6 text-[8px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {skillOptions.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-6 px-1.5 py-1 border rounded text-[8px] bg-gray-50">
                          {skills.sports}
                        </div>
                      )}
                    </div>

                    {/* Initiative */}
                    <div className="flex flex-col gap-1">
                      <span>Initiative:</span>
                      {userRole === "Principal" || userRole === "Teacher" ? (
                        <Select
                          value={skills.initiative}
                          onValueChange={(value) =>
                            handleSkillChange("initiative", value)
                          }
                        >
                          <SelectTrigger className="h-6 text-[8px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {skillOptions.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-6 px-1.5 py-1 border rounded text-[8px] bg-gray-50">
                          {skills.initiative}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            {/* Remarks and Signatures Section - 2 Column Layout */}
            <div className="border border-gray-400 mb-1.5 flex">
              {/* Left Column: Remarks */}
              <div className="flex-1 border-r border-gray-400 p-2 flex flex-col justify-between gap-4">
                {/* Class Teacher's Remark */}
                <div>
                   <h3 className="text-[8px] font-bold mb-1 underline">CLASS TEACHER'S REMARK</h3>
                   {(userRole === "Principal" || userRole === "Teacher") ? (
                      <Textarea
                        value={classTeacherRemark}
                        onChange={(e) => setClassTeacherRemark(e.target.value)}
                        className="min-h-[40px] text-[8px] resize-none border-gray-300 w-full"
                        placeholder="Enter class teacher's remark..."
                      />
                    ) : (
                      <p className="text-[8px] italic">{classTeacherRemark}</p>
                    )}
                </div>

                {/* Executive Director's Remark */}
                <div>
                   <h3 className="text-[8px] font-bold mb-1 underline">EXECUTIVE DIRECTOR'S REMARK</h3>
                   {userRole === "Principal" ? (
                      <Textarea
                        value={principalRemark}
                        onChange={(e) => onPrincipalRemarkChange(e.target.value)}
                        className="min-h-[40px] text-[8px] resize-none border-gray-300 w-full"
                        placeholder="Enter principal's remark..."
                      />
                    ) : (
                      <p className="text-[8px] italic">
                        {principalRemark || "Outstanding result. Keep it up!"}
                      </p>
                    )}
                </div>
              </div>

              {/* Right Column: Signatures */}
              <div className="w-32 p-2 flex flex-col justify-end items-center gap-6 bg-gray-50/30">
                 
                 {/* Admin Signature */}
                 <div className="text-center w-full flex flex-col items-center">
                    <div className="w-20 h-8 mb-1 flex items-end justify-center relative">
                      {adminSignature ? (
                        <>
                          <img
                            src={adminSignature}
                            alt="Admin Signature"
                            className="max-w-full max-h-full object-contain"
                          />
                          {userRole === "Principal" && (
                            <button
                              onClick={onRemoveAdminSignature}
                              className="absolute -top-2 -right-2 bg-red-100 rounded-full p-0.5 hover:bg-red-200"
                            >
                              <X className="w-3 h-3 text-red-600" />
                            </button>
                          )}
                        </>
                      ) : (
                        userRole === "Principal" && (
                          <div className="relative w-full h-full">
                            <input
                              type="file"
                              id="admin-sig-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={handleAdminSignatureUpload}
                            />
                            <label
                              htmlFor="admin-sig-upload"
                              className="absolute inset-0 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                            >
                              <Upload className="w-3 h-3 text-gray-400" />
                              <span className="text-[5px] text-gray-500">
                                Admin Sign
                              </span>
                            </label>
                          </div>
                        )
                      )}
                    </div>
                    <div className="border-b border-gray-400 w-full mb-1"></div>
                    <p className="text-[6px] font-bold">ADMINISTRATOR</p>
                 </div>

                 {/* Executive Director Signature */}
                 <div className="text-center w-full flex flex-col items-center">
                    <div className="w-20 h-8 mb-1 flex items-end justify-center relative">
                      {principalSignature || executiveSignature ? (
                        <>
                          <img
                            src={principalSignature || executiveSignature}
                            alt="Principal Signature"
                            className="max-w-full max-h-full object-contain"
                          />
                          {userRole === "Principal" && (
                            <button
                              onClick={onRemovePrincipalSignature}
                              className="absolute -top-2 -right-2 bg-red-100 rounded-full p-0.5 hover:bg-red-200"
                            >
                              <X className="w-3 h-3 text-red-600" />
                            </button>
                          )}
                        </>
                      ) : (
                        userRole === "Principal" && (
                          <div className="relative w-full h-full">
                            <input
                              type="file"
                              id="principal-sig-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={handlePrincipalSignatureUpload}
                            />
                            <label
                              htmlFor="principal-sig-upload"
                              className="absolute inset-0 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                            >
                              <Upload className="w-3 h-3 text-gray-400" />
                              <span className="text-[5px] text-gray-500">
                                Principal Sign
                              </span>
                            </label>
                          </div>
                        )
                      )}
                    </div>
                    <div className="border-b border-gray-400 w-full mb-1"></div>
                    <p className="text-[6px] font-bold">EXECUTIVE DIRECTOR</p>
                 </div>

              </div>
            </div>
            </div>

            {/* Footer / Date */}
            <div className="text-[7px] text-center text-gray-500 mt-2">
              Generated on {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};