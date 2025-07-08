import { expect, it } from "vitest";
import { flipPlane, getPlane, invertPlane } from "./plane.js";

it("flips a plane", () => {
    const plane = getPlane([1, 2, 3], [4, 5, 6]);
    expect(flipPlane(plane, getPlane([0, 0, 0], [1, 0, 0]))).toStrictEqual(getPlane([-1, 2, 3], [-4, 5, 6]));
    expect(flipPlane(plane, getPlane([0, 0, 0], [0, 1, 0]))).toStrictEqual(getPlane([1, -2, 3], [4, -5, 6]));
    expect(flipPlane(plane, getPlane([0, 0, 0], [1, 1, 0]))).toStrictEqual(getPlane([-2, -1, 3], [-5, -4, 6]));
});

it("inverts a plane", () => {
    const plane = getPlane([1, 2, 3], [4, 5, 6]);
    const planeInverted = getPlane([1, 2, 3], [-4, -5, -6]);
    expect(invertPlane(plane)).toStrictEqual(planeInverted);
});
