/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Latitude/longitude spherical geodesy tools                         (c) Chris Veness 2002-2016  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/latlong.html                                                    */
/* www.movable-type.co.uk/scripts/geodesy/docs/module-latlon-spherical.html                       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


import Dms from './dms.js';


/**
 * Library of geodesy functions for operations on a spherical earth model.
 *
 * Includes distances, bearings, destinations, etc, for both great circle paths and rhumb lines,
 * and other related functions.
 *
 * @module   latlon-spherical
 * @requires dms
 */


/* LatLonSpherical  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/**
 * Latitude/longitude points on an spherical model earth, and methods for calculating distances,
 * bearings, destinations, etc on great circle paths and rhumb lines.
 */
class LatLonSpherical { // note prototypal class not classical class

    /**
     * Creates a LatLon point on the earth's surface at the specified latitude / longitude.
     *
     * @param {number} lat - Latitude in degrees.
     * @param {number} lon - Longitude in degrees.
     *
     * @example
     *   import LatLon from 'latlon-spherical';
     *   var p1 = new LatLon(52.205, 0.119);
     */
    constructor(lat, lon) {
        this.lat = Number(lat);
        this.lon = Number(lon);
    }


    /**
     * Returns the distance from ‘this’ point to destination point (using haversine formula).
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
     * @returns {number} Distance between this point and destination point, in same units as radius.
     *
     * @example
     *   var p1 = new LatLon(52.205, 0.119);
     *   var p2 = new LatLon(48.857, 2.351);
     *   var d = p1.distanceTo(p2);       // 404.3 km
     *   var m = p1.distanceTo(p2, 3959); // 251.2 miles
     */
    distanceTo(point, radius=6371e3) {
        if (!(point instanceof LatLonSpherical)) throw new TypeError('point is not LatLon object');

        var R = Number(radius);
        var φ1 = this.lat.toRadians(), λ1 = this.lon.toRadians();
        var φ2 = point.lat.toRadians(), λ2 = point.lon.toRadians();
        var Δφ = φ2 - φ1;
        var Δλ = λ2 - λ1;

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2)
            + Math.cos(φ1) * Math.cos(φ2)
            * Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;

