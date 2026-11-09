export type Review = {
  id: number;
  name: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
};

const NAMES = [
  "Aarav S.", "Priya M.", "Rohan K.", "Ishita P.", "Vikram R.", "Sneha D.",
  "Karan T.", "Ananya B.", "Dev N.", "Meera J.",
];

const TITLES_POSITIVE = [
  "Excellent value for money", "Exceeded my expectations", "Great display and battery life",
  "Smooth performance every day", "Camera quality is impressive", "Worth every rupee",
];

const TITLES_MIXED = [
  "Good phone, minor niggles", "Solid but could be better", "Decent for the price",
];

const COMMENTS_POSITIVE = [
  "Been using this for a few weeks now and it handles everything I throw at it without a hiccup. Battery easily lasts a full day.",
  "The display is bright and crisp, perfect for streaming. Delivery was fast and the packaging felt premium.",
  "Switched from an older phone and the difference in speed is night and day. Highly recommend to anyone in this budget.",
  "Camera performs really well even in low light. Build quality feels sturdy and doesn't feel cheap at all.",
  "Customer support helped me set it up quickly. The phone itself has been flawless so far.",
];

const COMMENTS_MIXED = [
  "Overall a good phone for daily use, though the speaker could be a bit louder. Still happy with the purchase.",
  "Performance is good for the price but I wish the charger included faster charging. Otherwise no complaints.",
  "Does what it says on the box. Not flashy but reliable, which is what I needed.",
];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export function getReviewsForPhone(phoneId: number, baseRating: number): Review[] {
  const rand = seededRandom(phoneId * 7919 + 13);
  const count = 3 + Math.floor(rand() * 3);
  const reviews: Review[] = [];

  for (let i = 0; i < count; i++) {
    const isPositive = rand() > 0.3;
    const ratingJitter = isPositive ? (rand() > 0.5 ? 0 : -0.5) : -1;
    const rating = Math.max(3, Math.min(5, Math.round(baseRating + ratingJitter)));
    const nameIdx = Math.floor(rand() * NAMES.length);
    const daysAgo = Math.floor(rand() * 180) + 1;
    const date = new Date(Date.now() - daysAgo * 86400000).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const titlePool = isPositive ? TITLES_POSITIVE : TITLES_MIXED;
    const commentPool = isPositive ? COMMENTS_POSITIVE : COMMENTS_MIXED;

    reviews.push({
      id: i + 1,
      name: NAMES[nameIdx],
      rating,
      title: titlePool[Math.floor(rand() * titlePool.length)],
      comment: commentPool[Math.floor(rand() * commentPool.length)],
      date,
      verified: rand() > 0.2,
    });
  }

  return reviews;
}
