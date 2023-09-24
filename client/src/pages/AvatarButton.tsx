import React, { FC } from 'react';

interface AvatarButtonProps {
    toggleModal: () => void;
}

const AvatarButton: FC<AvatarButtonProps> = ({ toggleModal }) => (
    <button onClick={toggleModal} className="rounded-full w-12 h-12">
        <img src="path/to/avatar.gif" alt="Login" className="object-cover rounded-full" />
    </button>
);

export default AvatarButton;
