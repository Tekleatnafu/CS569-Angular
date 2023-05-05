import { Component, OnDestroy } from '@angular/core';
import { IGoal } from '../interfaces/goal.interface';
import { Router } from '@angular/router';
import { GoalService } from './goal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnDestroy {
  requestGoals$: Subscription = new Subscription();
  goals: IGoal[] = [];

  constructor(private router: Router, private goalService: GoalService) {
    this.requestGoals$ = goalService.requestGoals$.subscribe(goals => this.goals = goals);

    goalService.requestGoals();
  }

  ngOnDestroy() {
    this.requestGoals$.unsubscribe();
  }

  onAddClick() {
    this.router.navigate(['/goal/new']);
  }

  onEditClick(goal: IGoal) {
    this.router.navigate([`/goal/${goal.id}`]);
  }

  onDeleteClick(goal: IGoal) {
    if (confirm(`Are you sure you want to delete this goal ${goal.title}?`)) {
      this.goalService.deleteGoalById(goal.id).subscribe(() => {
        this.goalService.requestGoals();
      })
    }
  }

  getColorClass(goal: IGoal) {
    const today = new Date();
    const todate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0);
    const goalDeadline = new Date(goal.deadline + ' 00:00:00');

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
}
