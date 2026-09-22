-- Transformed: cost breakdown by date, region, product — feeds "Cost" and cost-driver drill-downs.

select
    sale_date,
    region,
    country,
    product,
    date_trunc('quarter', sale_date) as quarter,
    date_trunc('month', sale_date)   as month,
    sum(material_cost) as total_material_cost,
    sum(shipping_cost) as total_shipping_cost,
    sum(total_cost)     as total_cost
from {{ ref('stg_sales') }}
group by 1,2,3,4,5,6
