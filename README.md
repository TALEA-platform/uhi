Versione in Italiano [qui](README_it.md)

---

# 🌡️ Urban Heat Island Analysis – Bologna

This project analyzes Urban Heat Island (UHI) effects in the city of Bologna (Italy) by processing and integrating satellite data (Landsat, MODIS) with spatial indicators like [NDVI](https://it.wikipedia.org/wiki/Normalized_Difference_Vegetation_Index), LST - Land Surface Temperature, [Albedo](https://en.wikipedia.org/wiki/Albedo), and derived composite indices.

All data is clipped to the official boundary of Bologna and exported both as raster (GeoTIFF) and vector (GeoJSON).

## 🗺️ Workflow Summary

1. **Input**:
   - Precise AOI: `[bologna_borders.geojson](bologna_borders.geojson)`
   - Satellite data: Landsat 8/9 SR + MODIS LST (summer 2024)
2. **Derived raster layers**:
   - LST (Land Surface Temperature)
   - NDVI (Vegetation Index)
   - Albedo (Surface reflectivity)
   - MODIS ΔLST (day/night temp difference)
3. **Indices**:
   - **Z-score LST** – anomaly from mean LST
   - **Heat-Vegetation Index** – (LST_norm – NDVI_norm)
   - **Heat Retention Index** – (LST_norm – Albedo_norm)
   - **Urban Heat Exposure Index (UHEI)** – composite: LST + (1–NDVI) + (1–Albedo)
4. **Classifications**:
   - Z-score in 10 classes (cold to hot spots)
   - ΔLST in 3 classes: Δ > 10°C, 5–10°C, <5°C

## 📂 Output Files

Each index is exported in `.tif` and `.geojson` format with clip on Bologna.

| Index | Description | Filename (base) |
|-------|-------------|------------------|
| LST | Land Surface Temperature | `lst_mean` |
| NDVI | Normalized Difference Vegetation Index | `ndvi_mean` |
| Albedo | Surface reflectance (Liang 2001) | `albedo_mean` |
| Heat-Vegetation Index | LST_norm – NDVI_norm | `heat_veg_index` |
| Heat Retention Index | LST_norm – Albedo_norm | `heat_retention_index` |
| Z-score of LST | Deviation from average LST | `z_score`, `z_score_class` |
| Δ LST | MODIS day-night difference | `delta_lst`, `delta_lst_class` |
| UHEI | Composite index LST + (1–NDVI) + (1–Albedo) | `urban_heat_exposure_index` |

## 🖥️ Tools

- Python with:
  - Earth Engine Python API
  - geemap, rasterio, geopandas, leafmap
- Visualized in Jupyter Notebook
- ~Interactive map via `leafmap.Map()` + `geojson` click inspection~

## 📍 Purpose

This analysis supports:
- Environmental monitoring
- Climate adaptation planning
- Data-driven urban policy decisions
