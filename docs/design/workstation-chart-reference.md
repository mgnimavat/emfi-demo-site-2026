# Workstation chart reference

Use the Workstation price chart as the visual reference for interactive line charts on the EMFI site. Its pattern is a rounded white card, a light gray toolbar with a segmented time-range control, a thin blue line with a fading area fill, subtle horizontal grid lines, and a white tooltip with a dashed cursor guide.

The Workstation and Wealth V2 use the same plot component for axes, tooltips, and chart geometry. Wealth V2 uses a navy line, a soft blue fill, and a date axis. Its tooltip shows the date of the selected point. The selected period’s low and high map to 0 and 1, and flat series appear at 0.50. The loading state preserves the grid and date tick positions.

- [Workstation chart](../../src/components/sections/execution/execution-chart.tsx) · [Styles](../../src/components/sections/execution/execution-chart.module.css)
- [Shared plot](../../src/ui/components/TimeSeriesPlot.tsx) · [Styles](../../src/ui/components/TimeSeriesPlot.module.css)
- [Wealth V2 chart](../../src/containers/Sections/WealthServiceHero.tsx) · [Styles](../../src/containers/Sections/WealthServiceHero.module.css)
