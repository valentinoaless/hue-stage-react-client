export default class Light {
    constructor(bridgeIndex, name, id, gridStates) {
        this.bridgeIndex = bridgeIndex;
        this.name = name;
        this.id = id;
        this.gridStates = gridStates;
    }
}

export class State {
    constructor(hue, sat, bri, transitiontime=0, on=true, duration=1) {
        this.id = `state--id--${(new Date()).getTime()}`;
        this.hue = Math.round(hue * 182.04166);
        this.bri =  Math.round(bri/100 * 254);
        this.sat = Math.round(sat/100 * 254);
        this.transitiontime = transitiontime;
        this.on = on;
        this.duration = duration;
        this.UIhue = hue;
        this.UIsat = sat;
        this.UIbri = bri;
    }

    data() {
        return JSON.stringify({
            hue: this.hue, 
            sat: this.sat,
            bri: this.bri, 
            transitiontime: this.transitiontime,
            on: this.on
        })
    }

    set(property, value) {
        if(property === 'UIhue') {
            this.UIhue = value;
            this.hue = Math.round(value * 182.04166);
        } else if (property === 'UIsat') {
            this.UIsat = value;
            this.sat = Math.round(value/100 * 254);
        } else if (property === 'UIbri') {
            this.UIbri = value;
            this.bri =  Math.round(value/100 * 254);
        } else {
            console.log('Invalid property name');
        }

    }

    convert(property, value) {

        if(property === 'hue') {
            return Math.round(property * 182.04166);
        } else if (property === 'sat') {
            return Math.round(property/100 * 254);
        } else if (property === 'bri') {
            return Math.round(property/100 * 254);
        } else {
            return null;
        }


    }





}

