export default function About() {
  return (
    <section
      className="habout"
      id="about"
      style={{ backgroundImage: 'url(/assets/images/tegalalang-rice-terrace-hero.jpg)' }}
    >
      <div className="habout__in">
        <span className="habout__k">About Cahyana</span>
        <h2 className="habout__t">One local family, your whole trip</h2>
        <p className="habout__lead">
          Tours, driver, activities and villa from one team in Ubud - plan it once, ask one person, and see every price
          before you commit.
        </p>
        <a className="habout__btn" href="/about-us.html">Read our story</a>
      </div>
    </section>
  );
}
