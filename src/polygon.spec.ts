import { expect, it } from "vitest";
import { getXPlusPlane } from "./plane.js";
import { almostEquals, planeToPolygon } from "./polygon.js";

it("checks if 2 polygons are the same", () => {
    expect(almostEquals({ points: [] }, { points: [] })).toBe(true);
    expect(
        almostEquals(
            {
                points: [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9]
                ]
            },
            {
                points: [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9]
                ]
            }
        )
    ).toBe(true);
    expect(
        almostEquals(
            {
                points: [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9]
                ]
            },
            {
                points: [
                    [7, 8, 9],
                    [1, 2, 3],
                    [4, 5, 6]
                ]
            }
        )
    ).toBe(true);
    expect(
        almostEquals(
            {
                points: [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9]
                ]
            },
            {
                points: [
                    [1, 2, 3],
                    [4, 5, 6]
                ]
            }
        )
    ).toBe(false);
    expect(
        almostEquals(
            {
                points: [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9]
                ]
            },
            {
                points: [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 10]
                ]
            }
        )
    ).toBe(false);
});

it("converts a plane to a polygon", () => {
    expect(planeToPolygon(getXPlusPlane(), [])).toStrictEqual({ points: [] });
    expect(
        almostEquals(
            planeToPolygon(getXPlusPlane(), [
                [-1, 0, 0],
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
                [0, 1, 1]
            ]),
            {
                points: [
                    [0, 0, 0],
                    [0, 1, 0],
                    [0, 1, 1],
                    [0, 0, 1]
                ]
            }
        )
    ).toBe(true);
});
