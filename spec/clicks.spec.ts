import { heartbeatToTempo, tempoToHeartbeat } from '../src/ts/utils/tempo-conversion';
import { ClickPayload, Clicks } from '../clicks';
import {
    quarternotes44Label,
    eighthnotes44Label,
    getQuarterNotesBuilder_4_4,
    getQuarternotesStartParameter,
    getEighthNotesEmphasis_4_4StartParameter,
    rondoMelodyLabel,
    rondoLeftHandLabel,
    setDebugClickbaseRanges,
    start,
    stop,
    hemiolaTripletsLabel,
    hemiolaDupletsLabel,
    getBlueRondoALaTurkSFirstMeasureStartParameter,
    getHemiolaStartParameter
} from '../index';

interface CallbackAttributes {
    callbackRun: boolean;
    currentId: string;
    currentIndex: number;
    currentDuration: number;
}

const quarternoteCallbackAttributes: CallbackAttributes = {
    callbackRun: false,
    currentId: '',
    currentIndex: 0,
    currentDuration: 0
}

const eighthnoteCallbackAttributes = {
    callbackRun: false,
    currentId: '',
    currentIndex: 0,
    currentDuration: 0
}

const rondoMelodyCallbackAttributes: CallbackAttributes = {
    callbackRun: false,
    currentId: '',
    currentIndex: 0,
    currentDuration: 0
}

const rondoLeftHandCallbackAttributes: CallbackAttributes = {
    callbackRun: false,
    currentId: '',
    currentIndex: 0,
    currentDuration: 0,
}
const rondoLabels =  {
    melody: "",
    leftHand: ""
}

const hemiolaTripletsCallbackAttributes: CallbackAttributes = {
    callbackRun: false,
    currentId: '',
    currentIndex: 0,
    currentDuration: 0
}
const hemiolaDupletsCallbackAttributes: CallbackAttributes = {
    callbackRun: false,
    currentId: '',
    currentIndex: 0,
    currentDuration: 0
}

