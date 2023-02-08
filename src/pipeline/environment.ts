import { injectable } from 'inversify';

@injectable()
export class Environment {
  public userUuid: string;
  public taskId: string;
  public pipelineId: string;
}
