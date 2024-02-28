import React, { useState, useEffect } from 'react';
import { FiCommand } from "react-icons/fi";
import styles from './index.module.scss'

const Spinner = () => {
  const [messages, setMessages] = useState(['creazione in corso ...']);

  useEffect(() => {
    const steps = [
      'Lettura immagine ✔',
      'Ottenimento informazioni ✔',
      'Risposta in consegna ✔'
    ];

    const intervalId = setInterval(() => {
      setMessages(currentMessages => {
        if (currentMessages.length - 1 === steps.length) {
          clearInterval(intervalId);
          return currentMessages;
        }
        return [...currentMessages, steps[currentMessages.length - 1]];
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.Spinner}>
      <FiCommand className={styles.icon} />
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  )
}

export default Spinner