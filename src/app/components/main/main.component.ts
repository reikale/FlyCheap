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
    
    this.airportsService.getData();

    this.service.serviceFinalResult$.subscribe(
      resultatas =>{
        this.resultDeparture = resultatas[0].split('T')[0];
        this.resultArrival = resultatas[1];
        this.resultPrice = resultatas[2] + "Eur";
        this.resultLink = resultatas[3];
        console.log(this.resultPrice+"Eur");
      
        
      }
    )
    this.airportsService.duomenys$.subscribe( resultatas => {
      this.allAirportsInfo = resultatas;
      // console.log("cia apie oro uostus: ", resultatas);
    })
      
  }
  // HTML kintamieji: 
  showDropdown: boolean = true;
  resultInfo!: any;
  // cia yra visu oro uostu pavadinimai
  allAirportsInfo: string[] = [];
  allAirportsIATA: [] = [];

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
    
    // pasikeisti formuluote situ abieju dalyku:

    this.submitedCityFrom = this.removeSpaces(el.cityFrom)!;
    console.log("main.ts:80"+this.submitedCityFrom);
    // veikia
    this.submitedCityFrom = await this.airportsService.getIATACode(this.submitedCityFrom)
    console.log("main.ts:82"+this.submitedCityFrom);

    this.submitedCityTo = this.removeSpaces(el.cityTo);
    console.log("main.ts:85"+this.submitedCityFrom);
    this.submitedCityTo = await this.airportsService.getIATACode(this.submitedCityTo);
    console.log("main.ts:87"+this.submitedCityTo);

    
    this.submitedDateFrom = this.dateFormat(el.dateFrom);
    this.submitedDateTo = this.dateFormat(el.dateTo);
    // Siunciu duomenis i service elementa
    this.service.nustatytiLaukus(this.submitedCityFrom, this.submitedCityTo, this.dateFormat(el.dateFrom), this.dateFormat(el.dateTo));
   
    // ---- cia prasideda visa grandine ---
    this.resultInfo = await this.service.sudetiSarasa();

    window.scrollTo(0, 1400);
  }

  onSubmit(forma: any){
  
    this.viewMode = true;
    this.submitedCityFrom = "Loading...";
    this.submitedCityTo = "Loading...";
    this.resultPrice = "Loading...";
    this.resultDeparture = "Loading...";
  }
  gautiDuomenis(){

   this.informacija = this.service.postData();

  }

  dateFormat(data: string){
    let placeholder: string[] = [];
    placeholder = data.split('-');
    let newDate: string = placeholder.reverse().join('/');
    return newDate;
  }
  rodytiOroUostuInfo(){
    for (let i = 0; i < this.allAirportsInfo.length; i++) {
      const element = this.allAirportsInfo[i];
      
    }
  
  }
  
  RodytiRezultata(){
    window.open(this.resultLink);
  }    
  

  data!:String;

  toggleDropdown(){
    this.showDropdown = !this.showDropdown;
  }

  removeSpaces(word: string){
    const newWord = word.replaceAll(' ', '%20');
  
    return newWord;
  }

}



// ALL AIRPORTS JSON FILE : https://raw.githubusercontent.com/jbrooksuk/JSON-Airports/master/airports.json