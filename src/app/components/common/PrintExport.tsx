import React from 'react';
import { Printer, Download, FileText, File } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';

interface PrintExportProps {
  data: any;
  fileName?: string;
  title?: string;
  type?: 'report-card' | 'results' | 'attendance' | 'general';
}

export const PrintExport: React.FC<PrintExportProps> = ({
  data,
  fileName = 'export',
  title = 'Export Data',
  type = 'general',
}) => {
  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleExportPDF = () => {
    toast.info('PDF export feature coming soon! For now, use the Print option and select "Save as PDF"');
  };

  const handleExportExcel = () => {
    try {
      // Convert data to CSV format
      let csvContent = '';
      
      if (type === 'results') {
        csvContent = convertResultsToCSV(data);
      } else if (type === 'attendance') {
        csvContent = convertAttendanceToCSV(data);
      } else {
        csvContent = convertGenericToCSV(data);
      }

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const convertResultsToCSV = (results: any) => {
    let csv = 'Name,Student ID,Class,Subject,CA1,CA2,Exam,Total,Grade,Position\n';
    
    if (Array.isArray(results.students)) {
      results.students.forEach((student: any) => {
        csv += `${student.name || ''},${student.studentId || ''},${results.class || ''},${results.subject || ''},${student.ca1 || ''},${student.ca2 || ''},${student.exam || ''},${student.totalScore || ''},${student.grade || ''},${student.position || ''}\n`;
      });
    }
    
    return csv;
  };

  const convertAttendanceToCSV = (attendance: any) => {
    let csv = 'Date,Student Name,Status,Class,Subject\n';
    
    if (Array.isArray(attendance)) {
      attendance.forEach((record: any) => {
        record.students?.forEach((student: any) => {
          csv += `${record.date || ''},${student.studentName || ''},${student.status || ''},${record.class || ''},${record.subject || ''}\n`;
        });
      });
    }
    
    return csv;
  };

  const convertGenericToCSV = (data: any) => {
    if (Array.isArray(data)) {
      if (data.length === 0) return '';
      
      // Get headers from first object
      const headers = Object.keys(data[0]);
      let csv = headers.join(',') + '\n';
      
      // Add data rows
      data.forEach((row: any) => {
        const values = headers.map(header => {
          const value = row[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        });
        csv += values.join(',') + '\n';
      });
      
      return csv;
    }
    
    // For single object, convert to key-value pairs
    let csv = 'Field,Value\n';
    Object.entries(data).forEach(([key, value]) => {
      csv += `${key},${value}\n`;
    });
    return csv;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleExportExcel}>
          <File className="w-4 h-4 mr-2" />
          Export to Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Utility function to export report card
export const exportReportCard = (studentData: any, fileName: string) => {
  // This would be used for complex report card exports
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error('Please allow popups to print report card');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${fileName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
        }
        @media print {
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>BISHOP FELIX OWOLABI INTERNATIONAL ACADEMY</h1>
        <h2>STUDENT REPORT CARD</h2>
      </div>
      <div>
        <p><strong>Student Name:</strong> ${studentData.name || 'N/A'}</p>
        <p><strong>Class:</strong> ${studentData.class || 'N/A'}</p>
        <p><strong>Term:</strong> ${studentData.term || 'N/A'}</p>
        <p><strong>Session:</strong> ${studentData.session || 'N/A'}</p>
      </div>
      <!-- Add more content here -->
      <button onclick="window.print()">Print</button>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
