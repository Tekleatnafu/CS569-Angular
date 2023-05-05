import { EventEmitter, Injectable } from '@angular/core';
import { IGoal } from '../interfaces/goal.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../interfaces/api-response.interface';
import { Subscription } from 'rxjs';
import { IStep } from '../interfaces/step.interface';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  requestGoalById$: EventEmitter<IGoal> = new EventEmitter<IGoal>();
  requestGoals$: EventEmitter<IGoal[]> = new EventEmitter<IGoal[]>();

  constructor(private http: HttpClient) {
  }

  requestGoalById(goal_id: number) {
    return this.http.get<IApiResponse<IGoal>>(`${environment.server}/goals/${goal_id}`).subscribe(resp => {
      if (resp.success) {
        this.requestGoalById$.emit(resp.data);
      }
    });
  }

  requestGoals() {
    this.http.get<IApiResponse<IGoal[]>>(`${environment.server}/goals`).subscribe(resp => {
      if (resp.success) {
        resp.data?.forEach((goal) => {
          let sum = 0;

          if (goal.steps.length > 0) {
            for (let i = 0; i < goal.steps.length; i++) {
              const step = goal.steps[i];
              sum += step.status;
            }

            goal.percentage = Math.ceil(sum / (2 * goal.steps.length) * 100);
          } else {
            goal.percentage = 0;
          }
        })

        this.requestGoals$.emit(resp.data);
      }
    });
  }

  addGoal(goal: IGoal) {
    return this.http.post<IApiResponse<IGoal>>(`${environment.server}/goals`, goal);
  }

  editGoalById(goal_id: number, goal: IGoal) {
    return this.http.patch<IApiResponse<IGoal>>(`${environment.server}/goals/${goal_id}`, goal);
  }

  deleteGoalById(goal_id: number) {
    return this.http.delete(`${environment.server}/goals/${goal_id}`);
  }

  addStep(goal_id: number, step: IStep) {
    return this.http.post<IApiResponse<IStep>>(`${environment.server}/goals/${goal_id}/steps`, step);
  }

  editStepById(goal_id: number, step_id: number, step: IStep) {
    return this.http.patch<IApiResponse<IStep>>(`${environment.server}/goals/${goal_id}/steps/${step_id}`, step);
  }

  deleteStepById(goal_id: number, step_id: number) {
    return this.http.delete(`${environment.server}/goals/${goal_id}/steps/${step_id}`);
  }
}
