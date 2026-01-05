"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header/Header";

// Данные врача (в реальном приложении будут приходить с сервера)
const doctorData = {
  name: "Ахметов Айдар Серикович",
  position: "Врач-эндоскопист, заведующий отделением-врач-эндоскопист",
  education: "Выпускник 1980 года Московский Медицинский Институт",
  experience: "10+ лет опыта",
  avatar: "/services/doctor.png",
  rating: 5,
  certificates: [
    "/certificate1.png",
    "/certificate2.png",
    "/certificate3.png"
  ]
};

const reviewsData = [
  {
    name: "Арнау Жупарбеков",
    text: "Отличная клиника!!! Пришел по рекомендациям друзей и знакомых, не жалею, высокое качество обслуживания! Их методика лечения отличается от других!",
    avatar: "/arnau.png",
    rating: 5
  },
  {
    name: "Кайсар Калибаев",
    text: "Я доволен! Самое лучшее место для медицинского обслуживания в Актау!!! Очень удобное расположение, посещаю после работы, персонал профессиональный, врачи опытные!!! СПАСИБО!",
    avatar: "/kaysar.png",
    rating: 5
  }
];

const DoctorDetailPage = () => {
  const params = useParams();
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Закрытие попапа по ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSelectedCertificate(null);
      }
    };

    if (selectedCertificate) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedCertificate]);

  const openCertificate = (certSrc) => {
    setSelectedCertificate(certSrc);
  };

  const closeCertificate = () => {
    setSelectedCertificate(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCertificate();
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header 
        navItems={["Записаться на прием", "Выбрать врача", "Личный кабинет"]}
        showAccountButton={false}
        fixed={true}
      />

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Page Title */}
          <h1 className={styles.pageTitle}>Подробнее о враче</h1>

          {/* Doctor Info Card */}
          <div className={styles.doctorCard}>
            <div className={styles.doctorMainInfo}>
              <div className={styles.doctorLeftSection}>
                <div className={styles.doctorAvatar}>
                  <Image
                    src={doctorData.avatar}
                    alt={doctorData.name}
                    width={129}
                    height={145}
                    className={styles.avatarImage}
                  />
                </div>

                <div className={styles.doctorDetails}>
                  <h2 className={styles.doctorName}>{doctorData.name}</h2>
                  <p className={styles.doctorPosition}>{doctorData.position}</p>

                  <div className={styles.doctorRating}>
                    {[...Array(doctorData.rating)].map((_, i) => (
                      <span key={i} className={styles.star}>★</span>
                    ))}
                  </div>

                  <button className={styles.appointmentButton}>
                    <span className={styles.appointmentText}>Записаться на прием</span>
                  </button>
                </div>
              </div>

              <div className={styles.doctorAdditionalInfo}>
                <div className={styles.infoBlock}>
                  <h3 className={styles.infoTitle}>Образование</h3>
                  <p className={styles.infoText}>{doctorData.education}</p>
                </div>

                <div className={styles.infoBlock}>
                  <h3 className={styles.infoTitle}>Стаж</h3>
                  <p className={styles.infoText}>{doctorData.experience}</p>
                </div>

                <div className={styles.infoBlock}>
                  <h3 className={styles.infoTitle}>Сертификаты и лицензии</h3>
                  <div className={styles.certificatesGrid}>
                    {doctorData.certificates.map((cert, index) => (
                      <div
                        key={index}
                        className={styles.certificateItem}
                        onClick={() => openCertificate(cert)}
                      >
                        <Image
                          src={cert}
                          alt={`Сертификат ${index + 1}`}
                          width={107}
                          height={153}
                          className={styles.certificateImage}
                        />
                      </div>
                    ))}
                  </div>
                  <p className={styles.certificateNote}>
                    Нажмите на сертификат чтобы увидеть подробнее
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className={styles.reviewsCard}>
            <h2 className={styles.reviewsTitle}>Отзывы</h2>

            <div className={styles.reviewsContent}>
              <div className={styles.videoContainer}>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/4dtV3iF4MPg"
                  title="Отзыв о клинике"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={styles.videoIframe}
                ></iframe>
              </div>

              <div className={styles.reviewsGrid}>
                {reviewsData.map((review, index) => (
                  <div key={index} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewAvatar}>
                        <Image
                          src={review.avatar}
                          alt={review.name}
                          width={50}
                          height={50}
                          className={styles.reviewAvatarImage}
                        />
                      </div>
                      <div className={styles.reviewInfo}>
                        <h3 className={styles.reviewName}>{review.name}</h3>
                        <div className={styles.reviewRating}>
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} className={styles.reviewStar}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className={styles.reviewText}>"{review.text}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className={styles.scrollbarContainer}>
              <div className={styles.scrollbar}></div>
            </div> */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <Image
              src="/logo.png"
              alt="Sadap Clinic"
              width={120}
              height={40}
              className={styles.footerLogo}
            />
            <p className={styles.footerTagline}>Радость. Здоровье. Успех!</p>

            <button className={styles.feedbackButton}>
              Обратная связь
            </button>
          </div>

          <div className={styles.footerRight}>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Записаться на прием</a>
              <a href="#" className={styles.footerLink}>Выбрать врача</a>
              <a href="#" className={styles.footerLink}>Личный кабинет</a>
              <a href="#" className={styles.footerLink}>Расположение</a>
            </div>

            <div className={styles.footerContacts}>
              <a href="tel:+77023012796" className={styles.contactItem}>
                <Image
                  src="/phone.png"
                  alt="Phone"
                  width={24}
                  height={24}
                  className={styles.contactIcon}
                />
                <span className={styles.contactItemText}>+7 702 301 2796</span>
              </a>

              <a href="https://instagram.com/sadapclinic_kz" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                <Image
                  src="/instagram.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className={styles.contactIcon}
                />
                <span className={styles.contactItemText}>@sadapclinic_kz</span>
              </a>

              <a href="mailto:support@sadapclinic.kz" className={styles.contactItem}>
                <Image
                  src="/mail.png"
                  alt="Email"
                  width={24}
                  height={24}
                  className={styles.contactIcon}
                />
                <span className={styles.contactItemText}>support@sadapclinic.kz</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Certificate Popup */}
      {selectedCertificate && (
        <div
          className={styles.popupOverlay}
          onClick={handleBackdropClick}
        >
          <div className={styles.popupContent}>
            <button
              className={styles.popupClose}
              onClick={closeCertificate}
              aria-label="Закрыть"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className={styles.popupImageContainer}>
              <Image
                src={selectedCertificate}
                alt="Сертификат"
                width={800}
                height={1200}
                className={styles.popupImage}
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetailPage;

