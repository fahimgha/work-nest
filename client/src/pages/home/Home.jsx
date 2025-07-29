import Header from "../../components/Header";
import FeatureCard from "../../components/ui/FeatureCard";
import { Button } from "../../components/ui/buttons/Button";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Header />
      <div className="home-container">
        <main className="home-main">
          <section className="home-header">
            <h1 className="home-title">Work Nest</h1>
            <p className="home-description">
              Project management tools to help you stay productive and organized
            </p>
            <Link to="/app/board">
              <Button>Start App</Button>
            </Link>
          </section>

          <section id="Tools" className="home-tools">
            <h1 className="tools-title">All features</h1>
            <div className="tools-list">
              <FeatureCard
                name="Daily Planner"
                src="/fusionicon.svg"
                href="/app/board"
                description="Plan your days and weeks to stay organized"
              />
              <FeatureCard
                name="Timer"
                src="/supressionicon.svg"
                href="/app/board"
                description="Stay focused with a smart task timer"
              />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Home;
