import { importedMessage } from './src/ts/imported';
import { Clicks, ClicksBase, ClickPayload, MetronomeClicks } from './clicks'
import { ClicksBuilder  } from './clicksBuilder';
import { SynctrackTempo, defaultTempo } from "./src/ts/schemas/music/tempo";
import { tempoToHeartbeat, heartbeatToTempo } from "./src/ts/utils/tempo-conversion";

importedMessage();

interface DebugClickRange {
    id: string;
    start: number;
    end: number;
}
let debugClickRanges: Array<DebugClickRange> = [{
    id: "",
    start: 0,
    end: 0,
}];
let debugClickIndex = 0;
export function setDebugClickbaseRanges(debugClickRangesParm: Array<DebugClickRange>): void {
    debugClickRanges = debugClickRangesParm;
}

export const quarternotes44Label = "4/4 quarter notes";
export const eighthnotes44Label = "eighth notes";
export const rondoMelodyLabel = "Rondo Melody First Measure";
export const rondoLeftHandLabel = "Rondo Left Hand";
export const hemiolaTripletsLabel = "3 against 2 triplets";
export const hemiolaDupletsLabel = "3 against 2 duplets";

export function getQuarterNotesBuilder_4_4(): Array<ClicksBuilder> {
    const builder4_4QuarterNotes = new ClicksBuilder()
        .withId(quarternotes44Label)
        .withTempos(60);
    return [
        builder4_4QuarterNotes
    ];
}
export function getEighthNotesEmphasisBuilder_4_4(): Array<ClicksBuilder> {
    const builder4_4QuarterNotes = new ClicksBuilder()
        .withId(quarternotes44Label)
        .withTempos(60);
    const builderEighthNotes = new ClicksBuilder()
        .withId(eighthnotes44Label)
        .withTempos(120)
        .withNumberOfClicksPerClickGroup(2);
    return [
        builder4_4QuarterNotes,
        builderEighthNotes
    ]
}
export function getBlueRondoALaTurkFirstMeasureBuilder(): Array<ClicksBuilder> {
    const rondoMelody = new ClicksBuilder()
        .withId(rondoMelodyLabel)
        .withTempos(260)
        .withClickRepeats([3, 1])
        .withNumberOfClicksPerClickGroup([2, 3]);
    const rondoLeftHand = new ClicksBuilder()
        .withId(rondoLeftHandLabel)
        .withTempos([ 130, 65 ])
        .withClickRepeats([ 3, 1 ]);
    return [
        rondoMelody,
        rondoLeftHand
    ]
}
export function getHemiolaBuilder(): Array<ClicksBuilder> {
    const triplets = new ClicksBuilder()
        .withId(hemiolaTripletsLabel)
        .withTempos(180)
        .withNumberOfClicksPerClickGroup(3)
    const duplets = new ClicksBuilder()
        .withId(hemiolaDupletsLabel)
        .withTempos(120)
        .withNumberOfClicksPerClickGroup(2)
    return [
        triplets,
        duplets
    ]
}

const quarterNotes_4_4: MetronomeClicks = {
    clicks: [
        getQuarterNotesBuilder_4_4()[0]
            .build()
        ]
    };

export function start(clicks = quarterNotes_4_4): void {
    debugClickIndex = 0;
    if (Array.isArray(clicks.clicks)) {
        clicks.clicks.forEach((click) => {
            if (click.click) {
                fullResetBookmarkAttributes(click);
                flashTrigger(click);
            }
        });
    } else {
        fullResetBookmarkAttributes(clicks.clicks);
        flashTrigger(clicks.clicks);
    }
}

export async function stop(clicks = quarterNotes_4_4): Promise<void> {
    return new Promise<void>((resolve) => {
        if (setTimeoutHandle) {
            try {
                clearTimeout(setTimeoutHandle);
            } catch(e) {
                try {
                    clearTimeout(setTimeoutHandle);
                } catch(ee) {
                    console.error(`Did not clear timeout: ${JSON.stringify(ee)}`, ee);
                }
            }
            setTimeoutHandle = undefined;
        }
        resetClick(clicks);
        resolve();
    });
}

export function getClickBuilder(): ClicksBuilder {
    return new ClicksBuilder();
}
export function getSynctrackTempo(tempo = defaultTempo): SynctrackTempo {
    return {
        tempo: tempo,
        heartbeat: tempoToHeartbeat(tempo)
    };
}
export function getSynctrackHeartbeat(heartbeat = tempoToHeartbeat(defaultTempo)): SynctrackTempo {
    return {
        tempo: heartbeatToTempo(heartbeat),
        heartbeat: heartbeat
    };
}

function resetBookmarkAttributes(clickbase: ClicksBase): ClicksBase {
    clickbase.tempoHeartbeatIndex = 0;
    clickbase.clickRepeatIndex = 0;
    clickbase.clickGroupIndex = 0;
    clickbase.clickPerClickGroupIndex = 0;
    clickbase.delayIndex = 0;
    return clickbase;
}
function fullResetBookmarkAttributes(clickbase: ClicksBase): ClicksBase {
    resetBookmarkAttributes(clickbase);
    clickbase.clickIndex = 0;
    clickbase.groupRepeatIndex = 0;
    return clickbase;
}

