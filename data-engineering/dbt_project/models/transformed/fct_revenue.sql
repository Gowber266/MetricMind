-- Transformed: revenue aggregated by date, region, product — feeds the semantic layer's "Revenue" measure.

select
    sale_date,
    region,
    country,
    product,
    date_trunc('quarter', sale_date) as quarter,
    date_trunc('month', sale_date)   as month,
    sum(quantity)  as total_quantity,
    sum(revenue)   as total_revenue
from {{ ref('stg_sales') }}
group by 1,2,3,4,5,6
