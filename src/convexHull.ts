import { removeSimilar } from "@peulicke/algorithms/basic";
import { plane, vec3 } from "./index.js";
import { isBehindPlane, isInFrontOfPlane, type Plane } from "./plane.js";
import { almostEquals, isInFrontOfPolygon, planeToPolygon, type Polygon } from "./polygon.js";
import { getOrigin } from "./vec3.js";

export type ConvexHull = { points: vec3.Vec3[]; polygons: Polygon[] };

const vec3Avg = (v: vec3.Vec3[]): vec3.Vec3 =>
    vec3.scale(
        v.reduce((s, v) => vec3.add(s, v)),
        1 / v.length
    );

const removeDuplicatePoints = (points: vec3.Vec3[]): vec3.Vec3[] => removeSimilar(points, vec3.almostEquals);

const removeDuplicatePlanes = (planes: Plane[]): Plane[] => removeSimilar(planes, plane.almostEquals);

const removeDuplicatePolygons = (polygons: Polygon[]): Polygon[] => removeSimilar(polygons, almostEquals);

const isPlaneInsideConvexHull = (plane: Plane, points: vec3.Vec3[]): boolean =>
    points.some(point => isInFrontOfPlane(point, plane));

const isPolygonInsideConvexHull = (polygon: Polygon, points: vec3.Vec3[]): boolean =>
    points.some(point => isInFrontOfPolygon(point, polygon));

const removePlanesInsideConvexHull = (points: vec3.Vec3[], planes: Plane[]): Plane[] =>
    planes.filter(plane => !isPlaneInsideConvexHull(plane, points));

const removePolygonsInsideConvexHull = (points: vec3.Vec3[], polygons: Polygon[]): Polygon[] =>
    polygons.filter(polygon => !isPolygonInsideConvexHull(polygon, points));

const isPointNotInsideConvexHull = (point: vec3.Vec3, planes: Plane[]): boolean => {
    const onPlaneCount = planes.filter(plane => !isBehindPlane(point, plane));
    return onPlaneCount.length >= 3;
};

const computePlanes = (points: vec3.Vec3[]): Plane[] => {
    const center = vec3Avg(points);
    return removePlanesInsideConvexHull(
        points,
        removeDuplicatePlanes(
            points
                .flatMap((p1, i1) =>
                    points.flatMap((p2, i2) =>
                        points.flatMap((p3, i3): Plane[] => {
                            if (i1 >= i2) return [];
                            if (i2 >= i3) return [];
                            const axis1 = vec3.sub(p2, p1);
                            const axis2 = vec3.sub(p3, p1);
                            const dir = vec3.cross(axis1, axis2);
                            if (vec3.almostEquals(dir, getOrigin())) return [];
                            return [
                                {
                                    pos: p1,
                                    dir
                                }
                            ];
                        })
                    )
                )
                .map((plane): Plane => {
                    if (vec3.dot(vec3.sub(plane.pos, center), plane.dir) > 0) return plane;
                    return {
                        pos: plane.pos,
                        dir: vec3.negate(plane.dir)
                    };
                })
        )
    );
};

const removeInnerPoints = (points: vec3.Vec3[]): vec3.Vec3[] => {
    const planes = computePlanes(points);
    return points.filter(point => isPointNotInsideConvexHull(point, planes));
};

export const pointsToConvexHull = (allPoints: vec3.Vec3[]): Polygon[] => {
    const points = removeInnerPoints(removeDuplicatePoints(allPoints));
    const planes = computePlanes(points);
    return removeDuplicatePolygons(
        removePolygonsInsideConvexHull(
            points,
            planes.map(plane => planeToPolygon(plane, points))
        )
    );
};
