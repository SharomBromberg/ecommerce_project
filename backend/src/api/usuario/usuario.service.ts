import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel('usuario') private usuarioModel,
    private readonly _jwtService: JwtService,
  ) { }

  async createUsuario(data: any) {
    //Proceso de los datos para poder crear nuestro nuevo usuario
    //crear una validación para verificar que no hay usuarios con ese nombre, que el correo electronico sea único y encriptar la contraseña
    try {
      const _usuarios = await this.usuarioModel.find({ email: data.email }); //Validación ya que el email debe ser unico, por lo tanto buscamos si ya hay otro registro/documento con el mismo correo

      if (_usuarios.length >= 1) {
        //si ya hay uno
        return { data: undefined, message: 'El correo electrónico ya existe' }; //envía el siguiente mensaje, por lo tanto el servicio retorna un data en undefined y el mensaje
      } else {
        //cuando no hay un correo electronico y es nuevo completa/ primero estaremos encriptando la contraseña
        var salt = await bcrypt.genSalt(10); //longitud requerida se usa biblioteca bcrypt
        //hashear la cadena:
        var hash = await bcrypt.hash(/*data.password*/ '123456', salt);

        data.password = hash;
        const usuario = await this.usuarioModel.create(data); //y finalmente creando nuestro nuevo usuario
        return { data: usuario }; /*aquí retornamos nuestro objeto usuario directa; colocamos el usuario dentro de un objeto data para
        poder realizar la vaidación dentro del frontend*/

        //en este bloque se crea la encriptación de las contraseñas
      }
    } catch (error) {
      console.log(error);
      return { data: undefined, message: 'No se pudo crear el usuario' };
    }
  }

  async getUsuarios(filtro: any) {
    try {
      var usuarios = []; //arreglo inicial vacio
      //cuando filtro sea = a todos me devolverá todos los ussuarios y cuando sea distinto a todos quiere decir que me devolverá usuarios especificos con respecto a ese texto
      if (filtro == 'Todos') {
        usuarios = await this.usuarioModel.find().sort({ createdAt: -1 });
      } else {
        usuarios = await this.usuarioModel
          .find({
            $or: [
              { nombres: new RegExp(filtro, 'i') },
              { apellidos: new RegExp(filtro, 'i') },
              { email: new RegExp(filtro, 'i') },
            ],
          })
          .sort({ createdAt: -1 });
      }
      return usuarios;
    } catch (error) {
      return { data: undefined, message: 'No se pudo obtener los usuarios' };
    }
  }

  async setState(id: any, data: any) {
    var usuario = await this.usuarioModel.findOne({ _id: id });
    if (usuario) {
      let estado_actual = data.estado;
      let estado_nuevo;

      if (estado_actual) estado_nuevo = false;
      else if (!estado_actual) estado_nuevo = true;
      let reg = await this.usuarioModel.findOneAndUpdate(
        { _id: id },
        { estado: estado_nuevo },
      );
      return { data: reg };
    } else {
      return { data: undefined, message: 'No se pudo obtener los usuarios' };
    }
  }

  async getUsuario(id: any) {
    /*Se crea un bloque try catch para capturar cualquier excepción, por ejemplo cuando no se encuentra el id */
    try {
      /*crear objjeto llamado usuario (var usuario) = llamar a la instanci del modelo (this.usuarioModel)
     aplicando una consulta para poder buscar un solo documento (findOne) y la busqueda es mediante el código primario(_id)
     y le pasamos el parámetro id*/
      var usuario = await this.usuarioModel.findOne({ _id: id });
      /*vamos a validar que ese objeto exista: si el objeto usuario esta lleno es
      que encontró el usuario correctamente y en el bloque else es cuando no encuentra nada: por lo tanto se envía el mensaje*/

      /*Vamos a validar que eese usuario exista siempre y cuando data tenga algo adentro  y si no tiene 
      nada a dentro por lo tanto será undefined, quiere decir que no se encontró el usuario*/
      if (usuario) {
        return { data: usuario };
      } else {
        return { data: undefined, message: 'No se pudo obtener el usuario' };

      }
    } catch (error) {
      console.log(error)
      return { data: undefined, message: 'No se pudo obtener el usuario' };

    }
  }

  async updateUsuario(id: any, data: any) { //id del usuario a actualizar y otro objeto data con los datos que vamos a cambiar
    /*para preveer cualquier excepción vamos a colocar un bloque try-catch*/
    try { //consulta directa/ 
      /*1. Consulta para pode obtener los datos del usuario que pretendemos actualizar para ver si el usuario existe o no */
      var usuario = await this.usuarioModel.findOne({ _id: id })/*consulta para poder buscarl el usuario mediante ese codigo primario y 
      lo estamos almavenando en el obejto usuario*/
      if (usuario) {/*cuando si existe un usuario asignado a ese codigo primario, vamos a realizar la actualización*/

        /*omitir el email del usuario a editar dentro del conteo de la consulta  _id:{$ne:id}; $ne=not equal 
        para que no haya error al actualizar con el correo existente*/

        var reg_usuarios = await this.usuarioModel.find({ email: data.email, _id: { $ne: id } }) //vaidar que el email no lo tenga ningun otro usuario

        if (reg_usuarios.length == 0) { /*si ese arreglo en su ongitud es igual a cero, quiere decir que no 
        existe y realizará la actualización correctamente*/
          var reg = await this.usuarioModel.findOneAndUpdate({ _id: id }, { /*lo unico que vamos a actualizar es el email y el rol*/
            email: data.email,
            rol: data.rol
          });
          return { data: reg };
        } else {/* de lo contrario enviaremos un msg de error*/
          return { data: undefined, message: 'El correo ya está en uso' };

        }

      } else {/*de lo contrario si no existe un usuario con ese codigo enviaremos el sgte mensaje */
        return { data: undefined, message: 'No se pudo obtener el usuario' };

      }
    } catch (error) {
      return { data: undefined, message: 'No se pudo actualizar el usuario' };

    }

  }



  async login(data: any) {
    let usuario = await this.usuarioModel.find({ email: data.email });

    if (usuario.length >= 1) {
      //desencriptar contraseñas
      let compare = await bcrypt.compare(data.password, usuario[0].password);
      if (compare) {
        let jwt = this._jwtService.sign({
          sub: usuario[0]._id, //codigo primario del usuario
          nombres: usuario[0].nombre,
          apellidos: usuario[0].apellidos,
          email: usuario[0].email,
          rol: usuario[0].rol,
        });
        return { data: usuario[0], jwt }; // junto con el usuario se devuelve el token de acceso
      } else {
        return { data: undefined, message: 'La contraseña es incorrecta' };
      }
    } else {
      return { data: undefined, message: 'El correo no es valido' };
    }
  }
}
