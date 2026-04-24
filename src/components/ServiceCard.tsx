import { ReactNode } from 'react';
import { useRUM } from '../hooks/useRUM';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  technologies?: string[];
  titleId: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon, 
  title, 
  description, 
  technologies,
  titleId 
}) => {
  const { recordEvent } = useRUM();

  const handleCardInteraction = () => {
    // Track service card interaction
    recordEvent('service_card_interaction', {
      service: title
    });
  };

  return (
    <article 
      className="service-card-3d reveal" 
      aria-labelledby={titleId}
      onMouseEnter={handleCardInteraction}
      onFocus={handleCardInteraction}
      tabIndex={0}
    >
      <div className="service-card-face">
        <div className="service-icon-3d" aria-hidden="true">
          {icon}
        </div>
        <h3 id={titleId} className="service-title-3d font-['Audiowide']">{title}</h3>
        <p className="service-description-3d">
          {description}
        </p>
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center" role="list" aria-label="Technologies used">
            {technologies.map((tech, index) => (
              <span key={index} className="tech-tag" role="listitem">{tech}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
