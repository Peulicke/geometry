import { expect, it } from "vitest";
import * as orient from "./orient.js";

it("does nothing with the identify orientation", () => {
    const o = orient.identity();
    expect(orient.rotateVec3(o, [1, 0, 0])).toStrictEqual([1, 0, 0]);
    expect(orient.rotateVec3(o, [0, 1, 0])).toStrictEqual([0, 1, 0]);
    expect(orient.rotateVec3(o, [0, 0, 1])).toStrictEqual([0, 0, 1]);
});

it("rotates about the x axis", () => {
    const o = orient.fromAxisAngle([1, 0, 0], Math.PI / 2);
    expect(orient.rotateVec3(o, [1, 0, 0])).toBeCloseToVec3([1, 0, 0]);
    expect(orient.rotateVec3(o, [0, 1, 0])).toBeCloseToVec3([0, 0, 1]);
    expect(orient.rotateVec3(o, [0, 0, 1])).toBeCloseToVec3([0, -1, 0]);
    expect(orient.rotateVec3(o, [1, 1, 1])).toBeCloseToVec3([1, -1, 1]);
});

it("combines orientations", () => {
    const o1 = orient.fromAxisAngle([1, 0, 0], Math.PI / 2);
    const o2 = orient.fromAxisAngle([0, 1, 0], Math.PI / 2);
    const o = orient.combine([o1, o2]);
    expect(orient.rotateVec3(o, [1, 0, 0])).toBeCloseToVec3([0, 0, -1]);
    expect(orient.rotateVec3(o, [0, 1, 0])).toBeCloseToVec3([1, 0, 0]);
    expect(orient.rotateVec3(o, [0, 0, 1])).toBeCloseToVec3([0, -1, 0]);
});

it("inverts an orientation", () => {
    const o1 = orient.fromAxisAngle([1, 0, 0], Math.PI / 2);
    const o2 = orient.fromAxisAngle([0, 1, 0], Math.PI / 2);
    const o = orient.combine([o1, o2]);
    const oInv = orient.inverse(o);
    const i = orient.combine([o, oInv]);
    expect(i).toBeCloseToOrient(orient.identity());
    expect(orient.rotateVec3(o, [1, 0, 0])).toBeCloseToVec3([0, 0, -1]);
    expect(orient.rotateVec3(o, [0, 1, 0])).toBeCloseToVec3([1, 0, 0]);
    expect(orient.rotateVec3(o, [0, 0, 1])).toBeCloseToVec3([0, -1, 0]);
});
