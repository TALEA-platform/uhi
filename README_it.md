# 🌡️ Urban Heat Island Analysis – Bologna

This project explores how **heat builds up and stays** in different areas of Bologna during summer, based on **open satellite data** from Landsat 8/9 and MODIS. The goal is to identify which parts of the city are more exposed to extreme temperatures and why, helping decision-makers and citizens understand local climate risks.

All results are clipped to the official municipal boundary of Bologna and provided both as raster maps (GeoTIFF) and interactive vector data (GeoJSON).

## 🔍 What we analyzed

We processed satellite images from **summer 2024** to extract several environmental indicators:

- **LST (Land Surface Temperature)**: how hot the ground is
- **NDVI (Normalized Difference Vegetation Index)**: how much green vegetation is present
- **Albedo**: how reflective a surface is (dark roofs absorb more heat)
- **ΔLST (MODIS)**: how much temperature drops from day to night

We used these to calculate **composite indicators** that describe where heat is more intense and persistent:

- **Z-score of LST** – shows how much a zone is hotter/colder than the average
- **Heat-Vegetation Index** – how much the heat is mitigated (or not) by vegetation
- **Heat Retention Index** – where heat is absorbed and stored due to low reflectivity
- **UHEI (Urban Heat Exposure Index)** – a combined score of heat + lack of green + high absorption

We also **classified** some of these indicators to make them easier to interpret:

- 🔟 Z-score: divided into 10 levels (from cooler to hotter than average)
- 🌡️ ΔLST: 3 categories showing how much each area cools down at night

## 🗺️ Output files

Each indicator is saved in `.tif` and `.geojson` format.

| Index | Description | Filename (base) |
|-------|-------------|-----------------|
| **LST** | Surface temperature (°C) from Landsat | `lst_mean` |
| **NDVI** | Vegetation index from Landsat | `ndvi_mean` |
| **Albedo** | Reflectivity index (Liang 2001) | `albedo_mean` |
| **Heat-Vegetation Index** | LST_norm – NDVI_norm | `heat_veg_index` |
| **Heat Retention Index** | LST_norm – Albedo_norm | `heat_retention_index` |
| **Z-score of LST** | Temperature anomaly from the mean | `z_score`, `z_score_class` |
| **ΔLST** | MODIS day-night temp difference | `delta_lst`, `delta_lst_class` |
| **UHEI** | LST + (1–NDVI) + (1–Albedo) | `urban_heat_exposure_index` |

All values are **clipped to Bologna** and can be visualized on a map or reused in GIS software.

## 🧰 Tools used

- **Python**:
  - Earth Engine Python API
  - `geemap`, `rasterio`, `geopandas`, `leafmap`
- **Jupyter Notebook** for scripting and visualizations
- **Interactive map** with layer control and click-on-zone info (based on `leafmap` and `GeoJSON`)

## 🎯 Why this matters

🌆 Cities like Bologna experience **urban heat island effects**, especially during summer. This means some neighborhoods can be much hotter than others due to:

- Lack of green spaces 🌳
- Highly absorbent materials on roofs and streets 🛣️
- Limited ventilation or cooling at night 🌃

By mapping and explaining these dynamics with open data, we help:

- 🔧 Urban planners prioritize cooling interventions
- 🧑‍⚕️ Health services protect at-risk populations
- 🧑‍🎓 Citizens understand how local environments affect their well-being

> 📣 This is part of a broader effort to promote open science, climate resilience, and participatory urban planning.
