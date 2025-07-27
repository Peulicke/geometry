import { expect, it } from "vitest";
import { pointsToConvexHull } from "./convexHull.js";

it("creates the correct number of polygons for a tetrahedron", () => {
    const tetrahedron = pointsToConvexHull([
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]);
    expect(tetrahedron.length).toBe(4);
});

it("creates the correct number of polygons for a cube with inner points", () => {
    const unitCube = pointsToConvexHull([
        [0, 0, 0],
        [0.5, 0, 0],
        [1, 0, 0],
        [1, 1, 1],
        [1, 1, -1],
        [1, -1, 1],
        [1, -1, -1],
        [-1, 1, 1],
        [-1, 1, -1],
        [-1, -1, 1],
        [-1, -1, -1]
    ]);
    expect(unitCube.length).toBe(6);
});
