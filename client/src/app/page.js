import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Doctors from "./components/Doctors/Doctors";
import Stats from "./components/Stats/Stats";
import About from "./components/About/About";
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs";
import Reviews from "./components/Reviews/Reviews";
import HowToBook from "./components/HowToBook/HowToBook";
import Footer from "./components/Footer/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Services />
      <Doctors />
      <About />
      <Stats />
      <WhyChooseUs />
      <Reviews />
      <HowToBook />
      <Footer />
    </div>
  );
}
