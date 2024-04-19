import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var $: any;

@Component({
  selector: 'app-index-usuario',
  templateUrl: './index-usuario.component.html',
  styleUrls: ['./index-usuario.component.css'],
})
export class IndexUsuarioComponent {
  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  public filtro = '';
  private token = localStorage.getItem('token');
  public usuarios: Array<any> = [];
  public page = 1;
  public pageSize = 3;
  public btn_state_load = false;
  public load_data = true; //variable precargadora del contenido, inicia en verdadero, porque el componente va arrancar con esa petición

  ngOnInit() {
    //invocamos init_data
    this.init_data('Todos');
    this._route.queryParams.subscribe((params) => {
      //estos queryparams sirven para mantener información que hemos estado manejando anteriormente
      this.filtro = params['filter'];
      // console.log(params);
      if (this.filtro) {
        this.init_data(this.filtro);
      } else {
        this.init_data('Todos');
      }
    });
  }

  init_data(filtro: any) {
    filtro = filtro.trim();
    // //Alamcenamos la variable filtro dentro de this.fitro que está vinculada en el input
    // this.filtro = filtro; //limpia los espacios que se admiten por medio de filtro.trim()
    //almacenar la variable bindeada en el input(this.filtro) siempre y cuando sea distinto a todos
    if (filtro != 'Todos') this.filtro = filtro;
    this.load_data = true; //antes del servicio debe ir en verdadero
    this._usuarioService
      .getUsuarios(filtro, this.token)
      .subscribe((response) => {
        this.usuarios = response;
        this.load_data = false; //al finalizar la carga de los datos se colocará en falso
      });
  }

  filter() {
    //evento click del botón y evento key enter del input
    //vaidar que el filtro tenga algun dato
    if (this.filtro) {
      // this._usuarioService
      //   .getUsuarios(this.filtro, this.token)
      //   .subscribe((response) => {
      //     this.usuarios = response;
      //   });

      //cambiamos el tipo de busqueda, vamos a enviar este filtro mediante un QUERYPARAM
      this._router.navigate(['/colaborador'], {
        queryParams: { filter: this.filtro },
      });
    } else {
      // this.init_data('Todos');
      this._router.navigate(['/colaborador']);
    }
  }

  setState(id: any, estado: any) {
    //antes de ejecutar nuestro servicio para poder consultar la petición colocaremos el botón de carga en verdadero
    this.btn_state_load = true;
    //llamar el codigo primario del usuario  y su estado actual
    this._usuarioService
      .setState(id, { estado: estado }, this.token)
      .subscribe((response) => {
        console.log(response);
        $('#state-' + id).modal('hide');
        this.init_data('Todos');
        this.btn_state_load = false;

        // setTimeout(() => {
        //   this.btn_state_load = false; //cuando ejecutamos la consulta, vuelve a falso
        // }, 3000);
      });
  }
}
