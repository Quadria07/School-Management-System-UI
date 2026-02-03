export interface SubjectScores {
  first: number;
  second: number;
  third: number;
  total: number;
  average: number;
  position: number;
}

export interface BroadsheetData {
  sn: number;
  studentName: string;
  class: string;
  passportPhoto?: string; // Base64 encoded passport photo
  english: SubjectScores;
  mathematics: SubjectScores;
  basicScience: SubjectScores;
  prevocational: SubjectScores;
  nationalValues: SubjectScores;
  totalScore: number;
  overallAverage: number;
  percentAverage: number;
  overallPosition: number;
  grade: string;
  remarks: string;
}