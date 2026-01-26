"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Footer from "@/app/components/Footer/Footer";
import styles from "./page.module.css";

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const reviews = useMemo(
    () => [
      {
        name: "Арнау Жупарбеков",
        text:
          "Отличная клиника!!! Пришел по рекомендациям друзей и знакомых, не жалею, высокое качество обслуживания! Их методика лечения отличается от других!",
        rating: 5,
        color: "#5a50ff",
        avatar: null,
      },
      {
        name: "Кайсар Калибаев",
        text:
          "Я доволен! Самое лучшее место для медицинского обслуживания в Актау!!! Очень удобное расположение, посещаю после работы, персонал профессиональный, врачи опытные!! СПАСИБО!",
        rating: 5,
        color: "#4da8ff",
        avatar: null,
      },
    ],
    []
  );

  useEffect(() => {
    if (!slug) return;

    const fetchDoctor = async () => {
      try {
        const { data, error } = await supabase
          .from("doctors")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .maybeSingle();

        if (error) {
          console.error("Ошибка загрузки врача:", error);
          setLoading(false);
          return;
        }

        if (!data) {
          console.log("Врач не найден");
          setLoading(false);
          return;
        }

        setDoctor(data);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка:", err);
        setLoading(false);
      }
    };

    // Загружаем данные только при монтировании/смене slug
    fetchDoctor();
  }, [slug]);

  const ratingValue = useMemo(() => {
    const r = Number(doctor?.rating || 0);
    return Number.isFinite(r) ? Math.min(5, Math.max(0, r)) : 0;
  }, [doctor]);

  const StarRating = ({ value }) => {
    const pct = (Math.max(0, Math.min(5, Number(value))) / 5) * 100;
    return (
      <div className={styles.doctorRating} style={{ position: 'relative', display: 'inline-block', lineHeight: 1 }}>
        <div aria-hidden style={{ color: '#e2e8f0' }}>★★★★★</div>
        <div aria-hidden style={{ color: '#ffa800', position: 'absolute', top: 0, left: 0, width: pct + '%', overflow: 'hidden', whiteSpace: 'nowrap' }}>★★★★★</div>
        <span style={{ marginLeft: 8, fontWeight: 700, color: '#0c3465', fontSize: 14 }}>{value}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка...</div>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Врач не найден</h2>
          <button onClick={() => router.push("/doctors")} className={styles.backButton}>
            Вернуться к списку врачей
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Подготовка данных
  const directions = Array.isArray(doctor.directions) ? doctor.directions : [];
  const diseaseTags = Array.isArray(doctor.disease_tags) ? doctor.disease_tags : [];
  const certificates = Array.isArray(doctor.certificates) ? doctor.certificates : [];

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <div className={styles.container}>
          <button onClick={() => router.back()} className={styles.backButton}>← Назад</button>
          <h1 className={styles.pageTitle}>Подробнее о враче</h1>

          <section className={styles.doctorCard}>
            <div className={styles.doctorMainInfo}>
              {/* Left */}
              <div className={styles.doctorLeftSection}>
                <div className={styles.doctorAvatar}>
                  <Image
                    src={doctor.avatar_url ? `${doctor.avatar_url}?t=${Date.now()}` : '/doctor.png'}
                    alt={doctor.full_name}
                    width={129}
                    height={145}
                    className={styles.avatarImage}
                    unoptimized={true}
                  />
                </div>

                <div className={styles.doctorDetails}>
                  <h2 className={styles.doctorName}>{doctor.full_name}</h2>
                  <p className={styles.doctorPosition}>{doctor.specialization_title}</p>
                  {ratingValue > 0 && <StarRating value={ratingValue} />}
                  <button onClick={() => router.push('/appointments')} className={styles.appointmentButton}>
                    <span className={styles.appointmentText}>Записаться на прием</span>
                  </button>
                </div>
              </div>

              {/* Right */}
              <div className={styles.doctorAdditionalInfo}>
                {doctor.education_text && (
                  <div className={styles.infoBlock}>
                    <h3 className={styles.infoTitle}>Образование</h3>
                    <p className={styles.infoText}>{doctor.education_text}</p>
                  </div>
                )}

                {doctor.experience_years > 0 && (
                  <div className={styles.infoBlock}>
                    <h3 className={styles.infoTitle}>Стаж</h3>
                    <p className={styles.infoText}>{doctor.experience_years}+ лет опыта</p>
                  </div>
                )}

                {doctor.working_hours_text && (
                  <div className={styles.infoBlock}>
                    <h3 className={styles.infoTitle}>Время приема</h3>
                    <p className={styles.infoText}>{doctor.working_hours_text}</p>
                  </div>
                )}

                {directions.length > 0 && (
                  <div className={styles.infoBlock}>
                    <h3 className={styles.infoTitle}>Направления</h3>
                    <ul className={styles.listText} style={{ margin: 0 }}>
                      {directions.map((direction, index) => (
                        <li key={index}>{direction}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {diseaseTags.length > 0 && (
                  <div className={styles.infoBlock}>
                    <h3 className={styles.infoTitle}>Специализация по заболеваниям</h3>
                    <div className={styles.tagsRow}>
                      {diseaseTags.map((tag, index) => (
                        <span key={index} className={styles.tagBadge}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {certificates.length > 0 && (
                  <div className={styles.infoBlock}>
                    <h3 className={styles.infoTitle}>Сертификаты и лицензии</h3>
                    <div className={styles.certificatesGrid}>
                      {certificates.map((cert, index) => (
                        <div key={index} className={styles.certificateItem} onClick={() => setSelectedCertificate(cert.url)}>
                          <Image src={cert.url} alt={cert.title || `Сертификат ${index + 1}`} width={107} height={153} className={styles.certificateImage} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className={styles.reviewsCard} style={{ marginTop: 40 }}>
            <h3 className={styles.reviewsTitle}>Отзывы</h3>
            <div className={styles.reviewsContent}>
              <div className={styles.videoContainer}>
                <iframe
                  className={styles.videoIframe}
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/4dtV3iF4MPg"
                  title="Рекламный ролик клиники"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              <div className={styles.reviewsGrid}>
                {reviews.map((review, idx) => (
                  <div key={idx} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewAvatar} style={{ background: review.color }}>
                        <span style={{ color: '#fff', fontWeight: 700, display: 'block', textAlign: 'center', lineHeight: '50px' }}>
                          {review.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className={styles.reviewInfo}>
                        <p className={styles.reviewName}>{review.name}</p>
                        <div className={styles.reviewRating}>
                          {Array.from({ length: review.rating || 0 }).map((_, i) => (
                            <span key={i} className={styles.reviewStar}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className={styles.reviewText}>“{review.text}”</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.scrollbarContainer} aria-hidden>
              <div className={styles.scrollbar}></div>
            </div>
          </section>
        </div>
      </main>

      {selectedCertificate && (
        <div className={styles.popupOverlay} onClick={() => setSelectedCertificate(null)}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.popupClose} onClick={() => setSelectedCertificate(null)}>✕</button>
            <div className={styles.popupImageContainer}>
              <Image src={selectedCertificate} alt="Сертификат" width={800} height={1000} className={styles.popupImage} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

