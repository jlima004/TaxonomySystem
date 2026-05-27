import json, sys

TAX = "data/compiled/v2/taxonomy.json"
SIM = "data/compiled/v2/similarity_matrix.json"

with open(TAX) as f:
    tax = json.load(f)
with open(SIM) as f:
    sim = json.load(f)

rq = sim.get("review_queue", [])
results = {}

# Helper: buscar descriptor em uma subfamilia por id
def get_seed_desc(fam_id, sub_id, desc_id):
    fam = next((f for f in tax["families"] if f["id"] == fam_id), None)
    if not fam:
        return {}
    sub = next((s for s in fam.get("subfamilies", []) if s["id"] == sub_id), None)
    if not sub:
        return {}
    return next((d for d in sub.get("descriptors", []) if d["id"] == desc_id), {})

def get_subfamily(fam_id, sub_id):
    fam = next((f for f in tax["families"] if f["id"] == fam_id), None)
    if not fam:
        return None
    return next((s for s in fam.get("subfamilies", []) if s["id"] == sub_id), None)

# INV-1: lemon_peel.source == "seed" e status == "curated"
lp = get_seed_desc("citrus", "citrus_fresh", "lemon_peel")
inv1 = lp.get("source") == "seed" and lp.get("status") == "curated"
results["INV-1"] = ("PASS" if inv1 else "FAIL",
    "source={}, status={}, freq={}".format(lp.get("source"), lp.get("status"), lp.get("frequency")))

# INV-2: lemon_peel ausente do review_queue como item principal
# (WARN-PAT03: conflict de peel com seed_descriptor=lemon_peel eh esperado e coberto por INV-6)
lp_as_main = [i for i in rq if i.get("affected", {}).get("descriptor") == "lemon_peel"
              or i.get("descriptor") == "lemon_peel"]
inv2 = len(lp_as_main) == 0
results["INV-2"] = ("PASS" if inv2 else "FAIL",
    "lemon_peel como item principal no review_queue: {}".format(len(lp_as_main)))

# INV-3: lemon permanece seed curated
lemon = get_seed_desc("citrus", "citrus_fresh", "lemon")
inv3 = lemon.get("source") == "seed" and lemon.get("status") == "curated"
results["INV-3"] = ("PASS" if inv3 else "FAIL",
    "lemon source={}, status={}".format(lemon.get("source"), lemon.get("status")))

# INV-4: 6 seeds em citrus_fresh (filtrar source=seed)
sub = get_subfamily("citrus", "citrus_fresh")
cf_seeds = [d for d in sub.get("descriptors", []) if d.get("source") == "seed"] if sub else []
cf_seed_ids = [d["id"] for d in cf_seeds]
inv4 = len(cf_seed_ids) == 6
results["INV-4"] = ("PASS" if inv4 else "FAIL",
    "seeds count={}: {}".format(len(cf_seed_ids), cf_seed_ids))

# INV-5: 5 seeds pre-existentes intactos e curated
pre = {"lemon", "bergamot", "sweet_orange", "grapefruit", "petitgrain"}
pre_status = {d["id"]: d.get("status") for d in cf_seeds if d["id"] in pre}
inv5 = pre.issubset(set(cf_seed_ids)) and all(s == "curated" for s in pre_status.values())
results["INV-5"] = ("PASS" if inv5 else "FAIL",
    "pre-existentes={} statuses={}".format(pre.issubset(set(cf_seed_ids)), pre_status))

# INV-6: <= 2 novos seed_corpus_conflicts com seed_descriptor=lemon_peel
new_sc = [i for i in rq
          if i.get("type") == "seed_corpus_conflict"
          and i.get("evidence", {}).get("seed_descriptor") == "lemon_peel"]
inv6 = len(new_sc) <= 2
results["INV-6"] = ("PASS" if inv6 else "FAIL",
    "novos conflicts={}: {}".format(
        len(new_sc),
        [i.get("affected", {}).get("descriptor") or i.get("descriptor") for i in new_sc]))

# INV-7: lemongrass permanece no review_queue como seed_corpus_conflict
# schema real: campo 'affected.descriptor'
lg = [i for i in rq
      if i.get("type") == "seed_corpus_conflict"
      and (i.get("affected", {}).get("descriptor") == "lemongrass"
           or i.get("descriptor") == "lemongrass")]
inv7 = len(lg) >= 1
results["INV-7"] = ("PASS" if inv7 else "FAIL",
    "lemongrass no review_queue={} (seed_anchor={})".format(
        len(lg),
        lg[0].get("evidence", {}).get("seed_descriptor") if lg else "N/A"))

all_pass = all(v[0] == "PASS" for v in results.values())
sep = "=" * 62
print(sep)
print("WAVE 3 - VALIDACAO FINAL DOS 7 INVARIANTES (Phase 23, Plan 01)")
print(sep)
for k, (s, d) in results.items():
    icon = "OK" if s == "PASS" else "XX"
    print("{} {}: {} | {}".format(icon, k, s, d))
print(sep)
print("RESULTADO: {}".format("ALL PASS" if all_pass else "FALHA DETECTADA"))
print(sep)

if new_sc:
    print("\nWARN-PAT03: conflict(s) com seed_descriptor=lemon_peel (esperado):")
    for nc in new_sc:
        desc = nc.get("affected", {}).get("descriptor") or nc.get("descriptor")
        ev = nc.get("evidence", {})
        print("  descriptor={} corpus_count={}".format(desc, ev.get("corpus_count")))

sys.exit(0 if all_pass else 1)
