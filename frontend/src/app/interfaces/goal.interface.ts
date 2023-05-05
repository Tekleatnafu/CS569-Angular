// User's Goals
import { IStep } from './step.interface';

export interface IGoal {
  id: number,
  user_id: number, // from JWT, ObjectId()
  title: string,
  description: string,
  deadline: string, // timestamp
  steps: IStep[],
  percentage?: number
}
