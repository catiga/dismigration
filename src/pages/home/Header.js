import homeIcon from '../../assets/images/logo.svg'
import styled from 'styled-components'
import ConnectButton from '../layout/ConnectButton'
import ErrorNetwork from '../layout/ErrorNetwork'
import useGlobal from "../../hooks/useGlobal";
import useWallet from "../../hooks/useWallet";
import { getLocal } from "../../utils"
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import Button from '../../component/Button';

export default function Header(props) {
  const { accounts, currentTokenBalance } = useGlobal()
  const { chainId, network } = useWallet()
  const { handleChangeNetwork } = props
  const [currentBalance, setCurrentBalance] = useState()
  const [showWallet, setShowWallet] = useState('')
  useEffect(() => {
    if (currentTokenBalance) {
      setCurrentBalance(currentTokenBalance)
    }
    if (accounts && accounts.length > 0) {
      setShowWallet(accounts[0].substring(0, 4) + '***' + accounts[0].substring(accounts[0].length - 4))
    }
  }, [currentTokenBalance, accounts])
  return (
    <HeaderContanier>
      <div className="header-content">
        <div className="header-left font-cm">
          <a href='/'>
            <img className='logo' src={homeIcon} alt="" />
          </a>
          <Link to="/migration/start">
            {/* <h1 className='stake' data-shadow='stake'>stake</h1> */}
            <p className='stake' data-text="stake"> stake </p>
          </Link>

        </div>
        {
          (!accounts && !getLocal('account')) && <ConnectButton />
        }

        {
          (accounts || getLocal('account')) &&
          <div className='header-top-info'>
            {
              chainId !== 513100 || (!accounts || !getLocal('account')) &&
              <ErrorNetwork handleChangeNetwork={handleChangeNetwork} />
            }
            <div>
              <Button label={showWallet}></Button>
            </div>
          </div>
        }
      </div>
    </HeaderContanier>
  )
}
const HeaderContanier = styled.div`
  background-color: #f2f5f7;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 99;
  border-bottom: 1px solid #F2F2F2;
  .header-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    height: 62px;
    margin: 0 auto;
    max-width: 1400px;
  }
  .right-contanier {
    display: none
  }
  .header-left{
    margin-left: 20px;
    display: flex;
    align-items: center;
    gap: 30px;
    .logo {
      width: 130px;
    }

    .stake {
      position: relative;
      margin: 6px auto 0;
      font-size: 18px;
      word-spacing: 2px;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      color: transparent;
      background-color: #1868dc;
      background-clip: text;
      &::after {
        content: attr(data-text);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
        background-image: linear-gradient(120deg, transparent 0%, transparent 10px, white 20px, transparent 22px, transparent 30px, rgba(255, 255, 255, 0.3) 40px, transparent 50px, transparent 55px, rgba(255, 255, 255, 0.6) 32rem, white 60px, rgba(255, 255, 255, 0.3) 33.15rem, transparent 70px, transparent 80px, rgba(255, 255, 255, 0.3) 90px, transparent 100px, transparent 100%);
        background-clip: text;
        background-size: 150% 100%;
        background-repeat: no-repeat;
        animation: shine 2s infinite linear;
      }
      @keyframes shine {
        0% {
          background-position: 50% 0;
        }
        100% {
          background-position: -190% 0;
        }
      }
    }

  }
  .header-right {
    flex: 1;
    margin-left: 20px;
    li {
      cursor: pointer;
    }
  }
  .header-content {
    .icon-client {
      width: 137px;
      height: 30px;
    }
  }

`
