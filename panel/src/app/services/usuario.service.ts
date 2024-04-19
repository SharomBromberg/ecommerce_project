import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public url = GLOBAL.url;

  constructor(private _http: HttpClient) { }

  createUsuario(data: any, token: any): Observable<any> {
    // data: los datos que se van a enviar para que registre el nuevo usuario,  y el token de acceso, sin el token no se va a realizar correctamente la petición
    let headers = new HttpHeaders({
      // contiene las cabeceras o la configuración de la petición que vamos a consumir
      'Content-Type': 'application/json', //la primer llave sería el tipo de contenido que estamos manejando, cómo son datos de tipo texto plano, solo utilizamos application/json
      Authorization: token, //token de acceso para poder consultar correctamente de nuestra petición con la autorizacion  del token
    });
    return this._http.post(this.url + '/usuario/create', data, {
      //esta linea sería la consulta neta/, el primer parámetro es la url donde se está consumiendo de la petición, el segundo es el objeto que vamos a registrar o guardar en la base de datos, el tercer parámetro sería la configuración de la petición
      headers: headers,
    });
  }

  getUsuarios(filtro: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token, });
    return this._http.get(this.url + '/usuario/' + filtro, { headers: headers });
  }

  setState(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
    return this._http.put(this.url + '/usuario/' + id, data, { headers: headers });
  }

  getUsuario(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token, });
    return this._http.get(this.url + '/usuario/getUsuario/' + id, { headers: headers });
  }
  updateUsuario(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token, });
    return this._http.put(this.url + '/usuario/updateUsuario/' + id, data, { headers: headers });
  }
  login(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + '/usuario/login', data, { headers: headers });
  }
}

//si se llegaran a usar imagenes en el content-type se utilizaría formdata
