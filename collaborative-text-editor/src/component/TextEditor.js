import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const apiUrl = process.env.REACT_APP_API_URL;
const inactivitySeconds = process.env.REACT_APP_INACTIVITY_SECONDS;



const socket = io(apiUrl);

const CollaborativeEditor = () => {
    const [text, setText] = useState('');
    const [userIds, setUserIds] = useState(new Set());
    const [lockOwner, setLockOwner] = useState(null);
    const [lockOwnerName, setLockOwnerName] = useState('');
    const [userName, setUserName] = useState('');
    let inactivityTimer;

    useEffect(() => {
        const storedUserName = sessionStorage.getItem('userName');
        const storedUserId = sessionStorage.getItem('userId');

        if (!storedUserName) {
            const name = prompt("Please enter your name:");
            if (name) {
                setUserName(name);
                const generatedId = btoa(name + Math.random().toString(36).substring(2));
                sessionStorage.setItem('userId', generatedId);
                sessionStorage.setItem('userName', name);
                socket.emit('join', { id: generatedId, name });
            }
        } else {
            setUserName(storedUserName);
            socket.emit('join', { id: storedUserId, name: storedUserName });
        }

        socket.on('updateText', (newText) => {
            setText(newText);
        });

        socket.on('lockStatusChange', ({ ownerId, ownerName }) => {
            setLockOwner(ownerId);
            setLockOwnerName(ownerName);
        });

        socket.on('userJoined', (user) => {
            setUserIds((prev) => new Set(prev).add(user));
        });

        socket.on('userLeft', (user) => {
            setUserIds((prev) => {
                const updatedIds = new Set(prev);
                updatedIds.delete(user);
                return updatedIds;
            });
        });

        return () => {
            socket.emit('leave', storedUserId);
            socket.off();
        };
    }, []);

    const handleChange = (event) => {
        const newText = event.target.value;
        setText(newText);

        // Emit text change while still locked by this user or unlocked
        socket.emit('textChange', newText, sessionStorage.getItem('userId'));

        // Lock the document for this user if it's unlocked
        if (!lockOwner) {
            setLockOwner(sessionStorage.getItem('userId'));
            setLockOwnerName(sessionStorage.getItem('userName'));
            socket.emit('lockStatus', { ownerId: sessionStorage.getItem('userId'), ownerName: sessionStorage.getItem('userName') });
        }
        resetInactivityTimer(); // Reset timer on input change
    };

    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer); // Clear existing timer
        inactivityTimer = setTimeout(() => {
            if (lockOwner === sessionStorage.getItem('userId')) {
                // Unlock if this user was the lock owner
                unlockDocument();
            }
        }, inactivitySeconds); // Adjust time as needed
    };
    const unlockDocument = () => {
        setLockOwner(null);
        setLockOwnerName('');
        socket.emit('lockStatus', { ownerId: null, ownerName: '' }); // Notify others of unlock
    };

    const handleBlur = () => {
        if (lockOwner === sessionStorage.getItem('userId')) {
            unlockDocument(); // Unlock on blur
        }
    };

    const handleFocus = () => {
        resetInactivityTimer(); // Reset timer on focus
    };

    return (
        <div style={{marginInline:"20px" }}>
        <h2>Welcome, {userName}</h2>
            <textarea 
                value={text} 
                onChange={handleChange} 
                onBlur={handleBlur}
                onFocus={handleFocus} 
                disabled={lockOwner !== null && lockOwner !== sessionStorage.getItem('userId')}
                style={{ width: '70%', height: '200px' }}
            />
            {lockOwner && lockOwner !== sessionStorage.getItem('userId') && <p>This document is locked by {lockOwnerName}</p>}
        </div>
    );
};

export default CollaborativeEditor;