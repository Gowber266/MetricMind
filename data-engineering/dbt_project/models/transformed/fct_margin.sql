-- Transformed: margin = revenue - cost, joined at the same grain. This is what
-- "Why did European margins drop?" ultimately queries against.

select
    r.sale_date,
    r.region,
    r.country,
    r.product,
    r.quarter,
    r.month,
    r.total_revenue,
    c.total_material_cost,
    c.total_shipping_cost,
    c.total_cost,
    (r.total_revenue - c.total_cost) as margin,
    round(
        (r.total_revenue - c.total_cost) / nullif(r.total_revenue, 0) * 100, 2
    ) as margin_pct
from {{ ref('fct_revenue') }} r
join {{ ref('fct_cost') }} c
    on r.sale_date = c.sale_date
   and r.region = c.region
   and r.country = c.country
   and r.product = c.product
