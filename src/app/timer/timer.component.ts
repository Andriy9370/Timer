import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription, timer, Subject, Observable } from 'rxjs';
import { debounceTime, timeInterval } from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnDestroy, AfterViewInit {

  private ticks: number = 0;
  public minutesDisplay: string = '00';
  public hoursDisplay: string = '00';
  public secondsDisplay: string = '00';

  public startText = 'Start';
  public running: boolean = false;
  public waitting: boolean = false;
  public resetDisabled: boolean = true;

  private waitClick = new Subject<boolean>();
  private subscriptions: Subscription[] = [];


  ngAfterViewInit() {
    this.waitClick.pipe(
      timeInterval(),
    ).subscribe(i => {
      if (i.interval <= 300) {
        this.unsubscribe();
        this.startText = 'Start';
        this.running = false;
        this.waitting = true;
      }
    })
  }

  public toogleTimer() {
    this.running = !this.running;
    if (this.running) {
      this.startTimer();
    }
    else {
      this.clearTimer();
    }
  }

  private startTimer() {
    this.subscriptions.push(timer(0, 1000).subscribe(() => {
      this.setActiveTime(this.ticks);
      this.ticks++
      this.startText = 'Stop';
      this.waitting = false;
      this.resetDisabled = false;
    }))
  }

  public clearTimer() {
    this.unsubscribe();
    this.ticks = 0;
    this.running = false;
    this.setActiveTime(this.ticks);
    this.startText = 'Start';
    this.resetDisabled = true;
  }

  public resetTimer() {
    this.clearTimer();
    this.toogleTimer();
  }

  public waitTimer() {
    this.waitClick.next(true);
  }

  private setActiveTime(ticks: number) {
    this.secondsDisplay = this.getSeconds(ticks);
    this.minutesDisplay = this.getMinutes(ticks);
    this.hoursDisplay = this.getHours(ticks);
  }

  private getSeconds(ticks: number): string  {
    return this.pad(ticks % 60);
  }

  private getMinutes(ticks: number): string  {
    return this.pad((Math.floor(ticks / 60)) % 60);
  }

  private getHours(ticks: number): string  {
    return this.pad(Math.floor((ticks / 60) / 60));
  }

  private pad(digit: number): string {
    return digit <= 9 ? '0' + digit.toString() : digit.toString();
  }

  unsubscribe() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription: Subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions = [];
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
    this.waitClick.unsubscribe();
  }
}