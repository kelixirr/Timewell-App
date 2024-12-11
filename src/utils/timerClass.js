class Timer {
  constructor(duration, onTick, onComplete, onStatusChange) {
    this.duration = duration * 1000; 
    this.elapsedTime = 0; 
    this.startTime = null; 
    this.timeoutId = null; 
    this.onTick = onTick; 
    this.onComplete = onComplete;
    this.onStatusChange = onStatusChange;
  }

  start() {
    if (this.timeoutId === null) {
      this.startTime = Date.now() - this.elapsedTime; 
      if (this.onStatusChange) this.onStatusChange(true);
      this.tick();
    }
  }

  tick() {
    this.elapsedTime = Date.now() - this.startTime;

    if (this.elapsedTime >= this.duration) {
      this.elapsedTime = this.duration; 
      this.stop();
      if (this.onComplete) {
        this.onComplete()
      };
      
    } else {
      if (this.onTick) this.onTick(this.getTime());
      this.timeoutId = setTimeout(() => this.tick(), 1000);
    }
  }

  pause() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId); 
      this.timeoutId = null;
      if (this.onStatusChange) this.onStatusChange(false); 
    }
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId); 
      this.timeoutId = null;
      if (this.onStatusChange) this.onStatusChange(false);
    }
    this.elapsedTime = 0;
    this.startTime = null;
  }

  extend(extraDuration) {
    this.duration += extraDuration * 1000; 
    if (this.elapsedTime > this.duration) {
      this.elapsedTime = this.duration;
    }
  }

  getTime() {
    return Math.floor(Math.max((this.duration - this.elapsedTime) / 1000, 0)); 
  }

  isRunning() {
    return this.timeoutId !== null; 
  }
}

export default Timer;
