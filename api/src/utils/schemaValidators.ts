import { TypeCompiler } from "@sinclair/typebox/compiler";
import { MoxfieldResp, MoxfieldSchema } from "../models/schemas/MoxfieldSchema";
import logging from "./logger";


export const validateMoxfieldResponse = (apiResp: unknown): MoxfieldResp => {
    const moxComp = TypeCompiler.Compile(MoxfieldSchema);
    const isValid = moxComp.Check(apiResp)
    if (isValid) {
        return apiResp as MoxfieldResp
    }

    logging.error('[📦 Schema failed] Moxfield API response did not match!')
    return {
        boards: {
            commanders: { cards: {} },
            companions: { cards: {} },
            mainboard: { cards: {} },
            maybeboard: { cards: {} },
            sideboard: { cards: {} },
        }
    }
}