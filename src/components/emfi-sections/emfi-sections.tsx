import { ExpectMoreChapter } from "./expect-more-chapter";

export function EmfiSections({ showPoints = true, showRouteTitle = false, loop = false, stepLabel, highlightSlides = false, staticStandards = false, lightBands = false, markFill = true }: { showPoints?: boolean; showRouteTitle?: boolean; loop?: boolean; stepLabel?: string; highlightSlides?: boolean; staticStandards?: boolean; lightBands?: boolean; markFill?: boolean }) {
  return <ExpectMoreChapter showPoints={showPoints} showRouteTitle={showRouteTitle} loop={loop} stepLabel={stepLabel} highlightSlides={highlightSlides} staticStandards={staticStandards} lightBands={lightBands} markFill={markFill} />;
}
