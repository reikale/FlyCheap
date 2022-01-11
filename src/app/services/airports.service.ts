import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AirportsService {

  // SUKURIU SUBJECT
  private _oroUostuDuomenys = new Subject<string[]>();
  duomenys$ = this._oroUostuDuomenys.asObservable();

  // ORO UOSTU INFO
  allAirportsInfo: string[] = [];

  // KINTAMIEJI:
  responseData: any;
  nameList : string[] = [];
  

  constructor(private http : HttpClient) { }
// mano uostu API : C:\Users\Inga\Desktop\BIT\2021-12-16 Docker\WebApplication1\WebApplication1
  url:string = 'https://oro-uostu-api.herokuapp.com/';
  // GRAZINU VISUS ORO UOSTU KODUS: 
  async getData( ) {
    // Default options are marked with *
    const response = await fetch(this.url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        
        
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: data // body data type must match "Content-Type" header
    });
    let responseJson = await response.json();
    // console.log("Atejo geras rezultatas: " + JSON.stringify(responseJson)); 
    // --- iki cia gaunam gerus iata duomenis, taciau reikia issirusiuoti visa sarasa
    let JSONSarasas = responseJson;
    for (let i = 0; i < JSONSarasas.length; i++) {
      const element = JSONSarasas[i].name;
      this.nameList.push(element);
 
    } 
    this.responseData = responseJson.data;
 
    this._oroUostuDuomenys.next(this.nameList);
  
    return responseJson; // parses JSON response into native JavaScript objects
  }

 
  async getIATACode(el: string) {
    // Default options are marked with *
    const newUrl = [this.url, el].join().replace(',', '');
    let responseJson:any;

    responseJson = await fetch(newUrl)
  .then(response => response.text());
  
    return responseJson; // parses JSON response into native JavaScript objects
  }

}
