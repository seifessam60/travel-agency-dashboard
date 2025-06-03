import React from "react";
import { Outlet } from "react-router";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      MobileSidebar
      <aside className="hidden lg:block w-full max-w-[270px]">Sidebar</aside>
      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};

export default AdminLayout;
