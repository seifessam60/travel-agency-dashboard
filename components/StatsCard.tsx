import { calculateTrendPercentage, cn } from "~/lib/utils";

const StatsCard = ({
  headerTitle,
  total,
  lastMonthCount,
  currentMonthCount,
}: StatsCard) => {
  const { trend, percentage } = calculateTrendPercentage(
    currentMonthCount,
    lastMonthCount
  );
  const isDecrement = trend === "decrement";

  return (
    <article className="stats-card">
      <h3 className="text-base font-medium">{headerTitle}</h3>
      <div className="content">
        <div className=" flex-col gap-6 flex">
          <h2 className="text-4xl font-semibold">{total}</h2>
          <div className="flex gap-2 items-center">
            <figure className="flex gap-1 items-center">
              <img
                src={`/assets/icons/${
                  isDecrement ? "arrow-down-red.svg" : "arrow-up-green.svg"
                }`}
                className="size-5"
                alt="Arrow"
              />
              <figcaption
                className={cn(
                  "text-sm font-medium",
                  isDecrement ? "text-red-500" : "text-success-700"
                )}
              >
                {Math.round(percentage)}%
              </figcaption>
            </figure>
            <p className="text-sm font-medium truncate text-gray-100">
              vs Last Month
            </p>
          </div>
        </div>
        <img
          src={`/assets/icons/${
            isDecrement ? "decrement.svg" : "increment.svg"
          }`}
          className="w-full xl:w-32 h-full md:h-32 xl:h-full"
          alt="trend-graph"
        />
      </div>
    </article>
  );
};

export default StatsCard;
