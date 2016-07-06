import {Type} from '@angular/core';

export interface ServiceType extends Type{
    providers:Array<Type|any[]>;  
}

export interface Service{
    execute():void;
    start():void;
    stop():void;
    pause():void;
    resume():void;
}

export class ServiceInfo{
    public iId: number;
    public interval : number;
    public nextExec : Date;
    public serviceProviders :Array<Type|any[]>;
    public service : Service;
    public serviceType : Type;
    
    public constructor(serviceType: ServiceType , intervalInSecs :number){
        this.serviceType = serviceType;
        this.iId = null;
        this.interval = intervalInSecs * 1000;
        this.serviceProviders = serviceType.providers;
    }
}