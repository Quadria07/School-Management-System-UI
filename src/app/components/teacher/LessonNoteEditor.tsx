import React, { useState } from 'react';
import { LessonNote } from '../../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Save, Send, Eye, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface LessonNoteEditorProps {
  lessonNote?: LessonNote;
  onSave: (note: Partial<LessonNote>) => void;
  onSubmitForApproval: (note: Partial<LessonNote>) => void;
  onDelete?: (id: string) => void;
}

export const LessonNoteEditor: React.FC<LessonNoteEditorProps> = ({
  lessonNote,
  onSave,
  onSubmitForApproval,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Partial<LessonNote> & {
    // Nigerian Ministry of Education Template Fields
    term?: string;
    week?: number;
    period?: string;
    duration?: string;
    subTopic?: string;
    previousKnowledge?: string;
    instructionalMaterials?: string;
    learningObjectivesCognitive?: string;
    learningObjectivesAffective?: string;
    learningObjectivesPsychomotor?: string;
    setInduction?: string;
    presentation?: string;
    evaluation?: string;
    summary?: string;
    assignment?: string;
    teacherReflection?: string;
    hodRemarks?: string;
  }>({
    subject: lessonNote?.subject || '',
    class: lessonNote?.class || '',
    topic: lessonNote?.topic || '',
    content: lessonNote?.content || '',
    status: lessonNote?.status || 'draft',
    term: 'First Term',
    week: 1,
    period: '1st Period',
    duration: '40 minutes',
    subTopic: '',
    previousKnowledge: '',
    instructionalMaterials: '',
    learningObjectivesCognitive: '',
    learningObjectivesAffective: '',
    learningObjectivesPsychomotor: '',
    setInduction: '',
    presentation: '',
    evaluation: '',
    summary: '',
    assignment: '',
    teacherReflection: '',
    hodRemarks: '',
  });

  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    onSave({ ...formData, status: 'draft' });
    toast.success('Lesson note saved as draft');
  };

  const handleSubmitForApproval = () => {
    // Validate required fields
    const requiredFields = [
      'subject',
      'class',
      'topic',
      'term',
      'week',
      'duration',
      'learningObjectivesCognitive',
      'setInduction',
      'presentation',
      'evaluation',
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields before submitting');
      return;
    }

    onSubmitForApproval({ ...formData, status: 'pending' });
    toast.success('Lesson note submitted for approval');
  };

  const handleDelete = () => {
    if (lessonNote?.id && onDelete) {
      onDelete(lessonNote.id);
      toast.success('Lesson note deleted');
      setShowDeleteDialog(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; text: string }> = {
      draft: { variant: 'secondary', text: 'Draft' },
      pending: { variant: 'default', text: 'Pending Approval' },
      published: { variant: 'default', text: 'Approved' },
    };

    const config = variants[status] || variants.draft;
    return (
      <Badge 
        variant={config.variant}
        className={status === 'published' ? 'bg-green-500' : status === 'pending' ? 'bg-amber-500' : ''}
      >
        {config.text}
      </Badge>
    );
  };

  return (
    <>
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Lesson Note Editor
              </CardTitle>
              <CardDescription>
                Nigerian Ministry of Education Approved Template
              </CardDescription>
            </div>
            {formData.status && getStatusBadge(formData.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Approval Message */}
          {lessonNote?.status === 'published' && lessonNote.approvedBy && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500">Approved</Badge>
                <p className="text-sm text-green-800">
                  This lesson note has been approved by {lessonNote.approvedBy} and is now visible to students
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
              1. BASIC INFORMATION
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleInputChange('subject', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English Language">English Language</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Economics">Economics</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Literature in English">Literature in English</SelectItem>
                    <SelectItem value="Geography">Geography</SelectItem>
                    <SelectItem value="Civic Education">Civic Education</SelectItem>
                    <SelectItem value="Basic Science">Basic Science</SelectItem>
                    <SelectItem value="Basic Technology">Basic Technology</SelectItem>
                    <SelectItem value="Home Economics">Home Economics</SelectItem>
                    <SelectItem value="Agricultural Science">Agricultural Science</SelectItem>
                    <SelectItem value="Computer Studies">Computer Studies</SelectItem>
                    <SelectItem value="Christian Religious Studies">Christian Religious Studies</SelectItem>
                    <SelectItem value="Islamic Religious Studies">Islamic Religious Studies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select
                  value={formData.class}
                  onValueChange={(value) => handleInputChange('class', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JSS 1A">JSS 1A</SelectItem>
                    <SelectItem value="JSS 1B">JSS 1B</SelectItem>
                    <SelectItem value="JSS 2A">JSS 2A</SelectItem>
                    <SelectItem value="JSS 2B">JSS 2B</SelectItem>
                    <SelectItem value="JSS 3A">JSS 3A</SelectItem>
                    <SelectItem value="JSS 3B">JSS 3B</SelectItem>
                    <SelectItem value="SSS 1A">SSS 1A</SelectItem>
                    <SelectItem value="SSS 1B">SSS 1B</SelectItem>
                    <SelectItem value="SSS 2A">SSS 2A</SelectItem>
                    <SelectItem value="SSS 2B">SSS 2B</SelectItem>
                    <SelectItem value="SSS 3A">SSS 3A</SelectItem>
                    <SelectItem value="SSS 3B">SSS 3B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="term">Term *</Label>
                <Select
                  value={formData.term}
                  onValueChange={(value) => handleInputChange('term', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Term">First Term</SelectItem>
                    <SelectItem value="Second Term">Second Term</SelectItem>
                    <SelectItem value="Third Term">Third Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="week">Week *</Label>
                <Select
                  value={formData.week?.toString()}
                  onValueChange={(value) => handleInputChange('week', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(13)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Week {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value) => handleInputChange('period', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Period">1st Period (8:00 - 8:40)</SelectItem>
                    <SelectItem value="2nd Period">2nd Period (8:40 - 9:20)</SelectItem>
                    <SelectItem value="3rd Period">3rd Period (9:20 - 10:00)</SelectItem>
                    <SelectItem value="4th Period">4th Period (10:20 - 11:00)</SelectItem>
                    <SelectItem value="5th Period">5th Period (11:00 - 11:40)</SelectItem>
                    <SelectItem value="6th Period">6th Period (11:40 - 12:20)</SelectItem>
                    <SelectItem value="7th Period">7th Period (12:20 - 1:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 40 minutes"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Topic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
              2. TOPIC INFORMATION
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Main Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Introduction to Algebra"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subTopic">Sub-Topic</Label>
                <Input
                  id="subTopic"
                  placeholder="e.g., Linear Equations in One Variable"
                  value={formData.subTopic}
                  onChange={(e) => handleInputChange('subTopic', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousKnowledge">Previous Knowledge</Label>
                <Textarea
                  id="previousKnowledge"
                  placeholder="What prior knowledge should students have before this lesson?"
                  value={formData.previousKnowledge}
                  onChange={(e) => handleInputChange('previousKnowledge', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Learning Objectives */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
              3. LEARNING OBJECTIVES
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cognitiveObjectives">
                  Cognitive Domain (Knowledge & Understanding) *
                </Label>
                <Textarea
                  id="cognitiveObjectives"
                  placeholder="By the end of the lesson, students should be able to:&#10;1. Define/Explain...&#10;2. Identify/List...&#10;3. Calculate/Solve..."
                  value={formData.learningObjectivesCognitive}
                  onChange={(e) => handleInputChange('learningObjectivesCognitive', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="affectiveObjectives">
                  Affective Domain (Attitudes & Values)
                </Label>
                <Textarea
                  id="affectiveObjectives"
                  placeholder="e.g., Develop appreciation for mathematics in real life, Show respect during group discussions"
                  value={formData.learningObjectivesAffective}
                  onChange={(e) => handleInputChange('learningObjectivesAffective', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="psychomotorObjectives">
                  Psychomotor Domain (Skills)
                </Label>
                <Textarea
                  id="psychomotorObjectives"
                  placeholder="e.g., Construct geometric shapes accurately, Perform laboratory procedures safely"
                  value={formData.learningObjectivesPsychomotor}
                  onChange={(e) => handleInputChange('learningObjectivesPsychomotor', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Instructional Materials/Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
              4. INSTRUCTIONAL MATERIALS/RESOURCES
            </h3>
            <div className="space-y-2">
              <Label htmlFor="materials">Teaching Aids & Resources</Label>
              <Textarea
                id="materials"
                placeholder="List all materials needed:&#10;- Textbooks&#10;- Charts/Posters&#10;- Laboratory equipment&#10;- Multimedia/Projector&#10;- Real objects/Models&#10;- Worksheets"
                value={formData.instructionalMaterials}
                onChange={(e) => handleInputChange('instructionalMaterials', e.target.value)}
                rows={5}
              />
            </div>
          </div>

          {/* Section 5: Lesson Development */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
              5. LESSON DEVELOPMENT
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="setInduction">
                A. Set Induction/Introduction (5-7 minutes) *
              </Label>
              <Textarea
                id="setInduction"
                placeholder="How will you capture students' attention and link to previous knowledge?&#10;e.g., Ask questions, tell a story, show a video, conduct a quick demonstration"
                value={formData.setInduction}
                onChange={(e) => handleInputChange('setInduction', e.target.value)}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presentation">
                B. Presentation/Development (25-30 minutes) *
              </Label>
              <Textarea
                id="presentation"
                placeholder="Step-by-step teaching procedure:&#10;&#10;Step 1: Teacher's Activity | Students' Activity&#10;- Explain the concept | Listen and take notes&#10;&#10;Step 2: Demonstration | Observe and ask questions&#10;&#10;Step 3: Guided practice | Work in groups&#10;&#10;Include:&#10;- Main points to cover&#10;- Examples to use&#10;- Questions to ask&#10;- Student activities&#10;- Teaching methods (lecture, discussion, demonstration, etc.)"
                value={formData.presentation}
                onChange={(e) => handleInputChange('presentation', e.target.value)}
                rows={12}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluation">
                C. Evaluation/Assessment (5 minutes) *
              </Label>
              <Textarea
                id="evaluation"
                placeholder="Questions or activities to assess if objectives were achieved:&#10;1. ...&#10;2. ...&#10;3. ...&#10;&#10;Include both oral and written questions"
                value={formData.evaluation}
                onChange={(e) => handleInputChange('evaluation', e.target.value)}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">
                D. Summary/Conclusion (3-5 minutes)
              </Label>
              <Textarea
                id="summary"
                placeholder="How will you summarize the main points of the lesson?&#10;Key takeaways that students should remember"
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Section 6: Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
              6. ASSIGNMENT/HOME WORK
            </h3>
            <div className="space-y-2">
              <Label htmlFor="assignment">Assignment</Label>
              <Textarea
                id="assignment"
                placeholder="Classwork and homework exercises:&#10;&#10;CLASSWORK:&#10;1. ...&#10;2. ...&#10;&#10;HOMEWORK:&#10;1. ...&#10;2. ...&#10;&#10;Reading assignment/Further research topics"
                value={formData.assignment}
                onChange={(e) => handleInputChange('assignment', e.target.value)}
                rows={6}
              />
            </div>
          </div>

          {/* Section 7: Teacher's Reflection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
              7. TEACHER'S REFLECTION (Complete after lesson)
            </h3>
            <div className="space-y-2">
              <Label htmlFor="reflection">Reflection</Label>
              <Textarea
                id="reflection"
                placeholder="After teaching, reflect on:&#10;- Were the objectives achieved?&#10;- What went well?&#10;- What challenges did you face?&#10;- What would you do differently next time?&#10;- How did students respond?&#10;- Do students need remedial or enrichment activities?"
                value={formData.teacherReflection}
                onChange={(e) => handleInputChange('teacherReflection', e.target.value)}
                rows={6}
              />
            </div>
          </div>

          {/* Section 8: HOD/Principal Remarks */}
          {lessonNote?.status === 'published' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-950 border-b pb-2">
                8. HOD/PRINCIPAL'S REMARKS
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  {formData.hodRemarks || 'No remarks yet'}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex gap-2">
              {lessonNote?.id && onDelete && (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={formData.status === 'published'}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>

              <Button
                onClick={handleSubmitForApproval}
                disabled={formData.status === 'published'}
                className="bg-blue-950 hover:bg-blue-900"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit for Approval
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lesson Note Preview</DialogTitle>
            <DialogDescription>
              Nigerian Ministry of Education Approved Format
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 p-6 bg-white" id="lesson-note-preview">
            {/* Header */}
            <div className="text-center border-b-2 border-blue-950 pb-4">
              <h2 className="text-2xl font-bold text-blue-950">
                BISHOP FELIX OWOLABI INTERNATIONAL ACADEMY
              </h2>
              <p className="text-lg mt-2">LESSON NOTE</p>
              <p className="text-sm mt-1">
                (Nigerian Ministry of Education Approved Template)
              </p>
            </div>

            {/* Basic Info Table */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Subject:</strong> {formData.subject || 'N/A'}
              </div>
              <div>
                <strong>Class:</strong> {formData.class || 'N/A'}
              </div>
              <div>
                <strong>Term:</strong> {formData.term || 'N/A'}
              </div>
              <div>
                <strong>Week:</strong> {formData.week || 'N/A'}
              </div>
              <div>
                <strong>Period:</strong> {formData.period || 'N/A'}
              </div>
              <div>
                <strong>Duration:</strong> {formData.duration || 'N/A'}
              </div>
              <div className="col-span-2">
                <strong>Topic:</strong> {formData.topic || 'N/A'}
              </div>
              {formData.subTopic && (
                <div className="col-span-2">
                  <strong>Sub-Topic:</strong> {formData.subTopic}
                </div>
              )}
            </div>

            {/* Previous Knowledge */}
            {formData.previousKnowledge && (
              <div>
                <h3 className="font-bold text-blue-950 mb-2">PREVIOUS KNOWLEDGE:</h3>
                <p className="whitespace-pre-wrap text-sm">{formData.previousKnowledge}</p>
              </div>
            )}

            {/* Learning Objectives */}
            <div>
              <h3 className="font-bold text-blue-950 mb-2">LEARNING OBJECTIVES:</h3>
              {formData.learningObjectivesCognitive && (
                <div className="mb-3">
                  <p className="font-semibold text-sm">Cognitive Domain:</p>
                  <p className="whitespace-pre-wrap text-sm ml-4">{formData.learningObjectivesCognitive}</p>
                </div>
              )}
              {formData.learningObjectivesAffective && (
                <div className="mb-3">
                  <p className="font-semibold text-sm">Affective Domain:</p>
                  <p className="whitespace-pre-wrap text-sm ml-4">{formData.learningObjectivesAffective}</p>
                </div>
              )}
              {formData.learningObjectivesPsychomotor && (
                <div>
                  <p className="font-semibold text-sm">Psychomotor Domain:</p>
                  <p className="whitespace-pre-wrap text-sm ml-4">{formData.learningObjectivesPsychomotor}</p>
                </div>
              )}
            </div>

            {/* Instructional Materials */}
            {formData.instructionalMaterials && (
              <div>
                <h3 className="font-bold text-blue-950 mb-2">INSTRUCTIONAL MATERIALS:</h3>
                <p className="whitespace-pre-wrap text-sm">{formData.instructionalMaterials}</p>
              </div>
            )}

            {/* Set Induction */}
            {formData.setInduction && (
              <div>
                <h3 className="font-bold text-blue-950 mb-2">SET INDUCTION/INTRODUCTION:</h3>
                <p className="whitespace-pre-wrap text-sm">{formData.setInduction}</p>
              </div>
            )}

            {/* Presentation */}
            {formData.presentation && (
              <div>
                <h3 className="font-bold text-blue-950 mb-2">PRESENTATION/DEVELOPMENT:</h3>
                <p className="whitespace-pre-wrap text-sm">{formData.presentation}</p>
              </div>
            )}

            {/* Evaluation */}
            {formData.evaluation && (
              <div>
                <h3 className="font-bold text-blue-950 mb-2">EVALUATION/ASSESSMENT:</h3>
                <p className="whitespace-pre-wrap text-sm">{formData.evaluation}</p>
              </div>
            )}

            {/* Summary */}
            {formData.summary && (
              <div>
                <h3 className="font-bold text-blue-950 mb-2">SUMMARY/CONCLUSION:</h3>
                <p className="whitespace-pre-wrap text-sm">{formData.summary}</p>
              </div>
            )}

            {/* Assignment */}
            {formData.assignment && (
              <div>
                <h3 className="font-bold text-blue-950 mb-2">ASSIGNMENT/HOMEWORK:</h3>
                <p className="whitespace-pre-wrap text-sm">{formData.assignment}</p>
              </div>
            )}

            {/* Teacher's Reflection */}
            {formData.teacherReflection && (
              <div>
                <h3 className="font-bold text-blue-950 mb-2">TEACHER'S REFLECTION:</h3>
                <p className="whitespace-pre-wrap text-sm">{formData.teacherReflection}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button onClick={() => window.print()} className="bg-blue-950">
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lesson Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lesson note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};