import InitHandler from './ActionHandlers/InitHandler.js';
import TransitionToNextSlideHandler from './ActionHandlers/TransitionToNextSlideHandler.js';
import TransitionToPreviousSlideHandler from './ActionHandlers/TransitionToPreviousSlideHandler.js';
import TransitionToHandler from './ActionHandlers/TransitionToHandler.js';
import Bus from './Helpers/Bus.js';
import Store from './Helpers/Store.js';
import GetCurrentSlide from './ActionHelper/GetCurrentSlide.js';
import GetNextSlide from './ActionHelper/GetNextSlide.js';
import GetSliderPositionAsPercentage from './ActionHelper/GetSliderPositionAsPercentage.js';

export default class {

    constructor(userSettings) {

        this.options = Object.assign({}, userSettings);

        try {
            this.dom = {};
            this.dom.slider = this.options.el.querySelector('.' + this.options.blockname + '__slider');
            this.dom.slides = this.options.el.querySelectorAll('.' + this.options.blockname + '__slide');
            this.dom.next = this.options.el.querySelector('.' + this.options.blockname + '__next-slide');
            this.dom.prev = this.options.el.querySelector('.' + this.options.blockname + '__prev-slide');
        } catch (err) {
            console.log('The dom is missing some elements', err);
            return;
        }

        this.store = new Store();
        this.bus = new Bus();

        this.listenToErrors();
        this.listen();

        InitHandler(this.store, this.bus, this.dom.slides.length);

        this.uiEvents();
    }

    uiEvents() {
        this.dom.next.addEventListener('click', () => {
            this.next();
        });
        this.dom.prev.addEventListener('click', () => {
            this.prev();
        });
    }

    listenToErrors() {
        this.bus.on('InitiationFailed', (err) => {
            console.log(err, 'error');
        });
        this.bus.on('TransitionToNextSlideFailed', (err) => {
            console.log(err, 'error', this.store);
        });
        this.bus.on('TransitionToPreviousSlideFailed', (err) => {
            console.log(err, 'error', this.store);
        });
        this.bus.on('TransitionToFailed', (err) => {
            console.log(err, 'error', this.store);
        });
        this.bus.on('TransitionFailed', (err) => {
            console.log(err, 'error');
        });
    }

    listen() {
        this.bus.on('Initiated', (state) => {

        });
        this.bus.on('TransitionToNextSlideStarted', (state) => {
            this.dom.slider.style['margin-left'] = GetSliderPositionAsPercentage(this.store.get());
        });
        this.bus.on('TransitionToPreviousSlideStarted', (state) => {
            this.dom.slider.style['margin-left'] = GetSliderPositionAsPercentage(this.store.get());
        });
        this.bus.on('TransitionToStarted', (state) => {
            this.dom.slider.style['margin-left'] = GetSliderPositionAsPercentage(this.store.get());
        });
        this.bus.on('TransitionCompleted', (state) => {

        });
    }

    next() {
        TransitionToNextSlideHandler(this.store, this.bus);
    }

    prev() {
        TransitionToPreviousSlideHandler(this.store, this.bus);
    }

    goTo(slideNumber) {
        TransitionToHandler(this.store, this.bus, slideNumber);
    }

}
