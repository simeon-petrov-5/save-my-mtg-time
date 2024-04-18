import { expect, test } from "bun:test";
import { validateMoxfieldResponse } from "../utils/schemaValidators";
import { mockNotValidMoxfield, mockValidMoxfield } from "./mocks/MockedMoxfieldResponses";

test("Testing a valid moxfield response", () => {
    const response = validateMoxfieldResponse(mockValidMoxfield)
    expect(response).toBe(mockValidMoxfield);
});

test("Testing a NOT valid moxfield response", () => {
    const response = validateMoxfieldResponse(mockNotValidMoxfield);
    expect(response).not.toBe(mockNotValidMoxfield);
});