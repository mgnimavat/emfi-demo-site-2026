import type { ExecutionResearchRecord } from "./execution";
import chartData from "./intelligence-charts.json";

// Public EMFI Intelligence snapshot; full reports remain linked to their original pages.
export const intelligencePublications: ExecutionResearchRecord[] = [
  {
    "id": "emfi-2582",
    "title": "Double-digit Inflation Could Delay the B+",
    "country": "Pakistan",
    "reportType": "Flash Note",
    "publishedAt": "2026-10-20",
    "topics": [
      "Flash Note"
    ],
    "paragraphs": [
      "Inflation and fiscal constraints could postpone Pakistan’s next sovereign rating upgrade."
    ],
    "source": "EMFI Intelligence public publication and chart data, imported 21 October 2026. Summary condensed from the publication overview.",
    "sourceUrl": "https://emfi.uk/english/intelligence/details/double-digit-inflation-could-delay-the-b-2529?id=2582",
    "chart": {
      "title": "PKSTAN 6 7/8 12/05/27 Price",
      "kind": "price",
      "points": chartData["2582"]
    }
  },
  {
    "id": "emfi-2581",
    "title": "Hand in Hand with the IMF",
    "country": "Zambia",
    "reportType": "Country Report",
    "publishedAt": "2026-10-20",
    "topics": [
      "Country Report"
    ],
    "paragraphs": [
      "Zambia’s new IMF agreement faces fiscal pressures and unfinished reforms."
    ],
    "source": "EMFI Intelligence public publication and chart data, imported 21 October 2026. Summary condensed from the publication overview.",
    "sourceUrl": "https://emfi.uk/english/intelligence/details/xx-2528?id=2581",
    "publicationType": "Country Report",
    "chart": {
      "title": "ZAMBIN 8.97 07/30/27 Price",
      "kind": "price",
      "points": chartData["2581"]
    }
  },
  {
    "id": "emfi-2580",
    "title": "IMF Fall 2026 WEO – A Tale of Two Shocks",
    "country": "Global",
    "reportType": "Strategy Viewpoint",
    "publishedAt": "2026-10-14",
    "topics": [
      "Strategy Viewpoint"
    ],
    "paragraphs": [
      "The IMF outlook weighs AI-led demand against the Middle East supply shock."
    ],
    "source": "EMFI Intelligence public publication and chart data, imported 21 October 2026. Summary condensed from the publication overview.",
    "sourceUrl": "https://emfi.uk/english/intelligence/details/imf-fall-2026-weo-a-tale-of-two-shocks-2527?id=2580",
    "chart": {
      "title": "Global country daily change",
      "kind": "world"
    }
  },
  {
    "id": "emfi-2579",
    "title": "Caribbean Spreads: Tight, but Not Right",
    "country": "Global",
    "reportType": "Strategy Viewpoint",
    "publishedAt": "2026-10-13",
    "topics": [
      "Strategy Viewpoint"
    ],
    "paragraphs": [
      "Caribbean sovereign spreads remain tight despite the recent market sell-off."
    ],
    "source": "EMFI Intelligence public publication and chart data, imported 21 October 2026. Summary condensed from the publication overview.",
    "sourceUrl": "https://emfi.uk/english/intelligence/details/caribbean-spreads-tight-but-not-right-2526?id=2579",
    "chart": {
      "title": "BAHAMA 6 11/21/28 Price",
      "kind": "price",
      "points": chartData["2579"]
    }
  },
  {
    "id": "emfi-2575",
    "title": "EMFI Monthly Review – September",
    "country": "Global",
    "reportType": "EMFI Monthly Review",
    "publishedAt": "2026-10-05",
    "topics": [
      "EMFI Monthly Review"
    ],
    "paragraphs": [
      "September’s review covers sovereign performance, geopolitical shocks and policy reforms."
    ],
    "source": "EMFI Intelligence public publication and chart data, imported 21 October 2026. Summary condensed from the publication overview.",
    "sourceUrl": "https://emfi.uk/english/intelligence/details/emfi-monthly-review-september-2522?id=2575",
    "chart": {
      "title": "Global country daily change",
      "kind": "world"
    }
  },
  {
    "id": "emfi-2553",
    "title": "EMFI Monthly Review – August",
    "country": "Global",
    "reportType": "EMFI Monthly Review",
    "publishedAt": "2026-09-03",
    "topics": [
      "EMFI Monthly Review"
    ],
    "paragraphs": [
      "August’s review examines sovereign resilience, debt sustainability and monetary policy."
    ],
    "source": "EMFI Intelligence public publication and chart data, imported 21 October 2026. Summary condensed from the publication overview.",
    "sourceUrl": "https://emfi.uk/english/intelligence/details/emfi-monthly-review-august-2497?id=2553",
    "chart": {
      "title": "Global country daily change",
      "kind": "world"
    }
  }
];
