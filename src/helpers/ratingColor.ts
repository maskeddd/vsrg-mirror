// https://github.com/Quaver/Quaver.Website/blob/master/src/utils/ColorHelper.ts

export default function ratingColor(rating: number): string {
  if (rating < 1) return "#D1FFFA";
  else if (rating < 2.5) return "#5EFF75";
  else if (rating < 10) return "#5EC4FF";
  else if (rating < 20) return "#F5B25B";
  else if (rating < 30) return "#F9645D";
  else if (rating < 40) return "#D761EB";
  else if (rating < 50) return "#7B61EB";
  return "#B7B7B7";
}
