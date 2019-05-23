class Vector{
    constructor(x, y, z){
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }
    
    /**
     * @param other
     */
    crossProduct(other){
        return new Vector(
            this[1] * other[2] - this[2] * other[1], //X
            this[0] * other[2] - this[2] * other[0], //Y
            this[0] * other[1] - this[1] * other[0]  //Z
        );
    }

    /**
     * @param other
     */
    add(other){
        return new Vector(
            this[0] + other[0],
            this[1] + other[1],
            this[2] + other[2]
        );
    }

    /**
     * @param other
     */
    ccw(other){
        return this.crossProduct(other)[2] > 0;
    }

    /**
     * Scalar staat voor de schaal van de cubus
     * 
     * @param scalar
     */
    scale(scalar){
        return new Vector(
            scalar * this[0],
            scalar * this[1],
            scalar * this[2]
        );
    }

    /**
     * @param other
     */
    subtract(other){
        return this.add(other.scale(-1));
    }

    /**
     * Draait de cubus om zijn x-as heen
     * Theta staat voor een graden hoek
     * 
     * @param theta
     */
    rotateX(theta){
        var x = this[0],
            y = this[1],
            z = this[2];
        return new Vector(
            x, //X as
            Math.cos(theta) * y - Math.sin(theta) * z, //Y as
            Math.sin(theta) * y + Math.cos(theta) * z, //Z as
        );
    }

    /**
     * Draait de cubus om zijn y-as heen
     * Theta staat voor een graden hoek
     * 
     * @param theta
     */
    rotateY(theta){
        var x = this[0],
            y = this[1],
            z = this[2];
        return new Vector(
            Math.cos(theta) * x - Math.sin(theta) * z, //X as
            y, //Y as
            Math.sin(theta) * x + Math.cos(theta) * z, //Z as
        );
    }
  
}