import { CloseModalButton, CreateMenu } from '@components/Menu/styles';
import React, { FC, CSSProperties, useCallback } from 'react';
interface Props {
  show: boolean;
  onCloseModal: (e: any) => void;
  style: CSSProperties;
  closeButton?: boolean;
}
const Menu: FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  if (!show) {
    return null;
  }
  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateMenu>
  );
};
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
