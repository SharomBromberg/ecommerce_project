import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from 'src/schemas/categoria.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: 'categoria', schema: CategoriaSchema
        },
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
