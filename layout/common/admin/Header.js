import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import store from "store";

import AdminSidebar from "./Sidebar";
import showNotification from "@/helpers/show_notification";
import { useRouter } from "next/router";
import { APPCONST } from "@/store/constant/globalVar";
import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

export default function AdminHeader(props) {
  const userInfo = useSelector((state) => state.userData.userDetails);

  const router = useRouter();

  function logout() {
    localStorage.removeItem(APPCONST.AccessToken);
    showNotification("Logout successfully", "Success");
    router.push("/admin");
  }

  return (
    <>
      <Head>
        <meta name="description" content="Kindness Campaign" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props?.title}</title>
      </Head>

      <header role="banner">
        <div className="admin_heading">Admin Dashboard</div>

        <ul
          className="utilities"
          style={{
            display: "block ruby",
            listStyle: "none",
            justifyContent: "center",
          }}
        >
          <li className="users">
            <Link href="#">{userInfo ? userInfo?.name : ""}</Link>
          </li>
          <li onClick={logout} className="logout warn">
            <Link href="#">Log Out</Link>
          </li>
        </ul>
      </header>

      <AdminSidebar />
    </>
  );
}
