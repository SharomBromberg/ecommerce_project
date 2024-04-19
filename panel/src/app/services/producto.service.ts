import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  public url = GLOBAL.url;

  constructor(private _http: HttpClient) { }

  createCategoria(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
    return this._http.post(this.url + '/createCategoria', data, { headers: headers });
  }
  getCategorias(clasificacion: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
    return this._http.get(this.url + '/getCategorias/' + clasificacion, { headers: headers });
  }

  setStateCategoria(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
    return this._http.put(this.url + '/setStateCategoria/' + id, data, { headers: headers });
  }
  getCategoria(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token, });
    return this._http.get(this.url + '/getCategoria/' + id, { headers: headers });
  }
  updateCategoria(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
    return this._http.put(this.url + '/updateCategoria/' + id, data, { headers: headers });
  }
}
