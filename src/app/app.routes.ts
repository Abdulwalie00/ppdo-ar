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
import {PeoComponent} from './pages/implementing/peo/peo.component';
import {PioComponent} from './pages/implementing/pio/pio.component';
import {PcoComponent} from './pages/implementing/pco/pco.component';
import {OpagComponent} from './pages/implementing/opag/opag.component';
import {PenroComponent} from './pages/implementing/penro/penro.component';
import {PswdoComponent} from './pages/implementing/pswdo/pswdo.component';
import {PhoComponent} from './pages/implementing/pho/pho.component';
import {PvoComponent} from './pages/implementing/pvo/pvo.component';

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

  //Implementing Routes
  { path: 'implementing/peo', component: PeoComponent },
  { path: 'implementing/pio', component: PioComponent },
  { path: 'implementing/pco', component: PcoComponent },
  { path: 'implementing/opag', component: OpagComponent },
  { path: 'implementing/penro', component: PenroComponent },
  { path: 'implementing/pswdo', component: PswdoComponent },
  { path: 'implementing/pho', component: PhoComponent },
  { path: 'implementing/pvo', component: PvoComponent },
  //Other Routes

  { path: 'reports', component: ReportsComponent },
  { path: 'settings', component: SettingsComponent },



  { path: '**', redirectTo: 'dashboard' }
];
