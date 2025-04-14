export class ActorState {
    constructor(actor) {
        this.actor = actor;
        this.enterTime = 0;
    }

    enter (currentTime) {
        this.enterTime = currentTime;
    }

    update (dt , currentTime) {
        
    }
    exit () {
        
    }

    
}