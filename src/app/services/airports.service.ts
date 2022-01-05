import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AirportsService {

  // SUKURIU SUBJECT
  private _oroUostuDuomenys = new Subject<string>();
  duomenys$ = this._oroUostuDuomenys.asObservable();

  // ORO UOSTU INFO
  allAirportsInfo: string[] = [];


  constructor(private http : HttpClient) { }

  url:string = 'https://raw.githubusercontent.com/jbrooksuk/JSON-Airports/master/airports.json';
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
    // console.log("Atejo geras rezultatas: " + JSON.stringify(this.responseJson)); // veikia
    // console.log(this.responseJson.data.length); // veikia 
    // console.log(this.responseJson.data[0].price); // veikia
    let responseData = responseJson.data;
    // console.log("responseData tipas: "+ typeof this.responseData);
    
    
  
    return responseJson; // parses JSON response into native JavaScript objects
  }
}
