import React, { useState } from 'react'

interface AccordionProps {
  title?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  onEdit?: () => void;
  showEditIcon?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  onEdit,
  showEditIcon = true
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      border: '1px solid #E5E7EB',
      borderRadius: '20px',
      marginBottom: '12px',
      backgroundColor: '#F8F9FC'
    }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px',
          cursor: 'pointer',
          backgroundColor: "#F8F9FC",
          borderRadius: '20px',
          transition: 'background-color 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <i
            className={`la la-angle-${isOpen ? 'up' : 'down'}`}
            style={{
              fontSize: 16,
              color: '#4B5563',
              transition: 'transform 0.2s ease'
            }}
          ></i>
          <span style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#111827'
          }}>
            {title}
          </span>
        </div>

        {showEditIcon && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            style={{
              background: 'white',
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              width: '36px',
              height: '36px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <i className="la la-pen" style={{ fontSize: 16, color: '#6B7280' }}></i>
          </button>
        )}
      </div>

      {isOpen && (
        <div style={{
          padding: '0 10px 10px 10px',
          animation: 'slideDown 0.3s ease'
        }}>
          {children}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Accordion;