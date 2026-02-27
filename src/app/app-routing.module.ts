import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { AccountTypesComponent } from './account-types/account-types.component';
import { AuthGuard } from './_guard/auth.guard';
import { ChangePasswordGuard } from './_guard/change-password.guard';
import { BidsComponent } from './bids/bids.component';
import { UnitsComponent } from './units/units.component';
import { WebListComponent } from './web-list/web-list.component';
import { SitesComponent } from './sites/sites.component';
import { DapComponent } from './dap/dap.component';
import { SanRoqueComponent } from './san-roque/san-roque.component';
import {LoginComponent} from './login/login.component';
import { TestComponent } from './test/test.component';
import { ManualEntryComponent } from './manual-entry/manual-entry.component';
import {FtpConfigComponent} from './ftp-config/ftp-config.component';
import {FtpServiceComponent} from './ftp-service/ftp-service.component';
import { FtpFilesComponent } from './ftp-files/ftp-files.component';
import { FileSheetComponent } from './file-sheet/file-sheet.component';
import { ProcessFilesComponent } from './process-files/process-files.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {TraderDashboardComponent} from './trader-dashboard/trader-dashboard.component';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {PBReasonComponent} from './pbreason/pbreason.component';
import { BidsViewerComponent } from './bids-Viewer/bids-viewer.component';
import { BidsViewerExportComponent } from './bidshistory-export/bids-viewer-export.component';
import { ChangePasswordComponent } from './change-password/change-password/change-password.component';
const routes: Routes = [
  //{ path: '', component: TestComponent},
  { path: '', component: LoginComponent },
  { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate:[ChangePasswordGuard] },
  { path: 'trading', component: TraderDashboardComponent, canActivate: [AuthGuard] },
  { path: 'portfolio', component: PortfolioComponent, canActivate: [AuthGuard] },
  { path: 'pbreason', component: PBReasonComponent, canActivate: [AuthGuard] },
  { path: 'ftphome', component: FtpConfigComponent, canActivate: [AuthGuard] },
  { path: 'ftpservice', component: FtpServiceComponent, canActivate: [AuthGuard] },
  { path: 'ftpfiles', component: FtpFilesComponent, canActivate: [AuthGuard] },
  { path: 'processfiles', component: ProcessFilesComponent, canActivate: [AuthGuard] },
  { path: 'filesheet/:fileId/:fileName', component: FileSheetComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'types', component: AccountTypesComponent, canActivate: [AuthGuard] },
  { path: 'bids/:unitId/:unitNumber', component: BidsComponent, canActivate: [AuthGuard] },
  { path: 'bids-viewer/:bidHistoryId/:unitNumber/:uploadedBy/:transactionId/:dateUploaded/:transactionDate/:status', component: BidsViewerComponent, canActivate: [AuthGuard] },
  { path: 'bids-viewer-export/:bidHistoryId/:unitNumber/:uploadedBy/:transactionId/:dateUploaded/:transactionDate/:status', component: BidsViewerExportComponent, canActivate: [AuthGuard] },
  { path: 'units', component: UnitsComponent, canActivate: [AuthGuard] },
  { path: 'web-list', component: WebListComponent, canActivate: [AuthGuard] },
  { path: 'sites', component: SitesComponent, canActivate: [AuthGuard] },
  { path: 'dap', component: DapComponent, canActivate: [AuthGuard] },
  { path: 'spdc-monitoring', component: SanRoqueComponent, canActivate: [AuthGuard] },
  { path: 'manual-entry', component: ManualEntryComponent, canActivate: [AuthGuard] }];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
