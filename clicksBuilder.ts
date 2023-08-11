import { ClicksBase, Clicks, ClickPayload } from './clicks';
import { SynctrackTempo, defaultTempo } from './src/ts/schemas/music/tempo';
import { tempoToHeartbeat, heartbeatToTempo } from './src/ts/utils/tempo-conversion';

export class ClicksBuilder {
    private readonly clicks: Clicks = {
        id: 'default',
        temposHeartbeats: { tempo: defaultTempo, heartbeat: tempoToHeartbeat(defaultTempo) },
        tempos: defaultTempo,
        heartbeats: tempoToHeartbeat(defaultTempo),
        groupRepeats: 1,
        clickRepeats: 1,
        numberOfClicksPerGroup: 4,
        numberOfClicksPerClickGroup: 1,
        delays: 0,
        tempoHeartbeatIndex: 0,
        groupRepeatIndex: 0,
        clickRepeatIndex: 0,
        clickGroupIndex: 0,
        clickPerClickGroupIndex: 0,
        delayIndex: 0,
        clickIndex: 0,
        clickPerClickGroupValue: 0,
        clickPerGroupValue: 0,
        clickRepeatValue: 0,
        groupRepeatValue: 0,
        tempoHeartbeatValue: { tempo: defaultTempo, heartbeat: tempoToHeartbeat(defaultTempo) },
        tempoValue: defaultTempo,
        heartbeatValue: tempoToHeartbeat(defaultTempo),
        subclicks: undefined
    }

    withInputClicks(clicks: Clicks): ClicksBuilder {
        (this.clicks as Clicks) = clicks; // NOSONAR
        return this;
    }

    resetIndices(): ClicksBuilder {
        this.clicks.tempoHeartbeatIndex = 0;
        this.clicks.clickRepeatIndex = 0;
        this.clicks.clickGroupIndex = 0;
        this.clicks.clickIndex = 0;
        resetIndex(this.clicks.subclicks);
        return this;

        function resetIndex(subclicks: Array<ClicksBase> | undefined): void {
            if (subclicks) {
                for (let subclickIndex = 0; subclickIndex < subclicks.length; ++subclickIndex) {
                    subclicks[subclickIndex].tempoHeartbeatIndex = 0;
                    subclicks[subclickIndex].clickRepeatIndex = 0;
                    subclicks[subclickIndex].clickGroupIndex = 0;
                    subclicks[subclickIndex].clickIndex = 0;
                }
            }
         }
    }

    withId(id: string): ClicksBuilder {
        (this.clicks.id as string) = id; // NOSONAR
        return this;
    }

