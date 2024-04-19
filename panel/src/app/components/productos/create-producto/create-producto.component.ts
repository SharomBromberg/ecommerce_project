import { Component } from '@angular/core';
declare var Tagify: any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent {

  public active = 1;
  public producto: any = {
    categoria: '',
    subcategoria: '',
  };
  public tagify: any;

  ngOnInit() {
    this.init_tagify(); // Initialize tagify library
  }

  init_tagify() {
    setTimeout(() => {
      const input = document.querySelector('#kt_tagify')
      this.tagify = new Tagify(input, {
        maxTags: 10,
        dropdown: {
          maxItems: 5,
          classname: 'tagify_inline_sugestions',
          enable: 0,
          closeOnselect: false
        }
      });
    }, 150);
  }

  setActive(value: any) {
    this.active = value;
  }
  crear() {
    console.log(this.tagify.getTagElms());

  }
}
