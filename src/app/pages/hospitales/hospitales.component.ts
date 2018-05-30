import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService, ModalUploadService } from '../../services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];

  constructor( public _hs: HospitalService,
               public _mus: ModalUploadService ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._mus.notificacion.subscribe( () => this.cargarHospitales() );
  }

  cargarHospitales() {
    this._hs.cargarHospitales()
      .subscribe( hospitales => this.hospitales = hospitales );
  }

  buscarHospital( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this._hs.buscarHospital( termino )
      .subscribe( hospitales => this.hospitales = hospitales );
  }

  guardarHospital( hospital: Hospital ) {
    this._hs.actualizarHospital( hospital )
      .subscribe();

  }

  borrarHospital( hospital: Hospital ) {
    this._hs.borrarHospital( hospital._id )
      .subscribe( () => this.cargarHospitales() );
  }

  crearHospital() {
    Swal({
      title: 'Crear hospital',
      titleText: 'Ingrese el nombre del hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((valor) => {
      if ( !valor.value || valor.value.length === 0 ) {
        return;
      }
      this._hs.crearHospital( valor.value )
        .subscribe( () => this.cargarHospitales() );
    });
  }

  actualizarImagen( hospital: Hospital ) {
    this._mus.mostrarModal( 'hospitales', hospital._id );
  }

}
