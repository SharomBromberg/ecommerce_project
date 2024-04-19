import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
declare var toastr: any;
@Component({
  selector: 'app-edit-categoria',
  templateUrl: './edit-categoria.component.html',
  styleUrls: ['./edit-categoria.component.css']
})
export class EditCategoriaComponent {

  public id = '';
  private token = localStorage.getItem('token');
  public categoria: any = {
    estado: false,
    genero: ''
  };
  public btn_load = false; // variable que valide el tiempo de respuesta del backend
  public subcategoria = '';
  public subcategorias: Array<any> = [];
  public load_data = true; //precargador de la data
  public data = false;

  constructor(
    private _productoService: ProductoService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        this.init_data();
      });
  }

  init_data() {
    this.load_data = true;
    this._productoService.getCategoria(this.id, this.token).subscribe(
      response => {
        if (response.data != undefined) {
          console.log(response);
          this.categoria = response.data;
          this.subcategorias = this.categoria.subcategorias;
          this.data = true;
        } else {
          this.data = false;
          // toastr.error(response.message);
        }
        this.load_data = false;
      }
    );
  }

  actualizar() {
    this.categoria.subcategorias = this.subcategorias;
    if (!this.categoria.titulo) {
      toastr.error("El titulo es requerido.");
    } else if (!this.categoria.genero) {
      toastr.error("La clasificación es requerida");
    } else if (this.categoria.subcategorias.length == 0) {
      /*Si en mi objeto categoría el arreglo llamado subcategorias en su
     longitud es ==0 quiere decir que no hay nada*/
      toastr.error("Al menos ingrese una subcategoría.");
    } else {
      this.btn_load = true
      this._productoService.updateCategoria(this.id, this.categoria, this.token).subscribe(
        response => {
          if (response.data != undefined) {
            toastr.success("Categoría actualizada con éxito")
            this.init_data()
          } else {
            toastr.error(response.message);
          }
          this.btn_load = false
        }
      )
    }
  }
  add() {
    if (this.subcategoria) {
      this.subcategorias.push(this.subcategoria.trim());
      this.subcategoria = ''
    }
  }

  remove(idx: any) {
    this.subcategorias.splice(idx, 1)
  }
}
