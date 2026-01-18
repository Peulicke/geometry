import type { Line } from "./line.js";
import { lineTriangleIntersection, type Triangle } from "./triangle.js";
import { expect, it } from "vitest";

it("finds the line triangle intersection", () => {
    const line: Line = {
        from: [0, 0, 0],
        to: [0, 0, 1]
    };
    const triangle: Triangle = [
        [1, 1, 0],
        [-1, 1, 0],
        [0, -1, 0]
    ];
    expect(lineTriangleIntersection(line, triangle)).toBeCloseToVec3([0, 0, 0]);
});
