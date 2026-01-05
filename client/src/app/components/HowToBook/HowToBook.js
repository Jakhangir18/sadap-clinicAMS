import styles from "./HowToBook.module.css";

const steps = [
  {
    number: "ШАГ 1",
    title: "Оставьте заявку",
    description: "Нажмите «Отправить cообщение» и заполните форму."
  },
  {
    number: "ШАГ 2",
    title: "Выберите время",
    description: "Отметьте удобное окно и нажмите «Подтвердить»."
  },
  {
    number: "ШАГ 3",
    title: "Готово!",
    description: "Запись создана!\n\nМы пришлём напоминание перед приёмом."
  }
];

const HowToBook = () => {
  return (
    <section className={styles.howToBook}>
      <div className={styles.container}>
        <h2 className={styles.title}>Как легко записаться на прием</h2>

        <div className={styles.stepsContainer}>
          {/* <div className={styles.arrowImage}>
            <img src="/how-to-book-arrow.png" alt="" className={styles.arrow} />
          </div> */}

          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <div key={index} className={styles.stepCard}>
                <div className={styles.stepContent}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
                {index === steps.length - 1 ? null : (
                  <div className={styles.stepImageRight}>
                    <img src="/how-to-book-arrow.png" alt="" className={styles.arrowImage} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button className={styles.sendButton}>
          <span className={styles.buttonText}>отправить сообщение</span>
        </button>
      </div>
    </section >
  )
}


export default HowToBook

