import styled from "styled-components"
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import BGL from '../../assets/images/bg-l.png'
import BANNERPIC from '../../assets/images/pic-banner.png'
import BGPIC02L from '../../assets/images/section-02-l.png'
import BGPIC02R from '../../assets/images/section-02-r.png'
import SECTION03 from '../../assets/images/bg-02.png'
import ARROW from '../../assets/images/arrow-right.svg'
import BITCOIN from '../../assets/icon/bitcoin.png'
import ETH from '../../assets/icon/eth.png'
import CODE from '../../assets/icon/code.png'

import COMMUNITY from '../../assets/images/community-img.png'

import DISCORD from '../../assets/icon/discord.png'
import TELEGRAM from '../../assets/icon/telegram.png'
import GITHUB from '../../assets/icon/github.png'
import FOOTERL from '../../assets/images/footer-l.png'
import FOOTERR from '../../assets/images/footer-r.png'

import PARTNER01 from '../../assets/images/logo/logo-metamask.svg'
import PARTNER02 from '../../assets/images/logo/logo-coolwallet.svg'
import PARTNER03 from '../../assets/images/logo/logo-onekey.svg'
import PARTNER04 from '../../assets/images/logo/logo-tokenpocket.png'

import BANNER from '../../assets/images/bg-banner.webp'


