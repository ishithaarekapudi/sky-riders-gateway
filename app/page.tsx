export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">SKY RIDERS GATEWAY</p>
        <h1>Turn your passion into real-world opportunities.</h1>
        <p className="intro">
          Follow a structured roadmap, build practical skills, and take your next step with confidence.
        </p>
        <a className="button" href="#program">Explore the program</a>
      </section>

      <section className="program" id="program">
        <p className="eyebrow">YOUR ROADMAP</p>
        <h2>A clear path from curiosity to experience.</h2>
        <div className="steps">
          <article><span>01</span><h3>Discover</h3><p>Find the interests and opportunities that fit your goals.</p></article>
          <article><span>02</span><h3>Build</h3><p>Develop useful skills through guided, practical projects.</p></article>
          <article><span>03</span><h3>Launch</h3><p>Turn your progress into applications and real experience.</p></article>
        </div>
      </section>
    </main>
  );
}
