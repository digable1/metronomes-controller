import { SynctrackTempo } from "./src/ts/schemas/music/tempo";

export interface ClickPayload {
    id: string;
    clickIndex: number;
    duration: number;
}

export interface ClicksBase {
    readonly id: string;
    readonly temposHeartbeats: SynctrackTempo | Array<SynctrackTempo>;
    readonly tempos: number | Array<number>;
    readonly heartbeats: number | Array<number>;
    readonly groupRepeats: number | Array<number>;
    readonly clickRepeats: number | Array<number>;
    readonly numberOfClicksPerGroup: number | Array<number>;
    readonly numberOfClicksPerClickGroup: number | Array<number>;
    readonly delays: number | Array<number>;
    tempoHeartbeatIndex: number;
    groupRepeatIndex: number;
    clickRepeatIndex: number;
    clickGroupIndex: number;
    clickPerClickGroupIndex: number;
    delayIndex: number;
    clickIndex: number;
    clickPerClickGroupValue: number;
    clickPerGroupValue: number;
    clickRepeatValue: number;
    groupRepeatValue: number;
    tempoHeartbeatValue: SynctrackTempo;
    tempoValue: number;
    heartbeatValue: number;
    readonly click?: (click: ClickPayload) => void;
}

export interface Clicks extends ClicksBase {
    readonly subclicks?: Array<ClicksBase>;
}

export interface MetronomeClicks {
    presetId?: string;
    clicks: Clicks | Array<Clicks>;
}
