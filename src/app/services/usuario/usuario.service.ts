import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
import Swal from 'sweetalert2';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient
  ) {
    console.log('Servicio de usuario listo');
  }

  // Guardar Sotorage
  guardarStore(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  // Login Google
  loginGoogle( token: string ) {
    let url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, { token }).map( (resp: any) => {
      this.guardarStore(resp.id, resp.token, resp.usuario);
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
                      this.guardarStore(resp.id, resp.token, resp.usuario);
                      return true;
                    });
  }

  crearUsuario (usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario)
      .map((resp: any) => {
        Swal('Usuario creado', usuario.email, 'success');
        return resp.usuario;
      });
  }

}