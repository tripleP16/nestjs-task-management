import { TaskStatus } from '../task.model';

export class GetFilterDto {
  status?: TaskStatus;
  search?: string;
}