export default function Index() {
    return (
        <IndexContainer>
            {/* banner01 */}
            <div className="banner-box">
                <img className="bg" src={BANNER} />
                <div className="title-box">
                    <h1 className="title font-cs">Disney (DIS)  Chain</h1>
                    <div className="p">
                        <p className=" font-cr">Anticipate the opportunity for potential pledge rewards as DIS Chain's Mainnet launches. Will disclose the block height that initiates the mining activity.</p>
                        <p className=" font-cr">Keep an eye out for this chance to engage with and potentially benefit from the core of our blockchain network.</p>
                        <Link to="/home">
                            <div className="swipe-box mt-3">
                                <ul className="flip3"> 
                                    <li className="text-xl font-cm">Coming soon</li>
                                    <li className="text-xl font-cm">Current Block: </li>
                                    <li className="text-xl font-cm">Until Block: ?</li>
                                </ul>
                            </div>
                            {/* <button className="bg-white text-black mt-8 px-6 py-2 font-cm text-xl rounded-sm">Get Start</button> */}
                        </Link>
                    </div>
                </div>
            </div>
            {/* banner */}
            <div className="section01 px-4 lg:px-40">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-x-8 relative z-[2] lg:w-full">
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-cs tracking-wider">DIS Chain: Innovative PoW Public Chain Merging AI and MEME Culture</h1>
                        <p className="mt-4 font-cr">Initiating a New Era of Blockchain and Artificial Intelligence.</p>
                        <Link to="/home">
                            <button className="bg-white mt-8 px-6 py-2 font-cm text-xl rounded-sm">Get Start</button>
                        </Link>
                    </div>
                    <img className="banner-image text-xs w-[30rem] hidden lg:block" src={BANNERPIC} />
                </div>
                <img className="bg-image" src={BGL} />
            </div>
            {/* section 02 */}
            <div className="section02 px-4 lg:px-40 py-16 relative">
                <div className="relative z-[2] text-center">
                    <h1 className="text-sm font-cr">WHO WE ARE</h1>
                    <p className="text-3xl font-cm mt-8 tracking-wider">DIS Chain is an innovative PoW (Proof of Work) public chain that highly values the integration of MEME culture and AI computational power, creating a high-efficiency and decentralized blockchain ecosystem.</p>
                    <button className="bg-[#1559ed] mx-auto text-white mt-12 px-6 py-2 font-cr text-sm flex items-center rounded-sm">
                        <span>Learn More</span>
                        <img className="w-4 ml-2" src={ARROW} />
                    </button>
                </div>
                <img className="absolute right-0 w-[20rem] top-0" src={BGPIC02L} />
                <img className="absolute left-0 w-[20rem] top-0" src={BGPIC02R} />
            </div>
            {/* section03 */}
            <div className="section03 px-4 lg:px-40 py-20 relative overflow-hidden">
                <div className="relative z-[2]">
                    <h1 className="text-4xl font-cs tracking-wider text-center">DIS Chain - The Blockchain Innovation from Meme to AI Integration, Realizing True WEB3</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-12 text-white">
                        <div className="bg-[#1e2025] px-4 py-6">
                            <img className="w-8" src={ETH} />
                            <div className="p-1">
                                <h3 className="text-xl font-cs py-3">Blockchain Revolution</h3>
                                <p className="text-base font-cr leading-[1.3] tracking-wider">In the world of cryptocurrency, the rise of the PoS (Proof of Stake) mechanism has sparked widespread discussion. Despite the significant improvements in efficiency and energy consumption brought by PoS, this change essentially goes against the original spirit of blockchain decentralization. The PoS mechanism is perceived as leaning towards centralization because it gives individuals or institutions with more tokens greater decision-making power and network control.</p>
                            </div>
                        </div>
                        <div className="bg-[#1e2025] px-4 py-6">
                            <img className="w-8" src={CODE} />
                            <div className="p-1">
                                <h3 className="text-xl font-cs py-3">Technical Innovation</h3>
                                <p className="text-base font-cr leading-[1.3] tracking-wider">DIS Chain supports the Ethereum Virtual Machine (EVM) and is compatible with all Ethereum-based applications and smart contracts, allowing developers to develop and deploy various applications in a familiar and stable environment that supports the Solidity language.</p>
                            </div>
                        </div>
                        <div className="bg-[#1e2025] px-4 py-6">
                            <img className="w-8" src={BITCOIN} />
                            <div className="p-1">
                                <h3 className="text-xl font-cs py-3">Economic Model</h3>
                                <p className="text-base font-cr leading-[1.3] tracking-wider">Innovative Token Economy System: DIS Chain introduces an innovative token economy system by combining AI computational power with traditional PoW (Proof of Work) mining. In this system, we have introduced the concept of staking mining, creating an unprecedented "Dual Mining Model".</p>
                            </div>
                        </div>
                    </div>
                </div>
                <img className="absolute right-0 w-[20rem] top-0" src={SECTION03} />
            </div>
            {/* section04 */}
            <div className="section04 px-4 lg:px-40 py-20 text-center flex flex-col lg:flex-row items-center"> 
                <div className="flex-1">
                    <h1 className="text-4xl font-cs tracking-wider">Community</h1>
                    <p className="text-xl font-cm py-3 text-[#6f7174] w-">Collaborations with social platforms like Linkenetwork, DeNet, promoting DIS Chain on social media.</p>
                    <div className="social-box grid grid-cols-3 w-[30rem] mx-auto py-8 divide-x divide-[#d7d7d7] mt-8">
                        <div className="social-item">
                            <img className="w-8 mx-auto" src={DISCORD} />
                            <p className="mt-1">Discord</p>
                        </div>
                        <div className="social-item">
                            <img className="w-8 mx-auto" src={TELEGRAM} />
                            <p className="mt-1">Telegram</p>
                        </div>
                        <div className="social-item">
                            <img className="w-8 mx-auto" src={GITHUB} />
                            <p className="mt-1">Github</p>
                        </div>
                    </div>
                </div>
                <img className="w-[28rem] mt-12 lg:mt-0" src={COMMUNITY} />
            </div>
            {/* 合作伙伴儿 */}
            <div className="section05 px-4 lg:px-40 py-20 text-center">
                <h1 className="text-4xl text-white font-cs tracking-wider">Partners</h1>
                <div className="flex items-center justify-center gap-8 mt-8">
                    <img className="h-10" src={PARTNER01} />
                    <img className="h-10" src={PARTNER02} />
                    <img className="h-10" src={PARTNER03} />
                    <img className="h-10" src={PARTNER04} />
                </div>
            </div>
            {/* footer */}
            <footer className="footer px-4 lg:px-40 py-8">
                <div className="py-20 font-cm text-base">
                    
                </div>
                <p className="text-md font-cr text-center">All Rights Reserved @dis | <a href="https://whitepaper.dischain.xyz" target="_blank" className="ml-2 font-cm underline">white paper</a></p>
            </footer>
        </IndexContainer>
    )
}

