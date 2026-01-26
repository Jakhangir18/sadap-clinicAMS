"use client";

import { useState, useEffect } from "react";
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

    fetchDoctor();
    
    // Обновляем данные при фокусе на странице
    const handleFocus = () => {
      console.log("Doctor page focused - refreshing");
      fetchDoctor();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [slug]);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains(styles.certificateModal)) {
      setSelectedCertificate(null);
    }
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
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          ← Назад
        </button>
      </div>

      <div className={styles.doctorContent}>
        <div className={styles.doctorLeftSection}>
          <div className={styles.doctorImageWrapper}>
            <Image
              src={doctor.avatar_url ? `${doctor.avatar_url}?t=${Date.now()}` : '/doctor.png'}
              alt={doctor.full_name}
              width={320}
              height={400}
              className={styles.doctorImage}
              unoptimized={true}
            />
          </div>

          <div className={styles.doctorMainInfo}>
            <h2 className={styles.doctorName}>{doctor.full_name}</h2>
            <p className={styles.doctorPosition}>{doctor.specialization_title}</p>
            {doctor.rating > 0 && (
              <div className={styles.doctorRating}>
                {"★".repeat(doctor.rating)}
                {"☆".repeat(5 - doctor.rating)}
              </div>
            )}
          </div>
        </div>

        <div className={styles.doctorRightSection}>
          {doctor.education_text && (
            <div className={styles.doctorAdditionalInfo}>
              <h3>Образование</h3>
              <p>{doctor.education_text}</p>
            </div>
          )}

          {doctor.experience_years > 0 && (
            <div className={styles.doctorAdditionalInfo}>
              <h3>Стаж</h3>
              <p>{doctor.experience_years} лет опыта</p>
            </div>
          )}

          {doctor.working_hours_text && (
            <div className={styles.doctorAdditionalInfo}>
              <h3>Время приема</h3>
              <p>{doctor.working_hours_text}</p>
            </div>
          )}

          {directions.length > 0 && (
            <div className={styles.doctorAdditionalInfo}>
              <h3>Направления</h3>
              <ul className={styles.directionsList}>
                {directions.map((direction, index) => (
                  <li key={index}>{direction}</li>
                ))}
              </ul>
            </div>
          )}

          {diseaseTags.length > 0 && (
            <div className={styles.doctorAdditionalInfo}>
              <h3>Специализация по заболеваниям</h3>
              <div className={styles.diseaseTags}>
                {diseaseTags.map((tag, index) => (
                  <span key={index} className={styles.diseaseTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {certificates.length > 0 && (
            <div className={styles.doctorCertificates}>
              <h3>Сертификаты</h3>
              <div className={styles.certificatesGrid}>
                {certificates.map((cert, index) => (
                  <div
                    key={index}
                    className={styles.certificateItem}
                    onClick={() => setSelectedCertificate(cert.url)}
                  >
                    <Image
                      src={cert.url}
                      alt={cert.title || `Сертификат ${index + 1}`}
                      width={150}
                      height={200}
                      className={styles.certificateImage}
                    />
                    {cert.title && <p className={styles.certificateTitle}>{cert.title}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.appointmentSection}>
        <h3>Записаться на прием</h3>
        <button
          onClick={() => router.push("/appointments")}
          className={styles.appointmentButton}
        >
          Записаться
        </button>
      </div>

      {selectedCertificate && (
        <div className={styles.certificateModal} onClick={handleBackdropClick}>
          <div className={styles.certificateModalContent}>
            <button
              className={styles.certificateCloseButton}
              onClick={() => setSelectedCertificate(null)}
            >
              ✕
            </button>
            <Image
              src={selectedCertificate}
              alt="Сертификат"
              width={800}
              height={1000}
              className={styles.certificateFullImage}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

