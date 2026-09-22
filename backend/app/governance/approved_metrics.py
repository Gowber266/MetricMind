"""
Governance boundary: the agent may only query metrics in this list.
Owned jointly by Sravani (defines what's semantically valid) and the
QA/Governance member (tests that unapproved queries are rejected).
"""

APPROVED_METRICS = [
    "revenue",
    "material_cost",
    "shipping_cost",
    "cost",
    "margin",
    "margin_pct",
]


def is_approved(metric: str) -> bool:
    return metric.strip().lower() in APPROVED_METRICS
