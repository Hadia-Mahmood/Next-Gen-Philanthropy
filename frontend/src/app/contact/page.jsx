import Action from "@/components/Complain/Action";
import ContactForm from "@/components/Contact/ContactForm";
import Hero from "@/components/Shared/Hero";

const page = () => {
  return (
    <div>
      <Hero title="Contact Us" bgImage="/about/about__hero.jpg" />
      <div className="my-12 sm:my-20 lg:my-32 mx-4 sm:mx-10 bg-[#fff]  flex justify-center items-stretch gap-10">
        <Action />
        <ContactForm />
      </div>
    </div>
  );
};

export default page;
