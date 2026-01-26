"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    education: "",
    experience: "",
    schedule: "",
    directions: "",
    diseases: "",
    rating: 5,
    slug: "",
    avatar: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Ошибка загрузки врачей:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        directions: (formData.directions || "").split(",").map(d => d.trim()).filter(Boolean),
        diseases: (formData.diseases || "").split(",").map(d => d.trim()).filter(Boolean),
        slug: formData.slug || (formData.name || "").toLowerCase().replace(/\s+/g, "-")
      };

      if (editingId) {
        // Обновление
        await fetch("/api/doctors", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload })
        });
      } else {
        // Создание
        await fetch("/api/doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      fetchDoctors();
      resetForm();
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    }
  };

  const handleEdit = (doctor) => {
    setEditingId(doctor.id);
    setFormData({
      ...doctor,
      directions: Array.isArray(doctor.directions) ? doctor.directions.join(", ") : doctor.directions,
      diseases: Array.isArray(doctor.diseases) ? doctor.diseases.join(", ") : doctor.diseases
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Вы уверены?")) return;
    
    try {
      await fetch("/api/doctors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      fetchDoctors();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      education: "",
      experience: "",
      schedule: "",
      directions: "",
      diseases: "",
      rating: 5,
      slug: "",
      avatar: ""
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  // Загрузка изображения в Supabase Storage (bucket "avatars")
  const handleUpload = async (file) => {
    if (!file) return null;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      console.error('Upload error', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleUpload(file);
    if (url) {
      setFormData((prev) => ({ ...prev, avatar: url }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    router.push("/admin/login");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>👨‍⚕️ Управление врачами</h1>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Выход
          </button>
        </div>
      </div>

      <div className={styles.main}>
        {/* Add Doctor Button */}
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className={styles.addBtn}
        >
          + Добавить врача
        </button>

        {/* Form */}
        {isFormOpen && (
          <div className={styles.formContainer}>
            <h2>{editingId ? "Редактирование врача" : "Добавить нового врача"}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <input
                  type="text"
                  name="name"
                  placeholder="Полное имя"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="position"
                  placeholder="Должность"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>

                <div className={styles.formRow}>
                  <input
                    type="text"
                    name="avatar"
                    placeholder="URL фотографии (автоматически заполняется при загрузке)"
                    value={formData.avatar}
                    onChange={handleChange}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </div>

              <div className={styles.formRow}>
                <input
                  type="text"
                  name="slug"
                  placeholder="Slug (ID врача)"
                  value={formData.slug}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>

              <textarea
                name="education"
                placeholder="Образование"
                value={formData.education}
                onChange={handleChange}
              />

              <div className={styles.formRow}>
                <input
                  type="text"
                  name="experience"
                  placeholder="Стаж (пример: 15+ лет)"
                  value={formData.experience}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="schedule"
                  placeholder="Расписание"
                  value={formData.schedule}
                  onChange={handleChange}
                />
              </div>

              <textarea
                name="directions"
                placeholder="Направления (через запятую)"
                value={formData.directions}
                onChange={handleChange}
              />

              <textarea
                name="diseases"
                placeholder="Специализация по заболеваниям (через запятую)"
                value={formData.diseases}
                onChange={handleChange}
              />

              <div className={styles.formButtons}>
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? "Обновить" : "Создать"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className={styles.cancelBtn}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Doctors Table */}
        <div className={styles.tableContainer}>
          <h2>Список врачей ({doctors.length})</h2>
          {loading ? (
            <p>Загрузка...</p>
          ) : doctors.length === 0 ? (
            <p>Нет врачей. Добавьте первого!</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Должность</th>
                  <th>Специализация</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>{doctor.name}</td>
                    <td>{doctor.position}</td>
                    <td>
                      {Array.isArray(doctor.diseases) && doctor.diseases.length > 0
                        ? doctor.diseases.slice(0, 2).join(", ") + (doctor.diseases.length > 2 ? "..." : "")
                        : "-"}
                    </td>
                    <td className={styles.actions}>
                      <button
                        onClick={() => handleEdit(doctor)}
                        className={styles.editBtn}
                      >
                        ✏️ Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className={styles.deleteBtn}
                      >
                        🗑️ Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
