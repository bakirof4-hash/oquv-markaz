import React from 'react';
import { IconSearch } from '../common/SvgIcons';

export default function EmptyState({ title = "Ma'lumot topilmadi", description = "Qidiruv parametrlarini o'zgartirib ko'ring.", icon = null }) {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">
        {icon || <IconSearch size={32} />}
      </div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
    </div>
  );
}
