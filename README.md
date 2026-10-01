# Beutler Tech Website

Website von [Beutler Tech](https://beutler-tech.de): KI-Beratung und KI-Einführung für kleine und mittelständische Unternehmen am Bodensee.

## Aufbau

| Datei | Inhalt |
|-------|--------|
| `index.html` | Startseite (inkl. SEO-Metadaten, strukturierte Daten und FAQ) |
| `ueber-mich.html` | Über-mich-Seite (Foto später als `assets/img/david-beutler.jpg` ergänzen) |
| `impressum.html`, `datenschutz.html` | Pflichtangaben |
| `404.html` | Fehlerseite für GitHub Pages |
| `assets/css/style.css` | Gemeinsames Stylesheet |
| `assets/fonts/` | Lokal gehostete Schriften (Inter, Outfit, SIL OFL) |
| `assets/img/` | Social-Media-Vorschaubild, Apple-Touch-Icon |
| `favicon.svg`, `robots.txt`, `sitemap.xml` | Icon und Dateien für Suchmaschinen |

Die Seite lädt keine externen Ressourcen (keine Google Fonts, kein CDN, kein Tracking). Die Icons stammen von [Lucide](https://lucide.dev) (ISC) und sind als SVG direkt im HTML eingebettet.

## Vor dem Livegang

- Gelb markierte Platzhalter (`class="todo"`) in `impressum.html` und `datenschutz.html` ausfüllen.
- Postfach `info@beutler-tech.de` einrichten.
- Bei Inhaltsänderungen das Datum `lastmod` in `sitemap.xml` aktualisieren.

## GitHub Pages Deployment

Die Seite wird über GitHub Pages mit der eigenen Domain **beutler-tech.de** ausgeliefert (`CNAME`).

## DNS Setup

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | tuCsen.github.io |
