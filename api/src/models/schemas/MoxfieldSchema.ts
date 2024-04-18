import { Static, t } from "elysia";

export const MoxfieldSchema = t.Object({
    boards: t.Record(
        t.Union([
            t.Literal('mainboard'), 
            t.Literal('sideboard'), 
            t.Literal('maybeboard'), 
            t.Literal('commanders'),
            t.Literal('companions')
        ]
        ),
        t.Object({
            cards: t.Record(
                t.String(),
                t.Object({
                    quantity: t.Integer(),
                    card: t.Object({
                        id: t.String(),
                        name: t.String(),
                    })
                })
            )
        })
    )
})


export type MoxfieldResp = Static<typeof MoxfieldSchema>