const IndexContainer = styled.div`
    padding-top: 62px;
    min-height: 100vh;
    box-sizing: border-box;
    position: relative;
    .bg-image {
        width: 200px;
        position: absolute;
        left: 0;
        top: 50%;
    }

    .banner-box {
        height: calc(100vh - 72px);
        position: relative;
        overflow: hidden;
        background: radial-gradient(circle at 20% 70%, #002353, #000921 450px);
        .bg {
            position: absolute;
            width: 68%;
            max-width: 1100px;
            display: block;
            top: 56%;
            left: 0;
            transform: translateY(-50%);
        }
        .title-box {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            color: white;
            width: 36%;
            display: flex;
            flex-direction: column;
            h1 {
                font-size: 42px;
            }
            .p {
                margin-top: 30px;
            }

            .swipe-box{
                overflow: hidden;
                position: relative;
                height: 42px;
                display: inline-block;
                background: white;
                padding: 5px 20px 0;
                border-radius: 20px 0 20px 0;
                li {
                    color: black;
                    font-weight: 700;
                    padding: 0 10px;
                    height: 45px;
                    margin-bottom: 45px;
                    display: block;
                    text-align: center;
                }
            }
            .flip2 { animation: flip2 6s cubic-bezier(0.23, 1, 0.32, 1.2) infinite; }
            .flip3 { animation: flip3 8s cubic-bezier(0.23, 1, 0.32, 1.2) infinite; }
            .flip4 { animation: flip4 10s cubic-bezier(0.23, 1, 0.32, 1.2) infinite; }

            @keyframes flip2 {
                0% { margin-top: -180px; }
                5% { margin-top: -90px;  }
                50% { margin-top: -90px; }
                55% { margin-top: 0px; }
                99.99% { margin-top: 0px; }
                100% { margin-top: -270px; }
            }

            @keyframes flip3 {
                0% { margin-top: -270px; }
                5% { margin-top: -180px; }
                33% { margin-top: -180px; }
                38% { margin-top: -90px; }
                66% { margin-top: -90px; }
                71% { margin-top: 0px; }
                99.99% { margin-top: 0px; }
                100% { margin-top: -270px; }
            }

            @keyframes flip4 {
                0% { margin-top: -360px; }
                5% { margin-top: -270px; }
                25% { margin-top: -270px; }
                30% { margin-top: -180px; }
                50% { margin-top: -180px; }
                55% { margin-top: -90px; }
                75% { margin-top: -90px; }
                80% { margin-top: 0px; }
                99.99% { margin-top: 0px; }
                100% { margin-top: -270px; }
            }

        }
    }

    .section01 {
        height: 100vh;
        background-color: #1559ed;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        display: none;
    }

    .section02 {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .section03 {
        background: #000;
        color: white;
    }

    .section04 {
        .social-box {
            font-size: 15px;
            color: #6f7174;
            font-size: bold;
            border: 1px solid #d7d7d7;
            border-radius: 16px;
            .social-item {
                cursor: pointer;
                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }

    .section05 {
        background: black;
    }

    .footer {
        color: white;
        border-top: 1px solid rgba(255,255,255,0.2);
        background: url(${FOOTERL}) no-repeat left bottom / 270px, url(${FOOTERR}) no-repeat right center / 270px black;
    }
`