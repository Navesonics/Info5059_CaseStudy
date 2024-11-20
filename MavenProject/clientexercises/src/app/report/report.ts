import { ReportItem } from './report-item';

export interface Report {
  id: number;
  employeeid: number;
  items: ReportItem[];
}
