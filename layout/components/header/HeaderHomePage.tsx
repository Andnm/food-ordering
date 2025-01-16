"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { ROLE_ADMIN, ROLE_USER } from "@utils/constants";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS_GENERAL } from "@utils/constants";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";
import {
  generateFallbackAvatar,
  isExpiredTimeToken,
  isExpiredTimeTokenSecondHandle,
} from "@utils/helpers";
import useSelector from "@hooks/use-selector";
import useDispatch from "@hooks/use-dispatch";
import { deleteUser, setUserProfile } from "@slices/user";
import user from "@services/user";
import { clearCart, selectCartItemsCount } from "@slices/cart";
import { Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const HeaderHomePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const cartItemsCount = useSelector(selectCartItemsCount);

  const pathName = usePathname();

  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session) {
        try {
          const userProfile = await user.getUserProfile(session.user.token);
          dispatch(setUserProfile(userProfile));
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [session, dispatch]);

  const getNavItems = () => {
    return NAV_ITEMS_GENERAL;
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {getNavItems().map((item, index) => (
        <p className="p-1 nav-items items-center font-bold" key={index}>
          <Link
            href={item?.path}
            className={`flex items-center text-center ${
              pathName === item?.path ? "active" : ""
            }`}
          >
            {item?.nameItem}
          </Link>
        </p>
      ))}
    </ul>
  );

  return (
    <div className="top-0 z-10 h-max max-w-full border-0 rounded-none px-4 py-2 lg:px-8 lg:py-3">
      <div className="container general-header-container ">
        <div className="flex items-center justify-between text-white px-5 py-2">
          <Link
            href="/"
            className="mr-4 cursor-pointer py-1.5 font-medium brand-name flex items-center gap-2"
          >
            <Image
              src="/images/logo.png"
              width={150}
              height={80}
              alt="logo"
              loading="lazy"
            />
          </Link>

          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
          </div>

          {session ? (
            <div className="profile-section flex flex-row gap-2 items-center">
              <Badge count={cartItemsCount} size="small">
                <Link href="/cart">
                  <ShoppingCartOutlined
                    className="text-2xl cursor-pointer hover:text-red-500"
                    style={{ color: "#fbf4e2" }}
                  />
                </Link>
              </Badge>

              <div
                className="flex flex-row gap-2 items-center avatar-name-section p-2 ml-3"
                onClick={() => router.push("/account")}
              >
                <img
                  src={
                    userData?.avatar_url === null ||
                    userData?.avatar_url === undefined ||
                    userData?.avatar_url === ""
                      ? generateFallbackAvatar(userData?.email!)
                      : userData?.avatar_url
                  }
                  alt="avatar"
                  loading="lazy"
                  className="bg-gray-200 overflow-hidden"
                />

                <p className="name text-center" style={{ maxWidth: "150px" }}>
                  {userData.name}
                </p>
              </div>
              <BiLogOut
                onClick={() => {
                  dispatch(deleteUser);
                  dispatch(clearCart);
                  signOut({
                    callbackUrl: `${process.env.NEXT_PUBLIC_CALLBACK_URL}`,
                  });
                }}
                className="logout-icon w-5 h-5 cursor-pointer"
              />
            </div>
          ) : (
            <div>
              <button
                className="hidden lg:inline-block btn-login cursor-pointer"
                onClick={() => {
                  router.push("/login");
                }}
              >
                <p className="font-medium">Sign in</p>
              </button>

              <button
                className="hidden lg:inline-block btn-login btn-register cursor-pointer ml-4"
                onClick={() => {
                  router.push("/register");
                }}
              >
                <p className="font-medium">Register</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderHomePage;
