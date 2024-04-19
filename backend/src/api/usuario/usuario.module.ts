import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from 'src/schemas/usuario.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'usuario', schema: UsuarioSchema }]),
    JwtModule.register({
      secret: 'sharom', //colocar una llave mucho más elaborada
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  providers: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
