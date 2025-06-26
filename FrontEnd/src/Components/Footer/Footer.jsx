
import React from "react";
import classes from "./Footer.module.css";
import { LuFacebook } from "react-icons/lu";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import img1 from "../../assets/evangadi-logo-footer.png";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer>
      <section className={classes.footer_outer_container}>
        <div className={classes.footer_inner_container}>
          <div className={classes.first_section}>
            <ul>
              <div className={classes.logo_wrapper}>
                <li>
                  <Link to="/">
                    <img src={img1} alt="logo" />
                  </Link>
                </li>
              </div>

              <div className={classes.footer_icons}>
                <li>
                  <Link
                    to="https://www.facebook.com/evangaditech"
                    target="_blank"
                  >
                    <LuFacebook />
                  </Link>
                </li>
                <li>
                  <Link
                    to="https://www.instagram.com/evangaditech/"
                    target="_blank"
                  >
                    <FaInstagram />
                  </Link>
                </li>
                <li>
                  <Link
                    to="https://www.youtube.com/@EvangadiTech"
                    target="_blank"
                  >
                    <AiOutlineYoutube />
                  </Link>
                </li>
              </div>
            </ul>
          </div>

          <div className={classes.second_section}>
            <ul>

              <h3>Useful Links</h3>

              <div
                className={classes.lists}
              >
                <li>
                  <Link to="https://www.evangadi.com/legal/privacy/">
                    privacy policies
                  </Link>
                </li>
                <li>
                  <Link to="https://evangadi.com/legal/terms">
                    terms of service
                  </Link>
                </li>
                <li>
                  <Link to="https://tutoring.evangadi.com/privacy">
                    Privacy policy
                  </Link>
                </li>
              </div>
            </ul>
          </div>
          <div className={classes.third_section}>
            <ul>
              <h3>contact info</h3>
              <div className={classes.lists}>
                <li>
                  <Link to="https://evangadi.com/">evangadi networks</Link>
                </li>
                <li> support@evangadi.com</li>
                <li>+1-202-386-2702</li>
              </div>
            </ul>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;

