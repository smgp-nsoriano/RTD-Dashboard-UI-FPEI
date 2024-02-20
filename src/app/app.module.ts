import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighchartsChartModule } from 'highcharts-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HomeComponent } from './home/home.component';
import { NavComponent } from './partials/nav/nav.component';
import { UsersComponent } from './users/users.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FormsModule } from '@angular/forms';
import { AccountTypesComponent } from './account-types/account-types.component';
import { LoginComponent } from './login/login.component';
import { BidsComponent } from './bids/bids.component';
import { SettingsComponent } from './bids/settings/settings.component';
import { UnitsComponent } from './units/units.component';
import { WebListComponent } from './web-list/web-list.component';
import { SitesComponent } from './sites/sites.component';
import { DapComponent } from './dap/dap.component';
import { SanRoqueComponent } from './san-roque/san-roque.component';
import { EnvServiceProvider } from './env.service.provider';
import { TestComponent } from './test/test.component';
import { ManualEntryComponent } from './manual-entry/manual-entry.component';
import { FtpConfigComponent } from './ftp-config/ftp-config.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FtpServiceComponent } from './ftp-service/ftp-service.component';
import { FtpFilesComponent } from './ftp-files/ftp-files.component';
import { FileSheetComponent } from './file-sheet/file-sheet.component';
import { ProcessFilesComponent } from './process-files/process-files.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TraderDashboardComponent } from './trader-dashboard/trader-dashboard.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PBReasonComponent } from './pbreason/pbreason.component';
import { ReserveMarketDashboardComponent } from './reserve-market-dashboard/reserve-market-dashboard.component';
import { ReserveRequirementComponent } from './reserve-requirement/reserve-requirement.component';
import { ReservePortfolioComponent } from './reserve-portfolio/reserve-portfolio.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    UsersComponent,
    NotFoundComponent,
    AccountTypesComponent,
    LoginComponent,
    BidsComponent,
    SettingsComponent,
    UnitsComponent,
    WebListComponent,
    SitesComponent,
    DapComponent,
    SanRoqueComponent,
    TestComponent,
    ManualEntryComponent,
    FtpConfigComponent,
    FtpServiceComponent,
    FtpFilesComponent,
    FileSheetComponent,
    ProcessFilesComponent,
    DashboardComponent,
    TraderDashboardComponent,
    PortfolioComponent,
    PBReasonComponent,
    ReserveMarketDashboardComponent,
    ReserveRequirementComponent,
    ReservePortfolioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    HighchartsChartModule,
    FontAwesomeModule,
    Ng2SearchPipeModule,
    ColorPickerModule
  ],
  providers: [
    EnvServiceProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
