import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useParent } from '../../../contexts/ParentContext';

interface LessonNote {
  id: string;
  subject: string;
  topic: string;
  week: string;
  date: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
}

export const LearningOversight: React.FC = () => {
  const parentContext = useParent();
  const selectedChild = parentContext?.selectedChild;

  const [lessonNotes] = useState<LessonNote[]>([
    { id: '1', subject: 'Mathematics', topic: 'Quadratic Equations', week: 'Week 12', date: 'Dec 28' },
    { id: '2', subject: 'English', topic: 'Essay Writing Techniques', week: 'Week 12', date: 'Dec 28' },
    { id: '3', subject: 'Biology', topic: 'Cell Division', week: 'Week 12', date: 'Dec 27' },
  ]);

  const [assignments] = useState<Assignment[]>([
    { id: '1', title: 'Essay: Technology in Education', subject: 'English', dueDate: 'Tomorrow', status: 'pending' },
    { id: '2', title: 'Chapter 5 Review', subject: 'Biology', dueDate: 'Thursday', status: 'submitted' },
    { id: '3', title: 'Quadratic Practice Set', subject: 'Mathematics', dueDate: 'Completed', status: 'graded', score: 18 },
  ]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl mb-2 text-blue-950">Learning Oversight</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Monitor <strong>{selectedChild?.name}'s</strong> academic progress and homework
        </p>
      </div>

      {/* Current Curriculum */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Current Curriculum - What They're Learning
          </CardTitle>
          <CardDescription>Recent lesson notes to help with home study</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lessonNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{note.week}</Badge>
                      <Badge className="bg-blue-600 text-white">{note.subject}</Badge>
                    </div>
                    <h4 className="font-semibold mb-1">{note.topic}</h4>
                    <p className="text-sm text-gray-600">{note.date}</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assignment Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" />
            Assignment Tracker
          </CardTitle>
          <CardDescription>Monitor homework submissions and grades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`p-4 rounded-lg border ${
                  assignment.status === 'graded'
                    ? 'bg-green-50 border-green-200'
                    : assignment.status === 'submitted'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{assignment.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{assignment.subject}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Due: {assignment.dueDate}</span>
                    </div>
                  </div>
                  {assignment.status === 'graded' ? (
                    <Badge className="bg-green-600 text-white">Score: {assignment.score}/20</Badge>
                  ) : assignment.status === 'submitted' ? (
                    <Badge className="bg-blue-600 text-white">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Submitted
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-600 text-white">Pending</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};