import { Prop } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

export const Producto_galeriaSchema = new Schema({
    imagen: { type: String, required: true },
    titulo: { type: String, required: true },
    producto: { type: Schema.Types.ObjectId, required: true, ref: 'producto' },
    createdAt: { type: Date, default: Date.now },
});
//Este esquema es para las variaciones del producto 
