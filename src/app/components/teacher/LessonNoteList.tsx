import React, { useState, useEffect } from 'react';
import { TeacherAPI } from '../../../utils/api';
import { LessonNote } from '../../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Eye, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { toast } from 'sonner';

interface LessonNoteListProps {
    onCreateNew: () => void;
    onEdit: (note: LessonNote) => void;
}

export const LessonNoteList: React.FC<LessonNoteListProps> = ({ onCreateNew, onEdit }) => {
    const [notes, setNotes] = useState<LessonNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const res = await TeacherAPI.getLessonNotes();
            if (res.status === 'success' && res.data) {
                setNotes(res.data as LessonNote[]);
            }
        } catch (error) {
            console.error('Error fetching lesson notes:', error);
            toast.error('Failed to load lesson notes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const filteredNotes = notes.filter(note =>
        note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.class.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
            case 'pending':
                return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200"><AlertCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
            default:
                return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Draft</Badge>;
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-950">Lesson Notes</h1>
                    <p className="text-gray-600">Manage and track your lesson notes approval status</p>
                </div>
                <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Note
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">My Lesson Notes</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search notes..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredNotes.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50 text-left">
                                        <th className="p-4 font-medium">Topic</th>
                                        <th className="p-4 font-medium">Class & Subject</th>
                                        <th className="p-4 font-medium">Term/Week</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium">Last Updated</th>
                                        <th className="p-4 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNotes.map((note) => (
                                        <tr key={note.id} className="border-b hover:bg-blue-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-semibold text-blue-900">{note.topic}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-gray-700">{note.subject}</div>
                                                <div className="text-xs text-gray-500">{note.class}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-gray-700">{note.term || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">Week {note.week || 1}</div>
                                            </td>
                                            <td className="p-4">
                                                {getStatusBadge(note.status)}
                                            </td>
                                            <td className="p-4 text-gray-500">
                                                {new Date().toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => onEdit(note)}>
                                                        <Pencil className="w-4 h-4 text-blue-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="w-4 h-4 text-gray-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No lesson notes found</h3>
                            <p className="text-gray-500 mb-6">You haven't created any lesson notes yet or no records match your search.</p>
                            <Button onClick={onCreateNew} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                                <Plus className="w-4 h-4 mr-2" />
                                Create your first note
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
