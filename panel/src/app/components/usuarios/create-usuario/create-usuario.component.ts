import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

declare var toastr: any;
@Component({
  selector: 'app-create-usuario',
  templateUrl: './create-usuario.component.html',
  styleUrls: ['./create-usuario.component.css'],
})
export class CreateUsuarioComponent {
  public usuario: any = {
    rol: '',
  };
  private token = localStorage.getItem('token');
  public btn_load = false; // variable que valide el tiempo de respuesta del backend

  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router
  ) { }
  ngOnInit() { }
  registrar() {
    if (!this.usuario.nombres) {
      toastr.error('Los nombres son requeridos');
    } else if (!this.usuario.apellidos) {
      toastr.error('Los apellidos son requeridos');
    } else if (!this.usuario.email) {
      toastr.error('El email es requerido');
    } else if (!this.usuario.rol) {
      toastr.error('El rol es requeridos');
    } else {
      this.btn_load = true; //cuando cambie a true el botón procesador se va a mostrar
      this._usuarioService.createUsuario(this.usuario, this.token).subscribe(
        (response) => {
          if (response.data != undefined) {
            console.log(response); //respuesta positiva
            this.btn_load = false; //cuando finalice la ejecución del servicio y me devuelva una respuesta vamos a colocarlo nuevamente en falso
            //cuando todo es correcto, creamos la redirección
            this._router.navigate(['/colaborador']);

          } else {
            toastr.error(response.message)
          }
        },
        (error) => {
          console.log(error);
          this.btn_load = false; //en caso de error tambien se coloca de nuevo en falso
        }
      );
    }
  }
}
///redireccionar al index de usuarios cuando se cree un nuevo usuario
