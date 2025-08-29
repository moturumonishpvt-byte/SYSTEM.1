import React, { useState, useEffect } from 'react';
import { Notification } from '../types';

interface NotificationItemProps {
    notification: Notification;
    onDismiss: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            const dismissTimer = setTimeout(() => onDismiss(notification.id), 300);
            return () => clearTimeout(dismissTimer);
        }, 4700);

        return () => clearTimeout(timer);
    }, [notification.id, onDismiss]);

    const typeStyles = {
        system: 'border-system-blue',
        levelup: 'border-system-gold text-system-gold',
        quest: 'border-system-green',
        penalty: 'border-system-red',
        title: 'border-system-purple',
    };
    
    const titleStyles = {
        system: 'text-system-blue-light',
        levelup: 'text-system-gold',
        quest: 'text-system-green',
        penalty: 'text-system-red',
        title: 'text-system-purple',
    }

    return (
        <div
            className={`system-panel w-80 p-3 border-l-4 transition-all duration-300 ease-in-out transform ${typeStyles[notification.type]} ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
            role="alert"
        >
            <h3 className={`font-display text-lg ${titleStyles[notification.type]}`}>{notification.title}</h3>
            <p className="text-gray-300 text-sm">{notification.message}</p>
        </div>
    );
};

interface NotificationContainerProps {
    notifications: Notification[];
    onDismiss: (id: number) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onDismiss }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
            {notifications.map(n => (
                <NotificationItem key={n.id} notification={n} onDismiss={onDismiss} />
            ))}
        </div>
    );
};

export default NotificationContainer;