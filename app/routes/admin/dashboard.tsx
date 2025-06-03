import { Header, StatsCard, TripCard } from "components";
import { allTrips, dashboardStats, user } from "~/constants";

const { totalUsers, userJoined, totalTrips, tripsCreated, userRole } =
  dashboardStats;
const Dashboard = () => {
  return (
    <main className="wrapper dashboard">
      <Header
        title={`Welcome ${user?.name ?? "Guest"} 👋`}
        description={
          "Track activity, trends and popular destinations in real time"
        }
      />
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle="Total Users"
            total={totalUsers}
            lastMonthCount={userJoined.lastMonth}
            currentMonthCount={userJoined.currentMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={totalTrips}
            lastMonthCount={tripsCreated.lastMonth}
            currentMonthCount={tripsCreated.currentMonth}
          />
          <StatsCard
            headerTitle="Active Users"
            total={userRole.total}
            lastMonthCount={userRole.lastMonth}
            currentMonthCount={userRole.currentMonth}
          />
        </div>
      </section>
      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
        <div className="trip-grid">
          {allTrips
            .slice(0, 4)
            .map(({ id, name, estimatedPrice, imageUrls, itinerary, tags }) => (
              <TripCard key={id} id={id.toString()} name={name} imageUrl={imageUrls[0]} location={itinerary?.[0]?.location ?? ''} tags={tags} price={estimatedPrice}/>
            ))}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
