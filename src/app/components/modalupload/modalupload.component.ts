import { Component, OnInit } from '@angular/core';
import { SubirArchivoService, ModalUploadService } from '../../services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modalupload',
  templateUrl: './modalupload.component.html',
  styles: []
})
export class ModaluploadComponent implements OnInit {

  
  imagenSubir: File;
  imagenTemporal: string;

  constructor( public _sa: SubirArchivoService, 
               public _mus: ModalUploadService ) { }

  ngOnInit() {
  }

  seleccionImagen( archivo: File ) {
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }
    if ( archivo.type.indexOf('image') < 0 ) {
      Swal('Sólo imagenes', 'El archivo no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );
    reader.onloadend = () => this.imagenTemporal = reader.result;
  }

  subirImagen() {
    this._sa.subirArchivo( this.imagenSubir, this._mus.tipo, this._mus.id)
    .then( resp => {
      this._mus.notificacion.emit( resp );
      this.cerrarModal();
    }).catch( err => {
      console.log('Error en la carga...');
    });
  }

  cerrarModal() {
    this.imagenTemporal = null;
    this.imagenSubir = null;
    this._mus.ocultarModal();
  }

}
