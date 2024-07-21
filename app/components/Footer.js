import React from 'react';

const Footer = () => {
    return (
        <footer className="py-8 bg-gray-900 text-white text-center">
            <p>&copy; {new Date().getFullYear()} Cryptonite. All rights reserved.</p>
            <p>Contact us at <a href="mailto:info@cryptonite.com" className="underline">info@cryptonite.com</a></p>
        </footer>
    );
};

export default Footer;
