import { WeeklyStatus } from '../objects/weekly-status';

interface RawFileUpload {
  file_url: string;
}

interface RawReportUpload {
  file_upload_id: string;
  description: string;
  files: RawFileUpload[];
}

interface RawWeeklyReport {
  week_id: string;
  wk_start_date: string;
  wk_end_date: string;
  report_uploads: RawReportUpload[];
  month: string;
  year: number;
  created_on?: string;
  created_date?: string;
  project_id: string;
  'Material Integrity Audit'?: 'verified' | 'pending' | 'failed';
  'Structural Safety Certification'?: 'certified' | 'pending' | 'failed';
}

interface RawProjectResponse {
  project_id: string;
  created_on: string;
  scheduled_end_date: string;
  end_date: string | null;
  is_active: boolean;
  status: string;
  updated_on: string;
  weekly_reports: RawWeeklyReport[];
}

export const convertToWeeklyStatus = (rawResponse: RawProjectResponse): WeeklyStatus[] => {
  if (!rawResponse.weekly_reports) return [];

  return rawResponse.weekly_reports.map((report) => {
    // Collect all unique photos from all upload entries
    const photos: string[] = [];
    const descriptions: string[] = [];
    if (report.report_uploads) {
      report.report_uploads.forEach((upload) => {
        if (upload.description) {
          descriptions.push(upload.description);
        }
        if (upload.files) {
          upload.files.forEach((file) => {
            if (file.file_url) {
              photos.push(file.file_url);
            }
          });
        }
      });
    }

    console.log('[WeeklyStatusConverter] Raw report item keys:', Object.keys(report));

    const reportDateStr = report.created_date || report.created_on || report.wk_start_date || rawResponse.created_on || '';
    const datePart = reportDateStr.split(' ')[0]; 
    
    let dateObj: Date | null = null;
    if (datePart && datePart !== 'N/A') {
      dateObj = new Date(datePart);
      if (isNaN(dateObj.getTime())) {
        dateObj = new Date(datePart.replace(/-/g, '/'));
      }
    }
    
    const isValidDate = dateObj && !isNaN(dateObj.getTime());

    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    const formatDisplayDate = (date: Date | null) => {
      if (!date || isNaN(date.getTime())) return 'N/A';
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'long' });
      const year = date.getFullYear();
      return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
    };

    const converted: WeeklyStatus = {
      id: report.week_id,
      month: report.month && report.month !== 'N/A' ? report.month : (isValidDate ? dateObj!.toLocaleString('en-US', { month: 'long' }) : 'N/A'),
      year: report.year && report.year !== 0 ? report.year : (isValidDate ? dateObj!.getFullYear() : 0),
      startDate: report.wk_start_date || 'N/A',
      endDate: report.wk_end_date || 'N/A',
      photos: photos,
      date: formatDisplayDate(dateObj),
      userId: 'N/A',
      project_id: report.project_id || rawResponse.project_id,
      progressText: descriptions.length > 0 ? descriptions.join(' | ') : 'N/A',
      comments: [],
      auditMaterial: report['Material Integrity Audit'] || 'pending',
      auditSafety: report['Structural Safety Certification'] || 'pending',
      source: 'external' as const
    };

    console.log('[WeeklyStatusConverter] Converted report:', converted);
    return converted;
  });
};
