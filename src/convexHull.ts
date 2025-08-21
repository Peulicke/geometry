import ch from "convex-hull";
import { vec3 } from "./index.js";
import { type Polygon } from "./polygon.js";

export const pointsToConvexHull = (allPoints: vec3.Vec3[]): Polygon[] => {
    return ch(allPoints).map(indices => ({ points: indices.map(i => allPoints[i]!) }));
};
