import { SetUserComponent } from './set-user/set-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { InteroperabiliteComponent } from './interoperabilite/interoperabilite.component';
import { DetailsComponent } from './details/details.component';
import { ParametresComponent } from './parametres/parametres.component';
import { HistPanneComponent } from './hist-panne/hist-panne.component';
import { HistStateComponent } from './hist-state/hist-state.component';
import { HistoriqueComponent } from './historique/historique.component';
import { StatistiqueComponent } from './statistique/statistique.component';
import { WebServicesComponent } from './web-services/web-services.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'user',component :HomeComponent,children:[
    {path:'webservice', component :WebServicesComponent},
    {path:'statistique', component :StatistiqueComponent},
    {path:'parametres', component :ParametresComponent},
    {path:'details/:id', component: DetailsComponent},
    {
      path:'addUser',component:AddUserComponent
    },
    {
      path:'setUser/:id',component:SetUserComponent
    },
    {path:'interoperabilites', component: InteroperabiliteComponent},
    {path:'historique', component :HistoriqueComponent,children:[
      {path:'state', component :HistStateComponent},
    {path:'panne' , component :HistPanneComponent},
    ]
     
    }, 
  
  ] },
  {path:'',component :LoginComponent},
  {path:'**',component:NotFoundComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
