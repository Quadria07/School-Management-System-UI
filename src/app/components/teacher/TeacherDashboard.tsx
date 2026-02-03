/**
 * TeacherDashboard - Lesson Note & Content Manager
 * Version: 2.0.1 - Fixed getLessonNotesByTeacher function call
 * Last Updated: 2026-01-26
 */
import React, { useState, useEffect } from 'react';
import { LessonNoteEditor } from './LessonNoteEditor';
import * as dataFlowService from '@/utils/dataFlowService';
import { useAuth } from '@/contexts/AuthContext';
import type { LessonNote } from '@/types';
import {
  BookOpen,
  Upload,
  Plus,
  FileText,
  Download,
  Youtube,
  File,
  Link2,
  CheckCircle2,
  Circle,
  Trash2,
  Eye,
  Send,
  Save,
  Edit,
  Share2,
  Users,
  ClipboardList,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface StudyMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'ppt' | 'link';
  url: string;
  subject: string;
  class: string;
  uploadDate: string;
  size?: string;
  sharedWithStudents?: boolean;
  sharedAt?: Date;
}

interface CurriculumTopic {
  id: string;
  subject: string;
  class: string;
  term: string;
  week: number;
  topic: string;
  completed: boolean;
  lessonNoteId?: string;
}

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState<LessonNote | null>(null);
  const [currentNote, setCurrentNote] = useState<LessonNote | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('lesson-notes');

  // Lesson Notes State - Load from localStorage
  const [lessonNotes, setLessonNotes] = useState<LessonNote[]>([]);

  // ✅ Load lesson notes from localStorage on mount
  // Updated: Fixed function name from getTeacherLessonNotes to getLessonNotesByTeacher
  useEffect(() => {
    const loadLessonNotes = () => {
      try {
        const notes = dataFlowService.getLessonNotesByTeacher(user.id);
        if (notes && notes.length > 0) {
          // Convert LessonNoteRecord to LessonNote format
          const convertedNotes = notes.map(note => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
            approvedAt: note.approvedAt ? new Date(note.approvedAt) : undefined,
            sharedAt: note.sharedAt ? new Date(note.sharedAt) : undefined,
          }));
          setLessonNotes(convertedNotes);
        } else {
          // Initialize with sample data
          const sampleNotes: LessonNote[] = [
            {
              id: '1',
              teacherId: user.id,
              teacherName: user.name,
              subject: 'Mathematics',
              class: 'JSS 3A',
              topic: 'Introduction to Algebra',
              content: 'This lesson introduces students to basic algebraic concepts...',
              status: 'published',
              createdAt: new Date('2025-12-20'),
              updatedAt: new Date('2025-12-21'),
              approvedBy: 'Dr. Principal',
              approvedAt: new Date('2025-12-21'),
              term: 'First Term',
              week: 1,
              period: '1st Period',
              duration: '40 minutes',
              subTopic: 'Basic Algebraic Expressions',
              previousKnowledge: 'Students should know basic arithmetic operations',
              instructionalMaterials: '- Whiteboard and markers\n- Algebra textbooks\n- Chart showing algebraic expressions',
              learningObjectivesCognitive: 'By the end of the lesson, students should be able to:\n1. Define algebra and algebraic expressions\n2. Identify variables and constants\n3. Write simple algebraic expressions',
              learningObjectivesAffective: 'Develop appreciation for the use of algebra in real-life situations',
              learningObjectivesPsychomotor: 'Accurately write algebraic expressions using proper notation',
              setInduction: 'Ask students: "If you have x apples and I give you 5 more, how many do you have?" Use this to introduce the concept of variables.',
              presentation: 'Step 1: Introduce the concept of algebra\n- Explain that algebra uses letters to represent numbers\n- Give examples: x, y, z\n\nStep 2: Define terms\n- Variable: a letter that represents a number\n- Constant: a fixed number\n- Coefficient: number multiplying a variable\n\nStep 3: Practice examples\n- 2x + 5\n- 3y - 7\n- Students work in groups to create their own expressions',
              evaluation: '1. What is algebra?\n2. Define the term "variable"\n3. Write an algebraic expression for: "5 more than a number"\n4. Identify the coefficient in 7x + 3',
              summary: 'Algebra uses letters (variables) to represent unknown numbers. We can create algebraic expressions by combining variables, constants, and operations.',
              assignment: 'CLASSWORK:\n1. Define algebra in your own words\n2. List 3 variables and 3 constants\n\nHOMEWORK:\n1. Write 5 algebraic expressions\n2. Read Chapter 1 of the algebra textbook',
              teacherReflection: 'The lesson went well. Students were engaged during the group activity. Some students struggled with the concept of coefficients - will revisit this in the next lesson.',
              hodRemarks: 'Well-structured lesson note. Good use of real-life examples to introduce abstract concepts. Approved.',
            },
          ];
          setLessonNotes(sampleNotes);
        }
      } catch (error) {
        console.error('Error loading lesson notes:', error);
      }
    };
    
    loadLessonNotes();
  }, [user.id]);

  // Study Materials State
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([
    {
      id: '1',
      title: 'Quadratic Equations - Past Questions',
      type: 'pdf',
      url: '#',
      subject: 'Mathematics',
      class: 'JSS 3A',
      uploadDate: '2025-12-25',
      size: '2.4 MB',
    },
    {
      id: '2',
      title: 'Introduction to Algebra - Khan Academy',
      type: 'video',
      url: 'https://youtube.com/watch?v=example',
      subject: 'Mathematics',
      class: 'JSS 2B',
      uploadDate: '2025-12-20',
    },
    {
      id: '3',
      title: 'Trigonometry Presentation',
      type: 'ppt',
      url: '#',
      subject: 'Mathematics',
      class: 'SSS 2A',
      uploadDate: '2025-12-22',
      size: '5.1 MB',
    },
  ]);

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    type: 'pdf' as 'pdf' | 'video' | 'ppt' | 'link',
    url: '',
    subject: 'Mathematics',
    class: 'JSS 3A',
  });

  // Syllabus Progress State
  const [curriculumTopics, setCurriculumTopics] = useState<CurriculumTopic[]>([
    {
      id: '1',
      subject: 'Mathematics',
      class: 'JSS 3A',
      term: 'First Term',
      week: 1,
      topic: 'Introduction to Algebra',
      completed: true,
      lessonNoteId: '1',
    },
    {
      id: '2',
      subject: 'Mathematics',
      class: 'JSS 3A',
      term: 'First Term',
      week: 2,
      topic: 'Algebraic Expressions',
      completed: false,
    },
    {
      id: '3',
      subject: 'Mathematics',
      class: 'JSS 3A',
      term: 'First Term',
      week: 3,
      topic: 'Simple Equations',
      completed: false,
    },
    {
      id: '4',
      subject: 'Mathematics',
      class: 'JSS 3A',
      term: 'First Term',
      week: 4,
      topic: 'Linear Equations',
      completed: false,
    },
    {
      id: '5',
      subject: 'Mathematics',
      class: 'JSS 3A',
      term: 'First Term',
      week: 5,
      topic: 'Quadratic Equations',
      completed: false,
    },
    {
      id: '6',
      subject: 'Further Mathematics',
      class: 'JSS 3A',
      term: 'First Term',
      week: 1,
      topic: 'Advanced Algebra',
      completed: false,
    },
    {
      id: '7',
      subject: 'Mathematics',
      class: 'JSS 2B',
      term: 'First Term',
      week: 1,
      topic: 'Basic Arithmetic',
      completed: true,
    },
    {
      id: '8',
      subject: 'Mathematics',
      class: 'JSS 3A',
      term: 'Second Term',
      week: 1,
      topic: 'Geometry Basics',
      completed: false,
    },
  ]);

  // Filter states for Syllabus Progress
  const [syllabusFilters, setSyllabusFilters] = useState({
    subject: 'Mathematics',
    class: 'JSS 3A',
    term: 'First Term',
  });

  // Lesson Note Handlers
  const handleCreateNew = () => {
    setCurrentNote(undefined);
    setShowEditor(true);
  };

  const handleEditNote = (note: LessonNote) => {
    setCurrentNote(note);
    setShowEditor(true);
  };

  const handleSaveNote = (noteData: Partial<LessonNote>) => {
    if (currentNote) {
      const updatedNote: LessonNote = {
        ...currentNote,
        ...noteData,
        updatedAt: new Date(),
      };
      
      // Save to localStorage via dataFlowService
      const noteRecord: dataFlowService.LessonNoteRecord = {
        ...updatedNote,
        createdAt: updatedNote.createdAt.toISOString(),
        updatedAt: updatedNote.updatedAt.toISOString(),
        approvedAt: updatedNote.approvedAt?.toISOString(),
        sharedAt: updatedNote.sharedAt?.toISOString(),
      };
      dataFlowService.saveLessonNote(noteRecord);
      
      setLessonNotes((prev) =>
        prev.map((note) =>
          note.id === currentNote.id ? updatedNote : note
        )
      );
      toast.success('Lesson note saved as draft');
    } else {
      const newNote: LessonNote = {
        id: Date.now().toString(),
        teacherId: user.id,
        teacherName: user.name,
        ...(noteData as Omit<LessonNote, 'id' | 'teacherId' | 'teacherName' | 'createdAt' | 'updatedAt'>),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Save to localStorage via dataFlowService
      const noteRecord: dataFlowService.LessonNoteRecord = {
        ...newNote,
        createdAt: newNote.createdAt.toISOString(),
        updatedAt: newNote.updatedAt.toISOString(),
        approvedAt: newNote.approvedAt?.toISOString(),
        sharedAt: newNote.sharedAt?.toISOString(),
      };
      dataFlowService.saveLessonNote(noteRecord);
      
      setLessonNotes((prev) => [...prev, newNote]);
      toast.success('Lesson note saved as draft');
    }
    setShowEditor(false);
  };

  const handleSubmitForApproval = (noteData: Partial<LessonNote>) => {
    handleSaveNote({ ...noteData, status: 'pending' });
    toast.success('Lesson note submitted for Principal approval');
  };

  const handleDeleteNote = (id: string) => {
    setLessonNotes((prev) => prev.filter((note) => note.id !== id));
    setShowEditor(false);
    toast.success('Lesson note deleted');
  };

  // Study Material Handlers
  const handleAddMaterial = () => {
    if (!newMaterial.title || !newMaterial.url) {
      toast.error('Please fill in all fields');
      return;
    }

    const material: StudyMaterial = {
      id: Date.now().toString(),
      ...newMaterial,
      uploadDate: new Date().toISOString().split('T')[0],
    };

    setStudyMaterials((prev) => [material, ...prev]);
    setShowMaterialDialog(false);
    setNewMaterial({
      title: '',
      type: 'pdf',
      url: '',
      subject: 'Mathematics',
      class: 'JSS 3A',
    });
    toast.success('Study material added successfully');
  };

  const handleDeleteMaterial = (id: string) => {
    setStudyMaterials((prev) => prev.filter((m) => m.id !== id));
    toast.success('Study material deleted');
  };

  // Syllabus Progress Handlers
  const handleToggleTopic = (id: string) => {
    setCurriculumTopics((prev) =>
      prev.map((topic) =>
        topic.id === id ? { ...topic, completed: !topic.completed } : topic
      )
    );
  };

  // Share with Students Handler
  const handleShareWithStudents = (note: LessonNote) => {
    if (note.status !== 'published') {
      toast.error('Only approved lesson notes can be shared with students');
      return;
    }
    
    // Update the lesson note to mark it as shared
    setLessonNotes((prev) =>
      prev.map((n) =>
        n.id === note.id
          ? { ...n, sharedWithStudents: true, sharedAt: new Date() }
          : n
      )
    );
    
    toast.success(`Lesson note "${note.topic}" has been shared with ${note.class} students`);
  };

  // Share Study Material with Students
  const handleShareMaterial = (material: StudyMaterial) => {
    setStudyMaterials((prev) =>
      prev.map((m) =>
        m.id === material.id
          ? { ...m, sharedWithStudents: true, sharedAt: new Date() }
          : m
      )
    );
    
    toast.success(`Study material "${material.title}" has been shared with ${material.class} students`);
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'video':
        return <Youtube className="w-5 h-5 text-red-600" />;
      case 'ppt':
        return <File className="w-5 h-5 text-orange-500" />;
      case 'link':
        return <Link2 className="w-5 h-5 text-blue-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  // Filter curriculum topics based on selected filters
  const filteredTopics = curriculumTopics.filter(
    (topic) =>
      topic.subject === syllabusFilters.subject &&
      topic.class === syllabusFilters.class &&
      topic.term === syllabusFilters.term
  );

  const completedTopics = filteredTopics.filter((t) => t.completed).length;
  const totalTopics = filteredTopics.length;
  const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  if (showEditor) {
    return (
      <div className="p-4 sm:p-6">
        <div className="mb-4">
          <Button variant="outline" onClick={() => setShowEditor(false)}>
            ← Back to Lesson Notes
          </Button>
        </div>
        <LessonNoteEditor
          lessonNote={currentNote}
          onSave={handleSaveNote}
          onSubmitForApproval={handleSubmitForApproval}
          onDelete={handleDeleteNote}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            Lesson Note & Content Manager
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage lesson notes, study materials, and track syllabus progress
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Lesson Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">
                  {lessonNotes.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {lessonNotes.filter((n) => n.status === 'draft').length} drafts
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Approved Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">
                  {lessonNotes.filter((n) => n.status === 'published').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Published</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Study Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">
                  {studyMaterials.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Uploaded</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Syllabus Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl text-blue-950">
                  {progressPercentage.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {completedTopics}/{totalTopics} topics
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lesson-notes">
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Lesson Notes</span>
            <span className="sm:hidden">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="study-materials">
            <Upload className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Study Materials</span>
            <span className="sm:hidden">Materials</span>
          </TabsTrigger>
          <TabsTrigger value="syllabus">
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Syllabus Progress</span>
            <span className="sm:hidden">Syllabus</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Lesson Notes */}
        <TabsContent value="lesson-notes" className="mt-4 sm:mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>My Lesson Notes</CardTitle>
                  <CardDescription>
                    Create, edit, and submit lesson notes for approval
                  </CardDescription>
                </div>
                <Button
                  onClick={handleCreateNew}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Note
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lessonNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-medium">{note.topic}</h3>
                          <Badge
                            className={
                              note.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : note.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-700'
                            }
                          >
                            {note.status === 'published' && '✓ '}
                            {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {note.subject} • {note.class}
                        </p>
                        <p className="text-xs text-gray-500">
                          Updated {note.updatedAt.toLocaleDateString()}
                        </p>
                        {note.status === 'published' && note.approvedBy && (
                          <p className="text-xs text-green-600 mt-2">
                            ✓ Approved by {note.approvedBy} - Visible to students
                          </p>
                        )}
                        {note.status === 'pending' && (
                          <p className="text-xs text-amber-600 mt-2">
                            ⏳ Awaiting Principal's approval
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditNote(note)}
                          className="flex-1 sm:flex-none text-xs"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 sm:flex-none text-xs"
                          onClick={() => {
                            setSelectedNote(note);
                            setShowViewDialog(true);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 sm:flex-none text-xs"
                          onClick={() => handleShareWithStudents(note)}
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {lessonNotes.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No lesson notes yet</p>
                    <Button onClick={handleCreateNew}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Note
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Study Materials */}
        <TabsContent value="study-materials" className="mt-4 sm:mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Study Material Library</CardTitle>
                  <CardDescription>
                    Upload supplementary materials for students to download
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowMaterialDialog(true)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Material
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studyMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getMaterialIcon(material.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium mb-1">{material.title}</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                          <span>
                            {material.subject} • {material.class}
                          </span>
                          <span>{material.uploadDate}</span>
                          {material.size && <span>{material.size}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() =>
                            toast.success('Opening material in new window')
                          }
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => handleDeleteMaterial(material.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => handleShareMaterial(material)}
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {studyMaterials.length === 0 && (
                  <div className="text-center py-12">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      No study materials uploaded yet
                    </p>
                    <Button onClick={() => setShowMaterialDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Your First Material
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Syllabus Progress */}
        <TabsContent value="syllabus" className="mt-4 sm:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Syllabus Progress Tracker</CardTitle>
              <CardDescription>
                Track your curriculum coverage for the term
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Progress Bar */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">
                    {completedTopics} of {totalTopics} topics
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Select 
                  value={syllabusFilters.subject}
                  onValueChange={(value) =>
                    setSyllabusFilters({ ...syllabusFilters, subject: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Further Mathematics">
                      Further Mathematics
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={syllabusFilters.class}
                  onValueChange={(value) =>
                    setSyllabusFilters({ ...syllabusFilters, class: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JSS 3A">JSS 3A</SelectItem>
                    <SelectItem value="JSS 2B">JSS 2B</SelectItem>
                    <SelectItem value="SSS 2A">SSS 2A</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={syllabusFilters.term}
                  onValueChange={(value) =>
                    setSyllabusFilters({ ...syllabusFilters, term: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Term">First Term</SelectItem>
                    <SelectItem value="Second Term">Second Term</SelectItem>
                    <SelectItem value="Third Term">Third Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Topics Checklist */}
              <div className="space-y-2">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className={`p-4 border rounded-lg ${
                      topic.completed ? 'bg-green-50 border-green-200' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={topic.completed}
                        onCheckedChange={() => handleToggleTopic(topic.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                Week {topic.week}
                              </Badge>
                              <h4
                                className={`font-medium ${
                                  topic.completed
                                    ? 'line-through text-gray-500'
                                    : ''
                                }`}
                              >
                                {topic.topic}
                              </h4>
                            </div>
                            <p className="text-xs text-gray-500">
                              {topic.subject} • {topic.class} • {topic.term}
                            </p>
                          </div>
                          {topic.completed && topic.lessonNoteId ? (
                            <Badge className="bg-green-100 text-green-700 w-fit">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Lesson Note Created
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs w-full sm:w-auto"
                              onClick={handleCreateNew}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Create Note
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No topics found</p>
                    <p className="text-sm text-gray-500">
                      Try selecting a different subject, class, or term
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Material Dialog */}
      <Dialog open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
        <DialogContent className="w-[95vw] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Study Material</DialogTitle>
            <DialogDescription>
              Add supplementary materials for your students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="material-title">Material Title *</Label>
              <Input
                id="material-title"
                placeholder="e.g., Quadratic Equations - Past Questions"
                value={newMaterial.title}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="material-type">Material Type *</Label>
              <Select
                value={newMaterial.type}
                onValueChange={(value: any) =>
                  setNewMaterial({ ...newMaterial, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="ppt">PowerPoint Presentation</SelectItem>
                  <SelectItem value="video">YouTube Video Link</SelectItem>
                  <SelectItem value="link">External Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="material-url">
                {newMaterial.type === 'video'
                  ? 'YouTube URL *'
                  : newMaterial.type === 'link'
                  ? 'External URL *'
                  : 'Upload File *'}
              </Label>
              <Input
                id="material-url"
                placeholder={
                  newMaterial.type === 'video'
                    ? 'https://youtube.com/watch?v=...'
                    : newMaterial.type === 'link'
                    ? 'https://...'
                    : 'Click to upload file'
                }
                value={newMaterial.url}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, url: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="material-subject">Subject *</Label>
                <Select
                  value={newMaterial.subject}
                  onValueChange={(value) =>
                    setNewMaterial({ ...newMaterial, subject: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Further Mathematics">
                      Further Mathematics
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="material-class">Class *</Label>
                <Select
                  value={newMaterial.class}
                  onValueChange={(value) =>
                    setNewMaterial({ ...newMaterial, class: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JSS 3A">JSS 3A</SelectItem>
                    <SelectItem value="JSS 2B">JSS 2B</SelectItem>
                    <SelectItem value="SSS 2A">SSS 2A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMaterialDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMaterial}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Lesson Note Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="w-[95vw] sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lesson Note - Full Details</DialogTitle>
            <DialogDescription>
              Nigerian Ministry of Education Approved Format
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 p-4">
            {selectedNote && (
              <>
                {/* Header Section */}
                <div className="text-center border-b-2 border-blue-950 pb-4">
                  <h2 className="text-xl sm:text-2xl text-blue-950">
                    BISHOP FELIX OWOLABI INTERNATIONAL ACADEMY
                  </h2>
                  <p className="text-base sm:text-lg mt-2">LESSON NOTE</p>
                  <p className="text-xs sm:text-sm mt-1">
                    (Nigerian Ministry of Education Approved Template)
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-center gap-2">
                  <Badge
                    className={
                      selectedNote.status === 'published'
                        ? 'bg-green-500'
                        : selectedNote.status === 'pending'
                        ? 'bg-amber-500'
                        : 'bg-gray-500'
                    }
                  >
                    {selectedNote.status === 'published' && '✓ '}
                    {selectedNote.status.charAt(0).toUpperCase() +
                      selectedNote.status.slice(1)}
                  </Badge>
                  {selectedNote.status === 'published' && selectedNote.approvedBy && (
                    <p className="text-xs text-green-600">
                      Approved by {selectedNote.approvedBy}
                    </p>
                  )}
                </div>

                {/* 1. Basic Information */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg text-blue-950 border-b pb-2">
                    1. BASIC INFORMATION
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold">Subject:</p>
                      <p>{selectedNote.subject || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Class:</p>
                      <p>{selectedNote.class || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Term:</p>
                      <p>{selectedNote.term || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Week:</p>
                      <p>{selectedNote.week || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Period:</p>
                      <p>{selectedNote.period || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Duration:</p>
                      <p>{selectedNote.duration || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Topic Information */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg text-blue-950 border-b pb-2">
                    2. TOPIC INFORMATION
                  </h3>
                  <div>
                    <p className="font-semibold text-sm">Main Topic:</p>
                    <p className="text-sm mt-1">{selectedNote.topic || 'N/A'}</p>
                  </div>
                  {selectedNote.subTopic && (
                    <div>
                      <p className="font-semibold text-sm">Sub-Topic:</p>
                      <p className="text-sm mt-1">{selectedNote.subTopic}</p>
                    </div>
                  )}
                  {selectedNote.previousKnowledge && (
                    <div>
                      <p className="font-semibold text-sm">Previous Knowledge:</p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {selectedNote.previousKnowledge}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Learning Objectives */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg text-blue-950 border-b pb-2">
                    3. LEARNING OBJECTIVES
                  </h3>
                  {selectedNote.learningObjectivesCognitive && (
                    <div>
                      <p className="font-semibold text-sm">
                        Cognitive Domain (Knowledge & Understanding):
                      </p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {selectedNote.learningObjectivesCognitive}
                      </p>
                    </div>
                  )}
                  {selectedNote.learningObjectivesAffective && (
                    <div>
                      <p className="font-semibold text-sm">
                        Affective Domain (Attitudes & Values):
                      </p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {selectedNote.learningObjectivesAffective}
                      </p>
                    </div>
                  )}
                  {selectedNote.learningObjectivesPsychomotor && (
                    <div>
                      <p className="font-semibold text-sm">
                        Psychomotor Domain (Skills):
                      </p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {selectedNote.learningObjectivesPsychomotor}
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Instructional Materials */}
                {selectedNote.instructionalMaterials && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg text-blue-950 border-b pb-2">
                      4. INSTRUCTIONAL MATERIALS/RESOURCES
                    </h3>
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedNote.instructionalMaterials}
                    </p>
                  </div>
                )}

                {/* 5. Lesson Development */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg text-blue-950 border-b pb-2">
                    5. LESSON DEVELOPMENT
                  </h3>
                  {selectedNote.setInduction && (
                    <div>
                      <p className="font-semibold text-sm">
                        A. Set Induction/Introduction:
                      </p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {selectedNote.setInduction}
                      </p>
                    </div>
                  )}
                  {selectedNote.presentation && (
                    <div>
                      <p className="font-semibold text-sm">
                        B. Presentation/Development:
                      </p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {selectedNote.presentation}
                      </p>
                    </div>
                  )}
                  {selectedNote.evaluation && (
                    <div>
                      <p className="font-semibold text-sm">
                        C. Evaluation/Assessment:
                      </p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {selectedNote.evaluation}
                      </p>
                    </div>
                  )}
                  {selectedNote.summary && (
                    <div>
                      <p className="font-semibold text-sm">D. Summary/Conclusion:</p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {selectedNote.summary}
                      </p>
                    </div>
                  )}
                </div>

                {/* 6. Assignment */}
                {selectedNote.assignment && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg text-blue-950 border-b pb-2">
                      6. ASSIGNMENT/HOME WORK
                    </h3>
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedNote.assignment}
                    </p>
                  </div>
                )}

                {/* 7. Teacher's Reflection */}
                {selectedNote.teacherReflection && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg text-blue-950 border-b pb-2">
                      7. TEACHER'S REFLECTION
                    </h3>
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedNote.teacherReflection}
                    </p>
                  </div>
                )}

                {/* 8. HOD/Principal Remarks */}
                {selectedNote.hodRemarks && (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg text-blue-950 border-b pb-2">
                      8. HOD/PRINCIPAL'S REMARKS
                    </h3>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedNote.hodRemarks}
                      </p>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="space-y-2 pt-4 border-t text-xs text-gray-500">
                  <p>
                    <span className="font-semibold">Created:</span>{' '}
                    {selectedNote.createdAt.toLocaleDateString()} at{' '}
                    {selectedNote.createdAt.toLocaleTimeString()}
                  </p>
                  <p>
                    <span className="font-semibold">Last Updated:</span>{' '}
                    {selectedNote.updatedAt.toLocaleDateString()} at{' '}
                    {selectedNote.updatedAt.toLocaleTimeString()}
                  </p>
                  {selectedNote.approvedAt && (
                    <p>
                      <span className="font-semibold">Approved:</span>{' '}
                      {selectedNote.approvedAt.toLocaleDateString()} at{' '}
                      {selectedNote.approvedAt.toLocaleTimeString()}
                    </p>
                  )}
                  {selectedNote.sharedWithStudents && (
                    <p className="text-green-600">
                      <span className="font-semibold">✓ Shared with students</span>
                      {selectedNote.sharedAt &&
                        ` on ${selectedNote.sharedAt.toLocaleDateString()}`}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowViewDialog(false)}
            >
              Close
            </Button>
            {selectedNote && selectedNote.status !== 'published' && (
              <Button
                onClick={() => {
                  setShowViewDialog(false);
                  handleEditNote(selectedNote);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};