import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParamsOptions, HttpParams } from '@angular/common/http';
import { Observable, throwError, interval, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MainComponent } from '../components/main/main.component';
import * as _ from 'lodash';
import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { map, filter, tap } from 'rxjs/operators'


export interface Items {
  data: [{
    cityFrom: string,
    cityCodeFrom: string,
    cityTo: string,
    cityCodeTo: string,
    conversion: {Eur : number}
  }]
  
   
}
items: Observable;

const headers = new HttpHeaders().set('apikey', 'ZNkd6SLXdxIEFBPY43VQO6eo2pD3opdR');
const myObject: any = { 
  fly_from: "VNO",
  fly_to: "DUB",
  date_from: "25/12/2021",
  date_to: "02/01/2022",
  max_stopovers: 0,
  
};
const httpParams: HttpParamsOptions = { fromObject: myObject} as HttpParamsOptions;
const options = { params: new HttpParams(httpParams), headers: headers};

@Injectable({
  providedIn: 'root'
})


export class KiwiService {

  // CREATING SUBJECT:
  private _resultArray = new Subject<string[]>();
  serviceFinalResult$ = this._resultArray.asObservable();

  public allData: Items[]= [];
  items$!: Observable<Items[]>;

  trasferedCityFrom!: string;
  trasferedCityTo!: string;
  trasferedDateFrom!: string;
  trasferedDateTo!: string;
  trasferedList: string[] = [];
  secondString: string = '';
  apiUrl: string = '';
  responseJson: any;
  dalykas: any;
  kitasDalykas: any;
  responseData: any;

  // REZULTATU KINTAMIEJI

  resultDeparture!: string;
  resultArrival!: string;
  resultPrice!: string;
  resultLink!: string;
  
  returnArray!: string[];


  sudetiSarasa(){
    // console.log('Visi parametrai: '+ this.trasferedCityFrom +' '+this.trasferedCityTo+' '+this.trasferedDateFrom+' '+this.trasferedDateTo);
    let flyFromString = 'fly_from=';
    flyFromString += this.trasferedCityFrom;
    let flyToString = 'fly_to=';
    flyToString += this.trasferedCityTo;
    let dateFromString = 'date_from=';
    dateFromString += this.trasferedDateFrom;
    let dateToString = 'date_to=';
    dateToString += this.trasferedDateTo;
    let stopover = 'stopover_to=3:00';
    let vehicle_type = 'vehicle_type=aircraft';
    this.secondString = [flyFromString, flyToString, dateFromString, dateToString, stopover, vehicle_type].join('&');
    this.apiUrl = ['https://tequila-api.kiwi.com/v2/search?', this.secondString].join('');
    console.log('Pilna nuoroda: ' + this.apiUrl);
    let jsonResponse = this.postData(); 
    console.log("jasonResponsas: "+jsonResponse);
  }

  nustatytiLaukus(cityFrom: string, cityTo: string, dateFrom: string, dateTo: string){
    this.trasferedCityFrom = cityFrom;
    this.trasferedCityTo = cityTo;
    this.trasferedDateFrom = dateFrom;
    this.trasferedDateTo = dateTo;
  }

  constructor(private http : HttpClient) { }
  

async postData( url = this.apiUrl, data = myObject) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'ZNkd6SLXdxIEFBPY43VQO6eo2pD3opdR',
      
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body: data // body data type must match "Content-Type" header
  });
  this.responseJson = await response.json();
  // console.log("Atejo geras rezultatas: " + JSON.stringify(this.responseJson)); // veikia
  // console.log(this.responseJson.data.length); // veikia 
  // console.log(this.responseJson.data[0].price); // veikia
  this.responseData = this.responseJson.data;
  // console.log("responseData tipas: "+ typeof this.responseData);
  this.rastiMaziausiaKaina(this.responseData);
  let zemiausiaKaina : any;

  return this.responseJson; // parses JSON response into native JavaScript objects
}

  rastiMaziausiaKaina(dataStructure: any){
  //  console.log(dataStructure);
  
    let lowestPrice = dataStructure[0].price;
    let itemIndex = 0;
    for (let index = 0; index < dataStructure.length; index++) {
      this.dalykas = dataStructure[index];
      if (lowestPrice > this.dalykas.price) {
        lowestPrice = this.dalykas.price;
        itemIndex = index;
      }
    }
  
    this.surinktiDuomenis(itemIndex, dataStructure);
  }

  surinktiDuomenis(index: number, dataStructure: any){
    let dataItem = dataStructure[index]
    this.resultDeparture = dataItem.local_departure;
    this.resultArrival = dataItem.local_arrival;
    this.resultPrice = dataItem.price;
    this.resultLink = dataItem.deep_link;

    this.returnArray = [this.resultDeparture, this.resultArrival, this.resultPrice, this.resultLink];
    // console.log("Gautas atsakymas: " + this.resultDeparture + " "+ this.resultArrival + " " + this.resultPrice+"Eur"  + " "+ this.resultLink);
    


    // GRAZINAM OBSERVABLE
    this._resultArray.next(this.returnArray);
    
  }
  
  //  VISKAS IKI ČIA VEIKIA. TOLIAU REIK GRĄŽINTI VERTES IR JAS ATVAIZDUOTI 
  
}

