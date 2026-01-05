"use client";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";

// Данные услуг по алфавиту
const servicesByLetter = [
  {
    letter: "А",
    services: [
      "Аутоиммунные заболевания",
      "Аллергологические исследования"
    ]
  },
  {
    letter: "Б",
    services: [
      "Биохимические исследования крови"
    ]
  },
  {
    letter: "Г",
    services: [
      "Гистологические исследования",
      "Гормональные исследования крови",
      "Гематологические исследования",
      "Генетический анализ"
    ]
  },
  {
    letter: "О",
    services: [
      "Общие исследования крови",
      "Онкомаркеры",
      "Общеклинические исследования кала"
    ]
  },
  {
    letter: "П",
    services: [
      "Панели аллергенов"
    ]
  },
  {
    letter: "И",
    services: [
      "Исследования мочи",
      "Иммунологические исследования крови",
      "Исследования кала",
      "Исследования крови на инфекции",
      "Исследования инфекционных заболеваний"
    ]
  }
];

// Популярные анализы
const popularAnalyses = [
  {
    title: "Онкология",
    items: ["Гистология", "Онкомаркеры", "Цитология"]
  },
  {
    title: "Исследования крови",
    items: ["Клинические исследования", "Биохимия", "Иммунология", "Гормоны"]
  },
  {
    title: "Исследования мочи",
    items: ["Биохимический анализ", "Общий анализ мочи", "Гормоны"]
  },
  {
    title: "Аллергии",
    items: ["Биохимический анализ", "Общий анализ мочи", "Гормоны"]
  }
];

// Другие услуги
const otherServices = [
  {
    title: "Эндоскопия",
    description: "Благодаря современному видеооборудованию эндоскопия дает возможность врачу провести тщательный визуальный осмотр слизистых оболочек внутренних органов пациента.",
    image: "/blank.png",
    tags: ["Капсульная эндоскопия", "Колоноскопия", "Гастроскопия", "Бронхоскопия", "Гастроскопия"]
  }
];

// Консультации специалистов
const consultationsByLetter = [
  {
    letter: "А",
    services: [
      "Аллерголог-иммунолог",
      "Анестезиолог",
      "Аритмолог",
      "Артролог"
    ]
  },
  {
    letter: "Б",
    services: [
      "Бариатрический хирург"
    ]
  },
  {
    letter: "В",
    services: [
      "Врач функциональной диагностики",
      "Врач превентивной медицины",
      "Вызов врача на дом"
    ]
  },
  {
    letter: "Г",
    services: [
      "Гастроэнтеролог",
      "Гематолог",
      "Гепатолог",
      "Гинеколог"
    ]
  },
  {
    letter: "Д",
    services: [
      "Дерматолог-венеролог",
      "Диетолог"
    ]
  },
  {
    letter: "И",
    services: [
      "Инфекционист"
    ]
  },
  {
    letter: "К",
    services: [
      "Кардиолог",
      "Косметолог"
    ]
  },
  {
    letter: "Л",
    services: [
      "Липидолог",
      "Логопед-дефектолог"
    ]
  },
  {
    letter: "М",
    services: [
      "Маммолог",
      "Мануальный терапевт",
      "Миколог"
    ]
  },
  {
    letter: "Н",
    services: [
      "Невролог",
      "Нейрохирург",
      "Нефролог",
      "Нутрициолог"
    ]
  },
  {
    letter: "О",
    services: [
      "Озонотерапевт",
      "Онкогинеколог",
      "Онколог",
      "Онкоуролог",
      "Остеопат",
      "Отоларинголог",
      "Офтальмолог"
    ]
  },
  {
    letter: "П",
    services: [
      "Педиатр",
      "Пластический хирург",
      "Подолог",
      "Проктолог",
      "Психиатр",
      "Психолог",
      "Психотерапевт",
      "Пульмонолог"
    ]
  },
  {
    letter: "С",
    services: [
      "Сосудистый хирург",
      "Сомнолог",
      "Сексолог"
    ]
  },
  {
    letter: "Т",
    services: [
      "Травматолог-ортопед",
      "Трихолог",
      "Торакальный хирург",
      "Терапевт"
    ]
  },
  {
    letter: "У",
    services: [
      "Уролог-андролог",
      "УЗИ-диагностика"
    ]
  },
  {
    letter: "Ф",
    services: [
      "Флеболог",
      "Физиотерапевт"
    ]
  },
  {
    letter: "Х",
    services: [
      "Химиотерапевт",
      "Хирург"
    ]
  },
  {
    letter: "Ц",
    services: [
      "Центр лечения болевого синдрома",
      "Центр психологии, психотерапии и логопедии"
    ]
  },
  {
    letter: "Э",
    services: [
      "Эндокринолог",
      "Эндоскопия"
    ]
  }
];

// Маленькие карточки услуг
const serviceCards = [
  {
    title: "Сдача анализов на дому",
    icon: "test-tube"
  },
  {
    title: "Подготовка к сдаче анализов",
    icon: "folder"
  },
  {
    title: "Как получить результаты?",
    icon: "clipboard"
  },
  {
    title: "Цены",
    icon: "money"
  }
];

