import {Static, t} from "elysia"

export const ReqBodySchema = t.Object({
  sources:t.Array(t.String()),
  cards:t.Array(t.String())

})


export type ReqBody = Static<typeof ReqBodySchema>