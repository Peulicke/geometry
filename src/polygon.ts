import * as vec2 from "./vec2.js";
import * as vec3 from "./vec3.js";
import { isInFrontOfPlane, isPointAlmostOnPlane, type Plane } from "./plane.js";

export type Polygon = { points: vec3.Vec3[] };

export const almostEquals = (a: Polygon, b: Polygon): boolean => {
    if (a.points.length !== b.points.length) return false;
    if (a.points.length === 0) return true;
    return a.points.some((_, offset) =>
        a.points.every((p, i) => vec3.almostEquals(p, b.points[(offset + i) % b.points.length]!))
    );
};

export const planeToPolygon = (plane: Plane, points: vec3.Vec3[]): Polygon => {
    const pointsOnPlane = points.filter(p => isPointAlmostOnPlane(p, plane));
    const avgPoint = vec3.scale(
        pointsOnPlane.reduce((s, v) => vec3.add(s, v), [0, 0, 0]),
        1 / pointsOnPlane.length
    );
    const relativePoints = pointsOnPlane.map(p => vec3.sub(p, avgPoint));
    const axisOption1 = vec3.normalize(vec3.cross(plane.dir, [1, 0, 0]));
    const axisOption2 = vec3.normalize(vec3.cross(plane.dir, [0, 1, 0]));
    const x = vec3.length(axisOption1) > vec3.length(axisOption2) ? axisOption1 : axisOption2;
    const y = vec3.normalize(vec3.cross(plane.dir, x));
    const flatPoints = relativePoints.map((p): vec2.Vec2 => [vec3.dot(p, x), vec3.dot(p, y)]);
    flatPoints.sort((a, b) => Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]));
    return {
        points: flatPoints.map(p => vec3.add(vec3.add(vec3.scale(x, p[0]), vec3.scale(y, p[1])), avgPoint))
    };
};

export const polygonToPlane = (polygon: Polygon): Plane => {
    const [p1, p2, p3] = polygon.points;
    if (p1 === undefined || p2 === undefined || p3 === undefined) throw new Error("polygon has fewer than 3 points");
    return {
        pos: p1,
        dir: vec3.cross(vec3.sub(p2, p1), vec3.sub(p3, p1))
    };
};

export const isInFrontOfPolygon = (point: vec3.Vec3, polygon: Polygon): boolean =>
    isInFrontOfPlane(point, polygonToPlane(polygon));
