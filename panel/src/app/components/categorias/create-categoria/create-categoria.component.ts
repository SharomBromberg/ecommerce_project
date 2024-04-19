import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';


declare var toastr: any;

@Component({
  selector: 'app-create-categoria',
  templateUrl: './create-categoria.component.html',
  styleUrls: ['./create-categoria.component.css']
})
export class CreateCategoriaComponent {

  private token = localStorage.getItem('token');
  public categoria: any = {
    estado: false,
    genero: ''
  };
  public btn_load = false; // variable que valide el tiempo de respuesta del backend
  public subcategoria = '';
  public subcategorias: Array<any> = [];

  constructor(
    private _productoService: ProductoService,
    private _router: Router
  ) { }
  ngOnInit() { }

  registrar() {
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
      console.log(this.categoria);
      this.btn_load = true
      this._productoService.createCategoria(this.categoria, this.token).subscribe(
        response => {
          if (response.data != undefined) {
            toastr.success("Categoría creada con éxito")
            this._router.navigate(['/categoria', this.categoria.genero])
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
