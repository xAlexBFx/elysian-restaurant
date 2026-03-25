import HeroSection from "@/components/HeroSection";
import DishSection from "@/components/DishSection";
import LocationSection from "@/components/LocationSection";
import ReservationSection from "@/components/ReservationSection";
import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";
import dish4 from "@/assets/dish-4.jpg";
import dish5 from "@/assets/dish-5.jpg";

const dishes = [
  {
    image: dish1,
    title: "Wagyu",
    subtitle: "Main Course",
    description: "A5 Japanese wagyu, seared to perfection. Served with truffle jus and seasonal root vegetables.",
    price: "€185",
    chefSelection: true,
  },
  {
    image: dish2,
    title: "Salmon",
    subtitle: "From the Sea",
    description: "Wild-caught Scottish salmon, gently seared. Accompanied by microgreens and citrus beurre blanc.",
    price: "€95",
  },
  {
    image: dish3,
    title: "Chocolat",
    subtitle: "Dessert",
    description: "Valrhona dark chocolate sphere with 24-karat gold leaf. A signature indulgence.",
    price: "€65",
    chefSelection: true,
  },
  {
    image: dish4,
    title: "Homard",
    subtitle: "From the Sea",
    description: "Maine lobster tail, butter-poached. With herb beurre blanc and garden thyme.",
    price: "€145",
    chefSelection: true,
  },
  {
    image: dish5,
    title: "Tiramisù",
    subtitle: "Dessert",
    description: "Our interpretation of the Italian classic. Mascarpone cream, espresso, and cocoa.",
    price: "€55",
  },
];

const Index = () => {
  return (
    <main>
      <HeroSection />
      {dishes.map((dish, i) => (
        <DishSection key={dish.title} {...dish} index={i} reverse={i % 2 === 1} />
      ))}
      <LocationSection />
      <ReservationSection />
    </main>
  );
};

export default Index;
