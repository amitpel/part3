import React from 'react'
const Notification = ({ message }) => {
    if (!message || message.content === null) {
        return null
    }
    return (
        <div className={message.type === 'error' ? 'error' : 'success'}>
            {message.content}
        </div>
    )
}

export default Notification