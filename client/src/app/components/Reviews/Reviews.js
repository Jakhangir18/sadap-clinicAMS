import styles from "./Reviews.module.css";
import Image from "next/image";

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

const Reviews = () => {
  return (
    <section className={styles.reviews}>
      <div className={styles.reviewsContainer}>
        <div className={styles.reviewsHeader}>
          <h2 className={styles.reviewsTitle}>Отзывы</h2>
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

        {/* <div className={styles.reviewsNavigation}>
          <div className={styles.scrollbar}></div>
        </div> */}
      </div>
    </section>
  )
}

export default Reviews

