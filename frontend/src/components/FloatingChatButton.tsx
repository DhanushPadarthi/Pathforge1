'use client';

import { useState } from 'react';
import { MessageSquare, X } from 'react-feather';
import Chatbot from './Chatbot';
import styles from './FloatingChatButton.module.css';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <Chatbot 
          floating={true} 
          onClose={() => setIsOpen(false)} 
        />
      )}
      
      <button
        className={styles.floatingButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </>
  );
}
