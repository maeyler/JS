function toString(x) {
    return Number.isInteger(x)? x : x.toFixed(3)
}

class Vertex {
    constructor(a, b, c) {
        this.x = a; this.y = b; this.z = c;
        this.str = "("+toString(a)+","+toString(b)+","+toString(c)+")";
    }
    distance2(p) {
        let dx = this.x - p.x;
        let dy = this.y - p.y;
        let dz = this.z - p.z;
        return (dx*dx+dy*dy+dz*dz);
    }
    distanceTo(p) {
        return Math.sqrt(this.distance2(p));
    }
    equals(p) {
    	return (this.x==p.x && this.y==p.y && this.z==p.z);	
    }
    toString() {
        return str;
    }
}

class Octahedral {
    // ArraySet<Vertex> vert = new ArraySet<Vertex>(48);
    // Map<Float, Integer> cnt = new TreeMap<Float, Integer>();
    constructor(p, q, r, d) {
        this.desc = d; this.p = p; this.q = q; this.r = r;
        this.vert = []; this.addVertices(p, q, r); 
        this.rep = this.count(); //cnt is local
    }
    addVertices(p, q, r) {
        this.permute( p, q, r ); this.permute( p,-q, r );
        this.permute( p, q,-r ); this.permute( p,-q,-r );
        this.permute(-p, q, r ); this.permute(-p,-q, r );
        this.permute(-p, q,-r ); this.permute(-p,-q,-r );
    }
    permute(p, q, r) {
        this.add(p, q, r); this.add(p, r, q);
        this.add(q, p, r); this.add(q, r, p);
        this.add(r, q, p); this.add(r, p, q);
    }
    add(a, b, c) {
        let v = new Vertex(a,b,c)
        for (let x of this.vert)
            if (x.equals(v)) return
        this.vert.push(v);
    }
    count() {
        let p0 = this.vert[0];
        let cnt = new Map()
        for (let p of this.vert) { 
            let d = p0.distance2(p)
            if (!Number.isInteger(d)) //use 3 digits
                d = Math.round(d*1000)/1000
            let n = cnt.get(d);
            cnt.set(d, (n==null? 1 : n+1));
        }
        let a = []
        for (let [k, v] of cnt.entries())
            a.push({k, v});
        return a.sort((x, y) => x.k - y.k)
            .map((x) => x.v+" -> "+x.k.toFixed(3))
    }
    report() {
        console.log(this.desc, this.vert.length);
        console.log(this.rep);
        console.log('----------------');
    }
}

function makeSolids() {
    const H = 0.5, K = 0.5 * Math.SQRT2; //0.70711
    return [
     new Octahedral(0, 0, K, "Octahedron 3333"), 
     new Octahedral(H, H, H, "Cube 444"), 
     new Octahedral(0, K, K, "Cuboctahedron 3434"),
     new Octahedral(H, H, K+H, "Rhombicubocta 3444"),
     new Octahedral(H, K+H, K+H, "Trunc Cube 388"),
     new Octahedral(0, K, 2*K,   "Trunc Octahedron 466"),
     new Octahedral(H, K+H, 2*K+H, "Trunc Cubocta 468")
    ]
}
/* simplified from Java -- 2020 June
static Vertex[] pa = {  //24 vertices of cubocta
    new Vertex( 0, 1, 2 ),new Vertex( 0,-1, 2 ),
    new Vertex( 0, 1,-2 ),new Vertex( 0,-1,-2 ),
    new Vertex( 0, 2, 1 ),new Vertex( 0,-2, 1 ),
    new Vertex( 0, 2,-1 ),new Vertex( 0,-2,-1 ),
    new Vertex( 1, 0, 2 ),new Vertex(-1, 0, 2 ),
    new Vertex( 1, 0,-2 ),new Vertex(-1, 0,-2 ),
    new Vertex( 1, 2, 0 ),new Vertex(-1, 2, 0 ),
    new Vertex( 1,-2, 0 ),new Vertex(-1,-2, 0 ),
    new Vertex( 2, 1, 0 ),new Vertex(-2, 1, 0 ),
    new Vertex( 2,-1, 0 ),new Vertex(-2,-1, 0 ),
    new Vertex( 2, 0, 1 ),new Vertex(-2, 0, 1 ),
    new Vertex( 2, 0,-1 ),new Vertex(-2, 0,-1 )
};
static Map<Vertex, Float>  dist = new HashMap<Vertex, Float>();
*/