function quarternoteCallback(clicksPayload: ClickPayload): void {
    expect(clicksPayload.id).withContext('quarternote currentId').toEqual(quarternoteCallbackAttributes.currentId);
    expect(clicksPayload.clickIndex).withContext('quarternote clickIndex').toEqual(quarternoteCallbackAttributes.currentIndex);
    expect(clicksPayload.duration).withContext('quarternote duration').toEqual(quarternoteCallbackAttributes.currentDuration);
    quarternoteCallbackAttributes.currentIndex = (quarternoteCallbackAttributes.currentIndex + 1) % 4;
    quarternoteCallbackAttributes.callbackRun = true;
}
function eighthnoteCallback(clicksPayload: ClickPayload): void {
    expect(clicksPayload.id).withContext('eighthnote currentId').toEqual(eighthnoteCallbackAttributes.currentId);
    expect(clicksPayload.clickIndex).withContext('eighthnote clickIndex').toEqual(eighthnoteCallbackAttributes.currentIndex);
    expect(clicksPayload.duration).withContext('eighthnote duration').toEqual(eighthnoteCallbackAttributes.currentDuration);
    eighthnoteCallbackAttributes.currentIndex = (eighthnoteCallbackAttributes.currentIndex + 1) % 8;
    eighthnoteCallbackAttributes.callbackRun = true;
}
function rondoMelodyCallback(clicksPayload: ClickPayload): void {
    expect(clicksPayload.id).withContext(`[${rondoLabels.melody}] rondo melody currentId`).toEqual(rondoMelodyCallbackAttributes.currentId);
    expect(clicksPayload.clickIndex).withContext(`[${rondoLabels.melody}] rondo melody clickIndex`).toEqual(rondoMelodyCallbackAttributes.currentIndex);
    expect(clicksPayload.duration).withContext(`[${rondoLabels.melody}] rondo melody duration`).toEqual(rondoMelodyCallbackAttributes.currentDuration);
    ++rondoMelodyCallbackAttributes.currentIndex;
    rondoMelodyCallbackAttributes.callbackRun = true;
}
function rondoLefthandCallback(clicksPayload: ClickPayload): void {
    expect(clicksPayload.id).withContext(`[${rondoLabels.leftHand}] currentId ${JSON.stringify(clicksPayload)}`).toEqual(rondoLeftHandCallbackAttributes.currentId);
    expect(clicksPayload.clickIndex).withContext(`[${rondoLabels.leftHand}] currentIndex ${JSON.stringify(clicksPayload)}`).toEqual(rondoLeftHandCallbackAttributes.currentIndex);
    expect(clicksPayload.duration).withContext(`[${rondoLabels.leftHand}] currentDuration ${JSON.stringify(clicksPayload)}`).toEqual(rondoLeftHandCallbackAttributes.currentDuration);
    rondoLeftHandCallbackAttributes.currentIndex = (rondoLeftHandCallbackAttributes.currentIndex + 1) % 4;
    rondoLeftHandCallbackAttributes.callbackRun = true;
}
function hemiolaTripletsCallback(clicksPayload: ClickPayload): void {
    expect(clicksPayload.id).withContext(`hemiola triplets currentId ${JSON.stringify(clicksPayload)}`).toEqual(hemiolaTripletsCallbackAttributes.currentId);
    expect(clicksPayload.clickIndex).withContext(`hemiola triplets currentId currentIndex ${JSON.stringify(clicksPayload)}`).toEqual(hemiolaTripletsCallbackAttributes.currentIndex);
    expect(clicksPayload.duration).withContext(`hemiola triplets currentId currentDuration ${JSON.stringify(clicksPayload)}`).toEqual(hemiolaTripletsCallbackAttributes.currentDuration);
    hemiolaTripletsCallbackAttributes.currentIndex = (hemiolaTripletsCallbackAttributes.currentIndex + 1) % 12;
    hemiolaTripletsCallbackAttributes.callbackRun = true;
}
function hemiolaDupletsCallback(clicksPayload: ClickPayload): void {
    expect(clicksPayload.id).withContext(`hemiola duplets currentId ${JSON.stringify(clicksPayload)}`).toEqual(hemiolaDupletsCallbackAttributes.currentId);
    expect(clicksPayload.clickIndex).withContext(`hemiola duplets currentId currentIndex ${JSON.stringify(clicksPayload)}`).toEqual(hemiolaDupletsCallbackAttributes.currentIndex);
    expect(clicksPayload.duration).withContext(`hemiola duplets currentId currentDuration ${JSON.stringify(clicksPayload)}`).toEqual(hemiolaDupletsCallbackAttributes.currentDuration);
    hemiolaDupletsCallbackAttributes.currentIndex = (hemiolaDupletsCallbackAttributes.currentIndex + 1) % 8;
    hemiolaDupletsCallbackAttributes.callbackRun = true;    
}
function resetCallbackAttributes(callbackAttributes: CallbackAttributes): void {
    callbackAttributes.callbackRun = false;
    callbackAttributes.currentId = "";
    callbackAttributes.currentIndex = 0;
    callbackAttributes.currentDuration = 0;
}


