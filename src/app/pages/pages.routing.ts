import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { RegistroMedicoComponent } from './mantenimientos/medicos/registro-medico/registro-medico.component';

const routes: Routes = [
    { 
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardComponent, data: { titulo: 'Dashboard'} },
            { path: 'progress', component: ProgressComponent,  data: { titulo: 'Progress'} },
            { path: 'grafica1', component: Grafica1Component,  data: { titulo: 'Grafica'} },
            { path: 'account-settings', component: AccountSettingsComponent,  data: { titulo: 'Ajustes'} },
            { path: 'promesas', component: PromesasComponent,  data: { titulo: 'Promesas'} },
            { path: 'rxjs', component: RxjsComponent,  data: { titulo: 'RxJS'} },
            { path: 'perfil', component: PerfilComponent,  data: { titulo: 'Perfil'} },

            //mantenimientos
            { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Mantenimiento de Usuarios' }},
            { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimiento de Hospitales' }},
            { path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimiento de M??dicos' }},
            { path: 'medico/:id', component: RegistroMedicoComponent, data: { titulo: 'Registro de M??dicos'}}
        ]
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}


