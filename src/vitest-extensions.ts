import { expect } from "vitest";
import * as vec3 from "./vec3.js";
import type { Orient } from "./orient.js";

const epsilon = 1e-6;

export const toBeCloseToVec3 = (
    received: vec3.Vec3,
    expected: vec3.Vec3
): {
    pass: boolean;
    message: () => string;
    actual: vec3.Vec3;
    expected: vec3.Vec3;
} => {
    return {
        pass: vec3.length(vec3.sub(received, expected)) < epsilon,
        message: () => `expected vectors to be close within epsilon ${epsilon}`,
        actual: received,
        expected
    };
};

export const toBeCloseToOrient = (
    received: Orient,
    expected: Orient
): {
    pass: boolean;
    message: () => string;
    actual: Orient;
    expected: Orient;
} => {
    return {
        pass: vec3.length(vec3.sub(received.v, expected.v)) < epsilon && Math.abs(received.w - expected.w) < epsilon,
        message: () => `expected orientations to be close within epsilon ${epsilon}`,
        actual: received,
        expected
    };
};

expect.extend({ toBeCloseToVec3, toBeCloseToOrient });
