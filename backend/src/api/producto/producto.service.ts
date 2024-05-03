import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import slugify from 'slugify';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class ProductoService {
    constructor(
        @InjectModel('categoria') private categoriaModel,
        @InjectModel('producto') private productoModel,
        @InjectModel('producto_variedad') private producto_variedadModel,
        @InjectModel('producto_galeria') private producto_galeriaModel
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
    async createProducto(data: any, files: any) {
        try {
            data.portada = files[0].filename;
            data.slug = slugify(data.titulo, { lower: true });
            data.labels = JSON.parse(data.etiquetas);
            let producto = await this.productoModel.create(data);

            data.variaciones = JSON.parse(data.variaciones);

            for (var item of data.variaciones) {
                item.producto = producto._id;
                await this.producto_variedadModel.create(item);
            }

            data.galeria = JSON.parse(data.galeria);

            data.galeria.forEach(async (element, index) => {
                element.producto = producto._id;
                element.imagen = files[index].filename;
                await this.producto_galeriaModel.create(element);
            });

            return { data: producto }

        } catch (error) {
            return { data: undefined, message: 'No se pudo crear el producto' }
        }
    }
    async getProductos(filtro) {
        try {//metodo find: para obtener todos los productos, sort: para ordenarlos por fecha de creación
            let arr_productos = [];// inicialización: objeto producto arreglo de imagenes y arreglo de producto 
            let productos;
            if (filtro == 'Todos') {
                productos = await this.productoModel.find().populate('categoria').sort({ createdAt: -1 });
            } else {
                productos = await this.productoModel.find({ titulo: new RegExp(filtro, 'i') }).populate('categoria').sort({ createdAt: -1 });
            }
            //A el arreglo de productos, por cada producto obtendremos sus variaciones e imagenes mediante un bucle for
            for (var item of productos) {
                var variaciones = await this.producto_variedadModel.find({ producto: item._id });//consulta para obtener variaciones
                var galeria = await this.producto_galeriaModel.find({ producto: item._id });

                arr_productos.push({ //para cada producto se añade un objeto con sus variaciones e imagenes
                    producto: item,
                    variaciones,
                    galeria
                });
            }

            return { data: arr_productos }
        } catch (error) {
            return { data: undefined, message: 'No se pudo obtener las categoria' }
        }
    }
    async setStateProducto(id: any, data: any) {
        var producto = await this.productoModel.findOne({ _id: id }); //estamos buscando el producto mediante el codigo primario que enviamos por parametro en la petición,
        //una vez que lo encuentre va a pasar a la condición del if:

        if (producto) {
            //Y el estado actual lo va a invertir
            let estado_actual = data.estado;
            let estado_nuevo;
            //Es decir, si el estado actual es true, el nuevo estado será false, si el estado actual es false, el nuevo estado será true
            if (estado_actual) estado_nuevo = false;
            else if (!estado_actual) estado_nuevo = true;
            //Y finalmente hacer la consulta para actualizar el estado del producto
            let reg = await this.productoModel.findOneAndUpdate({ _id: id }, {
                estado: estado_nuevo
            });

            return { data: reg };

        } else {
            return { data: undefined, message: 'No se pudo obtener el producto' }
        }
    }

    async getProducto(id: any) {
        try {
            var producto = await this.productoModel.findOne({ _id: id });
            if (producto) {
                return { data: producto };
            } else {
                return { data: undefined, message: 'No se pudo obtener el producto' }
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo obtener el producto' }
        }
    }

    async getVariacionesProducto(id: any) {
        try {
            var producto = await this.productoModel.findOne({ _id: id });
            if (producto) {
                let variaciones = await this.producto_variedadModel.find({ producto: id });
                return { data: variaciones }
            } else {
                return { data: undefined, message: 'No se pudo obtener el producto' }
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo obtener el producto' }
        }
    }

    async getGaleriaProducto(id) {
        try {
            var producto = await this.productoModel.findOne({ _id: id });
            if (producto) {
                let galeria = await this.producto_galeriaModel.find({ producto: id });
                return { data: galeria }
            } else {
                return { data: undefined, message: 'No se pudo obtener el producto' }
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo obtener el producto' }
        }
    }
    async updateProducto(id, data) {
        try {
            var producto = await this.productoModel.findOne({ _id: id });
            if (producto) {
                //
                let producto = await this.productoModel.findOneAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    clasificacion: data.clasificacion,
                    categoria: data.categoria,
                    subcategoria: data.subcategoria,
                    labels: data.labels,
                    descripcion: data.descripcion,
                })

                return { data: producto }
            } else {
                return { data: undefined, message: 'No se pudo encontrar el producto' }
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo actualizar el producto' }
        }
    }


    async addVariacion(data) {
        try {
            const variacion = await this.producto_variedadModel.create(data);
            return { data: variacion }
        } catch (error) {
            return { data: undefined, message: 'No se pudo agregar la variacion' }
        }
    }

    async uploadImgProducto(data, file) {
        console.log(data);
        console.log(file);
        try {
            data.imagen = file.filename;
            const imagen = await this.producto_galeriaModel.create(data);
            return { data: imagen };
        } catch (error) {
            return { data: undefined, message: 'No se pudo agregar la imagen' }
        }

    }
    async deleteVariacion(id) {
        try {
            const variacion = await this.producto_variedadModel.findOne({ _id: id });
            if (variacion) {
                //

                if (variacion.cantidad == 0) {
                    await this.producto_variedadModel.findOneAndRemove({ _id: id });
                    return { data: true }
                } else {
                    return { data: undefined, message: 'Hay unidades en la variación' }
                }
            } else {
                return { data: undefined, message: 'No se pudo encontrar la variacion' }
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo eliminar la variacion' }
        }
    }
    async deleteImgProducto(id) {
        try {
            const imagen = await this.producto_galeriaModel.findOne({ _id: id });
            if (imagen) {
                //
                await fs.remove(path.resolve('./uploads/productos/' + imagen.imagen));
                const imagen_delete = await this.producto_galeriaModel.findOneAndRemove({ _id: imagen._id });
                return { data: imagen_delete };
            } else {
                return { data: undefined, message: 'No se pudo encontrar la imagen' }
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo eliminar la imagen' }
        }
    }
}


/*Campo slug: supongamos que el titulo sea prenda azul talla S: el slug sería prenda-azul-talla-s
me reemplaza los espacios por un guíon y también elimina los caracteres alfanuméricos pej: @ lo reemplazaría con un -
esto sirve para poder colocarlo como ruta de acceso en el ecommerce*/