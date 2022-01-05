import { Component, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { KiwiService } from 'src/app/services/kiwi.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AirportsService } from 'src/app/services/airports.service';
import { result } from 'lodash';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  constructor(private service: KiwiService, 
    private airportsService : AirportsService,
    private http:HttpClient) { 
  
  }

  ngOnInit(): void {
    console.log("pasileido onInit");
    this.airportsService.getData();
    this.service.serviceFinalResult$.subscribe(
      resultatas =>{
        this.resultDeparture = resultatas[0].split('T')[0];
        this.resultArrival = resultatas[1];
        this.resultPrice = resultatas[2];
        this.resultLink = resultatas[3];
        console.log(this.resultPrice+"Eur");
        console.log("pavyko per observable");
        
      }
    )
    this.airportsService.duomenys$.subscribe( resultatas => {
      this.allAirportsInfo = resultatas;
      console.log("cia apie oro uostus: ", resultatas);
    })
      
  }
  resultInfo!: any;
  allAirportsInfo!: string;

  informacija: any;
  viewMode = false;
  submitedCityFrom!: string;
  submitedCityTo!: string;
  submitedDateFrom!: string;
  submitedDateTo!: string;
  listOfInformation = [
      this.submitedCityFrom, 
      this.submitedCityTo,
      this.submitedDateFrom,
      this.submitedDateTo
    ];
  // ATSAKYMO KINTAMIEJI

  resultDeparture!: string;
  resultArrival!: string;
  resultPrice!: string;
  resultLink!: string;
 

  async submit(el: any ){
    
    
    this.submitedCityFrom = el.cityFrom;
    this.submitedCityTo = el.cityTo;
    this.submitedDateFrom = this.dateFormat(el.dateFrom);
    this.submitedDateTo = this.dateFormat(el.dateTo);
    // Siunciu duomenis i service elementa
    this.service.nustatytiLaukus(el.cityFrom, el.cityTo, this.dateFormat(el.dateFrom), this.dateFormat(el.dateTo));
   
    // ---- cia prasideda visa grandine ---
    this.resultInfo = await this.service.sudetiSarasa();
    console.log("Sulaukiau galutines info: "+this.resultInfo);

    
    console.log("Praejo submit metodas");
    window.scrollTo(0, 1400);
  }

  onSubmit(forma: any){
  
    this.viewMode = true;
   
  }
  gautiDuomenis(){
    console.log("Pasileido gautiDuomenis");
   this.informacija = this.service.postData();

  }

  dateFormat(data: string){
    let placeholder: string[] = [];
    placeholder = data.split('-');
    let newDate: string = placeholder.reverse().join('/');
    return newDate;
  }
  // atnaujintiDuomenis(){
  //   this.resultDeparture = this.service.returnItems()[0];
  //   this.resultArrival = this.service.returnItems()[1];
  //   this.resultPrice = this.service.returnItems()[2];
  //   this.resultLink = this.service.returnItems()[3];
  //   console.log(this.resultDeparture);
  //   console.log("pavyko kitu budu");
    
  // }
  RodytiRezultata(){
    window.open(this.resultLink);
  }    
  

  data!:String;

  postData(){

    const url = 'http://httpbin.org/post';
    this.http.post(url, {
      duomenys:this.data
    }).toPromise().then((data:any) => {
      console.log(data)
    })
  }
}

// ALL AIRPORTS JSON FILE : https://raw.githubusercontent.com/jbrooksuk/JSON-Airports/master/airports.json