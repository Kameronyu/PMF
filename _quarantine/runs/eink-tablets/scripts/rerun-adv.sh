#!/bin/bash
# Re-run Ad Library by advertiser page for the brands with any Meta footprint.
cd /home/kyu3/PMF/runs/eink-tablets || exit 1

while read -r slug query; do
  [ -z "$slug" ] && continue
  node scripts/adlib-one.js "$slug" "$query"
done <<'EOF'
KindleScribe Amazon Kindle
Viwoods Viwoods
iFLYTEK iFLYTEK
XPPen XPPen
TCL TCL
Harbor Harbor Innovations
Supernote Supernote
Kobo Kobo
Daylight Daylight Computer
PocketBook PocketBook
FujitsuQuaderno Quaderno
Boox Boox
Bigme Bigme
Dasung Dasung
EOF

echo "[rerun-adv] all done"
