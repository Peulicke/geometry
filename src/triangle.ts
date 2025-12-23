import { getLineDir, type Line } from "./line.js";
import type { Plane } from "./plane.js";
import * as vec3 from "./vec3.js";

export type Triangle = [vec3.Vec3, vec3.Vec3, vec3.Vec3];

export const triangleToPlane = (t: Triangle): Plane => {
    const line1: Line = { from: t[0], to: t[1] };
    const line2: Line = { from: t[0], to: t[2] };
    return {
        pos: t[0],
        dir: vec3.cross(getLineDir(line1), getLineDir(line2))
    };
};
