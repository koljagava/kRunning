import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Configuration } from '../../Configuration';
import { Converter } from '../../utils/Converter';
import { LocalStorage } from '../../utils/Storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnDestroy, OnInit {
  @Input() public config: any;

  constructor() {
  }

  public get programName(): string {
    return this.config.program == null ? '' : this.config.program.name;
  }

  public set programName(value: string) {
     this.config.program = this.config.stdPrograms.find((p: any) => p.name === value);
  }

  public getBmiInfo() {
    const bmiClass =  Converter.getBmiClass(Converter.bmiClaculator(this.config.heightCm, this.config.weightKg));
    if (bmiClass == null) {
      return '';
    } else {
      const diffWheight = (this.config.weightKg - this.standardWeigth(this.config.heightCm));
      if (diffWheight < 0) {
        return '[' + bmiClass.descr + ']';
      } else {
        return '[' + bmiClass.descr + ' (' + diffWheight.toFixed(1) + ' Kg)]';
      }
    }
  }

  public standardWeigth(heightCm: number) {
    return Converter.standardWeigth(heightCm);
  }

  public ngOnInit() {
    this.config = Configuration;
  }

  public ngOnDestroy() {
    LocalStorage.setObject('config', this.config);
  }
}