    withTempoHeartbeats(temposHeartbeats: SynctrackTempo | Array<SynctrackTempo>): ClicksBuilder {
        (this.clicks.temposHeartbeats as SynctrackTempo | Array<SynctrackTempo>) = temposHeartbeats; // NOSONAR
        if (Array.isArray(temposHeartbeats)) {
            (this.clicks.tempos as unknown as Array<number>) = new Array(temposHeartbeats.length);
            (this.clicks.heartbeats as unknown as Array<number>) = new Array(temposHeartbeats.length);
            for (let tempoHeartbeatIndex = 0; tempoHeartbeatIndex < temposHeartbeats.length; ++tempoHeartbeatIndex) {
                ((this.clicks.tempos as unknown as Array<number>)[tempoHeartbeatIndex]) = temposHeartbeats[tempoHeartbeatIndex].tempo;
                ((this.clicks.heartbeats as unknown as Array<number>)[tempoHeartbeatIndex]) = temposHeartbeats[tempoHeartbeatIndex].heartbeat;
            }
        } else {
            (this.clicks.tempos as number) = temposHeartbeats.tempo;
            (this.clicks.heartbeats as number) = temposHeartbeats.heartbeat;
        }
        return this;
    }
    withTempos(tempos: number | Array<number>): ClicksBuilder {
        (this.clicks.tempos as number | Array<number>) = tempos; // NOSONAR
        if (Array.isArray(tempos)) {
            (this.clicks.heartbeats as unknown as Array<number>) = new Array(tempos.length);
            const tempoHeartbeats: Array<SynctrackTempo> = new Array(tempos.length);
            for (let tempoHeartbeatIndex = 0; tempoHeartbeatIndex < tempos.length; ++tempoHeartbeatIndex) {
                tempoHeartbeats[tempoHeartbeatIndex] = {
                    tempo: tempos[tempoHeartbeatIndex],
                    heartbeat: tempoToHeartbeat(tempos[tempoHeartbeatIndex])
                };
                ((this.clicks.heartbeats as unknown as Array<number>)[tempoHeartbeatIndex]) = tempoHeartbeats[tempoHeartbeatIndex].heartbeat;
            }
            (this.clicks.temposHeartbeats as Array<SynctrackTempo>) = tempoHeartbeats; // NOSONAR
        } else {
            const tempoHeartbeats = {
                tempo: tempos,
                heartbeat: tempoToHeartbeat(tempos)
            };
            (this.clicks.heartbeats as number) = tempoHeartbeats.heartbeat;
            (this.clicks.temposHeartbeats as SynctrackTempo) = tempoHeartbeats; // NOSONAR
        }
        return this;
    }
    withHeartbeats(heartbeats: number | Array<number>): ClicksBuilder {
        (this.clicks.heartbeats as number | Array<number>) = heartbeats; // NOSONAR
        if (Array.isArray(heartbeats)) {
            (this.clicks.tempos as unknown as Array<number>) = new Array(heartbeats.length);
            const tempoHeartbeats: Array<SynctrackTempo> = new Array(heartbeats.length);
            for (let tempoHeartbeatIndex = 0; tempoHeartbeatIndex < heartbeats.length; ++tempoHeartbeatIndex) {
                tempoHeartbeats[tempoHeartbeatIndex] = {
                    tempo: heartbeatToTempo(heartbeats[tempoHeartbeatIndex]),
                    heartbeat: heartbeats[tempoHeartbeatIndex]
                };
                ((this.clicks.tempos as unknown as Array<number>)[tempoHeartbeatIndex]) = tempoHeartbeats[tempoHeartbeatIndex].tempo;
            }
            (this.clicks.temposHeartbeats as Array<SynctrackTempo>) = tempoHeartbeats; // NOSONAR
        } else {
            const tempoHeartbeats = {
                tempo: heartbeatToTempo(heartbeats),
                heartbeat: heartbeats
            };
            (this.clicks.tempos as number) = tempoHeartbeats.tempo;
            (this.clicks.temposHeartbeats as SynctrackTempo) = tempoHeartbeats; // NOSONAR
        }
        return this;
    }

    withClickRepeats(clickRepeats: number | Array<number>): ClicksBuilder {
        (this.clicks.clickRepeats as number | Array<number>) = clickRepeats; // NOSONAR
        return this;
    }

    withNumberOfClicksPerGroup(numberofClicksPerGroup: number | Array<number>): ClicksBuilder {
        (this.clicks.numberOfClicksPerGroup as number | Array<number>) = numberofClicksPerGroup; // NOSONAR
        return this;
    }

    withNumberOfClicksPerClickGroup(numberofClicksPerClickGroup: number | Array<number>): ClicksBuilder {
        (this.clicks.numberOfClicksPerClickGroup as number | Array<number>) = numberofClicksPerClickGroup; // NOSONAR
        return this;
    }

    withDelays(delays: number | Array<number>): ClicksBuilder {
        (this.clicks.delays as number | Array<number>) = delays; // NOSONAR
        return this;
    }

    withCallback(callback: (clicksPayload: ClickPayload) => void): ClicksBuilder {
        (this.clicks.click as (clicksPayload: ClickPayload) => void) = callback; // NOSONAR
        return this;
    }

    withClickIndex(clickIndex: number): ClicksBuilder {
        this.clicks.clickIndex = clickIndex;
        return this;
    }

    withDelayIndex(delayIndex: number): ClicksBuilder {
        this.clicks.delayIndex = delayIndex;
        return this;
    }

    withSubclicks(subclicks: Array<ClicksBase> | undefined): ClicksBuilder {
        (this.clicks.subclicks as Array<ClicksBase> | undefined) = subclicks; // NOSONAR
        return this;
    }

    build(): Clicks {
        return this.clicks;
    }
}
