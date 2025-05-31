import type { Orient } from "./orient.ts";
import * as vec3 from "./vec3.js";

declare module "vitest" {
    interface Assertion<T extends vec3.Vec3> {
        toBeCloseToVec3(expected: T): void;
    }
    interface Assertion<T extends Orient> {
        toBeCloseToOrient(expected: T): void;
    }
}
