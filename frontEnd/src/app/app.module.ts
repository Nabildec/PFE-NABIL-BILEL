import { NgxPaginationModule } from 'ngx-pagination';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import {MatNativeDateModule} from '@angular/material/core' ; 
import {MatDatepickerModule} from '@angular/material/datepicker' ; 
import { MatFormFieldModule } from '@angular/material/form-field';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations' ;


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import {HttpClientModule} from '@angular/common/http';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WebServicesComponent } from './web-services/web-services.component';
import { StatistiqueComponent } from './statistique/statistique.component';
import { HistoriqueComponent } from './historique/historique.component';
import { HistPanneComponent } from './hist-panne/hist-panne.component';
import { HistStateComponent } from './hist-state/hist-state.component';
import { ParametresComponent } from './parametres/parametres.component';
import { DetailsComponent } from './details/details.component';
import { InteroperabiliteComponent } from './interoperabilite/interoperabilite.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EvolutionGraphComponent } from './evolution-graph/evolution-graph.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import {  LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { EnteteComponent } from './entete/entete.component';
import { AddUserComponent } from './add-user/add-user.component';
import { SetUserComponent } from './set-user/set-user.component';
import { SidePhoneComponent } from './side-phone/side-phone.component';
import { FixSideBarComponent } from './fix-side-bar/fix-side-bar.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SidebarComponent,
    WebServicesComponent,
    StatistiqueComponent,
    HistoriqueComponent,
    HistPanneComponent,
    HistStateComponent,
    ParametresComponent,
    DetailsComponent,
    InteroperabiliteComponent,
    NotFoundComponent,
    EvolutionGraphComponent,
    BarChartComponent,
    EnteteComponent,
    AddUserComponent,
    SetUserComponent,
    SidePhoneComponent,
    FixSideBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule , 
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    NgxChartsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule
    
  ],
  providers: [{provide: LOCALE_ID, useValue: "fr-CA" }],
  bootstrap: [AppComponent]
})
export class AppModule { }
