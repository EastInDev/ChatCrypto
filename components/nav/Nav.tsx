import classNames from "classnames";
import styles from "../../styles/navbar.module.css";
import Link from "next/link";

type Props = {
  navigationData: string[];
  currentRoute: string;
  setCurrentRoute: any;
};

const Nav = ({ navigationData, currentRoute, setCurrentRoute }: Props) => {
  // const onAdminClick = () => {
  //   window.location.href = "/login";
  // };

  return (
    <nav className={styles.navbar}>
      <Link href={"/"}>
        <a>
          <div className="font-bold text-2xl text-white mt-3">ChatCrypto🔐</div>
        </a>
      </Link>

      <ul className={styles.navItems}>
        {navigationData.map((item, index) => (
          <Link key={index} href={item == "home" ? "/" : `/${item}`} passHref>
            <li
              key={index}
              className={classNames([
                styles.navItem,
                currentRoute === item && styles.selectedNavItem,
              ])}
            >
              {item}
            </li>
          </Link>
        ))}
      </ul>
      <Link href={"/login"} passHref>
        <button className={styles.actions}>Admin</button>
      </Link>
    </nav>
  );
};

export default Nav;
