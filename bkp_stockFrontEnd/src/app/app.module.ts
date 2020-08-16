import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackgroundComponent } from './background/background.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { MainHomeComponent } from './main-home/main-home.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
} from 'angularx-social-login';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { ChartsModule } from 'ng2-charts';
import { StockgraphComponent } from './stockgraph/stockgraph.component';
import { Home1Component } from './home1/home1.component';
import { ProtfolioExpansionComponent } from './protfolio-expansion/protfolio-expansion.component';
import { TransactionComponent } from './transaction/transaction.component';
const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'mainHome', component : MainHomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'home1', component: Home1Component},
  {path: 'expansionPanel', component: ProtfolioExpansionComponent},
  {path: 'transaction', component : TransactionComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    HomeComponent,
    MainHomeComponent,
    RegisterComponent,
    LogoutComponent,
    StockgraphComponent,
    Home1Component,
    ProtfolioExpansionComponent,
    TransactionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    FlashMessagesModule.forRoot(),
    Ng2SearchPipeModule,
    MatAutocompleteModule,
    MatTableModule,
    HttpClientModule,
    SocialLoginModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MatExpansionModule
  ],
  providers: [
    DataService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '572558869841-ad46c9up315er7rvgfkgol9am3p2v130.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('292727601822561'),
          },
          {
            id: AmazonLoginProvider.PROVIDER_ID,
            provider: new AmazonLoginProvider(
              'clientId'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    }
  ],

  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
