import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsolidatedComponent } from './pages/consolidated/consolidated.component';
import { HomeComponent } from './pages/home/home.component';
import { MovementEditComponent } from './pages/movement-edit/movement-edit.component';
import { MovementComponent } from './pages/movement/movement.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'movements', component: MovementComponent, children: [
      { path: ':id/edit', component: MovementEditComponent }
    ]
  },
  { path: 'consolidated', component: ConsolidatedComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
