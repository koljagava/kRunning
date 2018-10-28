// import {Globalization} from '@ionic-native/globalization';
import {LocalStorage} from './utils/Storage';

export enum RunProgramStepType {
    Walk,
    Run,
}
export class RunProgramStep {
    public type: RunProgramStepType;
    public minutes: number;
    public distanceKm: number;

    constructor(type: RunProgramStepType, minutes: number, distanceKm?: number) {
        this.type = type;
        this.minutes = minutes;
        this.distanceKm = distanceKm;
    }
}

export class RunProgram {
    public className: string;
    public name: string;
    public steps: Array<RunProgramStep>;
    public times: number;

    constructor(className: string, name: string, times: number, steps: Array<RunProgramStep>) {
        this.className = className;
        this.name = name;
        this.times = times;
        this.steps = steps;
    }
}

export class ConfigurationType {
    public heightCm = null;
    public weightKg = null;
    public program: RunProgram = null;
    public programStartDelayMin = 0;
    public mode = 'md';
    public minRecordingAccuracy = 22;
    public minRecordingGap = 5;
    public minRecordingSpeed = 3;
    public maxRecordingSpeed = 38;
    public debugEnabled = true;
    public infoTimeElaps = 1; // espresso in minuti, 0 = disabilitato
    public speechEnabled = true;
    public startDelaySecs = 10;
    public locale = navigator.languages;

    public globals = {
        units : {
            miles : 'miles',
            kms : 'kms',
        },
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
        }
    };
    public unit = this.globals.units.kms;
    public stdPrograms: Array<RunProgram> = this.setStdPrograms();
    // public globalization : Globalization = new Globalization();
    public setStdPrograms(): Array<RunProgram> {
        const stdPrograms = new Array<RunProgram>();
        // ** start to run **
        // Step 1
        stdPrograms.push(new RunProgram('Gialla', 'Livello 1', 8,
            [
                new RunProgramStep(RunProgramStepType.Walk, 2),
                new RunProgramStep(RunProgramStepType.Run, 1)
            ]));

        // Step 2
        stdPrograms.push(new RunProgram('Gialla', 'Livello 2', 6,
            [
                new RunProgramStep(RunProgramStepType.Walk, 3),
                new RunProgramStep(RunProgramStepType.Run, 2)
            ]));

            // Step 3
        stdPrograms.push(new RunProgram('Gialla', 'Livello 3', 6,
            [
                new RunProgramStep(RunProgramStepType.Walk, 3),
                new RunProgramStep(RunProgramStepType.Run, 4)
            ]));

        // Step 4
        stdPrograms.push(new RunProgram('Rossa', 'Livello 4', 5,
            [
                new RunProgramStep(RunProgramStepType.Walk, 3),
                new RunProgramStep(RunProgramStepType.Run, 6)
            ]));

        // Step 5
        stdPrograms.push(new RunProgram('Rossa', 'Livello 5', 4,
            [
                new RunProgramStep(RunProgramStepType.Walk, 3),
                new RunProgramStep(RunProgramStepType.Run, 10)
            ]));

        // Step 6
        stdPrograms.push(new RunProgram('Rossa', 'Livello 6', 3,
            [
                new RunProgramStep(RunProgramStepType.Walk, 3),
                new RunProgramStep(RunProgramStepType.Run, 15)
            ]));

        // Step 7
        stdPrograms.push(new RunProgram('Nera', 'Livello 7', 2,
            [
                new RunProgramStep(RunProgramStepType.Walk, 5),
                new RunProgramStep(RunProgramStepType.Run, 25)
            ]));

        // Step 8
        stdPrograms.push(new RunProgram('Nera', 'Livello 8', 1,
            [
                new RunProgramStep(RunProgramStepType.Walk, 5),
                new RunProgramStep(RunProgramStepType.Run, 35),
                new RunProgramStep(RunProgramStepType.Walk, 5),
                new RunProgramStep(RunProgramStepType.Run, 15)
            ]));

        // Step 9
        stdPrograms.push(new RunProgram('Nera', 'Livello 9', 1,
            [
                new RunProgramStep(RunProgramStepType.Walk, 5),
                new RunProgramStep(RunProgramStepType.Run, 45),
                new RunProgramStep(RunProgramStepType.Walk, 5),
                new RunProgramStep(RunProgramStepType.Run, 15)
            ]));

        // Step 10
        stdPrograms.push(new RunProgram('Nera', 'Livello 10', 1,
            [
                new RunProgramStep(RunProgramStepType.Walk, 5),
                new RunProgramStep(RunProgramStepType.Run, null, 10)
            ]));

        return stdPrograms;
    }
}

export const Configuration: ConfigurationType = LocalStorage.getObject<ConfigurationType>('config') || new ConfigurationType();
