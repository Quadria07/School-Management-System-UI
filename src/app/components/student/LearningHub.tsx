import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Video,
  Eye,
  Search,
  FolderOpen,
  ChevronRight,
  Calendar,
  CheckCircle2,
  File,
  Play,
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface Subject {
  id: string;
  name: string;
  teacher: string;
  totalNotes: number;
  lastUpdated: string;
  color: string;
}

interface LessonNote {
  id: string;
  title: string;
  topic: string;
  week: string;
  date: string;
  status: 'approved';
  materialsCount: number;
}

interface Material {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'ppt' | 'image';
  size: string;
  uploadedDate: string;
}

export const LearningHub: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonNote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showMaterialViewer, setShowMaterialViewer] = useState(false);

  const [subjects] = useState<Subject[]>([]);

  const [lessonNotes] = useState<LessonNote[]>([]);

  const [materials] = useState<Material[]>([]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'ppt':
        return <File className="w-5 h-5 text-orange-600" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setShowMaterialViewer(true);
  };

  const renderMaterialContent = () => {
    if (!selectedMaterial) return null;

    switch (selectedMaterial.type) {
      case 'video':
        return (
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm opacity-75">Video Player</p>
                <p className="text-xs opacity-50 mt-2">{selectedMaterial.name}</p>
              </div>
            </div>
          </div>
        );
      case 'pdf':
        return (
          <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-red-600" />
                <p className="text-sm text-gray-700">PDF Document Viewer</p>
                <p className="text-xs text-gray-500 mt-2">{selectedMaterial.name}</p>
                <p className="text-xs text-gray-400 mt-4">Document preview would appear here</p>
              </div>
            </div>
          </div>
        );
      case 'ppt':
        return (
          <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <File className="w-16 h-16 mx-auto mb-4 text-orange-600" />
                <p className="text-sm text-gray-700">PowerPoint Presentation</p>
                <p className="text-xs text-gray-500 mt-2">{selectedMaterial.name}</p>
                <p className="text-xs text-gray-400 mt-4">Presentation preview would appear here</p>
              </div>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="w-full rounded-lg overflow-hidden bg-gray-100">
            <div className="w-full h-[600px] flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <p className="text-sm text-gray-700">Image Viewer</p>
                <p className="text-xs text-gray-500 mt-2">{selectedMaterial.name}</p>
                <p className="text-xs text-gray-400 mt-4">Image preview would appear here</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {selectedSubject && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedSubject(null);
                  setSelectedLesson(null);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Subjects
              </Button>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">
            {selectedSubject ? selectedSubject.name : 'Learning Hub'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {selectedSubject
              ? `Teacher: ${selectedSubject.teacher} • ${selectedSubject.totalNotes} Lesson Notes`
              : 'Access your study materials and lesson notes'}
          </p>
        </div>
        {!selectedSubject && (
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        )}
      </div>

      {/* Subject Grid View */}
      {!selectedSubject && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject) => (
            <Card
              key={subject.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedSubject(subject)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center mb-3`}
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <CardTitle>{subject.name}</CardTitle>
                <CardDescription>{subject.teacher}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Lesson Notes:</span>
                    <Badge variant="outline">{subject.totalNotes}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-xs text-gray-500">{subject.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lesson Notes List View */}
      {selectedSubject && !selectedLesson && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Lesson Notes Archive
              </CardTitle>
              <CardDescription>
                All approved lesson notes for {selectedSubject.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lessonNotes.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setShowMaterialDialog(true);
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {lesson.week}
                          </Badge>
                          <Badge className="bg-green-600 text-white text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approved
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{lesson.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{lesson.topic}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {lesson.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {lesson.materialsCount} materials
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Materials
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Materials Dialog */}
      <Dialog
        open={showMaterialDialog}
        onOpenChange={(open) => {
          setShowMaterialDialog(open);
          if (!open) {
            // When dialog closes, clear selected lesson to show archive
            setSelectedLesson(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedLesson?.title}</DialogTitle>
            <DialogDescription>{selectedLesson?.topic}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <CheckCircle2 className="w-4 h-4 inline mr-1" />
                This lesson note has been approved by the Principal.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Study Materials ({materials.length})</h4>
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(material.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{material.name}</p>
                      <p className="text-xs text-gray-500">
                        {material.size} • {material.uploadedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {material.type === 'video' ? (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleViewMaterial(material)}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Watch
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleViewMaterial(material)}>
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Material Viewer Dialog */}
      <Dialog
        open={showMaterialViewer}
        onOpenChange={(open) => {
          setShowMaterialViewer(open);
          if (!open) {
            // When dialog closes, clear selected material
            setSelectedMaterial(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.name}</DialogTitle>
            <DialogDescription>
              {selectedMaterial?.type === 'video'
                ? 'Watch the video tutorial below'
                : 'View the study material below'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {renderMaterialContent()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};