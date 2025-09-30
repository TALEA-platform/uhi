[🇮🇹 Versione in italiano qui](#-versione-in-italiano)
---

# 🌡️ Surface Urban Heat Island Analysis – Bologna
## 🇬🇧 English version
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

| Index | Description | download raster | download vector |
|-------|-------------|------------------|------------------|
| LST | Land Surface Temperature | [lst_mean.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/delta_lst.tif?download=) | [lst_mean.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/delta_lst.geojson?download=) |
| NDVI | Normalized Difference Vegetation Index | [ndvi_mean.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/ndvi_mean.tif?download=) | [ndvi_mean.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/ndvi_mean.geojson?download=) |
| Albedo | Surface reflectance (Liang 2001) | [albedo_mean.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/albedo_mean.tif?download=) | [albedo_mean.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/albedo_mean.geojson?download=) |
| Heat-Vegetation Index | LST_norm – NDVI_norm | [heat_veg_index.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/heat_veg_index.tif?download=) |[heat_veg_index.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/heat_veg_index.geojson?download=) |
| Heat Retention Index | LST_norm – Albedo_norm | [heat_retention_index.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/heat_retention_index.tif?download=) |[heat_retention_index.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/heat_retention_index.geojson?download=)|
| Z-score of LST | Deviation from average LST | [z_score.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/z_score.tif?download=) - [z_score_class.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/z_score_class.tif?download=) | [z_score.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/z_score.geojson?download=), [z_score_class.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/z_score_class.geojson?download=) |
| Δ LST | MODIS day-night difference | [delta_lst.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/delta_lst.tif?download=) - [delta_lst_class.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/delta_lst_class.tif?download=) | [delta_lst.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/delta_lst.geojson?download=) - [delta_lst_class.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/z_score_class.geojson?download=) |
| UHEI | Composite index LST + (1–NDVI) + (1–Albedo) | [urban_heat_exposure_index.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/urban_heat_exposure_index.tif?download=) | [urban_heat_exposure_index.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/urban_heat_exposure_index.geojson?download=)|

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

---
[🇬🇧 English version here](#english)

# 🌡️ Analisi Isole di Calore di Superficie Urbana – Bologna
## 🇮🇹 Versione in italiano

Questo progetto analizza **come il calore si accumula e persiste** in diverse zone della città di Bologna durante l’estate, utilizzando **dati satellitari aperti** provenienti da Landsat 8/9 e MODIS.  
L’obiettivo è **identificare le aree più esposte al calore**, capire **perché** lo sono e fornire strumenti utili a cittadini, tecnici e decisori pubblici.

Tutti i dati sono ritagliati sui **confini ufficiali del Comune di Bologna** e sono forniti sia come mappe raster (GeoTIFF) sia come dati vettoriali interattivi (GeoJSON).

---

## 📍 Cosa puoi scoprire con questi dati

Ogni indicatore spiega un aspetto diverso del comportamento del calore in città.  
Sono tutti derivati da immagini satellitari scattate nell’estate 2024.

### 🌡️ Temperatura Superficiale (LST)
**Cosa mostra**: quanto è calda la superficie terrestre (es. asfalto, tetti, suolo) durante il giorno.  
**Come si legge**: le zone più rosse o scure sono più calde.  
➡️ *Serve per localizzare le isole di calore urbane.*

---

### 🧮 Z-score della LST (Anomalia termica)
**Cosa mostra**: quanto una zona è più calda o più fredda rispetto alla media cittadina.  
**Come si legge**:  
- 0 = nella media  
- valori negativi = più fresco  
- valori positivi = più caldo  
➡️ *Utile per evidenziare anomalie locali, anche all’interno di aree verdi.*

---

### 🌿 NDVI – Indice di Vegetazione
**Cosa mostra**: la quantità e lo stato di salute della vegetazione.  
**Come si legge**:  
- 0 = suolo nudo  
- vicino a 1 = vegetazione sana  
➡️ *Le aree verdi sono più fresche. NDVI aiuta a identificare dove mancano spazi verdi.*

---

### ☀️ Albedo – Riflettività superficiale
**Cosa mostra**: quanto una superficie riflette la luce solare.  
**Come si legge**:  
- valori alti = superfici chiare (es. tetti bianchi)  
- valori bassi = superfici scure (es. asfalto)  
➡️ *Le superfici scure assorbono calore. L’albedo aiuta a capire dove il suolo trattiene energia solare.*

---

### 🧊 ΔLST – Differenza Giorno/Notte
**Cosa mostra**: di quanto si abbassa la temperatura tra il giorno e la notte (da dati MODIS).  
**Come si legge**:  
- Δ alto = l’area si raffredda bene  
- Δ basso = l’area resta calda  
➡️ *Indica le zone che mantengono il calore anche di notte (potenziale disagio termico).*

---

### 🔥 Heat-Vegetation Index = LST<sub>norm</sub> – NDVI<sub>norm</sub>
**Cosa mostra**: zone calde con poca vegetazione.  
➡️ *Serve a individuare dove piantare alberi o migliorare il verde urbano.*

---

### 🌡️ Heat Retention Index = LST<sub>norm</sub> – Albedo<sub>norm</sub>
**Cosa mostra**: aree calde con superfici poco riflettenti (es. scure), che assorbono e rilasciano calore.  
➡️ *Identifica le zone che restano calde anche nelle ore serali.*

---

### 🌆 UHEI – Urban Heat Exposure Index  
**Formula**: LST + (1 – NDVI) + (1 – Albedo)  
**Cosa mostra**: un **indice composito** che unisce calore, mancanza di vegetazione e scarsa riflettività.  
➡️ *Più è alto, più l’area è esposta al rischio da calore urbano. Aiuta a decidere dove intervenire prima.*

---

## 🧪 Cosa è stato analizzato

I dati derivano da immagini satellitari:

- **Landsat 8/9**: LST, NDVI, Albedo (risoluzione 30–100 m)
- **MODIS**: differenza giorno-notte della temperatura (risoluzione 1 km)

Gli indici calcolati includono:

- LST (°C)
- NDVI
- Albedo
- ΔLST (giorno–notte)
- Indici compositi: Z-score, Heat-Vegetation, Heat Retention, UHEI

---

## 🗂️ File prodotti

Ogni indicatore è salvato in formato `.tif` e `.geojson` (ritagliato sui confini di Bologna).

| Indice | Descrizione | Download raster | Download vector | 
|--------|-------------|----------------|----------------|
| **LST** | Temperatura della superficie | [lst_mean.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/delta_lst.tif?download=) | [lst_mean.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/delta_lst.geojson?download=) |
| **NDVI** | Indice di vegetazione | [ndvi_mean.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/ndvi_mean.tif?download=) | [ndvi_mean.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/ndvi_mean.geojson?download=) |
| **Albedo** | Riflettività della superficie (Liang 2001) | [albedo_mean.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/albedo_mean.tif?download=) | [albedo_mean.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/albedo_mean.geojson?download=) |
| **Heat-Vegetation Index** | Caldo senza vegetazione |  [heat_veg_index.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/heat_veg_index.tif?download=) |[heat_veg_index.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/heat_veg_index.geojson?download=) |
| **Heat Retention Index** | Caldo trattenuto da superfici scure | heat_retention_index.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/heat_retention_index.tif?download=) |[heat_retention_index.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/heat_retention_index.geojson?download=)|
| **Z-score LST** | Deviazione dalla media | [z_score.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/z_score.tif?download=) - [z_score_class.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/z_score_class.tif?download=) | [z_score.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/z_score.geojson?download=), [z_score_class.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/z_score_class.geojson?download=) |
| **ΔLST (MODIS)** | Differenza giorno-notte | [delta_lst.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/delta_lst.tif?download=) - [delta_lst_class.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/delta_lst_class.tif?download=) | [delta_lst.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/delta_lst.geojson?download=) - [delta_lst_class.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/z_score_class.geojson?download=) |
| **UHEI** | Esposizione termica urbana | [urban_heat_exposure_index.tif](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/urban_heat_exposure_index.tif?download=) | [urban_heat_exposure_index.geojson](https://github.com/TALEA-platform/urbanheatislands/raw/refs/heads/main/data/urban_heat_exposure_index.geojson?download=)|


> 📁 I file sono disponibili sia in raster che in vettoriale, pronti per essere visualizzati su mappe o in software GIS.

---

## 🛠️ Strumenti utilizzati

- Python:
  - Earth Engine API
  - `geemap`, `rasterio`, `geopandas`, `leafmap`
- Jupyter Notebook per l'elaborazione e visualizzazione
- Leafmap per mappa interattiva con click e legenda

---

## 🎯 Perché è importante

🌇 Bologna, come molte città, sperimenta **effetti da isola di calore urbana** che peggiorano con l’estate e i cambiamenti climatici.  
Questi fenomeni dipendono da:

- Carenza di spazi verdi 🌳  
- Superfici che assorbono calore (asfalto, tetti scuri) 🛣️  
- Scarsa dispersione del calore notturno 🌃  

Mappare e spiegare questi meccanismi serve a:

- 🏛️ Aiutare chi pianifica la città a intervenire dove serve
- 🧑‍⚕️ Proteggere la salute dei cittadini più vulnerabili
- 🧑‍🎓 Far capire a tutti come l’ambiente urbano influisce sul benessere quotidiano

> 📣 Questo progetto promuove la scienza aperta, la resilienza climatica e la pianificazione urbana partecipata.

