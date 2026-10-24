import { Manrope } from "next/font/google";
import { ExpectMoreChapter } from "./expect-more-chapter";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export function EmfiSections() {
  return <ExpectMoreChapter fontClass={manrope.className} />;
}
