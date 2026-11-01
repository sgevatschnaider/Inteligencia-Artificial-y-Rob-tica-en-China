'use strict';
const assert=require('node:assert/strict');const {model,BASE}=require('../materiales/clase-3/ppt-1/model.cjs');
const a=model(BASE);assert.equal(a.length,16);assert.equal(a[0].year,2025);assert.equal(a.at(-1).year,2040);assert.deepEqual(a,model({...BASE}));
for(const r of a){for(const k of ['innovation','productivity','industry','local','knowledge','adoption'])assert.ok(Number.isFinite(r[k])&&r[k]>=100);assert.ok(r.exposure>=0&&r.exposure<=100);}
const restricted=model({...BASE,access:25}).at(-1);assert.ok(restricted.productivity<a.at(-1).productivity);assert.ok(restricted.industry<a.at(-1).industry);assert.ok(restricted.exposure>a.at(-1).exposure);
assert.ok(model({...BASE,rd:4.3}).at(-1).innovation>a.at(-1).innovation);assert.ok(model({...BASE,diffusion:90}).at(-1).productivity>a.at(-1).productivity);
for(const p of [{rd:1,talent:20,diffusion:20,industrial:20,access:10,coord:20},{rd:5,talent:100,diffusion:100,industrial:100,access:100,coord:100}])for(const r of model(p))for(const v of Object.values(r))assert.ok(Number.isFinite(v));
console.log('Class 3 model: deterministic trajectories, finite bounds, R&D and diffusion responses, and chip access mechanisms passed.');
