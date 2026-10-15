/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const ts = require("typescript");
const React = require("react");
const {renderToString} = require("react-dom/server");
const root = path.resolve(__dirname, "..");
const originalResolve = Module._resolveFilename;
const originalLoad = Module._load;
Module._resolveFilename = function(request, parent, isMain, options) {
  if (request.startsWith("@/")) request = path.join(root, "src", request.slice(2));
  return originalResolve.call(this, request, parent, isMain, options);
};
Module._load = function(request, parent, isMain) {
  if (request === "next/link") return {__esModule:true, default: ({href,children,...props})=>React.createElement("a",{href,...props},children)};
  return originalLoad.call(this, request, parent, isMain);
};
function loadTS(module, filename) {
  const source=fs.readFileSync(filename,"utf8");
  const out=ts.transpileModule(source,{fileName:filename,compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
  module._compile(out,filename);
}
Module._extensions[".ts"]=loadTS;
Module._extensions[".tsx"]=loadTS;
const lib=require(root+"/src/lib/simulated-cohort.ts");
const curriculum=require(root+"/src/content/curriculum.ts");
const a=lib.generateDemoCohort(), b=lib.generateDemoCohort();
const assert=require("assert");
assert.strictEqual(a.length,120);
assert.deepStrictEqual(a,b,"simulation is deterministic");
assert.strictEqual(new Set(a.map(s=>s.id)).size,120);
const m=lib.summarizeDemoCohort(a);
assert(m.paired>0 && m.paired<=120);
assert(m.studied>0 && m.studied<120);
assert(m.retries>0 && m.coreComplete>0);
for(const s of a){
 assert(s.lessons.length<=38);
 assert(s.activeDays>=1);
 assert(s.events.every(e=>Number.isInteger(e.day)&&e.day>=1&&e.day<=30));
 assert(s.events.every((e,i)=>i===0||s.events[i-1].day<=e.day));
 if(s.post) assert(s.pre && s.lessons.length>=8);
 for(const mod of curriculum.modules){
  if(s.lessons.some(key=>key.startsWith(mod.id+"/"))) {
    for(const req of mod.requires||[]){
      const parent=curriculum.getModule(req);
      assert(parent.lessons.every(lesson=>s.lessons.includes(curriculum.lessonKey(req,lesson.slug))),"prerequisite violation: "+s.id+" "+mod.id);
    }
  }
 }
}
const page=require(root+"/src/app/judge/simulation/page.tsx");
const html=renderToString(React.createElement(page.default));
assert(html.includes("DEMO COHORT") && html.includes("SIMULATED DATA"));
assert(html.includes("not collected from actual users"));
assert(html.includes("Learner <!-- -->001") || html.includes("Learner 001"));
assert(html.includes("Explore all") && html.includes("learner journeys"));
console.log("PASS: 120 deterministic profiles; honest labels; prereqs; chronological actions; varied outcomes; React SSR rendered "+html.length+" bytes");
console.log(JSON.stringify(m));