let setTimeoutHandle: NodeJS.Timeout | undefined = undefined;
function flashTrigger(clicks: Clicks, firsttime = true): void { // NOSONAR
    if (clicks.click) {
        const clickPayload = getClickPayload(clicks);
        const delayElapsed = getDelay(clicks);
        if (delayElapsed.delay === 0) {
            clicks.click(clickPayload);
        }
        delayAndUpdateClicks(clickPayload);
    }

    function getClickPayload(clickbase: ClicksBase): ClickPayload {
        const clickPayload: ClickPayload = {
            id: clickbase.id,
            clickIndex: clickbase.clickIndex,
            duration: Array.isArray(clickbase.heartbeats) ? clickbase.heartbeats[clickbase.tempoHeartbeatIndex] : clickbase.heartbeats
        }
        return clickPayload;
    }

    interface DelayElapsed {
        delay: number;
        elapsed: number;
    }

    function getDelay(clicksParm: Clicks): DelayElapsed {
        let delayElapsedTally = { delay: Array.isArray(clicksParm.delays) ? clicksParm.delays[clicksParm.delayIndex] : clicksParm.delays, elapsed: 0 };
        let delayElapsed = getCurrentDelay(delayElapsedTally, clicksParm);
        if (clicksParm.subclicks) {
            clicksParm.subclicks.forEach((click) => {
                delayElapsed = getCurrentDelay(delayElapsed, click);
            });
        }
        return delayElapsed;

        function getCurrentDelay(delayElapsedTallyParm: DelayElapsed, subclicksParm: ClicksBase): DelayElapsed {
            let delay = Number.MAX_VALUE;
            let currentDelay = Array.isArray(subclicksParm.delays) ? subclicksParm.delays[subclicksParm.delayIndex] : subclicksParm.delays;
            let elapsedDuration = delayElapsedTallyParm.elapsed;
            if (currentDelay < delay) {
                delay = currentDelay;
                if (currentDelay > elapsedDuration) {
                    elapsedDuration = currentDelay;
                }
            }
            return { delay: delay, elapsed: elapsedDuration };
        }
    }

    function delayAndUpdateClicks(clickPayloadParm: ClickPayload): void {
        if (isDebugClickInRange(clickPayloadParm.id)) {
            console.log(`delayAndUpdateClicks - clickPayloadParm: ${JSON.stringify(clickPayloadParm, null, 4)}`);
            console.log();
        }
        setTimeoutHandle = setTimeout(() => {
            updateIndices(clicks, firsttime);

            if (clicks.subclicks) {
                clicks.subclicks.forEach((subclick) => {
                    updateIndices(subclick, firsttime);
                });
            }
            flashTrigger(clicks, false);
        }, clickPayloadParm.duration);

        function updateIndices(clickbase: ClicksBase, firsttime: boolean): void {
            /*
             * Blue Rondo A La Turk
             *
             * A F     A F     A F     E F G - melody
             * 0 1     2 3     4 5     6 7 8 - click index
             * 0 1     0 1     0 1     0 1 2 - clicks per click group index
             * 0       0       0       0     - clicks per group index
             * 0       1       2       0     - clicks repeat
             * 260     260     260     260   - tempos
             * 
             * quarter quarter quarter dotted-quarter - left hand
             * 0       1       2       3              - click index
             * 0       0       0       0              - clicks per click group index
             * 0       0       0       1              - clicks per group index
             * 0       1       2       0              - clicks repeat
             * 130     130     130     65             - tempos
             */

            const temposHeartbeatsArray = Array.isArray(clickbase.temposHeartbeats) ? clickbase.temposHeartbeats : [ clickbase.temposHeartbeats ];
            const temposArray = Array.isArray(clickbase.tempos) ? clickbase.tempos : [ clickbase.tempos ];
            const heartbeatsArray = Array.isArray(clickbase.heartbeats) ? clickbase.heartbeats : [ clickbase.heartbeats ];
            const groupsRepeatArray = Array.isArray(clickbase.groupRepeats) ? clickbase.groupRepeats : [ clickbase.groupRepeats ];
            const clickRepeatsArray = Array.isArray(clickbase.clickRepeats) ? clickbase.clickRepeats : [ clickbase.clickRepeats ];
            const numberOfClicksPerGroupArray = Array.isArray(clickbase.numberOfClicksPerGroup) ? clickbase.numberOfClicksPerGroup : [ clickbase.numberOfClicksPerGroup ];
            const numberOfClicksPerClickGroupArray = Array.isArray(clickbase.numberOfClicksPerClickGroup) ? clickbase.numberOfClicksPerClickGroup
                : [ clickbase.numberOfClicksPerClickGroup ];

            clickbase.tempoHeartbeatValue = temposHeartbeatsArray[clickbase.tempoHeartbeatIndex];
            clickbase.tempoValue = temposArray[clickbase.tempoHeartbeatIndex];
            clickbase.heartbeatValue = heartbeatsArray[clickbase.tempoHeartbeatIndex];

            if (isDebugClickInRange(clickbase.id)) {
                console.log(`${debugClickIndex}) start updateIndices - clickbase: ${JSON.stringify(clickbase, null, 4)}`);
            }

            let numberOfGroupRepeats = groupsRepeatArray[clickbase.groupRepeatIndex];
            let numberOfClickRepeats = clickRepeatsArray[clickbase.clickRepeatIndex];
            let numberOfClicksPerGroup = numberOfClicksPerGroupArray[clickbase.clickGroupIndex];
            let numberOfClicksPerClickGroup = numberOfClicksPerClickGroupArray[clickbase.clickPerClickGroupIndex];
            let numberOfClicks = numberOfClicksPerGroup * numberOfClicksPerClickGroup;
            if (isDebugClickInRange(clickbase.id)) {
                console.log();
                console.log(`updateIndices -`);
                console.log(`    numberOfGroupRepeats: ${numberOfGroupRepeats}`);
                console.log(`    numberOfClickRepeats: ${numberOfClickRepeats}`);
                console.log(`    numberOfClicksPerGroup: ${numberOfClicksPerGroup}`);
                console.log(`    numberOfClicksPerClickGroup: ${numberOfClicksPerClickGroup}`);
                console.log(`    numberOfClicks: ${numberOfClicks}`);
                console.log();
            }

            let clickIndex = clickbase.clickIndex;
            clickPayloadParm.clickIndex = clickIndex;
            clickbase.clickIndex = (clickbase.clickIndex + 1) % numberOfClicks;
            if (clickIndex === 0 && !firsttime) {
                resetBookmarkAttributes(clickbase);
                clickbase.groupRepeatValue = (clickbase.groupRepeatValue + 1) % numberOfGroupRepeats;
            }
            let clickPerClickGroupValue = clickbase.clickPerClickGroupValue;
            clickbase.clickPerClickGroupValue = (clickbase.clickPerClickGroupValue + 1) % numberOfClicksPerClickGroup;
            if (clickPerClickGroupValue === 0) {
                clickbase.clickPerClickGroupIndex = (clickbase.clickPerClickGroupIndex + 1) % numberOfClicksPerClickGroupArray.length;

                let clickRepeatValue = clickbase.clickRepeatValue;
                clickbase.clickRepeatValue = (clickbase.clickRepeatValue + 1) % numberOfClickRepeats;
                if (clickRepeatValue === 0 && !firsttime) {
                    clickbase.clickRepeatIndex = (clickbase.clickRepeatIndex + 1) % clickRepeatsArray.length;
                    clickbase.tempoHeartbeatIndex = (clickbase.tempoHeartbeatIndex + 1) % temposHeartbeatsArray.length;
                    clickbase.tempoHeartbeatValue = temposHeartbeatsArray[clickbase.tempoHeartbeatIndex];
                    clickbase.tempoValue = temposArray[clickbase.tempoHeartbeatIndex];
                    clickbase.heartbeatValue = heartbeatsArray[clickbase.tempoHeartbeatIndex];
                    clickPayloadParm.duration = clickbase.heartbeatValue;
                }

                let clickPerGroupValue = clickbase.clickPerGroupValue;
                clickbase.clickPerGroupValue = (clickbase.clickPerGroupValue + 1) % numberOfClicksPerGroup;
                if (clickPerGroupValue === 0 && !firsttime) {
                    clickbase.clickGroupIndex = (clickbase.clickGroupIndex + 1) % numberOfClicksPerGroupArray.length;
                    clickbase.clickIndex = 0;
                }
            }

            if (isDebugClickInRange(clickbase.id)) {
                console.log(`end updateIndices - clickbase: ${JSON.stringify(clickbase, null, 4)}`);
                console.log();
            }
            ++debugClickIndex;
        }

        function isDebugClickInRange(id: string): boolean {
            for (let range of debugClickRanges) {
                const idAllowed = (range.id !== undefined && (range.id === id || range.id.length < 1)) || range.id === undefined;
                const rangestartAllowed = (range.start !== undefined && (debugClickIndex >= range.start || range.start < 0)) || range.start === undefined;
                const rangeendAllowed = (range.end !== undefined && (debugClickIndex < range.end || range.end < 0)) || range.end === undefined;
                if (idAllowed && rangestartAllowed && rangeendAllowed) {
                    return true;
                }
            }
            return false;
        }
    }
}

export function resetClick(payload: MetronomeClicks): void {
    if (Array.isArray(payload.clicks)) {
        payload.clicks.forEach((click, index) => {
            (payload.clicks as Array<Clicks>)[index] = resetIndividualClick(click);
        })
    }

    function resetIndividualClick(click: Clicks): Clicks {
        click = new ClicksBuilder()
                .withInputClicks(click)
                .resetIndices()
            .build();
        return click;
    }
}
