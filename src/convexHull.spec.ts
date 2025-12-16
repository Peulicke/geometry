import { expect, it } from "vitest";
import { pointsToConvexHull } from "./convexHull.js";

it("creates 0 polygons for 0 points", () => {
    expect(pointsToConvexHull([]).length).toBe(0);
});

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
        [0.99999, 0, 0],
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

it("creates the correct number of polygons for an extruded octagon", () => {
    const convexHull = pointsToConvexHull([
        [20, 5, 2],
        [15, 10, 2],
        [-20, 5, 2],
        [-15, 10, 2],
        [20, -5, 2],
        [15, -10, 2],
        [-20, -5, 2],
        [-15, -10, 2],
        [20, 5, -2],
        [15, 10, -2],
        [-20, 5, -2],
        [-15, 10, -2],
        [20, -5, -2],
        [15, -10, -2],
        [-20, -5, -2],
        [-15, -10, -2]
    ]);
    expect(convexHull.length).toBe(8 + 2);
});
