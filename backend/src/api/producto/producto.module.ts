import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from 'src/schemas/categoria.schema';
import { JwtModule } from '@nestjs/jwt';
import { ProductoSchema } from 'src/schemas/producto.schema';
import { Producto_variedadSchema } from 'src/schemas/producto_variedad.schema';
import { Producto_galeriaSchema } from 'src/schemas/producto_galeria.schema';

@Module({
    imports: [MongooseModule.forFeature([

        {
            name: 'categoria', schema: CategoriaSchema
        },
        {
            name: 'producto', schema: ProductoSchema
        },
        {
            name: 'producto_variedad', schema: Producto_variedadSchema
        },
        {
            name: 'producto_galeria', schema: Producto_galeriaSchema
        }
        ,
    ]),
    JwtModule.register({
        secret: 'sharom', //colocar una llave mucho más elaborada
        signOptions: {
            expiresIn: '1d',
        },
    }),],
    controllers: [ProductoController],
    providers: [ProductoService]
})
export class ProductoModule { }
