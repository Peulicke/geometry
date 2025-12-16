import { flipPos, getXPlusPlane, getYPlusPlane, getZPlusPlane, type Plane } from "./plane.js";
import { add, type Vec3 } from "./vec3.js";

type Mirror = (points: Vec3[]) => Vec3[];

const createMirror =
    (plane: Plane): Mirror =>
    points =>
        [...points, ...points.map(p => flipPos(plane, p))];

const combineMirrors =
    (mirrors: Mirror[]): Mirror =>
    points =>
        mirrors.reduce((p, mirror) => mirror(p), points);

export const createMirrors = (planes: Plane[]): Mirror => combineMirrors(planes.map(createMirror));

export const mirrorZ = createMirror(getZPlusPlane());

export const mirrorXZ = createMirrors([getXPlusPlane(), getZPlusPlane()]);

export const mirrorXYZ = createMirrors([getXPlusPlane(), getYPlusPlane(), getZPlusPlane()]);

export const addX = (v: Vec3, x: number) => add(v, [x, 0, 0]);

export const addY = (v: Vec3, y: number) => add(v, [0, y, 0]);

export const addZ = (v: Vec3, z: number) => add(v, [0, 0, z]);
