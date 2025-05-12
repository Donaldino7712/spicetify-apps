import type { Track } from '@shared/api/models/track';
import type {
    IAlbum,
    IArtist,
    ITrack,
    SimpleTrack,
} from '@shared/components/track-list/models/interfaces';
import type { LibraryAPITrack } from '@shared/platform/library';
import type { LocalTrack } from '@shared/platform/local-files';
import type { AdditionalTrackData, WorkflowTrack } from './workflow-track';

export class TrackWrapper implements ITrack {
    public get uri(): string {
        return this.backingTrack.uri;
    }

    public get name(): string {
        return this.backingTrack.name;
    }

    public get addedAt(): Date | null {
        if (TrackWrapper.isInternalTrack(this.backingTrack)) {
            if (this.backingTrack.addedAt === undefined) {
                return null;
            }

            if (this.backingTrack.addedAt instanceof Date) {
                return this.backingTrack.addedAt;
            }

            return new Date(this.backingTrack.addedAt);
        }

        return new Date(0);
    }

    public get duration(): number {
        if (TrackWrapper.isInternalTrack(this.backingTrack)) {
            return this.backingTrack.duration.milliseconds;
        }

        if (TrackWrapper.isApiTrack(this.backingTrack)) {
            return this.backingTrack.duration_ms;
        }

        return 0;
    }

    public get trackNumber(): number {
        if (TrackWrapper.isInternalTrack(this.backingTrack)) {
            return this.backingTrack.trackNumber;
        }

        if (TrackWrapper.isApiTrack(this.backingTrack)) {
            return this.backingTrack.track_number;
        }

        return 0;
    }

    public get artists(): IArtist[] {
        return this.backingTrack.artists;
    }

    public get album(): IAlbum {
        return this.backingTrack.album;
    }

    public get backingTrack(): WorkflowTrack {
        return this.track;
    }

    public get source(): string {
        return this.track.source;
    }

    public get isPlayable(): boolean {
        if (TrackWrapper.isInternalTrack(this.backingTrack)) {
            return this.backingTrack.isPlayable;
        }

        if (TrackWrapper.isApiTrack(this.backingTrack)) {
            return this.backingTrack.is_playable ?? false;
        }

        return false;
    }

    constructor(private readonly track: WorkflowTrack) {}

    private static isInternalTrack(
        track: WorkflowTrack,
    ): track is (LocalTrack | LibraryAPITrack | SimpleTrack) &
        AdditionalTrackData {
        const key: keyof (LocalTrack | LibraryAPITrack | SimpleTrack) =
            'duration';
        return key in track;
    }

    private static isApiTrack(
        track: WorkflowTrack,
    ): track is Track & AdditionalTrackData {
        const key: keyof Track = 'duration_ms';
        return key in track;
    }
}
