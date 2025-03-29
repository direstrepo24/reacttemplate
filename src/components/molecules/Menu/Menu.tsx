import React from 'react';

export interface MenuProps {
  isOpen?: boolean;
}

export const Menu: React.FC<MenuProps> = ({ isOpen = false }) => {
  return (
    <div data-testid="menu" data-open={isOpen}>
      Menu Component {isOpen ? '(Open)' : '(Closed)'}
    </div>
  );
};
