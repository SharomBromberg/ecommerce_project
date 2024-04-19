import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var toastr: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public usuario: any = {
    email: '',
    password: '',
  };

  constructor(
    private _usuariService: UsuarioService,
    private _router: Router
  ) {}
  ngOnInit() {}
  login() {
    if (!this.usuario.email) {
      toastr.error('Los el correo es requeridos');
    } else if (!this.usuario.password) {
      toastr.error('la contraseña es requerida');
    } else {
      console.log(this.usuario);
      this._usuariService.login(this.usuario).subscribe((response) => {
        console.log(response);
        if (response.data != undefined) {
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem('token', response.jwt);
          this._router.navigate(['/dashboard']);
        } else {
          toastr.error(response.message);
        }
      });
    }
  }
}
