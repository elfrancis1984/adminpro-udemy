import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Hospital } from '../../models/hospital.model';

import Swal from 'sweetalert2';

@Injectable()
export class HospitalService {

  totalHospitales: number = 0;

  constructor( public http: HttpClient, 
                public _us: UsuarioService ) { }

  cargarHospitales() {
    let url = URL_SERVICIOS + '/hospital';
    return this.http.get( url )
    .map( (resp: any) => {
      this.totalHospitales = resp.total;
      return resp.hospitales;
    });
  }

  obtenerHospital( id: string ) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get( url ).map( (resp: any) => resp.hospital );
  }

  borrarHospital ( id: string ) {
    let url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this._us.token;
    return this.http.delete( url )
    .map( resp => Swal('Hospital Borrado', 'Eliminado correctamente', 'success'));
  }

  crearHospital( nombre: String ) {
    let url = URL_SERVICIOS + '/hospital?token=' + this._us.token;
    return this.http.post( url, { nombre: nombre } )
    .map( (resp: any) => resp.hospital );
  }

  buscarHospital( termino: string ) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url).map( (resp: any) => resp.hospitales );
  }

  actualizarHospital( hospital: Hospital ) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._us.token;
    return this.http.put( url, hospital )
      .map( (resp: any) => {
        Swal('Hospital Actualizado', hospital.nombre, 'success');
        return resp.hospital; 
      });
  }

}