// Большие feature карточки
const featureCards = [
  {
    title: "Калькулятор анализов",
    description: "Быстрый поиск анализов и цен",
    icon: "calculator"
  },
  {
    title: "Комплексные анализы",
    description: "Комплексная лабараторная диагностика",
    icon: "complex"
  }
];

const Services2Page = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header
        navItems={["Главная", "Услуги", "Врачи", "О нас"]}
        showAccountButton={true}
        fixed={true}
      />

      {/* Main Content */}
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Наши услуги</h1>
              <p className={styles.heroSubtitle}>Наши услуги надежные и точные.</p>
            </div>

            {/* Service Cards Row */}
            <div className={styles.serviceCardsRow}>
              {serviceCards.map((card, index) => (
                <div key={index} className={styles.serviceCard}>
                  <div className={styles.serviceCardIcon}>
                    {card.icon === "test-tube" && (
                      <Image src="/analyzes.png" alt={card.title} width={40} height={40} className={styles.serviceIconImage} />
                    )}
                    {card.icon === "folder" && (
                      <Image src="/sending-analyzes.png" alt={card.title} width={40} height={40} className={styles.serviceIconImage} />
                    )}
                    {card.icon === "clipboard" && (
                      <Image src="/results.png" alt={card.title} width={40} height={40} className={styles.serviceIconImage} />
                    )}
                    {card.icon === "money" && (
                      <Image src="/money.png" alt={card.title} width={40} height={40} className={styles.serviceIconImage} />
                    )}
                  </div>
                  <p className={styles.serviceCardText}>{card.title}</p>
                </div>
              ))}
            </div>

            {/* Feature Cards Row */}
            <div className={styles.featureCardsRow}>
              {featureCards.map((card, index) => (
                <div key={index} className={styles.featureCard}>
                  <div className={styles.featureCardContent}>
                    <h3 className={styles.featureCardTitle}>{card.title}</h3>
                    <p className={styles.featureCardDescription}>{card.description}</p>
                    <button className={styles.featureCardButton}>
                      <span className={styles.featureCardButtonText}>ПОДРОБНЕЕ</span>
                    </button>
                  </div>
                  <div className={styles.featureCardIcon}>
                    {card.icon === "calculator" && (
                      <Image src="/calculator.png" alt="Калькулятор анализов" width={94} height={94} />
                    )}
                    {card.icon === "complex" && (
                      <Image src="/complex-analyzes.png" alt="Комплексные анализы" width={94} height={94} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.container}>
          {/* Consultations Section */}
          <div className={styles.servicesSection}>
            <h1 className={styles.pageTitle}>Консультации специалистов</h1>
            <div className={styles.servicesGrid}>
              {consultationsByLetter.map((group, index) => (
                <div key={index} className={styles.letterGroup}>
                  <h2 className={styles.letter}>{group.letter}</h2>
                  <div className={styles.servicesList}>
                    {group.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className={styles.serviceItem}>
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Analyses Section */}
          <section className={styles.popularSection}>
            <h2 className={styles.popularTitle}>Популярные анализы</h2>
            <div className={styles.popularGrid}>
              {popularAnalyses.map((analysis, index) => (
                <div key={index} className={styles.popularCard}>
                  <h3 className={styles.popularCardTitle}>{analysis.title}</h3>
                  <div className={styles.popularCardDivider}></div>
                  <ul className={styles.popularCardList}>
                    {analysis.items.map((item, itemIndex) => (
                      <li key={itemIndex} className={styles.popularCardItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Services List by Letter */}
          <div className={styles.servicesSection}>
            <h1 className={styles.pageTitle}>Виды лабораторных анализ и исследований</h1>
            <div className={styles.servicesGrid}>
              {servicesByLetter.map((group, index) => (
                <div key={index} className={styles.letterGroup}>
                  <h2 className={styles.letter}>{group.letter}</h2>
                  <div className={styles.servicesList}>
                    {group.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className={styles.serviceItem}>
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Services Section */}
          <section className={styles.otherServicesSection}>
            <h2 className={styles.otherServicesTitle}>Другие услуги</h2>
            <div className={styles.otherServicesGrid}>
              {otherServices.map((service, index) => (
                <div key={index} className={styles.otherServiceCard}>
                  <div className={styles.otherServiceContent}>
                    <h3 className={styles.otherServiceTitle}>{service.title}</h3>
                    <p className={styles.otherServiceDescription}>{service.description}</p>
                    <div className={styles.otherServiceImage}>
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={130}
                        height={125}
                        className={styles.serviceImage}
                      />
                    </div>
                    <div className={styles.otherServiceTags}>
                      {service.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className={styles.serviceTag}>{tag}</span>
                      ))}
                    </div>
                    <button className={styles.otherServiceButton}>
                      <span className={styles.otherServiceButtonText}>ПОДРОБНЕЕ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Services2Page;

