import { BroadsheetData } from '@/app/components/principal/types';

interface StoredStudent {
  id: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  passportPhoto?: string;
  [key: string]: any;
}

/**
 * Utility function to merge student passport photos from localStorage with result data
 */
export const mergeStudentPhotos = (studentsResults: BroadsheetData[]): BroadsheetData[] => {
  try {
    // Get stored students from localStorage
    const storedStudentsJson = localStorage.getItem('bfoia_students');
    if (!storedStudentsJson) {
      return studentsResults;
    }

    const storedStudents: StoredStudent[] = JSON.parse(storedStudentsJson);

    // Create a map for quick lookup by student name (case-insensitive)
    const studentPhotoMap = new Map<string, string>();
    storedStudents.forEach(student => {
      if (student.passportPhoto) {
        studentPhotoMap.set(student.studentName.toLowerCase().trim(), student.passportPhoto);
      }
    });

    // Merge photos with results
    return studentsResults.map(result => {
      const studentKey = result.studentName.toLowerCase().trim();
      const passportPhoto = studentPhotoMap.get(studentKey);
      
      return {
        ...result,
        passportPhoto: passportPhoto || result.passportPhoto
      };
    });
  } catch (error) {
    console.error('Error merging student photos:', error);
    return studentsResults;
  }
};

/**
 * Get a single student's passport photo by name
 */
export const getStudentPhoto = (studentName: string): string | undefined => {
  try {
    const storedStudentsJson = localStorage.getItem('bfoia_students');
    if (!storedStudentsJson) {
      return undefined;
    }

    const storedStudents: StoredStudent[] = JSON.parse(storedStudentsJson);
    const student = storedStudents.find(
      s => s.studentName.toLowerCase().trim() === studentName.toLowerCase().trim()
    );

    return student?.passportPhoto;
  } catch (error) {
    console.error('Error getting student photo:', error);
    return undefined;
  }
};