describe(`Package Test basic metronomes should at least somewhat work`, () => {
    beforeEach(() => {
        resetCallbackAttributes(quarternoteCallbackAttributes);
        resetCallbackAttributes(eighthnoteCallbackAttributes);
        resetCallbackAttributes(rondoMelodyCallbackAttributes);
        resetCallbackAttributes(rondoLeftHandCallbackAttributes);
    });

    it(`Should start 1 4/4 metronome if start called appropriately`, () => {
        jasmine.clock().install().mockDate();

        const startMetronome = getQuarternotesStartParameter([ quarternoteCallback ]);
        quarternoteCallbackAttributes.currentId = quarternotes44Label;
        const startMetronomeClicks = startMetronome.clicks as Array<Clicks>;
        quarternoteCallbackAttributes.currentDuration = Array.isArray(startMetronomeClicks[0].heartbeats) ? startMetronomeClicks[0].heartbeats[startMetronomeClicks[0].clickIndex]
            : startMetronomeClicks[0].heartbeats;

        start(startMetronome);

        expect(quarternoteCallbackAttributes.callbackRun).withContext(`First quarter note callbackRu`).toBeTrue();
        quarternoteCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(999);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Before second quarter note callbackRun`).toBeFalse();
        jasmine.clock().tick(1);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Second quarter note callbackRun`).toBeTrue();
        quarternoteCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(999);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Before third quarter note callbackRun`).toBeFalse();
        jasmine.clock().tick(1);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Third quarter note callbackRun`).toBeTrue();

        jasmine.clock().tick(1000);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Fourth quarter note callbackRun`).toBeTrue();
        quarternoteCallbackAttributes.currentIndex = 0;
        quarternoteCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(1000)
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`start of next group (measure) callbackRun`).toBeTrue();
        quarternoteCallbackAttributes.callbackRun = false;

        stop();

        jasmine.clock().uninstall();
    });

    it(`Should start a 4/4 metronome with eighth notes`, () => {
        jasmine.clock().install().mockDate();

        const startMetronome = getEighthNotesEmphasis_4_4StartParameter([ quarternoteCallback, eighthnoteCallback ]);
        quarternoteCallbackAttributes.currentId = quarternotes44Label;
        const startMetronomeClicks = startMetronome.clicks as Array<Clicks>;
        quarternoteCallbackAttributes.currentDuration = Array.isArray(startMetronomeClicks[0].heartbeats) ? startMetronomeClicks[0].heartbeats[startMetronomeClicks[0].clickIndex]
            : startMetronomeClicks[0].heartbeats;

        eighthnoteCallbackAttributes.currentId = eighthnotes44Label;
        eighthnoteCallbackAttributes.currentDuration = Array.isArray(startMetronomeClicks[1].heartbeats) ? startMetronomeClicks[1].heartbeats[startMetronomeClicks[1].clickIndex]
            : startMetronomeClicks[1].heartbeats;

        start(startMetronome);

        expect(quarternoteCallbackAttributes.callbackRun).withContext(`First quarternote start callbackRun`).toBeTrue();
        quarternoteCallbackAttributes.callbackRun = false;
        expect(eighthnoteCallbackAttributes.callbackRun).withContext(`First eighthnote start callbackRun`).toBeTrue();
        eighthnoteCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(499);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Before second quarter note callbackRun`).toBeFalse();
        expect(eighthnoteCallbackAttributes.callbackRun).withContext(`Before second eighth note callbackRun`).toBeFalse();
        jasmine.clock().tick(1);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Before second quarter note callbackRun 2`).toBeFalse();
        expect(eighthnoteCallbackAttributes.callbackRun).withContext(`Second eighth note callbackRun`).toBeTrue();
        eighthnoteCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(499);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Before second quarter note callbackRun 3`).toBeFalse();
        expect(eighthnoteCallbackAttributes.callbackRun).withContext(`Before third eighth note callbackRun`).toBeFalse();
        jasmine.clock().tick(1);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Second quarter note callbackRun`).toBeTrue();
        expect(eighthnoteCallbackAttributes.callbackRun).withContext(`Third eighth note callbackRun`).toBeTrue();
        quarternoteCallbackAttributes.callbackRun = false;
        eighthnoteCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(500);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Before third quarter note callbackRun`).toBeFalse();
        expect(eighthnoteCallbackAttributes.callbackRun).withContext(`Fourth eighth note callbackRun`).toBeTrue();
        eighthnoteCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(500);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Third quarter note callbackRun`).toBeTrue();
        expect(eighthnoteCallbackAttributes.callbackRun).withContext(`Fifth eighth note callbackRun`).toBeTrue();
        quarternoteCallbackAttributes.callbackRun = false;
        eighthnoteCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(500);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Before fourth quarter note callbackRun`).toBeFalse();
        expect(eighthnoteCallbackAttributes.callbackRun).withContext(`Sixth eighth note callbackRun`).toBeTrue();
        eighthnoteCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(500);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Fourth quarter note callbackRun`).toBeTrue();
        expect(eighthnoteCallbackAttributes.callbackRun).withContext(`Seventh eighth note callbackRun`).toBeTrue();
        quarternoteCallbackAttributes.callbackRun = false;
        eighthnoteCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(500);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Before fifth quarter note callbackRun`).toBeFalse();
        expect(eighthnoteCallbackAttributes.callbackRun).withContext(`Eighth eighth note callbackRun`).toBeTrue();
        eighthnoteCallbackAttributes.callbackRun = false;

        quarternoteCallbackAttributes.currentIndex = 0;
        eighthnoteCallbackAttributes.currentIndex = 0;
        jasmine.clock().tick(500);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Fifth quarter note callbackRun`).toBeTrue();
        expect(eighthnoteCallbackAttributes.callbackRun).withContext(`Ninth eighth note callbackRun`).toBeTrue();
        quarternoteCallbackAttributes.callbackRun = false;
        eighthnoteCallbackAttributes.callbackRun = false;

        stop();

        jasmine.clock().uninstall();
    });

    it(`Should start Blue Rondo A La Turk first measure`, () => {
        jasmine.clock().install().mockDate();

        const startMetronome = getBlueRondoALaTurkSFirstMeasureStartParameter([ rondoMelodyCallback, rondoLefthandCallback ]);
        rondoMelodyCallbackAttributes.currentId = rondoMelodyLabel;
        const startMetronomeClicks = startMetronome.clicks as Array<Clicks>;
        rondoMelodyCallbackAttributes.currentDuration = Array.isArray(startMetronomeClicks[0].heartbeats) ? startMetronomeClicks[0].heartbeats[startMetronomeClicks[0].clickIndex]
            : startMetronomeClicks[0].heartbeats;
        rondoLeftHandCallbackAttributes.currentId = rondoLeftHandLabel;
        rondoLeftHandCallbackAttributes.currentDuration = Array.isArray(startMetronomeClicks[1].heartbeats) ? startMetronomeClicks[1].heartbeats[startMetronomeClicks[1].clickIndex]
            : startMetronomeClicks[1].heartbeats;

        // setDebugClickbaseRanges([
        //     {id: rondoLeftHandLabel, start: -1, end: -1}
        // ]);

        rondoLabels.melody = 'Rondo melody starting A callbackRun';
        rondoLabels.leftHand = 'After Rondo left hand start callbackRun';
        start(startMetronome);

        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeTrue();
        rondoMelodyCallbackAttributes.callbackRun = false;
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(rondoLabels.leftHand).toBeTrue();
        rondoLeftHandCallbackAttributes.callbackRun = false;

        rondoLabels.melody = 'Before Rondo melody first F callbackRun';
        rondoLabels.leftHand = 'Before Rondo left hand second quarter note callbackRun';
        jasmine.clock().tick(tempoToHeartbeat(260) - 1);
        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeFalse();
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(rondoLabels.leftHand).toBeFalse();

        rondoLabels.melody = 'Rondo melody first F callbackRun';
        jasmine.clock().tick(1);
        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeTrue();
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(rondoLabels.leftHand).toBeFalse();
        rondoMelodyCallbackAttributes.callbackRun = false;

        rondoLabels.melody = 'Before Rondo melody second A callbackRun';
        jasmine.clock().tick(tempoToHeartbeat(260) - 1);
        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeFalse();
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(rondoLabels.leftHand).toBeFalse();
        rondoLabels.melody = 'Rondo melody second A callbackRun';
        rondoLabels.leftHand = 'Rondo left hand second quarter note callbackRun';
        jasmine.clock().tick(1);
        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeTrue();
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(rondoLabels.leftHand).toBeTrue();
        rondoMelodyCallbackAttributes.callbackRun = false;
        rondoLeftHandCallbackAttributes.callbackRun = false;

        rondoLabels.melody = 'Before Rondo melody second F callbackRun';
        jasmine.clock().tick(tempoToHeartbeat(260) - 1);
        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeFalse();
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(rondoLabels.leftHand).toBeFalse();

        rondoLabels.melody = 'Rondo melody second F callbackRun';
        jasmine.clock().tick(1);
        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeTrue();
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(rondoLabels.leftHand).toBeFalse();
        rondoMelodyCallbackAttributes.callbackRun = false;

        rondoLabels.melody = 'Rondo melody third A callbackRun';
        rondoLabels.leftHand = 'Rondo left hand third quarter note callbackRun';
        jasmine.clock().tick(260);
        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeTrue();
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(rondoLabels.leftHand).toBeTrue();
        rondoMelodyCallbackAttributes.callbackRun = false;
        rondoLeftHandCallbackAttributes.callbackRun = false;

        rondoLabels.melody = 'Rondo melody third F callbackRun';
        jasmine.clock().tick(260);
        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeTrue();
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(`Before fifth eighth note callbackRun`).toBeFalse();
        rondoMelodyCallbackAttributes.callbackRun = false;

        const leftHandStartMetronomeClicks = startMetronomeClicks[1];
        rondoLabels.melody = 'Rondo melody group of 3 E';
        rondoLabels.leftHand = 'Rondo left hand group of 3 dotted quarter note duration';
        jasmine.clock().tick(260);
        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeTrue();
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(rondoLabels.leftHand).toBeTrue();
        rondoMelodyCallbackAttributes.callbackRun = false;
        rondoLeftHandCallbackAttributes.callbackRun = false;

        rondoLabels.melody = 'Rondo melody group of 3 F';
        rondoLabels.leftHand = 'Before Rondo left hand end dotted quarter note 1';
        jasmine.clock().tick(260);
        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeTrue();
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(rondoLabels.leftHand).toBeFalse();
        rondoMelodyCallbackAttributes.callbackRun = false;

        rondoLabels.melody = 'Rondo melody group of 3 G';
        rondoLabels.leftHand = 'Before Rondo left hand end dotted quarter note 2';
        const nextTempoHeartbeatIndex = leftHandStartMetronomeClicks.tempoHeartbeatIndex + 1;
        rondoLeftHandCallbackAttributes.currentDuration = Array.isArray(leftHandStartMetronomeClicks.heartbeats) ? leftHandStartMetronomeClicks.heartbeats[nextTempoHeartbeatIndex]
            : leftHandStartMetronomeClicks.heartbeats;
        jasmine.clock().tick(260);
        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeTrue();
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(rondoLabels.leftHand).toBeTrue();
        rondoMelodyCallbackAttributes.callbackRun = false;
        rondoLeftHandCallbackAttributes.callbackRun = false;

        rondoLabels.melody = 'Rondo melody start of next measure';
        rondoLabels.leftHand = 'Rondo left hand start of next measure';
        jasmine.clock().tick(260);
        expect(rondoMelodyCallbackAttributes.callbackRun).withContext(rondoLabels.melody).toBeTrue();
        expect(rondoLeftHandCallbackAttributes.callbackRun).withContext(rondoLabels.leftHand).toBeFalse();
        rondoMelodyCallbackAttributes.callbackRun = false;

        stop();

        jasmine.clock().uninstall();
    });

    it(`Should start a hemiola (3 against 2) measure`, () => {
        jasmine.clock().install().mockDate();

        const startMetronome = getHemiolaStartParameter([ hemiolaTripletsCallback, hemiolaDupletsCallback ]);
        hemiolaTripletsCallbackAttributes.currentId = hemiolaTripletsLabel;
        const startMetronomeClicks = startMetronome.clicks as Array<Clicks>;
        hemiolaTripletsCallbackAttributes.currentDuration = Array.isArray(startMetronomeClicks[0].heartbeats) ? startMetronomeClicks[0].heartbeats[startMetronomeClicks[0].clickIndex]
            : startMetronomeClicks[0].heartbeats;
        hemiolaDupletsCallbackAttributes.currentId = hemiolaDupletsLabel;
        hemiolaDupletsCallbackAttributes.currentDuration = Array.isArray(startMetronomeClicks[1].heartbeats) ? startMetronomeClicks[1].heartbeats[startMetronomeClicks[1].clickIndex]
            : startMetronomeClicks[1].heartbeats;

        // setDebugClickbaseRanges([
        //     {id: hemiolaDupletsLabel, start: -1, end: -1}
        // ]);

        start(startMetronome);

        expect(hemiolaTripletsCallbackAttributes.callbackRun).withContext(`First triplet in hemiola callbackRun`).toBeTrue();
        expect(hemiolaDupletsCallbackAttributes.callbackRun).withContext(`First duplet in hemiola duplet callbackRun`).toBeTrue();
        hemiolaTripletsCallbackAttributes.callbackRun = false;
        hemiolaDupletsCallbackAttributes.callbackRun = false;

        /*
         * triplet cadence: 333.3333333333333
         * duplet cacdnce : 500
         */
        jasmine.clock().tick(Math.trunc(333));
        expect(hemiolaTripletsCallbackAttributes.callbackRun).withContext(`Before second triplet in hemiola callbackRun`).toBeFalse();
        expect(hemiolaDupletsCallbackAttributes.callbackRun).withContext(`Before second duplet in hemiola duplet callbackRun`).toBeFalse();

        jasmine.clock().tick(1); // 334
        expect(hemiolaTripletsCallbackAttributes.callbackRun).withContext(`Second triplet in hemiola callbackRun`).toBeTrue();
        expect(hemiolaDupletsCallbackAttributes.callbackRun).withContext(`Before second duplet in hemiola 2 callbackRun`).toBeFalse();
        hemiolaTripletsCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(165); // 499
        expect(hemiolaTripletsCallbackAttributes.callbackRun).withContext(`Before third triplet in hemiola callbackRun`).toBeFalse();
        expect(hemiolaDupletsCallbackAttributes.callbackRun).withContext(`Before second duplet in hemiola 3 callbackRun`).toBeFalse();

        jasmine.clock().tick(1); // 500
        expect(hemiolaTripletsCallbackAttributes.callbackRun).withContext(`Before third triplet in hemiola 2 callbackRun`).toBeFalse();
        expect(hemiolaDupletsCallbackAttributes.callbackRun).withContext(`Second duplet in hemiola callbackRun`).toBeTrue();
        hemiolaDupletsCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(166); // 666
        expect(hemiolaTripletsCallbackAttributes.callbackRun).withContext(`Before third triplet in hemiola 3 callbackRun`).toBeFalse();
        expect(hemiolaDupletsCallbackAttributes.callbackRun).withContext(`Before third duplet in hemiola callbackRun`).toBeFalse();

        jasmine.clock().tick(1); // 667
        expect(hemiolaTripletsCallbackAttributes.callbackRun).withContext(`Third triplet in hemiola callbackRun`).toBeTrue();
        expect(hemiolaDupletsCallbackAttributes.callbackRun).withContext(`Before third duplet in hemiola 2 callbackRun`).toBeFalse();
        hemiolaTripletsCallbackAttributes.callbackRun = false;

        jasmine.clock().tick(332); // 999
        expect(hemiolaTripletsCallbackAttributes.callbackRun).withContext(`Before fourth triplet in hemiola callbackRun`).toBeFalse();
        expect(hemiolaDupletsCallbackAttributes.callbackRun).withContext(`Before third duplet in hemiola 3 callbackRun`).toBeFalse();

        jasmine.clock().tick(1); // 1000
        expect(hemiolaTripletsCallbackAttributes.callbackRun).withContext(`Fourth triplet in hemiola 2 callbackRun`).toBeTrue();
        expect(hemiolaDupletsCallbackAttributes.callbackRun).withContext(`Third duplet in hemiola callbackRun`).toBeTrue();
        hemiolaTripletsCallbackAttributes.callbackRun = false;
        hemiolaDupletsCallbackAttributes.callbackRun = false;

        jasmine.clock().uninstall();
    });

    it(`Should stop currently running metronome`, () => {
        jasmine.clock().install().mockDate();

        const startMetronome = {
            clicks: [
                getQuarterNotesBuilder_4_4()[0].withCallback(quarternoteCallback).build()
            ]
        }
        quarternoteCallbackAttributes.currentId = quarternotes44Label;
        quarternoteCallbackAttributes.currentDuration = Array.isArray(startMetronome.clicks[0].heartbeats) ? startMetronome.clicks[0].heartbeats[startMetronome.clicks[0].clickIndex]
            : startMetronome.clicks[0].heartbeats;

        start(startMetronome);

        jasmine.clock().tick(1000);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Second quarter note for started metronome callbackRun`).toBeTrue();
        quarternoteCallbackAttributes.callbackRun = false;

        stop();

        jasmine.clock().tick(1000);
        expect(quarternoteCallbackAttributes.callbackRun).withContext(`Stopped metronome callbackRun`).toBeFalse();

        jasmine.clock().uninstall();
    })
});
