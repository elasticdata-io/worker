export class CommandInformation {
  cmd: string;
  name: string;
  uuid: string;
  materializedUuidPath: string;
  runTimeConfig: { [key: string]: any };
  designTimeConfig: { [key: string]: any };
  startOnUtc: Date;
  endOnUtc: Date;
  status: 'success' | 'error';
  failureReason?: string;
  dataContext: string;
  pageContext: number;
  dataValue?: any;
}
