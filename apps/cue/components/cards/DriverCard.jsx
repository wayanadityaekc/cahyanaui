export default function DriverCard({ name, role, bio, initial }) {
  return (
    <article className="driver">
      <span className="driver__avatar" aria-hidden="true">{initial || (name || 'C').charAt(0)}</span>
      <h3 className="driver__name">{name}</h3>
      {role && <p className="driver__role">{role}</p>}
      {bio && <p className="driver__bio">{bio}</p>}
    </article>
  );
}
