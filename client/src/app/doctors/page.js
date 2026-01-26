"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { supabase } from "@/lib/supabase";

// Специальности для фильтра
const specialties = [
  "Педиатр",
  "Кардиолог",
  "Гинеколог",
  "Терапевт",
  "Невролог",
  "Эндокринолог",
  "Хирург",
  "Дерматолог"
];

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Загружаем список только при первом монтировании.
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      console.log("fetchDoctors: start");

      const timeout = setTimeout(() => {
        console.warn("fetchDoctors: timeout 6s, forcing stop");
        setLoading(false);
        setErrorMessage("Не удалось загрузить врачей: таймаут запроса");
      }, 6000);

      const { data, error } = await supabase
        .from("doctors")
        .select("id, full_name, specialization_title, avatar_url, slug, is_published")
        .eq("is_published", true)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("full_name", { ascending: true });

      console.log("Supabase doctors response:", { data, error });

      if (error) {
        console.error("Supabase error:", error);
        clearTimeout(timeout);
        throw error;
      }

      const mapped = Array.isArray(data)
        ? data.map((d) => {
            const avatar = typeof d?.avatar_url === "string" && d.avatar_url.startsWith("http")
              ? d.avatar_url + `?t=${Date.now()}`  // Добавляем timestamp чтобы обойти кэш
              : "/doctor.png";

            return {
              id: d.id,
              name: d.full_name || "Без имени",
              position: d.specialization_title || "Специализация не указана",
              avatar,
              slug: d.slug || d.id,
            };
          })
        : [];

      console.log("Mapped doctors:", mapped);
      setDoctors(mapped);
      clearTimeout(timeout);
    } catch (error) {
      console.error("Ошибка загрузки врачей:", error);
      setErrorMessage(error?.message || "Не удалось загрузить врачей");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultDoctors = () => [
    {
      id: 1,
      name: "Ахметов Айдар Серикович",
      position: "Врач-эндоскопист, заведующий отделением",
      avatar: "/doctor.png",
      slug: "ahmetov-aidar"
    },
    {
      id: 2,
      name: "Жунисова Перизат Мухитдиновна",
      position: "Врач акушер-гинеколог",
      avatar: "/doctor.png",
      slug: "ahmetov-aidar-2"
    },
    {
      id: 3,
      name: "Кульнев Александр Владимирович",
      position: "Врач хирург",
      avatar: "/doctor.png",
      slug: "ahmetov-aidar-3"
    },
    {
      id: 4,
      name: "Иванова Мария Ивановна",
      position: "Врач кардиолог",
      avatar: "/doctor.png",
      slug: "ahmetov-aidar-4"
    }
  ];

  // Фильтрация врачей
  const filteredDoctors = doctors
    .filter(Boolean)
    .filter((doctor) => {
      const name = (doctor.name || "").toLowerCase();
      const position = (doctor.position || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = name.includes(query) || position.includes(query);
      const matchesSpecialty = !selectedSpecialty || position.includes(selectedSpecialty.toLowerCase());

      return matchesSearch && matchesSpecialty;
    });

  return (
    <div className={styles.pageWrapper}>
      <Header 
        showAccountButton={false}
        fixed={true}
      />

      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Наши врачи</h1>
            <p className={styles.pageSubtitle}>Наши врачи - наша гордость!</p>
          </div>

          {/* Search and Filter */}
          <div className={styles.searchWrapper}>
            <div className={styles.searchInput}>
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" className={styles.searchIcon}>
                <path d="M9.5 17C13.6421 17 17 13.6421 17 9.5C17 5.35786 13.6421 2 9.5 2C5.35786 2 2 5.35786 2 9.5C2 13.6421 5.35786 17 9.5 17Z" stroke="#D9D9D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 19L14.65 14.65" stroke="#D9D9D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                placeholder="Введите специализацию, имя или фамилию врача"
                className={styles.searchField}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className={styles.searchButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Specialty Filter Buttons */}
          <div className={styles.specialtiesWrapper}>
            <button
              onClick={() => setSelectedSpecialty("")}
              className={`${styles.specialtyButton} ${!selectedSpecialty ? styles.specialtyButtonActive : ""}`}
            >
              Все специальности
            </button>
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`${styles.specialtyButton} ${selectedSpecialty === specialty ? styles.specialtyButtonActive : ""}`}
              >
                {specialty}
              </button>
            ))}
          </div>

          {/* Doctors Grid */}
          {loading ? (
            <p className={styles.loadingText}>Загрузка врачей...</p>
          ) : filteredDoctors.length === 0 ? (
            <p className={styles.loadingText}>{errorMessage || "Врачи не найдены"}</p>
          ) : (
            <div className={styles.doctorsList}>
              {filteredDoctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/doctors/${doctor.slug || doctor.id || "doctor"}`}
                  className={styles.doctorCardLink}
                >
                  <div className={styles.doctorCard}>
                    <div className={styles.doctorAvatar}>
                      <Image
                        src={doctor.avatar || "/doctor.png"}
                        alt={doctor.name || "Врач"}
                        width={128}
                        height={128}
                        className={styles.avatarImage}
                      />
                    </div>

                    <div className={styles.doctorInfo}>
                      <h3 className={styles.doctorName}>{doctor.name}</h3>
                      <p className={styles.doctorPosition}>{doctor.position}</p>
                    </div>

                    <button className={styles.appointmentButton}>
                      <span className={styles.buttonText}>Записаться</span>
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className={styles.scrollbar}></div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorsPage;
