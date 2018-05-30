import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  constructor( public _ms: MedicoService ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this._ms.cargarMedicos()
      .subscribe( medicos => this.medicos = medicos );
  }

  buscarMedico( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }
    
    this._ms.buscarMedicos( termino )
        .subscribe( medicos => this.medicos = medicos );
  }

  borrarMedico( medico: Medico ) {
    this._ms.borrarMedico( medico._id )
        .subscribe( () => this.cargarMedicos() );
  }

}
