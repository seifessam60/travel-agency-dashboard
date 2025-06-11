import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/auth";
import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
  const user = useLoaderData();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser();
    navigate("/sign-in");
  };
  return (
    <section className="nav-items">
      <Link to={"/"} className="link-logo">
        <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
        <h1>Tourvisto</h1>
      </Link>
      <div className="container">
        <nav>
          {sidebarItems.map(({ id, icon, href, label }) => (
            <NavLink to={href} key={id}>
              {({ isActive }: { isActive: boolean }) => (
                <div
                  className={cn(
                    "nav-item group",
                    isActive && "!text-white bg-primary-100"
                  )}
                  onClick={handleClick}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={cn(
                      `group-hover:invert group-hover:brightness-0 size-0 ${
                        isActive ? "invert brightness-0" : "text-dark-200"
                      }`
                    )}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        <footer className="nav-footer">
          <img
            src={user?.imageUrl || "/assets/images/david.webp"}
            alt={user?.name || "User"}
            referrerPolicy="no-referrer"
          />
          <article>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </article>
          <button
            onClick={handleLogout}
            type="button"
            className="cursor-pointer"
          >
            <img
              src={"/assets/icons/logout.svg"}
              alt="logout"
              className="size-6"
            />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;
