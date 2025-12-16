import { expect, it } from "vitest";
import { createMirrors, mirrorXYZ } from "./mirror.js";

it("mirrors nothing", () => {
    expect(createMirrors([])([])).toStrictEqual([]);
});

it("mirrors 1 point using 1 mirror", () => {
    expect(createMirrors([{ pos: [0, 0, 0], dir: [1, 0, 0] }])([[1, 0, 0]])).toStrictEqual([
        [1, 0, 0],
        [-1, 0, 0]
    ]);
});

it("mirrors 1 point using 3 mirrors", () => {
    expect(mirrorXYZ([[1, 1, 1]])).toHaveLength(8);
});
