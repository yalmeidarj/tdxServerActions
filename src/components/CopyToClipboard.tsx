'use client'
import React, { useState } from 'react';
import { BsCopy, BsCheck2 } from "react-icons/bs";

interface CopyToClipboardProps {
    text: string | undefined | null;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText( text || '');
            setCopied(true);
            setTimeout(() => setCopied(false), 1300); // Hide the checkmark after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            
        >
            <div
                className='text-sm m-1 '>            
                {copied ?                
                    <BsCheck2
                        className='text-green-600 '
                    />
                    :
                    <BsCopy />
                }
            </div>            
        </button>
    );
};

export default CopyToClipboard;
