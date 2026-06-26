#!/usr/bin/env bash
# h6-funnel-assemble.sh — HARDENING H6: smoke the DETERMINISTIC SPINE of funnel-assemble
# (engine/bricks/funnel-assemble.js): normalizeUrl -> clusterAdsByUrl -> generateFunnelId ->
# buildBoundAd -> package shape. This is the load-bearing logic (D-04: bad normalization
# splatters one funnel into ten). The LIVE LP-render hop (Playwright page.goto) is network-gated
# and NOT verifiable from this offline/datacenter env — here the loopback destination URLs trip
# the SSRF guard FAST, so landing_page_body degrades to null while the deterministic fields are
# fully exercised. (Live render is verified at R7, not faked.) Output -> transient dir, removed at end.
set -u
cd "$(dirname "$0")/../.." || exit 1

FX="runs/_fixture/ads/sample-ads.json"
OUT="runs/_fixture-assemble"
FAIL=0

rm -rf "$OUT"; mkdir -p "$OUT"

echo "── H6.funnel-assemble: node funnel-assemble.js ${FX} --source-type=crowdfunding --out=${OUT} ──"
node engine/bricks/funnel-assemble.js "$FX" --source-type=crowdfunding --out="$OUT" >/dev/null 2>&1
rc=$?
if [ "$rc" -ne 0 ]; then echo "   FAIL: brick exited ${rc}"; echo "H6 funnel-assemble: FAILED"; rm -rf "$OUT"; exit 1; fi

node -e '
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const OUT="'"$OUT"'";
let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
const files=fs.readdirSync(OUT).filter(f=>/^funnel_[0-9a-f]{8}\.json$/.test(f));
files.length===2 ? ok("clustering: 4 ads (1 null dest) -> 2 funnels (2 share normalized URL)") : bad("expected 2 funnel files, got "+files.length+": "+files.join(","));
const pkgs=files.map(f=>JSON.parse(fs.readFileSync(path.join(OUT,f),"utf8")));
const two=pkgs.find(p=>p.variant_count===2), one=pkgs.find(p=>p.variant_count===1);
// required package fields
const req=["funnel_id","competitor","source_type","landing_page_url","bound_ads","variant_count","crowdfunding_stats"];
pkgs.every(p=>req.every(k=>k in p)) ? ok("every package has required fields") : bad("a package is missing required fields");
// the 2-ad cluster
if(!two){bad("no variant_count=2 cluster");}
else{
  two.bound_ads.length===2 ? ok("2-ad cluster: 2 bound_ads") : bad("bound_ads len "+two.bound_ads.length);
  const a=two.bound_ads.find(b=>b.ad_creative_ref==="ad-1");
  (a&&a.primary_text==="Ad one text"&&a.headline==="Headline A"&&a.cta_text==="Shop Now"&&a.started_running_date==="2026-01-01"&&Array.isArray(a.platforms)) ? ok("buildBoundAd field mapping correct (library_id/text/headline/cta/date/platforms)") : bad("bound_ad mapping wrong: "+JSON.stringify(a));
  two.competitor==="SampleCo" ? ok("competitor resolved from resolved_advertiser.name") : bad("competitor "+two.competitor);
  two.source_type==="crowdfunding" ? ok("source_type passed through") : bad("source_type "+two.source_type);
  // funnel_id determinism: funnel_<sha1(competitor|landing_page_url)[:8]>
  const expect="funnel_"+crypto.createHash("sha1").update(two.competitor+"|"+two.landing_page_url).digest("hex").slice(0,8);
  two.funnel_id===expect ? ok("funnel_id deterministic = sha1(competitor|url) "+expect) : bad("funnel_id "+two.funnel_id+" != "+expect);
  // utm/variant stripped from clustering key
  (!/utm_|variant=/.test(two.landing_page_url)) ? ok("tracking params stripped from clustering URL") : bad("tracking params survived: "+two.landing_page_url);
}
one ? ok("1-ad cluster present (variant_count=1)") : bad("no variant_count=1 cluster");
// live render degraded to null offline (SSRF-rejected loopback)
pkgs.every(p=>p.landing_page_body===null) ? ok("LP render degraded to null offline (live hop is R7)") : bad("unexpected landing_page_body");
// ambiguous sidecar for the null-destination ad
const amb=path.join(OUT,"ambiguous_destinations.json");
if(fs.existsSync(amb)){const a=JSON.parse(fs.readFileSync(amb,"utf8")); (a.ads&&a.ads.some(x=>x.ad_creative_ref==="ad-4")) ? ok("null-destination ad-4 -> ambiguous_destinations.json (not forced into a funnel)") : bad("ad-4 not in ambiguous sidecar");}
else bad("no ambiguous_destinations.json sidecar");
process.exit(fail);
' || FAIL=1

echo ""
rm -rf "$OUT"
if [ "$FAIL" -eq 0 ]; then echo "H6 funnel-assemble: DETERMINISTIC SPINE PASS ✓ (transient ${OUT} cleaned)"; exit 0;
else echo "H6 funnel-assemble: FAILED — see above"; exit 1; fi
