import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductoService {
    constructor(
        @InjectModel('categoria') private categoriaModel
    ) { }

    async createCategoria(data: any) {
        try {
            let categorias = await this.categoriaModel.find({ titulo: data.titulo });
            if (categorias.length >= 1) {
                return { data: undefined, message: 'La categoría no está disponible' }
            } else {
                /*toLowercase:convertirá la cadena en minúscula,
                replace (cambiará los caracteres alfanuméricos, espacios en blanco y simbolos especiales a un guíon) 
                trim() elimina los espacios en blanco por delante y por detrás*/
                data.slug = data.titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").trim()
                let reg = await this.categoriaModel.create(data);
                return { data: reg }
            }

        } catch (error) {
            return { data: undefined, message: 'No se pudo crear la categoría' };

        }
    }

    async getCategorias(clasificacion) {
        try {
            let categorias = await this.categoriaModel.find({ genero: clasificacion });
            return { data: categorias }
        } catch (error) {
            return { data: undefined, message: 'No se pudo obtener las categorías' };
        }
    }
    async setStateCategoria(id: any, data: any) {
        var categoria = await this.categoriaModel.findOne({ _id: id, genero: data.genero });
        if (categoria) {
            let estado_actual = data.estado;
            let estado_nuevo;

            if (estado_actual) estado_nuevo = false;
            else if (!estado_actual) estado_nuevo = true;

            let reg = await this.categoriaModel.findOneAndUpdate(
                { _id: id },
                { estado: estado_nuevo },
            );
            return { data: reg };
        } else {
            return { data: undefined, message: 'No se pudo obtener los categorias' };
        }

    }

    async getCategoria(id: any) {
        try {
            var categoria = await this.categoriaModel.findOne({ _id: id });
            if (categoria) {
                return { data: categoria };
            } else {
                return { data: undefined, message: 'No se pudo obtener la categoria' };

            }
        } catch (error) {
            console.log(error)
            return { data: undefined, message: 'No se pudo obtener la categoria' };

        }
    }
    async updateCategoria(id: any, data: any) {
        try {
            var categoria = await this.categoriaModel.findOne({ _id: id });
            if (categoria) {
                let reg = await this.categoriaModel.findOneAndUpdate(
                    { _id: id },
                    {
                        titulo: data.titulo,
                        genero: data.genero,
                        subcategorias: data.subcategorias,
                        estado: data.estado,
                    }
                );
                return { data: reg };
            } else {
                return { data: undefined, message: 'No se pudo obtener la categoria' };
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo obtener la categoria' };
        }
    }
}

/*Campo slug: supongamos que el titulo sea prenda azul talla S: el slug sería prenda-azul-talla-s
me reemplaza los espacios por un guíon y también elimina los caracteres alfanuméricos pej: @ lo reemplazaría con un -
esto sirve para poder colocarlo como ruta de acceso en el ecommerce*/