        return d;
    }


    /**
     * Returns the (initial) bearing from ‘this’ point to destination point.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @returns {number} Initial bearing in degrees from north.
     *
     * @example
     *   var p1 = new LatLon(52.205, 0.119);
     *   var p2 = new LatLon(48.857, 2.351);
     *   var b1 = p1.bearingTo(p2); // 156.2°
     */
    bearingTo(point) {
        if (!(point instanceof LatLonSpherical)) throw new TypeError('point is not LatLon object');

        var φ1 = this.lat.toRadians(), φ2 = point.lat.toRadians();
        var Δλ = (point.lon - this.lon).toRadians();

        // see http://mathforum.org/library/drmath/view/55417.html
        var x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
        var y = Math.sin(Δλ) * Math.cos(φ2);
        var θ = Math.atan2(y, x);

        return (θ.toDegrees() + 360) % 360;
    }


    /**
     * Returns final bearing arriving at destination destination point from ‘this’ point; the final
     * bearing will differ from the initial bearing by varying degrees according to distance and
     * latitude.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @returns {number} Final bearing in degrees from north.
     *
     * @example
     *   var p1 = new LatLon(52.205, 0.119);
     *   var p2 = new LatLon(48.857, 2.351);
     *   var b2 = p1.finalBearingTo(p2); // 157.9°
     */
    finalBearingTo(point) {
        if (!(point instanceof LatLonSpherical)) throw new TypeError('point is not LatLon object');

        // get initial bearing from destination point to this point & reverse it by adding 180°
        return ( point.bearingTo(this) + 180 ) % 360;
    }


    /**
     * Returns the midpoint between ‘this’ point and the supplied point.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @returns {LatLon} Midpoint between this point and the supplied point.
     *
     * @example
     *   var p1 = new LatLon(52.205, 0.119);
     *   var p2 = new LatLon(48.857, 2.351);
     *   var pMid = p1.midpointTo(p2); // 50.5363°N, 001.2746°E
     */
    midpointTo(point) {
        if (!(point instanceof LatLonSpherical)) throw new TypeError('point is not LatLon object');

        // φm = atan2( sinφ1 + sinφ2, √( (cosφ1 + cosφ2⋅cosΔλ) ⋅ (cosφ1 + cosφ2⋅cosΔλ) ) + cos²φ2⋅sin²Δλ )
        // λm = λ1 + atan2(cosφ2⋅sinΔλ, cosφ1 + cosφ2⋅cosΔλ)
        // see http://mathforum.org/library/drmath/view/51822.html for derivation

        var φ1 = this.lat.toRadians(), λ1 = this.lon.toRadians();
        var φ2 = point.lat.toRadians();
        var Δλ = (point.lon - this.lon).toRadians();

        var Bx = Math.cos(φ2) * Math.cos(Δλ);
        var By = Math.cos(φ2) * Math.sin(Δλ);

        var x = Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By);
        var y = Math.sin(φ1) + Math.sin(φ2);
        var φ3 = Math.atan2(y, x);

        var λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);

        return new LatLonSpherical(φ3.toDegrees(), (λ3.toDegrees()+540) % 360 - 180); // normalise to −180..+180°
    }


    /**
     * Returns the destination point from ‘this’ point having travelled the given distance on the
     * given initial bearing (bearing normally varies around path followed).
     *
     * @param   {number} distance - Distance travelled, in same units as earth radius (default: metres).
     * @param   {number} bearing - Initial bearing in degrees from north.
     * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
     * @returns {LatLon} Destination point.
     *
     * @example
     *   var p1 = new LatLon(51.4778, -0.0015);
     *   var p2 = p1.destinationPoint(7794, 300.7); // 51.5135°N, 000.0983°W
     */
    destinationPoint(distance, bearing, radius=6371e3) {
        // φ2 = asin( sinφ1⋅cosδ + cosφ1⋅sinδ⋅cosθ )
        // λ2 = λ1 + atan2( sinθ⋅sinδ⋅cosφ1, cosδ − sinφ1⋅sinφ2 )
        // see http://williams.best.vwh.net/avform.htm#LL

        var δ = Number(distance) / Number(radius); // angular distance in radians
        var θ = Number(bearing).toRadians();

        var φ1 = this.lat.toRadians();
        var λ1 = this.lon.toRadians();

        var φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
        var x = Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2);
        var y = Math.sin(θ) * Math.sin(δ) * Math.cos(φ1);
        var λ2 = λ1 + Math.atan2(y, x);

        return new LatLonSpherical(φ2.toDegrees(), (λ2.toDegrees()+540) % 360 - 180); // normalise to −180..+180°
    }


    /**
     * Returns the point of intersection of two paths defined by point and bearing.
     *
     * @param   {LatLon} p1 - First point.
     * @param   {number} brng1 - Initial bearing from first point.
     * @param   {LatLon} p2 - Second point.
     * @param   {number} brng2 - Initial bearing from second point.
     * @returns {LatLon|null} Destination point (null if no unique intersection defined).
     *
     * @example
     *   var p1 = new LatLon(51.8853, 0.2545), brng1 = 108.547;
     *   var p2 = new LatLon(49.0034, 2.5735), brng2 =  32.435;
     *   var pInt = LatLon.intersection(p1, brng1, p2, brng2); // 50.9078°N, 004.5084°E
     */
    static intersection(p1, brng1, p2, brng2) {
        if (!(p1 instanceof LatLonSpherical)) throw new TypeError('p1 is not LatLon object');
        if (!(p2 instanceof LatLonSpherical)) throw new TypeError('p2 is not LatLon object');

        // see http://williams.best.vwh.net/avform.htm#Intersection

        // TODO: consider use of variables

        var φ1 = p1.lat.toRadians(), λ1 = p1.lon.toRadians();
        var φ2 = p2.lat.toRadians(), λ2 = p2.lon.toRadians();
        var θ13 = Number(brng1).toRadians(), θ23 = Number(brng2).toRadians();
        var Δφ = φ2 - φ1, Δλ = λ2 - λ1;

        var sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1);
        var sinφ2 = Math.sin(φ2), cosφ2 = Math.cos(φ2);
        var sinθ13 = Math.sin(θ13), cosθ13 = Math.cos(θ13);

        var δ12 = 2 * Math.asin(Math.sqrt(Math.sin(Δφ/2) * Math.sin(Δφ/2)
            + cosφ1 * cosφ2 * Math.sin(Δλ/2) * Math.sin(Δλ/2) ) );
        if (δ12 == 0) return null;
        var sinδ12 = Math.sin(δ12), cosδ12 = Math.cos(δ12);

        // initial/final bearings between points
        var θ1 = Math.acos(( sinφ2 - sinφ1 * cosδ12 ) / ( sinδ12 * cosφ1 ));
        if (isNaN(θ1)) θ1 = 0; // protect against rounding
        var θ2 = Math.acos(( sinφ1 - sinφ2 * cosδ12 ) / ( sinδ12 * cosφ2 ));

        var θ12 = Math.sin(λ2-λ1)>0 ? θ1 : 2*Math.PI-θ1;
        var θ21 = Math.sin(λ2-λ1)>0 ? 2*Math.PI-θ2 : θ2;

        var α1 = (θ13 - θ12 + Math.PI) % (2 * Math.PI) - Math.PI; // angle 2-1-3
        var α2 = (θ21 - θ23 + Math.PI) % (2 * Math.PI) - Math.PI; // angle 1-2-3
        var sinα1 = Math.sin(α1), cosα1 = Math.cos(α1);
        var sinα2 = Math.sin(α2), cosα2 = Math.cos(α2);

        if (sinα1 == 0 && sinα2 == 0) return null; // infinite intersections
        if (sinα1 * sinα2 < 0) return null;      // ambiguous intersection

        //α1 = Math.abs(α1);
        //α2 = Math.abs(α2);
        // ... Ed Williams takes abs of α1/α2, but seems to break calculation?

        var α3 = Math.acos(-cosα1*cosα2 + sinα1*sinα2*cosδ12);

        var cosα3 = Math.cos(α3);
        var δ13 = Math.atan2(sinδ12*sinα1*sinα2, cosα2 + cosα1*cosα3);

        var sinδ13 = Math.sin(δ13), cosδ13 = Math.cos(δ13);
        var φ3 = Math.asin(sinφ1*cosδ13 + cosφ1*sinδ13*cosθ13);

        var sinφ3 = Math.sin(φ3);
        var Δλ13 = Math.atan2(sinθ13*sinδ13*cosφ1, cosδ13 - sinφ1*sinφ3);
        var λ3 = λ1 + Δλ13;

        return new LatLonSpherical(φ3.toDegrees(), (λ3.toDegrees()+540) % 360 - 180); // normalise to −180..+180°
    }


    /**
     * Returns (signed) distance from ‘this’ point to great circle defined by start-point and end-point.
     *
     * @param   {LatLon} pathStart - Start point of great circle path.
     * @param   {LatLon} pathEnd - End point of great circle path.
     * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
     * @returns {number} Distance to great circle (-ve if to left, +ve if to right of path).
     *
     * @example
     *   var pCurrent = new LatLon(53.2611, -0.7972);
     *   var p1 = new LatLon(53.3206, -1.7297);
     *   var p2 = new LatLon(53.1887, 0.1334);
     *   var d = pCurrent.crossTrackDistanceTo(p1, p2);  // -307.5 m
     */
    crossTrackDistanceTo(pathStart, pathEnd, radius=6371e3) {
        if (!(pathStart instanceof LatLonSpherical)) throw new TypeError('pathStart is not LatLon object');
        if (!(pathEnd instanceof LatLonSpherical)) throw new TypeError('pathEnd is not LatLon object');
        radius = Number(radius);

        var δ13 = pathStart.distanceTo(this, radius) / radius;
        var θ13 = pathStart.bearingTo(this).toRadians();
        var θ12 = pathStart.bearingTo(pathEnd).toRadians();

        var dxt = Math.asin(Math.sin(δ13) * Math.sin(θ13 - θ12)) * radius;

        return dxt;
    }


    /**
     * Returns maximum latitude reached when travelling on a great circle on given bearing from this
     * point ('Clairaut's formula'). Negate the result for the minimum latitude (in the Southern
     * hemisphere).
     *
     * The maximum latitude is independent of longitude; it will be the same for all points on a
     * given latitude.
     *
     * @param {number} bearing - Initial bearing.
     * @param {number} latitude - Starting latitude.
     */
    maxLatitude(bearing) {
        var θ = Number(bearing).toRadians();

        var φ = this.lat.toRadians();

        var φMax = Math.acos(Math.abs(Math.sin(θ) * Math.cos(φ)));

        return φMax.toDegrees();
    }


    /**
     * Returns the pair of meridians at which a great circle defined by two points crosses the given
     * latitude. If the great circle doesn't reach the given latitude, null is returned.
     *
     * @param {LatLon} point1 - First point defining great circle.
     * @param {LatLon} point2 - Second point defining great circle.
     * @param {number} latitude - Latitude crossings are to be determined for.
     * @returns {Object|null} Object containing { lon1, lon2 } or null if given latitude not reached.
     */
    static crossingParallels(point1, point2, latitude) {
        var φ = Number(latitude).toRadians();

        var φ1 = point1.lat.toRadians();
        var λ1 = point1.lon.toRadians();
        var φ2 = point2.lat.toRadians();
        var λ2 = point2.lon.toRadians();

        var Δλ = λ2 - λ1;

        var x = Math.sin(φ1) * Math.cos(φ2) * Math.cos(φ) * Math.sin(Δλ);
        var y = Math.sin(φ1) * Math.cos(φ2) * Math.cos(φ) * Math.cos(Δλ) - Math.cos(φ1) * Math.sin(φ2) * Math.cos(φ);
        var z = Math.cos(φ1) * Math.cos(φ2) * Math.sin(φ) * Math.sin(Δλ);

        if (z * z > x * x + y * y) return null; // great circle doesn't reach latitude

        var λm = Math.atan2(-y, x);                  // longitude at max latitude
        var Δλi = Math.acos(z / Math.sqrt(x * x + y * y)); // Δλ from λm to intersection points

        var λi1 = λ1 + λm - Δλi;
        var λi2 = λ1 + λm + Δλi;

        return {
            lon1: (λi1.toDegrees()+540) % 360 - 180,  // normalise to −180..+180°
            lon2: (λi2.toDegrees()+540) % 360 - 180,
        };
    }


    /* Rhumb - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


    /**
     * Returns the distance travelling from ‘this’ point to destination point along a rhumb line.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
     * @returns {number} Distance in km between this point and destination point (same units as radius).
     *
     * @example
     *   var p1 = new LatLon(51.127, 1.338);
     *   var p2 = new LatLon(50.964, 1.853);
     *   var d = p1.distanceTo(p2); //  40.31 km
     */
    rhumbDistanceTo(point, radius=6371e3) {
        // see http://williams.best.vwh.net/avform.htm#Rhumb

        if (!(point instanceof LatLonSpherical)) throw new TypeError('point is not LatLon object');

        var R = Number(radius);
        var φ1 = this.lat.toRadians(), φ2 = point.lat.toRadians();
        var Δφ = φ2 - φ1;
        var Δλ = Math.abs(point.lon - this.lon).toRadians();
        // if dLon over 180° take shorter rhumb line across the anti-meridian:
        if (Math.abs(Δλ) > Math.PI) Δλ = Δλ > 0 ? -(2 * Math.PI - Δλ) : (2 * Math.PI + Δλ);

        // on Mercator projection, longitude distances shrink by latitude; q is the 'stretch factor'
        // q becomes ill-conditioned along E-W line (0/0); use empirical tolerance to avoid it
        var Δψ = Math.log(Math.tan(φ2 / 2 + Math.PI / 4) / Math.tan(φ1 / 2 + Math.PI / 4));
        var q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1);

        // distance is pythagoras on 'stretched' Mercator projection
        var δ = Math.sqrt(Δφ * Δφ + q * q * Δλ * Δλ); // angular distance in radians
        var dist = δ * R;

        return dist;
    }


    /**
     * Returns the bearing from ‘this’ point to destination point along a rhumb line.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @returns {number} Bearing in degrees from north.
     *
     * @example
     *   var p1 = new LatLon(51.127, 1.338);
     *   var p2 = new LatLon(50.964, 1.853);
     *   var d = p1.rhumbBearingTo(p2); // 116.7 m
     */
    rhumbBearingTo(point) {
        if (!(point instanceof LatLonSpherical)) throw new TypeError('point is not LatLon object');

        var φ1 = this.lat.toRadians(), φ2 = point.lat.toRadians();
        var Δλ = (point.lon - this.lon).toRadians();
        // if dLon over 180° take shorter rhumb line across the anti-meridian:
        if (Math.abs(Δλ) > Math.PI) Δλ = Δλ > 0 ? -(2 * Math.PI - Δλ) : (2 * Math.PI + Δλ);

        var Δψ = Math.log(Math.tan(φ2 / 2 + Math.PI / 4) / Math.tan(φ1 / 2 + Math.PI / 4));

        var θ = Math.atan2(Δλ, Δψ);

        return (θ.toDegrees()+360) % 360;
    }


    /**
     * Returns the destination point having travelled along a rhumb line from ‘this’ point the given
     * distance on the  given bearing.
     *
     * @param   {number} distance - Distance travelled, in same units as earth radius (default: metres).
     * @param   {number} bearing - Bearing in degrees from north.
     * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
     * @returns {LatLon} Destination point.
     *
     * @example
     *   var p1 = new LatLon(51.127, 1.338);
     *   var p2 = p1.rhumbDestinationPoint(40300, 116.7); // 50.9642°N, 001.8530°E
     */
    rhumbDestinationPoint(distance, bearing, radius=6371e3) {
        var δ = Number(distance) / Number(radius); // angular distance in radians
        var φ1 = this.lat.toRadians(), λ1 = this.lon.toRadians();
        var θ = Number(bearing).toRadians();

        var Δφ = δ * Math.cos(θ);
        var φ2 = φ1 + Δφ;

        // check for some daft bugger going past the pole, normalise latitude if so
        if (Math.abs(φ2) > Math.PI / 2) φ2 = φ2 > 0 ? Math.PI - φ2 : -Math.PI - φ2;

        var Δψ = Math.log(Math.tan(φ2 / 2 + Math.PI / 4) / Math.tan(φ1 / 2 + Math.PI / 4));
        var q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1); // E-W course becomes ill-conditioned with 0/0

        var Δλ = δ * Math.sin(θ) / q;
        var λ2 = λ1 + Δλ;

        return new LatLonSpherical(φ2.toDegrees(), (λ2.toDegrees()+540) % 360 - 180); // normalise to −180..+180°
    }


    /**
     * Returns the loxodromic midpoint (along a rhumb line) between ‘this’ point and second point.
     *
     * @param   {LatLon} point - Latitude/longitude of second point.
     * @returns {LatLon} Midpoint between this point and second point.
     *
     * @example
     *   var p1 = new LatLon(51.127, 1.338);
     *   var p2 = new LatLon(50.964, 1.853);
     *   var pMid = p1.rhumbMidpointTo(p2); // 51.0455°N, 001.5957°E
     */
    rhumbMidpointTo(point) {
        if (!(point instanceof LatLonSpherical)) throw new TypeError('point is not LatLon object');

        // http://mathforum.org/kb/message.jspa?messageID=148837

        var φ1 = this.lat.toRadians(), λ1 = this.lon.toRadians();
        var φ2 = point.lat.toRadians(), λ2 = point.lon.toRadians();

        if (Math.abs(λ2 - λ1) > Math.PI) λ1 += 2 * Math.PI; // crossing anti-meridian

        var φ3 = (φ1 + φ2) / 2;
        var f1 = Math.tan(Math.PI / 4 + φ1 / 2);
        var f2 = Math.tan(Math.PI / 4 + φ2 / 2);
        var f3 = Math.tan(Math.PI / 4 + φ3 / 2);
        var λ3 = ( (λ2 - λ1) * Math.log(f3) + λ1 * Math.log(f2) - λ2 * Math.log(f1) ) / Math.log(f2 / f1);

        if (!isFinite(λ3)) λ3 = (λ1 + λ2) / 2; // parallel of latitude

        return new LatLonSpherical(φ3.toDegrees(), (λ3.toDegrees() + 540) % 360 - 180); // normalise to −180..+180°
    }


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


    /**
     * Returns a string representation of ‘this’ point, formatted as degrees, degrees+minutes, or
     * degrees+minutes+seconds.
     *
     * @param   {string} [format=dms] - Format point as 'd', 'dm', 'dms'.
     * @param   {number} [dp=0|2|4] - Number of decimal places to use: default 0 for dms, 2 for dm, 4 for d.
     * @returns {string} Comma-separated formatted latitude/longitude.
     */
    toString(format='dms', dp=undefined) {
        return Dms.toLat(this.lat, format, dp) + ', ' + Dms.toLon(this.lon, format, dp);
    }

}


// Extend Number object with methods to convert between degrees & radians
Number.prototype.toRadians = function() { return this * Math.PI / 180; };
Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };

export default LatLonSpherical;

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
