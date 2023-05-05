import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GoalEditComponent } from './goal/goal-edit.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HeaderComponent } from './header/header.component';
import { GoalListComponent } from './goal/goal-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'goal/list', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'goal/list', component: GoalListComponent, canActivate: [AuthGuard]},
  {path: 'goal/new', component: GoalEditComponent, canActivate: [AuthGuard]},
  {path: 'goal/:goal_id', component: GoalEditComponent, canActivate: [AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GoalEditComponent,
    HeaderComponent,
    GoalListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
