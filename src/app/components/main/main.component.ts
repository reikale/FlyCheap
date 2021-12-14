import { Component, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { KiwiService } from 'src/app/services/kiwi.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  constructor(private service: KiwiService) { 
  
  }

  ngOnInit(): void {
    
  }
  informacija: any;
  
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
  showResult = false;

  submit(el: any ){
    
    
    this.submitedCityFrom = el.cityFrom;
    this.submitedCityTo = el.cityTo;
    this.submitedDateFrom = this.dateFormat(el.dateFrom);
    this.submitedDateTo = this.dateFormat(el.dateTo);
    // Siunciu duomenis i service elementa
    this.service.nustatytiLaukus(el.cityFrom, el.cityTo, this.dateFormat(el.dateFrom), this.dateFormat(el.dateTo));
   
    this.service.sudetiSarasa();
  }
  onSubmit(forma: any){
    console.log(forma);
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
  // this.service.returnItems(
  //     this.resultDeparture,
  //     this.resultArrival,
  //     this.resultPrice,
  //     this.resultLink,
  //     this.showResult)
  
}
