import { useNavigate } from "react-router-dom";
import Header from "./Header";
import styles from "./Hero.module.css";
import { useUser } from "../contexts/UserContext";
import { customToast } from "../utils/customToast";
import { useEffect, useState } from "react";

export default function Hero() {
  const navigate = useNavigate();
  const {user, updateName} = useUser();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user?.name) {
      setUsername(user.name);
    }
  }, [user, navigate]);

  const handleRedirect = (e) => {
    e.preventDefault();

    if (!username) {
      customToast.error("Please enter your name to get started!");
      return;
    }

    updateName(username);
    customToast.success(`Welcome, ${username}. You can try the app now!`);
    navigate("/app");
  };

  return (
    <div className={styles.MainContainer}>
      <Header />
      <div className={styles.HeroContainer}>
        <h1 className={styles.HeroHeading}>
          Timewell Helps You Become More Efficient At Your Tasks
        </h1>
        <p className={styles.HeroParagraph}>
          Timewell is an intuitive productivity app designed to help you manage
          tasks more effectively. It's the ultimate time management tool you wished you had. Get
          started by entering your name, and let Timewell assist you in
          completing tasks efficiently and staying organized. Try our app now.
        </p>
        <form id="user" className={styles.HeroForm}>
          <input
            type="text"
            id="username"
            placeholder="Enter your name"
            maxLength="20"
            minLength="3"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="on"
          />
          <button type="button" onClick={handleRedirect}>
            {user?.name ? "Go Back" : "Get Started"}
          </button>
        </form>
        <div className={styles.customers}>
          <div className={styles.CustomersImage}>
            <img src="https://i.pravatar.cc/300?img=12" alt="Customer 1" />
            <img src="https://i.pravatar.cc/300?img=10" alt="Customer 2" />
            <img src="https://i.pravatar.cc/300?img=16" alt="Customer 3" />
            <img src="https://i.pravatar.cc/300?img=65" alt="Customer 4" />
            <img src="https://i.pravatar.cc/300?img=5" alt="Customer 5" />
          </div>
          <p>Loved By Thousands Of People!</p>
        </div>
      </div>
    </div>
  );
}
