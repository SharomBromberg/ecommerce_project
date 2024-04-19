import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('usuario') //con las otras alternativas se borra esto
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  //@Post('createUsuario') alternativa
  @Post('create') // /usuario/create
  @UseGuards(AuthGuard) //esto para que cada que se quiera ingresar a la petición o tratar de consumirla, pasará antes por el guard, realizando la respectiva validacións
  async createUsuario(@Res() res, @Req() req) {
    //aquí vamos a estar recibiendo el objeto de auth.guard decodificado
    console.log(req.user);
    // console.log(req.headers.authorization); se elimina de aquí porque esto se va a imprimir netamente en el guard
    const data = req.body; // recibimos los datos a traves del cuerpo de la solicitud, estos se almacenan en la constante data
    const usuario = await this.usuarioService.createUsuario(data); //esos datos los llamo desde usuario, consumiendo el serivicio, le estamos pasando por parametro el objeto data que tiene los parametros a crear
    res.status(200).send(usuario); //Muestra la respuesta del servicio en el frontend
  }

  // la llave autorizada se recibe en el Request, busqueda y filtro de un usuario
  //@Get('getUsuarios/:filtro) alternativa
  @Get(':filtro') // /usuario por parametro recibiremos un filtro
  @UseGuards(AuthGuard) // hay que crear otro middlewate
  async getUsuarios(@Res() res, @Req() req, @Param('filtro') filtro: any) {
    const usuarios = await this.usuarioService.getUsuarios(filtro);
    res.status(200).send(usuarios);
  }

  // @Put('setState/:id') // /usuario por parametro recibiremos un filtro
  @Put(':id')
  @UseGuards(AuthGuard)
  async setState(@Res() res, @Req() req, @Param('id') id: any) {
    let data = req.body;
    const usuarios = await this.usuarioService.setState(id, data);
    res.status(200).send(usuarios);
  }
  //@Put('getUsuario/:id')

  @Get('getUsuario/:id')
  @UseGuards(AuthGuard)
  async getUsuario(@Res() res, @Req() req, @Param('id') id: any) {
    const usuario = await this.usuarioService.getUsuario(id);
    res.status(200).send(usuario);
  }

  @Put('updateUsuario/:id')
  @UseGuards(AuthGuard)
  async updateUsuario(@Res() res, @Req() req, @Param('id') id: any) {
    let data = req.body;
    const usuario = await this.usuarioService.updateUsuario(id, data);
    res.status(200).send(usuario);
  }
  @Post('login') // usuario/login
  async login(@Res() res, @Req() req) {
    const data = req.body;
    const usuario = await this.usuarioService.login(data);
    res.status(200).send(usuario);
  }
}
