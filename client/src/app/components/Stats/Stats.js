import styles from "./Stats.module.css";
import Image from "next/image";

const statsData = [
  {
    number: "10,000+",
    text: "клиентам мы оказали помощь",
    icon: "/clients.png"
  },
  {
    number: "97%",
    text: "наших клиентов реккоммендуют нас",
    icon: "/like.png"
  },
  {
    number: "30+",
    text: "удовлетворения потребностей клиентов",
    icon: "/satisfied.png"
  }
];

const Stats = () => {
  return (
    <section className={styles.stats}>
      <div className={styles.statsContainer}>
        {statsData.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon}>
              <Image
                src={stat.icon}
                alt=""
                width={64}
                height={54}
                className={styles.statImage}
              />
            </div>
            <h3 className={styles.statNumber}>{stat.number}</h3>
            <p className={styles.statText}>{stat.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stats

