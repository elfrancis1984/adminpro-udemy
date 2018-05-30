import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

import Swal from 'sweetalert2';

@Injectable()
export class MedicoService {

  totalMedicos: number = 0;

  constructor( public http: HttpClient,
               public _us: UsuarioService ) { }

  cargarMedicos() {
    let url = URL_SERVICIOS + '/medico';
    return this.http.get( url )
    .map( (resp: any) => {
      this.totalMedicos = resp.total;
      return resp.medicos;
    });
  }

  cargarMedico( id: string ) {
    let url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get( url ).map( (resp: any) => resp.medico);
  }

  buscarMedicos( termino: string ) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url).map( (resp: any) => resp.medicos );
  }

  borrarMedico( id: string ) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this._us.token;
    return this.http.delete( url )
        .map( resp => {
          Swal('Medico borrado!', 'El medico a sido eliminado correctamente', 'success');
          return resp;
        });
  }

  guardarMedico( medico: Medico ) {
    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) {
      // Actualizando
      url += '/' + medico._id + '?token=' + this._us.token;
      return this.http.put( url, medico)
        .map( (resp: any) => {
          Swal('Medico actualizado!', medico.nombre, 'success');
          return resp.medico;
        });
    } else {
      // Creando
      url += '?token=' + this._us.token;
      return this.http.post( url, medico )
        .map( (resp: any) => {
          Swal('Medico creado!', medico.nombre, 'success');
          return resp.medico;
        });
    }



  }

}
