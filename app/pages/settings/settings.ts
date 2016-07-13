import {Page, NavController} from "ionic-angular";
import {Input, OnDestroy} from "@angular/core";
import {Configuration} from "../../Configuration";
import {Converter} from "../../utils/Converter";
import {LocalStorage} from "../../utils/Storage";
/*
  Generated class for the SettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: "build/pages/settings/settings.html",
})
export class SettingsPage implements OnDestroy {
  @Input()
  public config: any;
  constructor(public nav: NavController) {
    this.config = Configuration;
  }

  public get programName(): string{
    return this.config.program == null ? "" : this.config.program.name;
  }

  public set programName(value: string){
     this.config.program = this.config.stdPrograms.find((p: any) => {return p.name === value; });
  }

  public getBmiInfo() {
    let bmiClass =  Converter.getBmiClass(Converter.bmiClaculator(this.config.heightCm, this.config.weightKg));
    if (bmiClass == null)
      return "";
    else {
      let diffWheight = (this.config.weightKg - this.standardWeigth(this.config.heightCm));
      if (diffWheight < 0)
        return "[" + bmiClass.descr + "]";
      else
        return "[" + bmiClass.descr + " (" + diffWheight.toFixed(1) + " Kg)]";
    }
  }

  public standardWeigth(heightCm: number) {
    return Converter.standardWeigth(heightCm);
  }

  public ngOnDestroy() {
    LocalStorage.setObject("config", this.config);
  }
}