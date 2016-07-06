import { Type } from '@angular/core';
import {Service, ServiceInfo} from "./Service";
import {Events} from 'ionic-angular';
import {Configuration} from '../Configuration';

//Services
import {TimerService} from './TimerService';
import {GeoLocationService} from './GeoLocationService';
import {WeatherService}from './WeatherService';
import {SpeechService}from './SpeechService';
import {SessionDataService}from './SessionDataService';

export class ServicesBuilder{
    public x : TimerService;
    private static _servicesInfo : Array<ServiceInfo> = null;

    public static get servicesInfo():Array<ServiceInfo>{
        if (this._servicesInfo!=null)        
            return ServicesBuilder._servicesInfo;
        this._servicesInfo = new Array<ServiceInfo>();

        //WeatherService
        this._servicesInfo.push(new ServiceInfo(WeatherService,600));        
        //GeoLocationService
        this._servicesInfo.push(new ServiceInfo(GeoLocationService,null));
        //TimerService
        this._servicesInfo.push(new ServiceInfo(TimerService,1));
        //SpeechService
        this._servicesInfo.push(new ServiceInfo(SpeechService,null));
        //SessionDataService
        this._servicesInfo.push(new ServiceInfo(SessionDataService, Configuration.minRecordingGap));


        return this._servicesInfo;
    }
    
    public static getServiceTypes(): Array<Type>{
        let serviceTypes = new Array<Type>();
        this.servicesInfo.forEach(si => {
            serviceTypes.push(si.serviceType)
        });
        return serviceTypes;
    }
    
    public static getProviders(defaultProviders:Array<Type>=[]): Array<Type|any[]>{
        let providers:Array<Type|any[]>=defaultProviders;        
        this.servicesInfo.forEach(si => {
            si.serviceProviders.forEach(sp=>{
                if(!providers.find(el=> el.toString() == sp.toString()))
                    providers.push(sp);
            });
        });
        this.getServiceTypes().forEach(si => {
            if(!providers.find(el=> el.toString() == si.toString()))
                providers.push(si);
        });
        return providers;
    }
}