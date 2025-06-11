import { Header } from "components";

const Trips = () => {
  return (
    <main className="wrapper dashboard">
      <Header
        title={"Trips"}
        description={"View and edit AI-generated travel plans"}
        ctaText={"Create Trip"}
        ctaUrl={"/trips/create"}
      />
    </main>
  );
};

export default Trips;
