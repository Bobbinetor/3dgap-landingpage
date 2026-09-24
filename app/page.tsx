import Nav from "@/components/nav";
import Hero from "@/components/hero";
import {
  QuotePaths,
  Materials,
  Process,
  Pricing,
  Catalog,
  FinalCTA,
  Footer,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <QuotePaths />
        <Materials />
        <Process />
        <Pricing />
        <Catalog />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
