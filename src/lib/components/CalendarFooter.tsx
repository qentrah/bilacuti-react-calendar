export function CalendarRelatedLinks({ year }: { year: number }) {
  const links = [
    [
      "Plan your long weekend",
      "9 breaks with one day of leave",
      "long-weekends-malaysia",
      "↗",
    ],
    [
      "School holidays",
      "Term breaks and year-end holiday for all states",
      "school-holidays-malaysia",
      "▣",
    ],
    [
      "Tahun Baru Cina",
      year === 2026 ? "17 – 18 Feb" : "6 – 7 Feb",
      "chinese-new-year",
      "🧧",
    ],
    [
      "Hari Raya Aidilfitri",
      year === 2026 ? "21 – 22 Mar" : "10 – 11 Mar",
      "hari-raya-aidilfitri",
      "☾",
    ],
    ["Deepavali", year === 2026 ? "8 Nov" : "28 Oct", "deepavali", "✧"],
    ["Hari Krismas", "25 Dec", "christmas", "☆"],
  ];
  return (
    <div className="related">
      {links.map(([title, subtitle, path, icon]) => (
        <a key={title} href={`https://www.bilacuti.my/${path}-${year}`}>
          <span className="related-icon">{icon}</span>
          <span>
            {title}
            <small>{subtitle}</small>
          </span>
          <span className="arrow">›</span>
        </a>
      ))}
    </div>
  );
}
export function CalendarFooter() {
  return (
    <footer>
      © Copyright <a href="https://www.bilacuti.my/">bilacuti.my</a>. Made by{" "}
      <a href="https://x.com/gaddafirusli">@gaddafirusli</a>
      <br />
      <a href="https://forms.gle/Dm9ADRp28CD8ZhwaA">
        Report issues or submit feedback
      </a>
    </footer>
  );
}
