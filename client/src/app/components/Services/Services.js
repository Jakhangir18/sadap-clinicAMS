import styles from "./Services.module.css";
import Image from "next/image";

const servicesData = [
  { title: "Диагностика", image: "/services/diagnostics.png" },
  { title: "Консультации специалистов", image: "/services/consultations.png" },
  { title: "Хирургическое лечение", image: "/services/surgical-treatment.png" },
  { title: "Анализы", image: "/services/analyzes.png" },
  { title: "Услуги стационара", image: "/services/hospital.png" },
  { title: "Процедурный кабинет", image: "/services/treatment-room.png" },
  { title: "Комплексные программы", image: "/services/compex-programs.png" },
  { title: "Услуги на дому", image: "/services/home-services.png" },
  { title: "Вакцинация", image: "/services/vaccination.png" },
  { title: "Экстренная хирургическая помощь", image: "/services/mergency-surgical-care.png" },
  { title: "Скорая помощь", image: "/services/ambulance.png" },
  { title: "Лекарства", image: "/services/medicines.png" },
];

const Services = () => {
  return (
    <section className={styles.services}>
      <div className={styles.servicesContainer}>
        <h2 className={styles.servicesTitle}>Наши услуги</h2>

        <div className={styles.servicesGrid}>
          {servicesData.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              <div className={styles.serviceImageWrapper}>
                 <Image
                  src={service.image}
                  alt={service.title}

                  width={120}
                  height={110}
                  className={styles.serviceImage}
                />
                </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              
               
              
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services

