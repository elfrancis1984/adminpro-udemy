import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  SettingsService, 
  SharedService, 
  SidebarService, 
  UsuarioService, 
  LoginGuardGuard, 
  SubirArchivoService,
  ModalUploadService,
  HospitalService } from './service.index';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService, 
    SharedService, 
    SidebarService, 
    UsuarioService, 
    LoginGuardGuard, 
    SubirArchivoService, 
    ModalUploadService, 
    HospitalService
  ],
  declarations: []
})
export class ServiceModule { }
