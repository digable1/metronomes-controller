import { SynctrackHeartbeat, SynctrackBPM } from '../timings'

export interface SynctrackTempo {
    readonly heartbeat: SynctrackHeartbeat;
    readonly tempo: SynctrackBPM;
}

export interface SynctrackTempoModify {
    readonly delay: number;
    readonly duration: number;
}

export const minimumTempo = 30;
export const maximumTempo = 250;
export const defaultTempo = 112;
