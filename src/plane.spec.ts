import { expect, it } from "vitest";
import * as orient from "./orient.js";
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
    linePlaneIntersection,
    planeIntersection,
    transformPlane,
    type Plane
} from "./plane.js";
import { createTransformation } from "./transformation.js";
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

it("gets intersection of plane and line", () => {
    expect(
        linePlaneIntersection({ from: [0, 0, 0], to: [0, 1, 0] }, { pos: [0, 0, 0], dir: [0, 1, 0] })
    ).toBeCloseToVec3([0, 0, 0]);
    expect(
        linePlaneIntersection({ from: [0, 0, 0], to: [0, 1, 0] }, { pos: [0, 10, 0], dir: [1, 1, 1] })
    ).toBeCloseToVec3([0, 10, 0]);
    expect(
        linePlaneIntersection({ from: [-1, -2, -3], to: [1, 2, 3] }, { pos: [0, 0, 0], dir: [1, 1, 1] })
    ).toBeCloseToVec3([0, 0, 0]);
    expect(
        linePlaneIntersection({ from: [-1, -2, -3], to: [1, 2, 3] }, { pos: [2, 4, 6], dir: [1, 3, 5] })
    ).toBeCloseToVec3([2, 4, 6]);
});

it("transforms a plane", () => {
    const transformed = transformPlane(
        { pos: [1, 0, 0], dir: [1, 0, 0] },
        createTransformation({
            pos: [0, 1, 0],
            orient: orient.fromAxisAngle([0, 1, 0], Math.PI),
            scale: 2
        })
    );
    const expected: Plane = {
        pos: [-2, 1, 0],
        dir: [-1, 0, 0]
    };
    expect(transformed.pos).toBeCloseToVec3(expected.pos);
    expect(transformed.dir).toBeCloseToVec3(expected.dir);
});
