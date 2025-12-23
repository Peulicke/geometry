import { mapTuple } from "@peulicke/algorithms/tuple";
import { getLineDir, type Line } from "./line.js";
import { isBehindPlane, linePlaneIntersection, type Plane } from "./plane.js";
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

export const triangleToLines = (t: Triangle): [Line, Line, Line] =>
    mapTuple(t, (point, i) => ({ from: point, to: t[(i + 1) % 3]! }));

export const triangleToOutwardPlanes = (t: Triangle): [Plane, Plane, Plane] => {
    const plane = triangleToPlane(t);
    const lines = triangleToLines(t);
    return mapTuple(lines, (line, i) => ({
        pos: t[i]!,
        dir: vec3.cross(getLineDir(line), plane.dir)
    }));
};

export const lineTriangleIntersection = (line: Line, triangle: Triangle): vec3.Vec3 | undefined => {
    const point = linePlaneIntersection(line, triangleToPlane(triangle));
    const planes = triangleToOutwardPlanes(triangle);
    if (!planes.every(plane => isBehindPlane(point, plane))) return undefined;
    return point;
};
