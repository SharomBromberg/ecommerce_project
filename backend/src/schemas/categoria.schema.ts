import { Prop } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

export const CategoriaSchema = new Schema({
    titulo: { type: String, required: true },
    slug: { type: String, required: true },
    genero: { type: String, required: true },
    subcategorias: [{ type: Object, required: true }], /*va entre llaves porque es un arreglo de tipo object para poder 
    agregar campos en cada subcategoría*/
    estado: { type: Boolean, required: true }, /*Si el estado de la categoría es verdaero quiere decir que está activo y se puede ver
    tanto en el panel de administrador como en el ecommerce y si es falso no se podrá ver en el panel ni en el ecommerce porque estará 
    descativado*/
    createdAt: { type: Date, default: Date.now },
});

