"use client";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header/Header";

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

const ReviewsPage = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header 
        navItems={["Главная", "Услуги", "Врачи", "О нас"]}
        showAccountButton={true}
        fixed={true}
      />

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Reviews Section */}
          <div className={styles.reviewsHeader}>
            <h1 className={styles.reviewsTitle}>Отзывы</h1>
            <p className={styles.reviewsSubtitle}>Здесь вы можете прочесть отзывы о нашей клинике.</p>
          </div>

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
                <div key={index} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewAvatar}>
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        width={50}
                        height={50}
                        className={styles.avatarImage}
                      />
                    </div>
                    <div className={styles.reviewInfo}>
                      <h3 className={styles.reviewName}>{review.name}</h3>
                      <div className={styles.reviewRating}>
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className={styles.star}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className={styles.reviewText}>"{review.text}"</p>
                </div>
              ))}
            </div>
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
            <p className={styles.footerCopyright}>Все права защищены, 2024.</p>
          </div>

          <div className={styles.footerRight}>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Услуги</a>
              <a href="#" className={styles.footerLink}>Врачи</a>
              <a href="#" className={styles.footerLink}>Отзывы</a>
              <a href="#" className={styles.footerLink}>О нас</a>
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
    </div>
  );
};

export default ReviewsPage;

