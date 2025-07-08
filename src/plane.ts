import { vec3 } from "@peulicke/geometry";

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

const flipDir = (basePlane: Plane, dir: vec3.Vec3): vec3.Vec3 =>
    vec3.sub(dir, vec3.scale(vec3.proj(dir, basePlane.dir), 2));

const flipPos = (basePlane: Plane, pos: vec3.Vec3): vec3.Vec3 =>
    vec3.add(flipDir(basePlane, vec3.sub(pos, basePlane.pos)), basePlane.pos);

export const flipPlane = (plane: Plane, basePlane: Plane): Plane => ({
    pos: flipPos(basePlane, plane.pos),
    dir: flipDir(basePlane, plane.dir)
});

export const invertPlane = (plane: Plane): Plane => ({
    pos: plane.pos,
    dir: vec3.negate(plane.dir)
});
