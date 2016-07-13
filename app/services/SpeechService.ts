import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Service} from "./Service";
import {Events} from "ionic-angular";
import {Configuration, RunProgram, RunProgramStep, RunProgramStepType} from "../Configuration";
import {StringUtils} from "../utils/String";
import {EventsManager} from "../utils/EventsManager";

declare var SpeechSynthesisUtterance: any;
declare var speechSynthesis: any;

enum EventType {
    minutes,
    distance
}

@Injectable()
export class SpeechService implements Service {
    public static providers = [Events];
    private events: Events;
    private isPaused = false;
    private minCount = 0;
    private kmCount = 0;
    private delayProgramMinCount = 0;
    private program: RunProgram;
    private currentRunStepId = 0;
    private programRepeat = 0;
    public constructor(events: Events) {
        this.events = events;
    }

    public start() {
        EventsManager.subscribe("TimerService:infoMinElaps", this, this.speechInfoTimeElaps);
        EventsManager.subscribe("SessionDataService:infoKmElaps", this, this.speechInfoKmElaps);

        this.program = Configuration.program;

        if (this.program != null) {
            if (this.program.steps.length === 0) {
                this.program == null;
            }else {
                this.minCount = this.program.steps[this.currentRunStepId].minutes;
                this.kmCount = this.program.steps[this.currentRunStepId].distanceKm;
                this.programRepeat = this.program.times;
            }
        }
        this.delayProgramMinCount = Configuration.programStartDelayMin;
        this.speakStart();
    }

    public speakStart() {
        if (this.delayProgramMinCount === 0)
            this.speechProgramStep(true);
    }

    public static speak(text: String) {
        if (Configuration.speechEnabled !== true)
            return;
        let u = new SpeechSynthesisUtterance();
        u.lang = Configuration.lang;
        u.text = text;
        speechSynthesis.speak(u);
    }

    public speechInfoKmElaps(params: Array<any>) {
        if (this.isPaused === true)
            return;
        this.doProgramSpeech(EventType.distance);
    }


    public speechInfoTimeElaps(params: Array<any>) {
        if (this.isPaused === true)
            return;
        let mins = <number>params[0];

        this.delayProgramMinCount--;

        if (this.delayProgramMinCount === 0)
            this.speechProgramStep(true);

        if (Configuration.infoTimeElaps !== 0 && (mins % Configuration.infoTimeElaps) === 0) {
            let text: String;
            if (mins === 1) {
                text = "un minuto";
            }else {
                text = StringUtils.format("{0} minuti", mins);
            }
            // text = StringUtils.format("Sessione in corso da {0}", text);
            SpeechService.speak(text);
        }
        this.doProgramSpeech(EventType.minutes);
    }

    private doProgramSpeech(et: EventType) {
        if (this.program == null || this.delayProgramMinCount > 0)
        return;
        switch (et) {
            case EventType.distance:
                if (this.kmCount == null)
                    return;
                this.kmCount--;
                if (this.kmCount === 0) {
                    this.setNewProgramStep();
                    this.speechProgramStep();
                }
                break;
            case EventType.minutes:
                if (this.minCount == null)
                    return;
                this.minCount--;
                if (this.minCount === 0) {
                    this.setNewProgramStep();
                    this.speechProgramStep();
                }
                break;
        }
    }

    private setNewProgramStep() {
        this.currentRunStepId++;
        if (this.currentRunStepId >= this.program.steps.length) {
            this.programRepeat--;
            if (this.programRepeat <= 0) {
                SpeechService.speak("programma di allenamento " + this.program.name + "terminato");
                this.program = null;
                return;
            }
            this.currentRunStepId = 0;
        }
        this.minCount = this.program.steps[this.currentRunStepId].minutes;
        this.kmCount = this.program.steps[this.currentRunStepId].distanceKm;
    }

    private speechProgramStep(isFirst: boolean = false) {
        if (this.program == null)
            return;
        if (isFirst === true) {
            SpeechService.speak("inizia programma di allenamento " + this.program.name);
        }
        let text = "è ora di ";
        let step = this.program.steps[this.currentRunStepId];
        switch (step.type) {
            case RunProgramStepType.Run:
                text += "correre per ";
                break;
            case RunProgramStepType.Walk:
                text += "camminare per ";
                break;
        }
        if (step.minutes != null) {
            if (step.minutes === 1)
                text += "un minuto";
            else
                text += step.minutes + " minuti";
        }else {
            if (step.distanceKm === 1)
                text += "un chilòmetro";
            else
                text += step.distanceKm + " chilòmetri";
        }
        SpeechService.speak(text);
    }

    public execute() {
    }

    public stop() {
        EventsManager.unsubscribe("TimerService:infoMinElaps", this);
        EventsManager.unsubscribe("SessionDataService:infoKmElaps", this);
    }

    public pause() {
        this.isPaused = true;
    }

    public resume() {
        this.isPaused = false;
    }
}