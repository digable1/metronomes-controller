export function isTempoExact(tempo: number, heartbeat: number): boolean {
    return ~~(tempo/heartbeat) === tempo/heartbeat;
}

export function tempoToHeartbeat(tempo: number): number {
    // NOSONAR return ~~((1000 / (tempo/60)));
    return 1000 / (tempo / 60);
}

export function heartbeatToTempo(heartbeat: number): number {
    return Math.round((1000 / heartbeat) * 60);
}
