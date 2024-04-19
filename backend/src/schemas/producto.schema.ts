import { Prop } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

export const ProductoSchema = new Schema({
    titulo: { type: String, required: true },
    slug: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, default: 0, required: true },
    descuento: { type: Number, required: false },
    etiquetas: [{ type: String, default: 'Nuevo', required: true }],
    categoria: { type: String, required: true },
    subcategoria: { type: String, required: true },
    labels: [{ type: Object, required: true }],
    estado: { type: Boolean, default: false, required: true },
    createdAt: { type: Date, default: Date.now },
});
