import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { GoalService } from './goal.service';
import { IGoal } from '../interfaces/goal.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { IApiResponse } from '../interfaces/api-response.interface';
import { Observable, Subscription } from 'rxjs';
import { IStep } from '../interfaces/step.interface';

@Component({
  selector: 'app-goal',
  template: `
    <div class="goal-form">
      <div class="container">
        <div class="row">
          <div class="col-6">
            <div class="row mt-3">
              <div class="col-12">
                <h3>Goal</h3>
              </div>
              <div class="col-12 mt-3">
                <form [formGroup]="goalForm" (ngSubmit)="onGoalSubmit()">
                  <div class="mb-3 row">
                    <label for="title" class="col-3 col-form-label">Title</label>
                    <div class="col-9">
                      <input id="title" type="text" formControlName="title" class="form-control" />
                      <div *ngIf="!f['title'].pristine && f['title'].errors" class="error">
                        <div *ngIf="f['title'].errors['required']">Title is required</div>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="description" class="col-3 col-form-label">Description</label>
                    <div class="col-9">
                      <input id="description" type="text" formControlName="description" class="form-control" />
                      <div *ngIf="!f['description'].pristine && f['description'].errors" class="error">
                        <div *ngIf="f['description'].errors['required']">
                          Description is required
                        </div>
                        <div *ngIf="f['description'].errors['maxlength']">
                          Description must not exceed 1000 characters
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="deadline" class="col-sm-3 col-form-label">Deadline</label>
                    <div class="col-9">
                      <input id="deadline" type="date" formControlName="deadline" class="form-control" />
                      <div *ngIf="!f['deadline'].pristine && f['deadline'].errors" class="error">
                        <div *ngIf="f['deadline'].errors['required']">Deadline is required</div>
                        <div *ngIf="f['deadline'].errors['deadline']">Deadline is invalid</div>
                      </div>
                    </div>
                  </div>
                  <button class="btn btn-primary mt-3" type="submit">{{ this.goalId ? 'Edit' : 'Add' }} form</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="row" *ngIf="this.goalId">
          <div class="col-md-5">
            <div class="row mt-3">
              <div class="col-12">
                <h3>Step</h3>
              </div>
              <div class="col-12 mt-3">
                <form [formGroup]="stepForm" (ngSubmit)="onStepSubmit()">
                  <div class="mb-3 row">
                    <label for="step_title" class="col-3 col-form-label">Title</label>
                    <div class="col-9">
                      <input id="step_title" type="text" formControlName="title" class="form-control" />
                      <div *ngIf="!fs['title'].pristine && fs['title'].errors" class="error">
                        <div *ngIf="fs['title'].errors['required']">Title is required</div>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="step_description" class="col-3 col-form-label">Description</label>
                    <div class="col-9">
                      <input id="step_description" type="text" formControlName="description" class="form-control" />
                      <div *ngIf="!fs['description'].pristine && fs['description'].errors" class="error">
                        <div *ngIf="fs['description'].errors['required']">
                          Description is required
                        </div>
                        <div *ngIf="fs['description'].errors['maxlength']">
                          Description must not exceed 1000 characters
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="status" class="col-3 col-form-label">Status</label>
                    <div class="col-9">
                      <select id="status" formControlName="status">
                        <option value="0">To do</option>
                        <option value="1">Doing</option>
                        <option value="2">Done</option>
                      </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="step_deadline" class="col-sm-3 col-form-label">Deadline</label>
                    <div class="col-9">
                      <input id="step_deadline" type="date" formControlName="deadline" class="form-control" />
                      <div *ngIf="fs['deadline'].errors" class="error">
                        <div *ngIf="fs['deadline'].errors['required']">Deadline is required</div>
                        <div *ngIf="fs['deadline'].errors['deadline']">Deadline is invalid</div>
                      </div>
                    </div>
                  </div>
                  <button class="btn btn-info mt-3" type="submit"
                          [disabled]="stepForm.invalid">{{ this.stepId ? 'Edit' : 'Add' }} step</button>
                </form>
              </div>
            </div>
          </div>
          <div class="col-md-7" *ngIf="this.goalId">
            <table>
              <thead>
                <th>Title</th>
                <th>Status</th>
                <th>Deadline</th>
                <th></th>
              </thead>
              <tbody>
                <tr *ngFor="let step of steps" class="{{getColorClass(step)}}">
                  <td>{{step.title}}</td>
                  <td>{{getStatus(step.status)}}</td>
                  <td>{{step.deadline}}</td>
                  <td><button class="btn btn-success" (click)="onStepEditClick(step)">E</button></td>
                  <td><button class="btn btn-danger" (click)="onStepDeleteClick(step)">D</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error {
      color: red
    }

    table {
      width: 100%;
    }

    .isDue {
      background-color: #e5ae5b;
    }

    .isOverDue {
      background-color: #ff7575;
    }
 `]
})
export class GoalEditComponent implements OnDestroy {
  requestGoalById$ : Subscription = new Subscription();
  goalForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    deadline: ['', [Validators.required]]
  });
  stepForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    status: [0, [Validators.required]],
    deadline: ['', [Validators.required]]
  });

  isFieldInvalid(field: string) {
    const fieldInput = this.goalForm.get(field);
    if (fieldInput && !fieldInput.pristine) {
      return fieldInput.errors !== null;
    }

    return false;
  }

  ngOnDestroy() {
    this.requestGoalById$.unsubscribe();
  }

  goalId: number = 0;
  stepId: number = 0;
  steps: IStep[] = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private goalService: GoalService) {
    route.params.subscribe(params => {
      const goalId = params['goal_id'];
      if (goalId) {
        this.goalId = parseInt(goalId);
        this.requestGoalById$ = this.goalService.requestGoalById$.subscribe(data => {
          this.steps = data.steps;

          const { title, description, deadline } = data;
          this.goalForm.patchValue({ title, description, deadline });
        });

        this.goalService.requestGoalById(this.goalId);
      }
    })
  }

  onStepEditClick(step: IStep) {
    this.stepId = step.id;

    const { title, description, status, deadline } = step;
    this.stepForm.patchValue({ title, description, status, deadline });
  }

  onStepDeleteClick(step: IStep) {
    if (confirm(`Are you sure you want to delete this step ${step.title}?`)) {
      this.goalService.deleteStepById(this.goalId, step.id).subscribe(() => {
        this.goalService.requestGoalById(this.goalId);
      })
    }
  }

  onGoalSubmit(): void {
    if (this.goalForm.valid) {
      let obs$: Observable<IApiResponse<IGoal>> = this.goalId
        ? this.goalService.editGoalById(this.goalId, this.goalForm.value as IGoal)
        : this.goalService.addGoal(this.goalForm.value as IGoal);

      obs$.subscribe(resp => {
        if (resp.success) {
          this.router.navigate(['/goal/list']);
        }
      });
    }
  }

  onStepSubmit(): void {
    if (this.stepForm.valid) {
      let obs$: Observable<IApiResponse<IStep>> = this.stepId
        ? this.goalService.editStepById(this.goalId, this.stepId, this.stepForm.value as IStep)
        : this.goalService.addStep(this.goalId, this.stepForm.value as IStep);

      obs$.subscribe(resp => {
        if (resp.success) {
          this.goalService.requestGoalById(this.goalId);
          this.stepForm.patchValue({
            title: '',
            description: '',
            status: 0,
            deadline: ''
          });
          this.stepId = 0;
        }
      });
    }
  }

  getStatus(status: number) {
    switch (status.toString()) {
      case '1':
        return 'Doing';
      case '2':
        return 'Done';
      default:
        return 'To do';
    }
  }

  getColorClass(step: IStep) {
    const today = new Date();
    const todate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0);
    const goalDeadline = new Date(step.deadline + ' 00:00:00');

    if (todate.getFullYear() == goalDeadline.getFullYear() &&
      todate.getMonth() == goalDeadline.getMonth() &&
      todate.getDate() == goalDeadline.getDate()) {
      return 'isDue';
    }

    if (todate > goalDeadline) {
      return 'isOverDue';
    }

    return '';
  }

  get f(): { [key: string]: AbstractControl } {
    return this.goalForm.controls;
  }

  get fs(): { [key: string]: AbstractControl } {
    return this.stepForm.controls;
  }
}
