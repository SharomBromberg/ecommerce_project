import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

declare var toastr: any;

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrls: ['./edit-usuario.component.css'],
})
export class EditUsuarioComponent {

  public token = localStorage.getItem('token');
  public usuario: any = {};
  public btn_load = false;
  public id = '';
  public data = false;
  public load_data = true;

  constructor(
    private _route: ActivatedRoute,
    private _usuarioService: UsuarioService
  ) { }

  //hook
  /*inicializar componentes despues que se hayan resuelto las dependiencias de todas las propiedades de ese componente
  Manejar la información que estamos manejando en la ruta, tanto parametros como query params*/

  ngOnInit() {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        this.init_data();
      }
    );
  }

  //cargamos los datos del usuario mediante el código primario
  /*y crear variable para poder almacenar el estado de la devolución, 
  si es verdadera es que encontró el usuario y me va a mostrar el formulario para actualizar los datos, 
  de lo contrario si es  falso se enviará algo que diga que no se encontró nada*/
  init_data() {
    this.load_data = true;

    this._usuarioService.getUsuario(this.id, this.token).subscribe(
      response => {
        console.log(response);
        if (response.data != undefined) {
          this.usuario = response.data
          this.data = true
        } else {
          this.data = false
        }
        this.load_data = false;
      }
    )
  }

  actualizar() {
    if (!this.usuario.email) {
      toastr.error('El email es requerido');
    } else if (!this.usuario.rol) {
      toastr.error('El rol es requeridos');
    } else { //consumir la petición que se haga sobre el usuario que hay que editar
      this._usuarioService.updateUsuario(this.id, this.usuario, this.token).subscribe(
        response => {
          console.log(response)
          if (response.data != undefined) { /* Si response.data es diferente a undefined quiere decir que si actualizó correctamente */
            toastr.success("usuario actualizado")
            this.init_data();//llamamos el metodo init_data para actualizar todo el formulario            
          } else {
            toastr.error(response.message)
          }
        })
    }
  }
}

