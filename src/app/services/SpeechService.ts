import {Service} from './Service';
import {Configuration, RunProgram, RunProgramStepType} from '../Configuration';
import {StringUtils} from '../utils/String';
import {EventsManager} from '../utils/EventsManager';

declare var SpeechSynthesisUtterance: any;
declare var speechSynthesis: any;
declare var TTS: any;

enum EventType {
    minutes,
    distance
}

export class SpeechService extends Service {
    private minCount = 0;
    private kmCount = 0;
    private delayProgramMinCount = 0;
    private program: RunProgram;
    private currentRunStepId = 0;
    private programRepeat = 0;

    public constructor() {
        super(null);
        EventsManager.subscribe('TimerService:infoMinElaps', this, this.speechInfoTimeElaps);
        EventsManager.subscribe('SessionDataService:infoKmElaps', this, this.speechInfoKmElaps);
    }

    protected doStart() {
        this.program = Configuration.program;

        if (this.program != null) {
            if (this.program.steps.length === 0) {
                this.program = null;
            } else {
                this.minCount = this.program.steps[this.currentRunStepId].minutes;
                this.kmCount = this.program.steps[this.currentRunStepId].distanceKm;
                this.programRepeat = this.program.times;
            }
        }
        this.delayProgramMinCount = Configuration.programStartDelayMin;
        this.speakStart();
    }

    private speakStart() {
        if (this.delayProgramMinCount === 0) {
            this.speechProgramStep(true);
        }
    }

    private speak(text: String) {
        if (Configuration.speechEnabled !== true) {
            return;
        }
        const u = new SpeechSynthesisUtterance();
        u.lang = Configuration.locale[0];
        u.text = text;
        speechSynthesis.speak(u);
        // Test 2
//        TTS.speak({
//            text: text + ' B',
//            locale: 'it-IT'
//         }, () => {
//                let i = 1;
//             }, (reason : any) => {
//                 let i = 1;
//             });
    }

    public speechInfoKmElaps() {
        if (this.isPaused === true) {
            return;
        }
        this.doProgramSpeech(EventType.distance);
    }


    public speechInfoTimeElaps(mins: number) {
        if (this.isPaused === true) {
            return;
        }
        this.delayProgramMinCount--;

        if (this.delayProgramMinCount === 0) {
            this.speechProgramStep(true);
        }

        if (Configuration.infoTimeElaps !== 0 && (mins % Configuration.infoTimeElaps) === 0) {
            let text: String;
            if (mins === 1) {
                text = 'un minuto';
            } else {
                text = StringUtils.format('{0} minuti', mins);
            }
            // text = StringUtils.format("Sessione in corso da {0}", text);
            this.speak(text);
        }
        this.doProgramSpeech(EventType.minutes);
    }

    private doProgramSpeech(et: EventType) {
        if (this.program == null || this.delayProgramMinCount > 0) {
            return;
        }
        switch (et) {
            case EventType.distance:
                if (this.kmCount == null) {
                    return;
                }
                this.kmCount--;
                if (this.kmCount === 0) {
                    this.setNewProgramStep();
                    this.speechProgramStep();
                }
                break;
            case EventType.minutes:
                if (this.minCount == null) {
                    return;
                }
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
                this.speak('programma di allenamento ' + this.program.name + 'terminato');
                this.program = null;
                return;
            }
            this.currentRunStepId = 0;
        }
        this.minCount = this.program.steps[this.currentRunStepId].minutes;
        this.kmCount = this.program.steps[this.currentRunStepId].distanceKm;
    }

    private speechProgramStep(isFirst: boolean = false) {
        if (this.program == null) {
            return;
        }
        if (isFirst === true) {
            this.speak('inizia programma di allenamento ' + this.program.name);
        }
        let text = 'è ora di ';
        const step = this.program.steps[this.currentRunStepId];
        switch (step.type) {
            case RunProgramStepType.Run:
                text += 'correre per ';
                break;
            case RunProgramStepType.Walk:
                text += 'camminare per ';
                break;
        }
        if (step.minutes != null) {
            if (step.minutes === 1) {
                text += 'un minuto';
            } else {
                text += step.minutes + ' minuti';
            }
        } else {
            if (step.distanceKm === 1) {
                text += 'un chilòmetro';
            } else {
                text += step.distanceKm + ' chilòmetri';
            }
        }
        this.speak(text);
    }

    protected execute() {
    }

    protected doStop() {
    }

    protected doDestroy() {
        EventsManager.unsubscribe('TimerService:infoMinElaps', this);
        EventsManager.unsubscribe('SessionDataService:infoKmElaps', this);
    }
}
