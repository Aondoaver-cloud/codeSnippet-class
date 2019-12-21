import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import {PresentationComponent} from "./components/presentation/presentation.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CourseDetailsComponent} from "./components/course-details/course-details.component";
import {SettingsComponent} from "./components/settings/settings.component";
import {VideoSessionComponent} from "./components/video-session/video-session.component";

const appRoutes: Routes = [
  {
    path: '',
    component: PresentationComponent,
    pathMatch: 'full',
  },
  {
    path: 'courses',
    component: DashboardComponent
  },
  {
    path: 'courses/:id/:tabId',
    component: CourseDetailsComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'session/:id',
    component: VideoSessionComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
