-- Staging: light cleaning of the raw sales seed, one row per transaction.

select
    cast(date as date)         as sale_date,
    trim(region)                as region,
    trim(country)                as country,
    trim(product)                as product,
    cast(quantity as integer)   as quantity,
    cast(unit_price as decimal(10,2))   as unit_price,
    cast(revenue as decimal(12,2))      as revenue,
    cast(material_cost as decimal(12,2)) as material_cost,
    cast(shipping_cost as decimal(12,2)) as shipping_cost,
    cast(total_cost as decimal(12,2))    as total_cost,
    cast(margin as decimal(12,2))        as margin
from {{ ref('sales') }}
where date is not null
  and revenue >= 0
