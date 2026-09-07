export default function ScoreRow({ scores }) {
  return (
    <div className="score-row">
      {scores.map(([label, value]) => (
        <div className="score" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
