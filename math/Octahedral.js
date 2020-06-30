function toString(x) {
    let s = ""+x;
    return (s.endsWith(".0")? s.substring(0,s.length()-2) : s);
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
    constructor(s, p, q, r) {
        this.desc = s; this.p = p; this.q = q; this.r = r;
        this.vert = []; this.cnt = new Map()
        this.addVertices(p, q, r); this.count();
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
        let V = this.vert.length;
        let p0 = this.vert[0];
        for (let p of this.vert) { 
            let d = p0.distance2(p)
            if (!Number.isInteger(d)) //use 3 digits
                d = Math.round(d*1000)/1000
            let n = this.cnt.get(d);
            this.cnt.set(d, (n==null? 1 : n+1));
        }
    }
    report() {
        console.log(this.desc, this.vert.length);
        let a = []
        for (let [k, v] of this.cnt.entries())
            a.push({k, v});
        this.rep = a.sort((x, y) => x.k - y.k)
        .map((x) => x.k.toFixed(3)+" -> "+x.v)
        console.log(this.rep);
        console.log('----------------');
    }
}

function makeSolids() {
    const K = Math.SQRT1_2; // 0.70711
    return [
     new Octahedral("Octahedron 3333", 0, 0, K), 
     new Octahedral("Cube 444", 0.5, 0.5, 0.5), 
     new Octahedral("Cuboctahedron 3434", 0, K, K),
     new Octahedral("Rhombicubocta 3444", 0.5, 0.5, K+0.5),
     new Octahedral("Trunc Cube 388", 0.5, K+0.5, K+0.5),
     new Octahedral("Trunc Octahedron 466", 0, K, 2*K),
     new Octahedral("Trunc Cubocta 468", 0.5, K+0.5, 2*K+0.5)
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
