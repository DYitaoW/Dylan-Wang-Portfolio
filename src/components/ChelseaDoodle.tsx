export default function ChelseaDoodle() {
  const chelseaUrl = `${import.meta.env.BASE_URL}chelsea.png`;
  return (
    <div className="chelsea-doodle-wrapper" aria-hidden="true" title="Chelsea FC hand-drawn doodle">
      <img
        src={chelseaUrl}
        alt="Chelsea Football Club hand-drawn crest doodle"
        className="chelsea-doodle-img"
      />
    </div>
  );
}
