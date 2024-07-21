"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
    return (
        <div className="min-h-screen text-black bg-gray-100">
            <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">About Cryptonite</h1>
                    <p className="text-lg">Discover the fascinating world of cryptocurrency and how it has evolved over the years.</p>
                </div>
            </section>

            {/* History of Cryptocurrency */}
            <section className="py-16 bg-gray-800 text-white">
                <div className="container mx-auto">
                    <div className="relative">
                        <div className="timeline">
                            <div className="timeline-event">
                                <div className="timeline-icon bg-blue-500"></div>
                                <div className="timeline-content h-96 overflow-y-scroll">
                                    <p>
                                        Bitcoin, the first decentralized digital currency, was launched in 2009 by an anonymous individual or group under the pseudonym Satoshi Nakamoto. The idea of a digital currency is not new, but Bitcoin was the first to solve the double-spending problem, allowing for secure, verifiable transactions without the need for a trusted third party. Bitcoin operates on a peer-to-peer network where transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain.

                                        The creation of Bitcoin was motivated by the financial crisis of 2008, which exposed the vulnerabilities of the traditional banking system and the risks associated with centralized control over currency. Nakamoto envisioned a currency that would be independent of central authorities, providing users with full control over their money and privacy.

                                        Bitcoin's whitepaper, titled "Bitcoin: A Peer-to-Peer Electronic Cash System," was published in 2008, outlining the principles and mechanisms behind the cryptocurrency. The Bitcoin network went live on January 3, 2009, with the mining of the genesis block, the first block in the blockchain. Embedded in the coinbase of this block was the text "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks," highlighting the context in which Bitcoin was created.

                                        The early years of Bitcoin were marked by its use among cryptography enthusiasts and the tech-savvy, with its value being negligible and transactions largely experimental. However, it soon gained traction as a means of exchange on various online platforms, notably the infamous Silk Road, an online black market.

                                        Bitcoin's value started to rise significantly in 2010, when it was first used to purchase real-world goods. On May 22, 2010, known as Bitcoin Pizza Day, Laszlo Hanyecz paid 10,000 bitcoins for two pizzas, valuing Bitcoin at a fraction of a cent. This marked the beginning of Bitcoin's journey towards broader adoption and recognition as a legitimate digital asset.

                                        Over the years, Bitcoin's value has experienced significant volatility, driven by factors such as regulatory developments, macroeconomic trends, technological advancements, and market sentiment. Despite its fluctuations, Bitcoin has consistently trended upward, achieving new all-time highs and gaining acceptance as a store of value and medium of exchange.

                                        Bitcoin's underlying technology, blockchain, has also garnered significant attention and innovation. The blockchain is a decentralized ledger that records all transactions in a secure and immutable manner. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data, ensuring the integrity and chronological order of the blockchain.

                                        The process of verifying and adding transactions to the blockchain is called mining, which involves solving complex cryptographic puzzles. Miners compete to solve these puzzles, and the first to do so gets to add a new block to the blockchain and is rewarded with newly minted bitcoins and transaction fees. This process is resource-intensive, requiring significant computational power and energy consumption.

                                        Bitcoin has faced numerous challenges and criticisms over the years. These include concerns over its environmental impact due to energy-intensive mining, its association with illegal activities, regulatory uncertainty, and scalability issues. Despite these challenges, Bitcoin has continued to evolve and adapt, with ongoing developments aimed at improving its efficiency, security, and usability.

                                        One of the most significant developments in Bitcoin's history is the implementation of the Lightning Network, a second-layer protocol that enables faster and cheaper transactions by creating off-chain payment channels. This addresses Bitcoin's scalability issues and enhances its potential as a medium of exchange for everyday transactions.

                                        Bitcoin's decentralized nature has made it a popular choice for individuals seeking financial sovereignty and protection against inflation and economic instability. It has been adopted as a form of digital gold, a hedge against traditional financial systems, and a tool for financial inclusion, particularly in regions with limited access to banking services.

                                        In recent years, institutional interest in Bitcoin has surged, with major companies and financial institutions recognizing its potential as an investment asset. This has led to increased mainstream acceptance and integration into the global financial system. Bitcoin futures, exchange-traded funds (ETFs), and custodial services have emerged, providing investors with more ways to gain exposure to the cryptocurrency.

                                        Governments and regulatory bodies worldwide are grappling with how to approach Bitcoin and other cryptocurrencies. Some countries have embraced it, implementing favorable regulations to foster innovation and growth, while others have imposed restrictions or outright bans. The regulatory landscape continues to evolve as policymakers balance the need for consumer protection, financial stability, and technological advancement.

                                        Bitcoin's impact extends beyond finance, influencing various sectors such as technology, economics, and even politics. It has inspired the development of numerous other cryptocurrencies, collectively known as altcoins, each with its own unique features and use cases. The broader cryptocurrency market has grown exponentially, with thousands of digital assets and blockchain projects exploring new possibilities.

                                        As Bitcoin approaches its 15th anniversary, it remains a polarizing and transformative force in the world of finance and technology. Its journey from an obscure digital experiment to a global phenomenon is a testament to the power of decentralized innovation and the enduring appeal of a borderless, censorship-resistant form of money.

                                        Looking ahead, Bitcoin's future is uncertain but full of potential. It faces ongoing challenges, including scalability, regulatory scrutiny, and competition from other cryptocurrencies and digital assets. However, its resilient community, robust infrastructure, and pioneering vision continue to drive its evolution and adoption.

                                        In conclusion, Bitcoin's history is a fascinating tale of innovation, disruption, and resilience. It has redefined the concept of money, challenged the traditional financial system, and opened up new possibilities for economic empowerment and financial inclusion. As the world continues to navigate the complexities of the digital age, Bitcoin's legacy as the first cryptocurrency and its impact on the future of finance will undoubtedly be remembered.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Information */}
            <section className="bg-blue-600 py-16">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8 text-white">Learn More</h2>
                    <p className="text-white mb-4">For a more in-depth look at cryptocurrency, You can visit Wiki</p>
                    <Link href="https://en.wikipedia.org/wiki/Cryptocurrency" className="inline-block bg-blue-800 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                        Visit Wiki
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
