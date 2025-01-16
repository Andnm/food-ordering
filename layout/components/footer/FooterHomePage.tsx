import React from "react";
import { CiInstagram } from "react-icons/ci";
import {
  FaFacebook,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { IconType } from "react-icons";

interface SocialIconProps {
  Icon: IconType;
  className?: string;
}

const FooterHomePage = () => {
  return (
    <div className="footer-home-page">
      <div className="container">
        <div className="flex flex-row gap-9 justify-center items-center">
          <p className="font-semibold">Về chúng tôi</p>
          <p className="font-semibold">Dịch vụ của chúng tôi</p>
        </div>

        <div className="line my-10"></div>

        <div className="flex flex-row justify-between items-center">
          <p className="font-light">
            All rights reserved ® uifry.com | Terms and conditions apply!
          </p>
          <div className="social flex flex-row justify-between gap-4 items-center">
            <div className="item">
              <FaFacebook />
            </div>
            <div className="item">
              <CiInstagram  />
            </div>
            <div className="item">
              <FaYoutube  />
            </div>
            <div className="item">
              <FaLinkedinIn  />
            </div>
            <div className="item">
              <FaTwitter  />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterHomePage;
