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
    const startDate = new Date(report.wk_start_date);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Collect all unique photos from all upload entries
    const photos: string[] = [];
    const descriptions: string[] = [];

    report.report_uploads.forEach((upload) => {
      if (upload.description) {
        descriptions.push(upload.description);
      }
      upload.files.forEach((file) => {
        if (file.file_url) {
          photos.push(file.file_url);
        }
      });
    });

    return {
      id: report.week_id,
      project_id: rawResponse.project_id,
      month: months[startDate.getMonth()],
      year: startDate.getFullYear(),
      startDate: report.wk_start_date,
      endDate: report.wk_end_date,
      date: rawResponse.created_on.split('T')[0], // Using project creation date as a fallback for report date
      photos: photos,
      progressText: descriptions.join(' | '),
      userId: 'system', // Default user ID as it's not present in the sample JSON
      auditMaterial: 'pending',
      auditSafety: 'pending',
      source: 'external',
      comments: []
    };
  });
};
