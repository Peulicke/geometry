import { epsilon } from "./epsilon.js";
import type { Line } from "./line.js";
import * as vec3 from "./vec3.js";

export type Plane = {
    pos: vec3.Vec3;
    dir: vec3.Vec3;
};

export const getPlane = (pos: vec3.Vec3, dir: vec3.Vec3): Plane => ({ pos, dir });

export const getOriginPlane = (dir: vec3.Vec3): Plane => getPlane(vec3.getOrigin(), vec3.normalize(dir));

export const getXPlusPlane = (): Plane => getOriginPlane(vec3.getXPlus());

export const getYPlusPlane = (): Plane => getOriginPlane(vec3.getYPlus());

export const getZPlusPlane = (): Plane => getOriginPlane(vec3.getZPlus());

export const getXMinusPlane = (): Plane => getOriginPlane(vec3.getXMinus());

export const getYMinusPlane = (): Plane => getOriginPlane(vec3.getYMinus());

export const getZMinusPlane = (): Plane => getOriginPlane(vec3.getZMinus());

export const getDirOffsetPlane = (dir: vec3.Vec3, offset: number): Plane =>
    getPlane(vec3.scale(vec3.normalize(dir), offset), dir);

export const getXPlusOffsetPlane = (offset: number): Plane => getDirOffsetPlane(vec3.getXPlus(), offset);

export const getYPlusOffsetPlane = (offset: number): Plane => getDirOffsetPlane(vec3.getYPlus(), offset);

export const getZPlusOffsetPlane = (offset: number): Plane => getDirOffsetPlane(vec3.getZPlus(), offset);

export const getXMinusOffsetPlane = (offset: number): Plane => getDirOffsetPlane(vec3.getXMinus(), offset);

export const getYMinusOffsetPlane = (offset: number): Plane => getDirOffsetPlane(vec3.getYMinus(), offset);

export const getZMinusOffsetPlane = (offset: number): Plane => getDirOffsetPlane(vec3.getZMinus(), offset);

export const flipDir = (basePlane: Plane, dir: vec3.Vec3): vec3.Vec3 =>
    vec3.sub(dir, vec3.scale(vec3.proj(dir, basePlane.dir), 2));

export const flipPos = (basePlane: Plane, pos: vec3.Vec3): vec3.Vec3 =>
    vec3.add(flipDir(basePlane, vec3.sub(pos, basePlane.pos)), basePlane.pos);

export const flipPlane = (plane: Plane, basePlane: Plane): Plane => ({
    pos: flipPos(basePlane, plane.pos),
    dir: flipDir(basePlane, plane.dir)
});

export const invertPlane = (plane: Plane): Plane => ({
    pos: plane.pos,
    dir: vec3.negate(plane.dir)
});

type PlanePointOffset = {
    v: vec3.Vec3;
    offset: number;
};

const planeToPlanePointOffset = (plane: Plane): PlanePointOffset => {
    const normal = vec3.normalize(plane.dir);
    const offset = vec3.dot(normal, plane.pos);
    return { v: normal, offset };
};

const determinant3x3 = (r1: vec3.Vec3, r2: vec3.Vec3, r3: vec3.Vec3): number => vec3.dot(r1, vec3.cross(r2, r3));

const solveIntersection = (p1: PlanePointOffset, p2: PlanePointOffset, p3: PlanePointOffset): vec3.Vec3 | null => {
    const pp1: vec3.Vec3 = [p1.v[0], p2.v[0], p3.v[0]];
    const pp2: vec3.Vec3 = [p1.v[1], p2.v[1], p3.v[1]];
    const pp3: vec3.Vec3 = [p1.v[2], p2.v[2], p3.v[2]];
    const det = determinant3x3(pp1, pp2, pp3);
    if (Math.abs(det) < 1e-8) return null;
    const d: vec3.Vec3 = [p1.offset, p2.offset, p3.offset];
    const x = determinant3x3(d, pp2, pp3) / det;
    const y = determinant3x3(pp1, d, pp3) / det;
    const z = determinant3x3(pp1, pp2, d) / det;
    return [x, y, z];
};

export const planeIntersection = (p1: Plane, p2: Plane, p3: Plane): vec3.Vec3 | null => {
    const pp1 = planeToPlanePointOffset(p1);
    const pp2 = planeToPlanePointOffset(p2);
    const pp3 = planeToPlanePointOffset(p3);
    return solveIntersection(pp1, pp2, pp3);
};

export const isPointAlmostOnPlane = (point: vec3.Vec3, plane: Plane): boolean =>
    Math.abs(vec3.dot(vec3.sub(point, plane.pos), plane.dir)) < epsilon;

export const isInFrontOfPlane = (point: vec3.Vec3, plane: Plane): boolean =>
    vec3.dot(vec3.sub(point, plane.pos), plane.dir) > epsilon;

export const isBehindPlane = (point: vec3.Vec3, plane: Plane): boolean =>
    vec3.dot(vec3.sub(point, plane.pos), plane.dir) < -epsilon;

export const almostEquals = (a: Plane, b: Plane): boolean =>
    vec3.dirAlmostEquals(a.dir, b.dir) && isPointAlmostOnPlane(a.pos, b);

export const linePlaneIntersection = (line: Line, plane: Plane): vec3.Vec3 => {
    const n = vec3.normalize(plane.dir);
    const lineDir = vec3.normalize(vec3.sub(line.to, line.from));
    const lineDirAlongNormal = vec3.dot(lineDir, n);
    const lineToPlaneDiff = vec3.sub(plane.pos, line.from);
    const lineToPlaneDiffAlongNormal = vec3.dot(lineToPlaneDiff, n);
    const scale = lineToPlaneDiffAlongNormal / lineDirAlongNormal;
    return vec3.add(line.from, vec3.scale(lineDir, scale));
};
