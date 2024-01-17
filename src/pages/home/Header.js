import homeIcon from '../../assets/images/logo/logo.png'
import homeTextIcon from '../../assets/images/logo/disney-w.svg'
import styled from 'styled-components'
import ConnectButton from '../layout/ConnectButton'
import ErrorNetwork from '../layout/ErrorNetwork'
import useGlobal from "../../hooks/useGlobal";
import useWallet from "../../hooks/useWallet";
import { getLocal } from "../../utils"
import { useEffect, useState } from "react";
import { Link, useLocation, useHistory } from 'react-router-dom'
import Button from '../../component/Button';
import Toast from '../../component/Toast';

export default function Header(props) {
  const { accounts, currentTokenBalance } = useGlobal()
  const { chainId, network } = useWallet()
  const { handleChangeNetwork } = props
  const [currentBalance, setCurrentBalance] = useState()
  const [showWallet, setShowWallet] = useState('')
  const location = useLocation();
  const history = useHistory();
  const [showToast, setShowToast] = useState(false);
  const [localAccount, setLocalAccount] = useState(false)

  useEffect(() => {
    if (currentTokenBalance) {
      setCurrentBalance(currentTokenBalance)
    }
    if (accounts && accounts.length > 0) {
      setShowWallet(accounts[0].substring(0, 4) + '***' + accounts[0].substring(accounts[0].length - 4))
    }
    if (!getLocal('account')) {
      setLocalAccount(false)
    } else {
      setLocalAccount(true)
    }
  }, [currentTokenBalance, accounts, getLocal('account')])


  const handleGotoView = (name) => {
    if (location.pathname !== '/') {
      history.push('/#' + name);
      return;
    }
    document.getElementById(name).scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  const handlePledge = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Toast显示3秒后自动隐藏
  }
  
  return (
    <HeaderContanier>
      <div className="header-content">
        <div className="header-left font-cm">
          <a href='/'>
            <img className='logo' src={homeIcon} alt="" />
            <img className='logo-text' src={homeTextIcon} />
          </a>
        </div>
         
        <div className='header-right'>
          <p className='nav' onClick={() => handleGotoView('info')}>Info</p>
          <p className='nav' onClick={() => handleGotoView('community')}>Community</p>
          <p className='nav' onClick={() => handleGotoView('partners')}>Partners</p>
            {/* <p className='stake nav' onClick={() => handlePledge()} data-text="Pledge">Pledge</p> */}
            <Link className='stake nav' to='/yield'>Pledge</Link>
          {
            (!accounts && !localAccount) && <ConnectButton />
          }

          {
            (accounts || localAccount) &&
            <div className='header-top-info'>
              {
                chainId !== 513100 || (!accounts || !localAccount) &&
                <ErrorNetwork handleChangeNetwork={handleChangeNetwork} />
              }
              <div>
                <Button size={'small'} label={showWallet}></Button>
              </div>
            </div>
          }
        </div>

        <Toast showToast={showToast} message="Coming soon!" />
      </div>
    </HeaderContanier>
  )
}
const HeaderContanier = styled.div`
  background-color: black;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 99;
  // border-bottom: 1px solid #F2F2F2;
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
    a {
      display: flex;
      align-items: center;
      gap: 5px;
      .logo {
        width: 32px;
      }
      .logo-text {
        width: 65px;
        margin-top: 3px;
      }
    }
  }
  .header-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 20px;
    color: rgba(255,255,255,0.8);
    font-size: 14px;
    li {
      cursor: pointer;
    }
    .nav {
      text-decoration: underline;
      cursor: pointer;
    }

    .stake {
      position: relative;
      font-size: 16px;
      word-spacing: 2px;
      display: inline-block;
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
  .header-content {
    .icon-client {
      width: 137px;
      height: 30px;
    }
  }

`
