import Image from "next/image";

import FeaturedProducts from "./_components/FeaturedProducts/FeaturedProducts";
import Slider from "./_components/Slider/Slider";
import HeaderComponent from "./_components/HomeCategories/HomeCategories";
import img1 from "../assets/pictures/home-slider-1.d79601a8.png";
import img2 from "../assets/pictures/home-slider-1.d79601a8.png";
import img3 from "../assets/pictures/home-slider-1.d79601a8.png";

import Newsletter from "./_components/Newsletter/Newsletter";
import DealBanners from "./_components/DealBanners/DealBanners";
import FeaturesUP from "./_components/FeaturesUP/FeaturesUP";

export default function Home() {
  return (
    <>
      <Slider
        slides={[
          {
            image: img1.src,
            title: "Fresh Products Delivered to your Door",
            subtitle: "Get 20% off your first order",
            primaryBtn: "Shop Now",
            secondaryBtn: "View Deals",
            primaryHref: "/products",
            secondaryHref: "/deals",
            primaryText: "text-green-500",
          },
          {
            image: img2.src,
            title: "Premium Quality Guaranteed",
            subtitle: "Fresh from farm to your table",
            primaryBtn: "Shop Now",
            secondaryBtn: "Learn More",
            primaryHref: "/products",
            secondaryHref: "/about",
            primaryText: "text-blue-500",
          },
          {
            image: img3.src,
            title: "Fast & Free Delivery",
            subtitle: "Same day delivery available",
            primaryBtn: "Order Now",
            secondaryBtn: "Delivery Info",
            primaryHref: "/products",
            secondaryHref: "/delivery",
            primaryText: "text-purple-500",
          },
        ]}
      />

      <FeaturesUP />
      <HeaderComponent />

      <DealBanners />
      <FeaturedProducts />
      <Newsletter />
    </>
  );
}
