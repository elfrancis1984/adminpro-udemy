import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import Swal from 'sweetalert2';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor( public http: HttpClient,
               public router: Router, 
               public _sa: SubirArchivoService) {
    this.cargarStorage();
  }

  estaLogueado() {
    return this.token.length > 5 ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
      this.menu = JSON.parse( localStorage.getItem('menu') );
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  // Guardar Sotorage
  guardarStore(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
     this.usuario = null;
     this.token = '';
     this.menu = [];
     
     localStorage.removeItem('token');
     localStorage.removeItem('usuario');
     localStorage.removeItem('menu');

     this.router.navigate(['/login']);
    }

  // Login Google
  loginGoogle( token: string ) {
    let url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token }).map( (resp: any) => {
      this.guardarStore(resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    });
  }

  // Login normal
  login( usuario: Usuario, recordar: boolean = false ) {
    let url = URL_SERVICIOS + '/login';
    if ( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    return this.http.post(url, usuario)
                    .map( (resp: any) => {
                      this.guardarStore(resp.id, resp.token, resp.usuario, resp.menu);
                      return true;
                    }).catch( err => {
                      Swal('Error en el login', err.error.mensaje, 'error');              
                      return Observable.throw(err);
                    });
  }

  crearUsuario (usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario)
      .map((resp: any) => {
        Swal('Usuario creado', usuario.email, 'success');
        return resp.usuario;
      }).catch( err => {
        Swal(err.error.mensaje, err.error.errors.message, 'error');              
        return Observable.throw(err);
      });
  }

  actualizarUsuario( usuario: Usuario ) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put( url, usuario ).map( (resp: any) => {
      if ( usuario._id === this.usuario._id ) {
        this.guardarStore( resp.usuario._id, this.token, resp.usuario, this.menu);
      }
      
      Swal('Usuario actualizado', usuario.nombre, 'success');
      return true;
    }).catch( err => {
      Swal(err.error.mensaje, err.error.errors.message, 'error');              
      return Observable.throw(err);
    });
  }

  cambiarImagen( archivo: File, id: string) {
    this._sa.subirArchivo( archivo, 'usuarios', id )
      .then( (resp: any) => {
        this.usuario.img = resp.usuario.img;
        Swal('Imagen actualizada', this.usuario.nombre, 'success');
        this.guardarStore( id, this.token, this.usuario, this.menu );
      }).catch( err => {
        console.log( err );
      });
  }

  cargarUsuarios( desde: number = 0 ) {
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get(url);
  }

  buscarUsuarios( termino: string ) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url).map( (resp: any) => resp.usuarios );
  }

  borrarUsuario( id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id + '?token=' + this.token;
    return this.http.delete( url )
    .map( resp => {
      Swal('Usuario borrado!', 'El usuario a sido eliminado correctamente', 'success');
      return true;
    });
  }

}
