import { expect, it } from "vitest";
import {
    almostEquals,
    flipPlane,
    getPlane,
    getXMinusPlane,
    getXPlusOffsetPlane,
    getXPlusPlane,
    getYPlusOffsetPlane,
    getYPlusPlane,
    getZPlusOffsetPlane,
    getZPlusPlane,
    invertPlane,
    isInFrontOfPlane,
    isPointAlmostOnPlane,
    planeIntersection
} from "./plane.js";
import { getOrigin } from "./vec3.js";

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

it("finds intersection point of 3 planes", () => {
    expect(planeIntersection(getXPlusPlane(), getYPlusPlane(), getZPlusPlane())).toStrictEqual(getOrigin());
    expect(planeIntersection(getXPlusOffsetPlane(1), getYPlusOffsetPlane(1), getZPlusOffsetPlane(1))).toStrictEqual([
        1, 1, 1
    ]);
});

it("checks if a point is on a plane", () => {
    const plane = getPlane([0, 0, 0], [1, 0, 0]);
    expect(isPointAlmostOnPlane([-1, -1, -1], plane)).toBe(false);
    expect(isPointAlmostOnPlane([0, 0, 0], plane)).toBe(true);
    expect(isPointAlmostOnPlane([1, 1, 1], plane)).toBe(false);
});

it("checks if a point is in front of a plane", () => {
    const plane = getPlane([0, 0, 0], [1, 0, 0]);
    expect(isInFrontOfPlane([-1, -1, -1], plane)).toBe(false);
    expect(isInFrontOfPlane([0, 0, 0], plane)).toBe(false);
    expect(isInFrontOfPlane([1, 1, 1], plane)).toBe(true);
});

it("checks if 2 planes are the same", () => {
    expect(almostEquals(getXPlusPlane(), getXPlusPlane())).toBe(true);
    expect(almostEquals(getXPlusPlane(), getPlane([0, 1, 2], [1, 0, 0]))).toBe(true);
    expect(almostEquals(getXPlusPlane(), getXMinusPlane())).toBe(false);
});
