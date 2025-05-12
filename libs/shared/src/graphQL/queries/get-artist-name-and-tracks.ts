import { z } from 'zod';
import { GRAPHQL_MAX_LIMIT } from '../constants';
import { sendGraphQLQuery } from '../utils/graphql-utils';

type TopTrackItem = {
    track: {
        uri: string;
    };
};

export type GetArtistNameAndTracksData = {
    artistUnion: {
        __typename: 'Artist';
        discography: {
            topTracks: {
                items: TopTrackItem[];
                pagingInfo: {
                    nextOffset: null;
                };
            };
        };
        profile: {
            name: string;
        };
    };
};

const ParamsSchema = z
    .object({
        uri: z
            .string()
            .nonempty()
            .refine((value) => Spicetify.URI.isArtist(value), {
                message: 'Invalid artist URI',
            }),
        offset: z.number().nonnegative().int(),
        limit: z.number().nonnegative().int().max(GRAPHQL_MAX_LIMIT),
        locale: z.string().nonempty(),
    })
    .strict()
    .readonly();

export type Params = z.infer<typeof ParamsSchema>;

/**
 * Get an artist's name and top tracks.
 * @param params The query params.
 * @returns The artist name and top tracks.
 */
export async function getArtistNameAndTracks(
    params: Params,
): Promise<GetArtistNameAndTracksData> {
    ParamsSchema.parse(params);

    const { getArtistNameAndTracks } = Spicetify.GraphQL.Definitions;

    return await sendGraphQLQuery(getArtistNameAndTracks, params);
}
