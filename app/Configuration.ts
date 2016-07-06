import {Globalization} from 'ionic-native';
import {LocalStorage} from './utils/Storage';
export enum RunProgramStepType{
    Walk,
    Run,
}

export class RunProgramStep{
    public type : RunProgramStepType;
    public minutes : number;
    public distanceKm : number;

    constructor(type:RunProgramStepType, minutes:number, distanceKm?:number){
        this.type = type;
        this.minutes = minutes;
        this.distanceKm = distanceKm;
    }
}

export class RunProgram{
    public className : string;
    public name : string;
    public steps : Array<RunProgramStep>;
    public times : number

    constructor(className:string, name:string, times:number, steps:Array<RunProgramStep>){
        this.className = className;
        this.name = name;
        this.times = times;
        this.steps = steps;
    }
}

export class ConfigurationType{
    public heightCm = null;
    public weightKg = null;
    public program  : RunProgram = null;
    public programStartDelayMin = 0;
    public lang = Globalization.getLocaleName();
    public mode = "md";
    public unit = "kms";
    public minRecordingAccuracy = 22;
    public minRecordingGap = 5;
    public minRecordingSpeed = 3;
    public maxRecordingSpeed = 38;
    public debugEnabled = false; 
    public infoTimeElaps = 1; //espresso in minuti, 0 = disabilitato
    public speechEnabled = true;
    public startDelaySecs = 10;
    public globals = {
        heartRate: {
            service: '180d',
            measurement: '2a37'
        },
        radius: {
            miles: 3959,
            kms: 6371
        },
        tounit: {
            miles: 1609.344,
            kms: 1000
        },
        pace: {
            miles: 11.990880236041,
            kms: 4.62963888888889
        },
        speed: {
            miles: 2.2369,
            kms: 3.6
        },
        pacelabel: {
            miles: ' min/mile',
            kms: ' min/km'
        },
        speedlabel: {
            miles: ' mph',
            kms: ' kph'
        },
        distancelabel: {
            miles: ' miles',
            kms: ' km'
        }
    };
    public stdPrograms : Array<RunProgram> = this.setStdPrograms();

    public setStdPrograms():Array<RunProgram> {
        let stdPrograms = new Array<RunProgram>();
        //** start to run **
        // Step 1
        let prg = new RunProgram("Gialla", "Livello 1", 8, [new RunProgramStep(RunProgramStepType.Walk, 2), new RunProgramStep(RunProgramStepType.Run, 1)]);
        stdPrograms.push(prg);

        // Step 2
        prg = new RunProgram("Gialla", "Livello 2", 6, [new RunProgramStep(RunProgramStepType.Walk, 3), new RunProgramStep(RunProgramStepType.Run, 2)]);
        stdPrograms.push(prg);

        // Step 3
        prg = new RunProgram("Gialla", "Livello 3", 6, [new RunProgramStep(RunProgramStepType.Walk, 3), new RunProgramStep(RunProgramStepType.Run, 4)]);
        stdPrograms.push(prg);

        // Step 4
        prg = new RunProgram("Rossa", "Livello 4", 5, [new RunProgramStep(RunProgramStepType.Walk, 3), new RunProgramStep(RunProgramStepType.Run, 6)]);
        stdPrograms.push(prg);

        // Step 5
        prg = new RunProgram("Rossa", "Livello 5", 4, [new RunProgramStep(RunProgramStepType.Walk, 3), new RunProgramStep(RunProgramStepType.Run, 10)]);
        stdPrograms.push(prg);

        // Step 6
        prg = new RunProgram("Rossa", "Livello 6", 3, [new RunProgramStep(RunProgramStepType.Walk, 3), new RunProgramStep(RunProgramStepType.Run, 15)]);
        stdPrograms.push(prg);

        // Step 7
        prg = new RunProgram("Nera", "Livello 7", 2, [new RunProgramStep(RunProgramStepType.Walk, 5), new RunProgramStep(RunProgramStepType.Run, 25)]);
        stdPrograms.push(prg);

        // Step 8
        prg = new RunProgram("Nera", "Livello 8", 1, [new RunProgramStep(RunProgramStepType.Walk, 5), new RunProgramStep(RunProgramStepType.Run, 35), new RunProgramStep(RunProgramStepType.Walk, 5), new RunProgramStep(RunProgramStepType.Run, 15)]);
        stdPrograms.push(prg);

        // Step 9
        prg = new RunProgram("Nera", "Livello 9", 1, [new RunProgramStep(RunProgramStepType.Walk, 5), new RunProgramStep(RunProgramStepType.Run, 45), new RunProgramStep(RunProgramStepType.Walk, 5), new RunProgramStep(RunProgramStepType.Run, 15)]);
        stdPrograms.push(prg);

        // Step 10
        prg = new RunProgram("Nera", "Livello 10", 1, [new RunProgramStep(RunProgramStepType.Walk, 5), new RunProgramStep(RunProgramStepType.Run, null, 10)]);
        stdPrograms.push(prg);

        return stdPrograms;
    }
}

export var Configuration : ConfigurationType = LocalStorage.getObject<ConfigurationType>('config') || new ConfigurationType();