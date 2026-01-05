"use client";
import { useState, useEffect } from "react";
import styles from "./Doctors.module.css";
import Image from "next/image";
import Link from "next/link";

const doctorsData = [
  {
    name: "Ахметов Айдар Серикович",
    position: "Врач-эндоскопист, заведующий отделением-врач-эндоскопист",
    avatar: "/services/doctor.png",
  },
  {
    name: "Каримова Асель Болатовна",
    position: "Врач-терапевт высшей категории",
    avatar: "/services/doctor.png",
  },
  {
    name: "Нурланов Ерлан Маратович",
    position: "Врач-хирург, кандидат медицинских наук",
    avatar: "/services/doctor.png",
  },
  {
    name: "Жумабаева Гульнара Сериковна",
    position: "Врач-гинеколог высшей категории",
    avatar: "/services/doctor.png",
  },
  {
    name: "Турсунов Бахтияр Асылбекович",
    position: "Врач-кардиолог, доктор медицинских наук",
    avatar: "/services/doctor.png",
  },
  {
    name: "Сагындыкова Айгуль Мухтаровна",
    position: "Врач-педиатр высшей категории",
    avatar: "/services/doctor.png",
  },
  {
    name: "Алимов Ерлан Жанатович",
    position: "Врач-невролог, кандидат медицинских наук",
    avatar: "/services/doctor.png",
  },
];

const Doctors = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // определяем, мобилка или нет
  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 768);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // по 3 врача на десктопе и по 1 на мобилке
  const doctorsPerSlide = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(doctorsData.length / doctorsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const visibleDoctors = doctorsData.slice(
    currentSlide * doctorsPerSlide,
    (currentSlide + 1) * doctorsPerSlide
  );

  return (
    <section className={styles.doctors}>
      <div className={styles.doctorsContainer}>
        <div className={styles.doctorsHeader}>
          <h2 className={styles.doctorsTitle}>Наши врачи</h2>
          <p className={styles.doctorsSubtitle}>Наши врачи - наша гордость!</p>
        </div>

        <div className={styles.sliderWrapper}>
          <button
            className={`${styles.sliderButton} ${styles.sliderButtonPrev}`}
            onClick={prevSlide}
            aria-label="Предыдущий слайд"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className={styles.doctorsGrid}>
            {visibleDoctors.map((doctor, index) => (
              <div
                key={currentSlide * doctorsPerSlide + index}
                className={styles.doctorCard}
              >
                <div className={styles.doctorAvatar}>
                  <Image
                    src={doctor.avatar}
                    alt={doctor.name}
                    width={143}
                    height={169}
                    className={styles.doctorImage}
                  />
                </div>
                <h3 className={styles.doctorName}>{doctor.name}</h3>
                <p className={styles.doctorPosition}>{doctor.position}</p>

                <button className={styles.appointmentButton}>
                  <span className={styles.buttonText}>Записаться</span>
                  <span className={styles.buttonIcon}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            ))}
          </div>

          <button
            className={`${styles.sliderButton} ${styles.sliderButtonNext}`}
            onClick={nextSlide}
            aria-label="Следующий слайд"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.pagination}>
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              className={`${styles.paginationDot} ${
                index === currentSlide ? styles.paginationDotActive : ""
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>

        <Link href="/doctors" className={styles.viewAllButton}>
          <span className={styles.viewAllText}>ПОСМОТРЕТЬ ВСЕХ ВРАЧЕЙ</span>
        </Link>
      </div>
    </section>
  );
};

export default Doctors;
