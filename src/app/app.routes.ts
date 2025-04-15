import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SettingsComponent } from './pages/settings/settings.component';
import {PtcaoComponent} from './pages/pgo/ptcao/ptcao.component';
import {PddComponent} from './pages/pgo/pdd/pdd.component';
import {IctoComponent} from './pages/pgo/icto/icto.component';
import {RydoComponent} from './pages/pgo/rydo/rydo.component';
import {PwoComponent} from './pages/pgo/pwo/pwo.component';
import {PlppComponent} from './pages/pgo/plpp/plpp.component';
import {PtldcComponent} from './pages/pgo/ptldc/ptldc.component';
import {LedipoComponent} from './pages/pgo/ledipo/ledipo.component';
import {GadComponent} from './pages/pgo/gad/gad.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  //PGO Routes
  { path: 'pgo/ptcao', component: PtcaoComponent },
  { path: 'pgo/pdd', component: PddComponent },
  { path: 'pgo/icto', component: IctoComponent },
  { path: 'pgo/rydo', component: RydoComponent },
  { path: 'pgo/pwo', component: PwoComponent },
  { path: 'pgo/plpp', component: PlppComponent },
  { path: 'pgo/ptldc', component: PtldcComponent },
  { path: 'pgo/ledipo', component: LedipoComponent },
  { path: 'pgo/gad', component: GadComponent },

  //Other Routes

  { path: 'reports', component: ReportsComponent },
  { path: 'settings', component: SettingsComponent },



  { path: '**', redirectTo: 'dashboard' }
];
