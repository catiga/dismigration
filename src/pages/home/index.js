import React from "react"
import './home.scss'
import Button from '../../component/Button'
import { Link } from 'react-router-dom'
export default function Home() {
  return (
    <div>
      <div className="home-container">
        <div className="d-flex justfify-between">
          <div className="title-wrap">
            <div className="title">Token migration</div>
            <div className="sub-title">Help secure the DIS and earn rewards</div>
          </div>
          <div className="explian-wrap">
            <div className="title">What is <span className="color-blue">token migration?</span></div>
            <div className="info">Before the new mainnet went online, ERC 20 tokens issued by the old smart contract were used. The ETHF and DIS (ERC 20 tokens) previously held by users can be traded on the exchange, but their true practical value cannot be reflected. Mainnet mapping ( token migration ) is to map users’ ERC 20 tokens into real mainnet coins.</div>
          </div>
        </div>

        <div className="d-flex justfify-between mt-60">
          <div className="reward-wrap">
            <div className="title color-blue">27,397<span>Rewards</span></div>
            <div className="sub-title">of token migration DIS/ETHF (day)*</div>
          </div>
          <div className="explian-wrap">
            <div className="title">Rewards</div>
            <div className="info">During the mainnet migration  period, 27,397 ETHF and 27,397 Dis will be generated every day and distributed to addresses participating in the currency exchange. After the mainnet goes online, this income will become 5,750 new mainnet tokens per day. The new mainnet is also compatible with POW mining.</div>
          </div>
        </div>

        <div className="bottom-wrap">
          <div>Ready to start token migration ?</div>
          <div>Earn <span className="color-blue">DIS and ETHF</span> on the Mainnet.</div>
        </div>

        <div className="buttom-button-wrap">
          <Link to="/migration/start"><Button label="Migration  Now" size="large" /></Link>
        </div>
      </div>
    </div>
  )
}