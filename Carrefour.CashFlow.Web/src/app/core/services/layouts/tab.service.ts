import { Injectable, Inject } from '@angular/core';
import { SecurityService } from '../accounts/security.service';
import { HttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabService {



  constructor(private http: HttpClient, 
    private securityService: SecurityService, 
    @Inject('BASE_URL') private baseUrl: string)
   {
  }

  public open(
    title: string,
    tabAddress: string,
    tabControlSelector: string = null,
    tabItemSelector: string = null,
    setBaseLegacyUrl = true): void {

    let url = this.baseUrl;

    if(setBaseLegacyUrl)
      url = this.securityService.legacyAddress;

    var referrer = this.securityService.referrer;

    let message: any = {};

    message.type = 'open-tab';
    message.title = title;

    if (!tabAddress.startsWith('http')) {
      message.url = url + tabAddress;
    } else {
      message.url = tabAddress;
    }

    message.tabControlSelector = tabControlSelector;
    message.tabItemSelector = tabItemSelector;

    window.top.postMessage(message, referrer);
  }
}
